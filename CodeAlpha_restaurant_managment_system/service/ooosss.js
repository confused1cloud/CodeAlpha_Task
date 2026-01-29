// service/ooosss.js
const Order = require("../models/order");
const { STATUS_TRANSITIONS } = require("../utils/orderStatus");

const updateOrderStatus = async (orderId, newStatus) => {
  const order = await Order.findById(orderId);
  if (!order) {
    throw new Error("Order not found");
  }
  
  const allowedNextStates = STATUS_TRANSITIONS[order.status];
  if (!allowedNextStates.includes(newStatus)) {
    throw new Error(`Cannot change status from ${order.status} to ${newStatus}`);
  }
  
  order.status = newStatus;
  await order.save();
  return order;
};

module.exports = {
  updateOrderStatus
};