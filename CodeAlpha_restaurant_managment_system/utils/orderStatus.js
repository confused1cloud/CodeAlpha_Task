// utils/orderStatus.js
const ORDER_STATUS = {
  PENDING: "pending",
  PREPARING: "preparing",
  SERVED: "served",
  CLOSED: "closed",
  CANCELLED: "cancelled",
};

const STATUS_TRANSITIONS = {
  pending: ["preparing", "cancelled"],
  preparing: ["served", "cancelled"],
  served: ["closed"],
  closed: [],
  cancelled: [],
};

module.exports = {
  ORDER_STATUS,
  STATUS_TRANSITIONS
};