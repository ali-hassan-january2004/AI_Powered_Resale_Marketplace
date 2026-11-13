export const ROLES = {
  BUYER: "buyer",
  SELLER: "seller",
  ADMIN: "admin",
};

export const ROLE_LABELS = {
  buyer: "Buyer",
  seller: "Seller",
  admin: "Admin",
};

// Every seller is also a buyer, and admins can do everything sellers can
export const SELLER_ROLES = [ROLES.SELLER, ROLES.ADMIN];
export const ADMIN_ROLES = [ROLES.ADMIN];

export const hasRole = (user, roles = []) => !!user && roles.includes(user.role);
export const isSeller = (user) => hasRole(user, SELLER_ROLES);
export const isAdmin = (user) => hasRole(user, ADMIN_ROLES);