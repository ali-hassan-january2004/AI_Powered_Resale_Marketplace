import { delay, http, HttpResponse } from "msw";
import categoriesData from "./data/categories.json";
import listingsData from "./data/listings.json";
import notificationsData from "./data/notifications.json";
import ordersData from "./data/orders.json";
import reportsData from "./data/reports.json";
import reviewsData from "./data/reviews.json";
import usersData from "./data/users.json";
import { ApiError, publicUser, tokensFor, userFromRefresh, userFromRequest, verifyPassword } from "./mockAuth";

const BASE = (import.meta.env.VITE_API_URL || "http://localhost:5000/api").replace(/\/$/, "");
const LATENCY = Number(import.meta.env.VITE_MOCK_DELAY ?? 250);
const SHIPPING_FEE = Number(import.meta.env.VITE_SHIPPING_FEE || 0);
const FEE_PERCENT = Number(import.meta.env.VITE_PLATFORM_FEE_PERCENT || 10);
const url = (path) => `${BASE}${path}`;

/* ---------- in-memory database ---------- */
const db = {
  users: structuredClone(usersData),
  categories: structuredClone(categoriesData),
  listings: structuredClone(listingsData),
  orders: structuredClone(ordersData),
  reviews: structuredClone(reviewsData),
  notifications: structuredClone(notificationsData),
  reports: structuredClone(reportsData),
  carts: {}, // userId -> [listingId]
  wishlists: { u4: ["l2", "l7"] }, // userId -> [listingId]
};

/* ---------- small helpers ---------- */
let seq = 1000;
const newId = (prefix) => `${prefix}${++seq}`;
const now = () => new Date().toISOString();
const find = (list, id) => list.find((x) => x._id === id);
const money = (n) => Math.round(n * 100) / 100;
const orderCode = (id) => String(id).slice(-6).toUpperCase();
const cartOf = (uid) => (db.carts[uid] = db.carts[uid] || []);
const wishlistOf = (uid) => (db.wishlists[uid] = db.wishlists[uid] || []);

const bad = (message) => new ApiError(400, "VALIDATION_ERROR", message);
const forbidden = () => new ApiError(403, "FORBIDDEN", "You are not allowed to do that.");
const must = (item, message = "Not found.") => {
  if (!item) throw new ApiError(404, "NOT_FOUND", message);
  return item;
};

const ok = (data, status = 200) => HttpResponse.json({ success: true, data }, { status });
const fail = (e) =>
  HttpResponse.json({ success: false, error: { code: e.code, message: e.message } }, { status: e.status });
const created = (data) => ({ __status: 201, data });

const paginate = (items, sp) => {
  const page = Math.max(1, Number(sp.get("page")) || 1);
  const limit = Math.min(100, Math.max(1, Number(sp.get("limit")) || 20));
  return { items: items.slice((page - 1) * limit, page * limit), page, limit, total: items.length };
};

const newestFirst = (a, b) => new Date(b.createdAt) - new Date(a.createdAt);

const notify = (userId, type, message, link) =>
  db.notifications.unshift({ _id: newId("n"), user: userId, type, message, link, isRead: false, createdAt: now() });

const toDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

/* ---------- shaping data like the real API will ---------- */
const userRef = (id) => {
  const u = find(db.users, id);
  return u ? { _id: u._id, name: u.name, avatarUrl: u.avatarUrl } : null;
};
const sellerRef = (id) => {
  const u = find(db.users, id);
  return u
    ? {
        _id: u._id, name: u.name, avatarUrl: u.avatarUrl,
        sellerProfile: u.sellerProfile, ratingAvg: u.ratingAvg, ratingCount: u.ratingCount,
      }
    : null;
};
const categoryRef = (id) => {
  const c = find(db.categories, id);
  return c ? { _id: c._id, name: c.name, slug: c.slug } : null;
};
const listingOut = (l, viewer) => ({
  ...l,
  seller: sellerRef(l.seller),
  category: categoryRef(l.category),
  isFavorite: !!viewer && wishlistOf(viewer._id).includes(l._id),
});
const reviewOf = (orderId) => db.reviews.find((r) => r.order === orderId) || null;
const orderOut = (o) => ({ ...o, buyer: userRef(o.buyer), seller: sellerRef(o.seller), review: reviewOf(o._id) });

