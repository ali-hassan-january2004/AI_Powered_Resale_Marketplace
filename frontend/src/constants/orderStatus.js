export const ORDER_STATUS = {
  PENDING: "pending",
  CONFIRMED: "confirmed",
  SHIPPED: "shipped",
  DELIVERED: "delivered",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
};

export const ORDER_STATUSES = Object.values(ORDER_STATUS);

// Order of the tracking timeline (SRS ORD-06)
export const ORDER_STEPS = ["pending", "confirmed", "shipped", "delivered", "completed"];

export const ORDER_STATUS_LABELS = {
  pending: "Pending",
  confirmed: "Confirmed",
  shipped: "Shipped",
  delivered: "Delivered",
  completed: "Completed",
  cancelled: "Cancelled",
};

// SRS ORD-07: a buyer may cancel before shipping
export const CANCELLABLE_STATUSES = [ORDER_STATUS.PENDING, ORDER_STATUS.CONFIRMED];
export const isCancellable = (status) => CANCELLABLE_STATUSES.includes(status);

// What a seller can do next (SRS SLR-03)
export const SELLER_NEXT_STATUS = {
  pending: { status: "confirmed", label: "Confirm order" },
  confirmed: { status: "shipped", label: "Mark as shipped", askNote: true },
  shipped: { status: "delivered", label: "Mark as delivered" },
};

// Tabs on the order list pages
export const ORDER_FILTER_TABS = [
  { id: "all", label: "All" },
  ...ORDER_STATUSES.map((s) => ({ id: s, label: ORDER_STATUS_LABELS[s] })),
];