const recomputeRating = (sellerId) => {
  const seller = find(db.users, sellerId);
  const reviews = db.reviews.filter((r) => r.seller === sellerId);
  seller.ratingCount = reviews.length;
  seller.ratingAvg = reviews.length
    ? Math.round((reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length) * 10) / 10
    : 0;
};

/* ---------- auth + wrapper ---------- */
const ACCESS = { user: undefined, seller: ["seller", "admin"], admin: ["admin"] };

const requireUser = (request, roles) => {
  const user = userFromRequest(request, db.users);
  if (!user) throw new ApiError(401, "UNAUTHENTICATED", "Please log in to continue.");
  if (user.isBlocked) throw new ApiError(403, "BLOCKED", "Your account has been blocked.");
  if (roles && !roles.includes(user.role)) throw forbidden();
  return user;
};

// handle(fn, "public" | "user" | "seller" | "admin"); fn returns data or created(data), and throws ApiError
const handle =
  (fn, access = "public") =>
  async ({ request, params }) => {
    await delay(LATENCY);
    try {
      const user =
        access === "public" ? userFromRequest(request, db.users) : requireUser(request, ACCESS[access]);
      const body = await request.clone().json().catch(() => ({}));
      const out = await fn({ user, body, params, request, sp: new URL(request.url).searchParams });
      return out && out.__status ? ok(out.data, out.__status) : ok(out ?? { ok: true });
    } catch (e) {
      if (e instanceof ApiError) return fail(e);
      console.error("[mocks]", e);
      return fail(new ApiError(500, "SERVER_ERROR", "Mock server error. Check the browser console."));
    }
  };

/* ---------- listings helpers ---------- */
const categoryIds = (slug) => {
  const c = db.categories.find((x) => x.slug === slug);
  return c ? [c._id, ...db.categories.filter((x) => x.parent === c._id).map((x) => x._id)] : [];
};

const matchListing = (l, sp) => {
  const q = sp.get("q")?.trim().toLowerCase();
  if (q) {
    const hay = `${l.title} ${l.brand} ${l.description}`.toLowerCase();
    if (!q.split(/\s+/).every((t) => hay.includes(t))) return false;
  }
  const cat = sp.get("category");
  if (cat && !categoryIds(cat).includes(l.category)) return false;
  const min = sp.get("minPrice");
  const max = sp.get("maxPrice");
  if (min && l.price < Number(min)) return false;
  if (max && l.price > Number(max)) return false;
  for (const k of ["size", "condition", "color"]) {
    const v = sp.get(k);
    if (v && String(l[k]).toLowerCase() !== v.toLowerCase()) return false;
  }
  const brand = sp.get("brand");
  if (brand && !l.brand?.toLowerCase().includes(brand.toLowerCase())) return false;
  return true;
};

const SORTERS = {
  newest: newestFirst,
  price_asc: (a, b) => a.price - b.price,
  price_desc: (a, b) => b.price - a.price,
  popular: (a, b) => b.views + b.favoritesCount * 5 - (a.views + a.favoritesCount * 5),
};

const canSee = (l, user) =>
  ["active", "reserved", "sold"].includes(l.status) || (user && (user.role === "admin" || user._id === l.seller));

const ownListing = (id, user) => {
  const l = must(find(db.listings, id), "Listing not found.");
  if (l.seller !== user._id && user.role !== "admin") throw forbidden();
  return l;
};

const FIELDS = ["title", "description", "category", "brand", "size", "color", "condition", "price"];
const applyFields = (l, body) =>
  FIELDS.forEach((k) => {
    if (body[k] !== undefined) l[k] = k === "price" ? Number(body[k]) : body[k];
  });

const ensureCover = (l) => {
  if (l.images.length && !l.images.some((i) => i.isCover)) l.images[0].isCover = true;
};

const assertPublishable = (l) => {
  if (!l.title || l.title.length < 5) throw bad("Title must be at least 5 characters.");
  if (!(l.price > 0)) throw bad("Price must be greater than 0.");
  if (!find(db.categories, l.category)) throw bad("Choose a valid category.");
  if (!l.images.length) throw bad("Add at least one photo before publishing.");
};

/* ---------- orders helpers ---------- */
const pushStatus = (o, status, note) => {
  o.status = status;
  o.statusHistory.push({ status, at: now(), ...(note ? { note } : {}) });
};
const setOrderListings = (o, status) =>
  o.items.forEach((it) => {
    const l = find(db.listings, it.listing);
    if (l && l.status !== "removed") l.status = status;
  });
const pickAddress = ({ label, line1, city, region, postalCode, country }) => ({
  label, line1, city, region, postalCode, country,
});
const NEXT_STATUS = { pending: "confirmed", confirmed: "shipped", shipped: "delivered" };

const orderForViewer = (id, user) => {
  const o = must(find(db.orders, id), "Order not found.");
  if (o.buyer !== user._id && o.seller !== user._id && user.role !== "admin") throw new ApiError(404, "NOT_FOUND", "Order not found.");
  return o;
};

/* ---------- categories helpers ---------- */
const slugify = (s) => s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
const uniqueSlug = (name, selfId) => {
  const base = slugify(name) || "category";
  let slug = base;
  let n = 2;
  while (db.categories.some((c) => c.slug === slug && c._id !== selfId)) slug = `${base}-${n++}`;
  return slug;
};
const categoryTree = (includeInactive) => {
  const list = db.categories.filter((c) => includeInactive || c.isActive !== false);
  return list.filter((c) => !c.parent).map((root) => ({ ...root, children: list.filter((c) => c.parent === root._id) }));
};

/* ================= handlers ================= */
export const handlers = [
  /* ----- auth ----- */
  http.post(url("/auth/register"), handle(({ body }) => {
    const name = body.name?.trim();
    const email = body.email?.trim().toLowerCase();
    if (!name || !email || !body.password) throw bad("Name, email and password are required.");
    if (body.password.length < 8) throw bad("Password must be at least 8 characters.");
    if (db.users.some((u) => u.email === email)) throw new ApiError(409, "EMAIL_TAKEN", "An account with this email already exists.");
    const user = {
      _id: newId("u"), name, email, password: body.password, role: "buyer", avatarUrl: "", phone: "",
      addresses: [], ratingAvg: 0, ratingCount: 0, isBlocked: false, createdAt: now(),
    };
    db.users.push(user);
    return created({ ...tokensFor(user), user: publicUser(user) });
  })),

  http.post(url("/auth/login"), handle(({ body }) => {
    const user = db.users.find((u) => u.email === body.email?.trim().toLowerCase());
    if (!user || !verifyPassword(user, body.password)) throw new ApiError(401, "INVALID_CREDENTIALS", "Invalid email or password.");
    if (user.isBlocked) throw new ApiError(403, "BLOCKED", "Your account has been blocked.");
    return { ...tokensFor(user), user: publicUser(user) };
  })),

  http.post(url("/auth/refresh"), handle(({ body }) => {
    const user = userFromRefresh(body.refreshToken, db.users);
    if (!user) throw new ApiError(401, "INVALID_REFRESH", "Your session has expired. Please log in again.");
    return tokensFor(user);
  })),

  http.post(url("/auth/logout"), handle(() => ({ ok: true }))),
  http.post(url("/auth/forgot-password"), handle(() => ({ ok: true }))),
  http.post(url("/auth/reset-password"), handle(({ body }) => {
    if (!body.token || body.token === "expired") throw bad("This link has expired or was already used.");
    if (!body.password || body.password.length < 8) throw bad("Password must be at least 8 characters.");
    return { ok: true };
  })),

  /* ----- users (static /me routes first) ----- */
  http.get(url("/users/me"), handle(({ user }) => publicUser(user), "user")),

  http.patch(url("/users/me"), handle(({ user, body }) => {
    ["name", "phone", "bio", "avatarUrl"].forEach((k) => {
      if (body[k] !== undefined) user[k] = body[k];
    });
    if (!user.name || user.name.trim().length < 2) throw bad("Enter your name.");
    if (Array.isArray(body.addresses)) user.addresses = body.addresses.map((a) => ({ ...a, _id: a._id || newId("a") }));
    if (body.sellerProfile) user.sellerProfile = { ...user.sellerProfile, ...body.sellerProfile };
    return publicUser(user);
  }, "user")),

  http.post(url("/users/me/become-seller"), handle(({ user, body }) => {
    if (!body.shopName?.trim() || body.shopName.trim().length < 3) throw bad("Shop name must be at least 3 characters.");
    if (!body.phone?.trim()) throw bad("Enter a contact phone number.");
    if (user.role === "buyer") user.role = "seller";
    user.phone = body.phone.trim();
    user.sellerProfile = { shopName: body.shopName.trim(), bio: body.bio || "", returnPolicy: user.sellerProfile?.returnPolicy || "" };
    return publicUser(user);
  }, "user")),

  http.get(url("/users/:id"), handle(({ params, user }) => {
    const u = must(find(db.users, params.id), "Seller not found.");
    if (u.isBlocked) throw new ApiError(404, "NOT_FOUND", "Seller not found.");
    return {
      _id: u._id, name: u.name, avatarUrl: u.avatarUrl, sellerProfile: u.sellerProfile,
      ratingAvg: u.ratingAvg, ratingCount: u.ratingCount, createdAt: u.createdAt,
      listings: db.listings.filter((l) => l.seller === u._id && l.status === "active").sort(newestFirst).map((l) => listingOut(l, user)),
    };
  })),

  http.get(url("/users/:id/reviews"), handle(({ params, sp }) => {
    const reviews = db.reviews.filter((r) => r.seller === params.id).sort(newestFirst);
    const out = paginate(reviews, sp);
    out.items = out.items.map((r) => ({ ...r, reviewer: userRef(r.reviewer) }));
    return out;
  })),

  /* ----- categories ----- */
  http.get(url("/categories"), handle(({ user }) => categoryTree(user?.role === "admin"))),

  /* ----- listings ----- */
  http.get(url("/listings"), handle(({ sp, user }) => {
    const sort = SORTERS[sp.get("sort")] || SORTERS.newest;
    const matches = db.listings.filter((l) => l.status === "active" && matchListing(l, sp)).sort(sort);
    const out = paginate(matches, sp);
    out.items = out.items.map((l) => listingOut(l, user));
    return out;
  })),

  http.get(url("/listings/:id"), handle(({ params, user }) => {
    const l = must(find(db.listings, params.id), "Listing not found.");
    if (!canSee(l, user)) throw new ApiError(404, "NOT_FOUND", "Listing not found.");
    if (!user || user._id !== l.seller) l.views += 1;
    return listingOut(l, user);
  })),

  http.get(url("/listings/:id/similar"), handle(({ params, user }) => {
    const l = must(find(db.listings, params.id));
    return db.listings
      .filter((x) => x._id !== l._id && x.status === "active" && x.category === l.category)
      .sort(SORTERS.popular)
      .slice(0, 8)
      .map((x) => listingOut(x, user));
  })),

  http.post(url("/listings"), handle(({ user, body }) => {
    const l = {
      _id: newId("l"), seller: user._id, category: "", title: "", description: "", brand: "", size: "",
      color: "", condition: "", price: 0, images: [], status: "draft", views: 0, favoritesCount: 0, createdAt: now(),
    };
    applyFields(l, body);
    if (!l.title?.trim()) throw bad("Add a title.");
    if (body.price !== undefined && !(l.price > 0)) throw bad("Price must be greater than 0.");
    db.listings.unshift(l); // always created as a draft; publish with PATCH { status: "active" }
    return created(listingOut(l, user));
  }, "seller")),

  http.patch(url("/listings/:id"), handle(({ params, user, body }) => {
    const l = ownListing(params.id, user);
    if (!["draft", "active"].includes(l.status)) throw new ApiError(409, "NOT_EDITABLE", "This listing can no longer be edited.");
    if (body.status && !["draft", "active"].includes(body.status)) throw bad("Invalid status.");
    applyFields(l, body);
    if (Array.isArray(body.images)) {
      l.images = body.images.map((im, i) => ({ url: im.url, publicId: im.publicId || im.url, isCover: !!im.isCover, order: i }));
      ensureCover(l);
    }
    if (body.status) l.status = body.status;
    if (l.status === "active") assertPublishable(l);
    return listingOut(l, user);
  }, "seller")),

  http.delete(url("/listings/:id"), handle(({ params, user }) => {
    ownListing(params.id, user).status = "removed"; // soft delete (SRS LST-04)
    return { ok: true };
  }, "seller")),

  http.post(url("/listings/:id/images"), handle(async ({ params, user, request }) => {
    const l = ownListing(params.id, user);
    const files = (await request.formData()).getAll("images").filter((f) => f instanceof File);
    if (l.images.length + files.length > 8) throw bad("You can add up to 8 photos.");
    for (const file of files) {
      l.images.push({ url: await toDataUrl(file), publicId: newId("img"), isCover: false, order: l.images.length });
    }
    ensureCover(l);
    return listingOut(l, user);
  }, "seller")),

  http.post(url("/listings/:id/mark-sold"), handle(({ params, user }) => {
    ownListing(params.id, user).status = "sold";
    return { ok: true };
  }, "seller")),

  /* ----- cart ----- */
  http.get(url("/cart"), handle(({ user }) =>
    cartOf(user._id).map((id) => find(db.listings, id)).filter(Boolean).map((l) => listingOut(l, user)), "user")),

  http.post(url("/cart/items"), handle(({ user, body }) => {
    const l = must(find(db.listings, body.listingId), "Listing not found.");
    if (l.seller === user._id) throw bad("You can't buy your own item.");
    if (l.status !== "active") throw new ApiError(409, "ITEM_UNAVAILABLE", "This item is no longer available.");
    const cart = cartOf(user._id);
    if (!cart.includes(l._id)) cart.push(l._id);
    return created({ ok: true });
  }, "user")),

  http.delete(url("/cart/items/:listingId"), handle(({ user, params }) => {
    db.carts[user._id] = cartOf(user._id).filter((id) => id !== params.listingId);
    return { ok: true };
  }, "user")),

  /* ----- wishlist ----- */
  http.get(url("/wishlist"), handle(({ user }) =>
    wishlistOf(user._id).map((id) => find(db.listings, id)).filter((l) => l && l.status !== "removed").map((l) => listingOut(l, user)), "user")),

  http.post(url("/wishlist/:listingId"), handle(({ user, params }) => {
    const l = must(find(db.listings, params.listingId), "Listing not found.");
    const list = wishlistOf(user._id);
    if (!list.includes(l._id)) { list.push(l._id); l.favoritesCount += 1; }
    return created({ ok: true });
  }, "user")),

  http.delete(url("/wishlist/:listingId"), handle(({ user, params }) => {
    const list = wishlistOf(user._id);
    const l = find(db.listings, params.listingId);
    if (list.includes(params.listingId) && l) l.favoritesCount = Math.max(0, l.favoritesCount - 1);
    db.wishlists[user._id] = list.filter((id) => id !== params.listingId);
    return { ok: true };
  }, "user")),

  /* ----- orders ----- */
  http.post(url("/orders"), handle(({ user, body }) => {
    const addr = body.shippingAddress;
    if (!addr?.line1 || !addr.city || !addr.country) throw bad("Enter a complete shipping address.");
    if (!["cod", "test_card"].includes(body.paymentMethod)) throw bad("Choose a payment method.");

    const items = cartOf(user._id).map((id) => find(db.listings, id)).filter(Boolean);
    if (!items.length) throw bad("Your cart is empty.");
    // Atomic check (SRS ORD-03, AT-05): if anything was sold meanwhile, nothing is ordered
    if (items.some((l) => l.status !== "active")) throw new ApiError(409, "ITEM_UNAVAILABLE", "One of your items was just sold.");

    const bySeller = {};
    items.forEach((l) => { (bySeller[l.seller] = bySeller[l.seller] || []).push(l); });

    const orders = Object.entries(bySeller).map(([seller, ls]) => {
      const subtotal = ls.reduce((sum, l) => sum + l.price, 0);
      const order = {
        _id: newId("o"), buyer: user._id, seller,
        items: ls.map((l) => ({ listing: l._id, title: l.title, image: l.images[0]?.url, priceAtPurchase: l.price })),
        shippingAddress: pickAddress(addr),
        paymentMethod: body.paymentMethod,
        paymentStatus: body.paymentMethod === "test_card" ? "paid" : "pending",
        status: "pending",
        statusHistory: [{ status: "pending", at: now(), note: "Order placed" }],
        totals: { subtotal, shipping: SHIPPING_FEE, platformFee: money((subtotal * FEE_PERCENT) / 100), total: subtotal + SHIPPING_FEE },
        createdAt: now(),
      };
      ls.forEach((l) => { l.status = "reserved"; });
      db.orders.unshift(order);
      notify(user._id, "order_placed", `Your order #${orderCode(order._id)} was placed.`, `/orders/${order._id}`);
      notify(seller, "order_placed", `New order #${orderCode(order._id)} from ${user.name}.`, `/seller/orders/${order._id}`);
      return order;
    });

    db.carts[user._id] = [];
    return created({ orders: orders.map(orderOut) });
  }, "user")),

  http.get(url("/orders"), handle(({ user, sp }) => {
    const status = sp.get("status");
    const mine = db.orders.filter((o) => o.buyer === user._id && (!status || o.status === status)).sort(newestFirst);
    const out = paginate(mine, sp);
    out.items = out.items.map(orderOut);
    return out;
  }, "user")),

  http.get(url("/orders/:id"), handle(({ user, params }) => orderOut(orderForViewer(params.id, user)), "user")),

  http.post(url("/orders/:id/cancel"), handle(({ user, params }) => {
    const o = must(find(db.orders, params.id), "Order not found.");
    if (o.buyer !== user._id) throw forbidden();
    if (!["pending", "confirmed"].includes(o.status)) throw new ApiError(409, "NOT_CANCELLABLE", "This order can no longer be cancelled.");
    pushStatus(o, "cancelled", "Cancelled by buyer");
    setOrderListings(o, "active"); // listing goes back on sale (SRS AT-06)
    notify(o.seller, "order_status", `Order #${orderCode(o._id)} was cancelled by the buyer.`, `/seller/orders/${o._id}`);
    return orderOut(o);
  }, "user")),

  http.post(url("/orders/:id/review"), handle(({ user, params, body }) => {
    const o = must(find(db.orders, params.id), "Order not found.");
    if (o.buyer !== user._id) throw forbidden();
    if (o.status !== "completed") throw new ApiError(409, "NOT_COMPLETED", "You can review a seller once the order is completed.");
    if (reviewOf(o._id)) throw new ApiError(409, "ALREADY_REVIEWED", "You already reviewed this order.");
    const rating = Number(body.rating);
    if (!(rating >= 1 && rating <= 5)) throw bad("Choose a rating from 1 to 5.");
    if (body.comment && body.comment.length > 500) throw bad("Keep your comment under 500 characters.");
    const review = { _id: newId("r"), order: o._id, reviewer: user._id, seller: o.seller, rating, comment: body.comment || "", createdAt: now() };
    db.reviews.push(review);
    recomputeRating(o.seller);
    return created(review);
  }, "user")),

  /* ----- seller ----- */
  http.get(url("/seller/listings"), handle(({ user, sp }) => {
    const status = sp.get("status");
    const mine = db.listings.filter((l) => l.seller === user._id && l.status !== "removed" && (!status || l.status === status)).sort(newestFirst);
    const out = paginate(mine, sp);
    out.items = out.items.map((l) => listingOut(l, user));
    return out;
  }, "seller")),

  http.get(url("/seller/orders"), handle(({ user, sp }) => {
    const status = sp.get("status");
    const mine = db.orders.filter((o) => o.seller === user._id && (!status || o.status === status)).sort(newestFirst);
    const out = paginate(mine, sp);
    out.items = out.items.map(orderOut);
    return out;
  }, "seller")),

  http.get(url("/seller/orders/:id"), handle(({ user, params }) => {
    const o = must(find(db.orders, params.id), "Order not found.");
    if (o.seller !== user._id && user.role !== "admin") throw new ApiError(404, "NOT_FOUND", "Order not found.");
    return orderOut(o);
  }, "seller")),

  http.patch(url("/seller/orders/:id/status"), handle(({ user, params, body }) => {
    const o = must(find(db.orders, params.id), "Order not found.");
    if (o.seller !== user._id && user.role !== "admin") throw forbidden();
    if (NEXT_STATUS[o.status] !== body.status) {
      throw new ApiError(409, "INVALID_TRANSITION", `An order that is ${o.status} can't be marked ${body.status}.`);
    }
    pushStatus(o, body.status, body.note?.trim());
    notify(o.buyer, "order_status", `Your order #${orderCode(o._id)} is now ${body.status}.`, `/orders/${o._id}`);
    if (body.status === "delivered") {
      // Mock shortcut: the SRS has no step that moves Delivered to Completed, so the mock completes
      // the order right away. That way the review flow can be tried end to end.
      pushStatus(o, "completed", "Completed automatically (mock)");
      o.paymentStatus = "paid";
      setOrderListings(o, "sold");
    }
    return orderOut(o);
  }, "seller")),

  http.get(url("/seller/summary"), handle(({ user }) => {
    const mine = db.orders.filter((o) => o.seller === user._id);
    const paid = mine.filter((o) => ["delivered", "completed"].includes(o.status));
    const totalSales = paid.reduce((s, o) => s + o.totals.subtotal, 0);
    const platformFee = paid.reduce((s, o) => s + o.totals.platformFee, 0);

    const byDay = new Map();
    paid.slice().sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)).forEach((o) => {
      const label = new Date(o.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" });
      byDay.set(label, (byDay.get(label) || 0) + o.totals.subtotal);
    });

    const listings = db.listings.filter((l) => l.seller === user._id && l.status !== "removed");
    return {
      totalSales,
      platformFee: money(platformFee),
      netEarnings: money(totalSales - platformFee),
      activeListings: listings.filter((l) => l.status === "active").length,
      pendingOrders: mine.filter((o) => ["pending", "confirmed"].includes(o.status)).length,
      totalViews: listings.reduce((s, l) => s + l.views, 0),
      salesOverTime: [...byDay].map(([label, total]) => ({ label, total })),
      mostViewed: listings.slice().sort((a, b) => b.views - a.views).slice(0, 5).map((l) => ({ _id: l._id, title: l.title, views: l.views })),
    };
  }, "seller")),

  /* ----- notifications ----- */
  http.get(url("/notifications"), handle(({ user, sp }) =>
    paginate(db.notifications.filter((n) => n.user === user._id).sort(newestFirst), sp), "user")),

  http.patch(url("/notifications/read-all"), handle(({ user }) => {
    db.notifications.forEach((n) => { if (n.user === user._id) n.isRead = true; });
    return { ok: true };
  }, "user")),

  http.patch(url("/notifications/:id/read"), handle(({ user, params }) => {
    const n = must(find(db.notifications, params.id));
    if (n.user !== user._id) throw forbidden();
    n.isRead = true;
    return { ok: true };
  }, "user")),

  /* ----- reports ----- */
  http.post(url("/reports"), handle(({ user, body }) => {
    if (!["listing", "user", "review"].includes(body.targetType)) throw bad("Invalid report target.");
    if (!body.targetId) throw bad("Missing report target.");
    if (!body.reason || body.reason.trim().length < 5) throw bad("Please give a reason.");
    const report = { _id: newId("rp"), reporter: user._id, targetType: body.targetType, targetId: body.targetId, reason: body.reason.trim(), status: "open", createdAt: now() };
    db.reports.unshift(report);
    return created(report);
  }, "user")),

  /* ----- admin ----- */
  http.get(url("/admin/stats"), handle(() => ({
    users: db.users.length,
    listings: db.listings.filter((l) => l.status !== "removed").length,
    orders: db.orders.length,
    revenue: money(db.orders.filter((o) => o.status === "completed").reduce((s, o) => s + o.totals.platformFee, 0)),
    flagged: db.listings.filter((l) => l.status === "flagged").length,
  }), "admin")),

  http.get(url("/admin/users"), handle(({ sp }) => {
    const q = sp.get("q")?.trim().toLowerCase();
    const users = db.users.filter((u) => !q || u.name.toLowerCase().includes(q) || u.email.includes(q)).sort(newestFirst);
    const out = paginate(users, sp);
    out.items = out.items.map(publicUser);
    return out;
  }, "admin")),

  http.patch(url("/admin/users/:id/block"), handle(({ params, body }) => {
    const u = must(find(db.users, params.id), "User not found.");
    if (u.role === "admin") throw new ApiError(409, "CANNOT_BLOCK_ADMIN", "Admins can't be blocked.");
    u.isBlocked = !!body.blocked;
    return publicUser(u);
  }, "admin")),

  http.get(url("/admin/listings"), handle(({ sp }) => {
    const q = sp.get("q")?.trim().toLowerCase();
    const status = sp.get("status");
    const list = db.listings
      .filter((l) => (!status || l.status === status) && (!q || `${l.title} ${l.brand}`.toLowerCase().includes(q)))
      .sort(newestFirst);
    const out = paginate(list, sp);
    out.items = out.items.map((l) => listingOut(l, null));
    return out;
  }, "admin")),

  http.delete(url("/admin/listings/:id"), handle(({ params, body }) => {
    const l = must(find(db.listings, params.id), "Listing not found.");
    if (!body.reason || body.reason.trim().length < 5) throw bad("Give a reason (at least 5 characters).");
    l.status = "removed";
    notify(l.seller, "listing_removed", `Your listing "${l.title}" was removed: ${body.reason.trim()}`, "/seller/listings");
    return { ok: true };
  }, "admin")),

  http.post(url("/admin/categories"), handle(({ body }) => {
    if (!body.name?.trim() || body.name.trim().length < 2) throw bad("Name is too short.");
    const c = {
      _id: newId("c"), name: body.name.trim(), slug: uniqueSlug(body.name),
      parent: body.parent || null, icon: body.icon || "", isActive: body.isActive !== false,
    };
    db.categories.push(c);
    return created(c);
  }, "admin")),

  http.patch(url("/admin/categories/:id"), handle(({ params, body }) => {
    const c = must(find(db.categories, params.id), "Category not found.");
    if (body.name !== undefined && body.name.trim() !== c.name) { c.name = body.name.trim(); c.slug = uniqueSlug(c.name, c._id); }
    if (body.parent !== undefined) c.parent = body.parent || null;
    if (body.icon !== undefined) c.icon = body.icon;
    if (body.isActive !== undefined) c.isActive = !!body.isActive;
    return c;
  }, "admin")),

  http.delete(url("/admin/categories/:id"), handle(({ params }) => {
    const c = must(find(db.categories, params.id), "Category not found.");
    if (db.categories.some((x) => x.parent === c._id) || db.listings.some((l) => l.category === c._id)) {
      throw new ApiError(409, "CATEGORY_IN_USE", "This category has listings or subcategories. Deactivate it instead.");
    }
    db.categories = db.categories.filter((x) => x._id !== c._id);
    return { ok: true };
  }, "admin")),

  http.get(url("/admin/reports"), handle(({ sp }) => {
    const status = sp.get("status");
    const out = paginate(db.reports.filter((r) => !status || r.status === status).sort(newestFirst), sp);
    out.items = out.items.map((r) => ({ ...r, reporter: userRef(r.reporter) }));
    return out;
  }, "admin")),

  http.patch(url("/admin/reports/:id"), handle(({ user, params, body }) => {
    const r = must(find(db.reports, params.id), "Report not found.");
    if (!["dismissed", "actioned"].includes(body.status)) throw bad("Invalid status.");
    r.status = body.status;
    r.resolvedBy = user._id;
    return r;
  }, "admin")),

  /* ----- AI (Phases 1-3: empty draft, keyword fallback; SRS 3.4) ----- */
  http.post(url("/ai/listing-draft"), handle(() => ({
    category: [], color: [], brand: [], condition: null, title: "", description: "",
    priceSuggestion: null, modelVersions: {},
  }), "seller")),

  http.get(url("/ai/search"), handle(({ sp, user }) => {
    const matches = db.listings.filter((l) => l.status === "active" && matchListing(l, sp));
    const out = paginate(matches, sp);
    out.items = out.items.map((l) => listingOut(l, user));
    return out;
  })),

  http.post(url("/ai/price-suggestion"), handle(({ body }) => {
    const prices = db.listings.filter((l) => l.category === body.category && l.status !== "draft").map((l) => l.price).sort((a, b) => a - b);
    if (!prices.length) return { value: 0, low: 0, high: 0 };
    const median = prices[Math.floor(prices.length / 2)];
    return { value: median, low: Math.round(median * 0.75), high: Math.round(median * 1.25) };
  }, "seller")),
];