"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateOrderStatus = exports.getAllOrders = exports.getUserOrders = exports.deleteOrder = exports.updateOrder = exports.createOrder = void 0;
const orderModel_1 = require("../models/orderModel");
const authModel_1 = require("../models/authModel");
const orderValidations_1 = require("../validations/orderValidations");
const helper_1 = require("../utils/helper");
const createOrder = async (req, res) => {
    const { items, totalPrice } = req.body;
    const userId = req.user._id;
    const { error } = orderValidations_1.orderValidationSchema.validate({ userId, items, totalPrice });
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    try {
        const user = await authModel_1.AuthModel.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        const order = new orderModel_1.OrderModel({ userId, items, totalPrice });
        await order.save();
        user.orders?.push(order._id);
        await user.save();
        return res.status(201).json({ message: "Order created successfully", order });
    }
    catch (error) {
        console.error("Error creating order:", error);
        return res.status(500).json({ error: "Failed to create order. Please try again later." });
    }
};
exports.createOrder = createOrder;
const updateOrder = async (req, res) => {
    const { orderId } = req.params;
    const { items, totalPrice } = req.body;
    const userId = req.user._id;
    try {
        const order = await orderModel_1.OrderModel.findById(orderId);
        if (!order) {
            return res.status(404).json({ error: "Order not found" });
        }
        if (order.userId.toString() !== userId.toString()) {
            return res.status(403).json({ error: "You are not authorized to update this order" });
        }
        if (!(0, helper_1.canModifyOrder)(order.createdAt)) {
            return res.status(403).json({ error: "Order can only be modified within 10 minutes of creation" });
        }
        order.items = items || order.items;
        order.totalPrice = totalPrice || order.totalPrice;
        await order.save();
        return res.status(200).json({ message: "Order updated successfully", order });
    }
    catch (error) {
        console.error("Error updating order:", error);
        return res.status(500).json({ error: "Failed to update order" });
    }
};
exports.updateOrder = updateOrder;
const deleteOrder = async (req, res) => {
    const { orderId } = req.params;
    const userId = req.user._id;
    try {
        const order = await orderModel_1.OrderModel.findById(orderId);
        if (!order) {
            return res.status(404).json({ error: "Order not found" });
        }
        if (order.userId.toString() !== userId.toString()) {
            return res.status(403).json({ error: "You are not authorized to delete this order" });
        }
        if (!(0, helper_1.canModifyOrder)(order.createdAt)) {
            return res.status(403).json({ error: "Order can only be deleted within 10 minutes of creation" });
        }
        await orderModel_1.OrderModel.findByIdAndDelete(orderId);
        await authModel_1.AuthModel.findByIdAndUpdate(userId, {
            $pull: { orders: orderId },
        });
        return res.status(200).json({ message: "Order deleted successfully " });
    }
    catch (error) {
        console.error("Error deleting order:", error);
        return res.status(500).json({ error: "Failed to delete order" });
    }
};
exports.deleteOrder = deleteOrder;
const getUserOrders = async (req, res) => {
    const userId = req.user?._id;
    try {
        const orders = await orderModel_1.OrderModel.find({ userId });
        const accessibleOrders = orders.filter((order) => (0, helper_1.canModifyOrder)(order.createdAt));
        if (accessibleOrders.length === 0) {
            return res.status(404).json({ message: "No orders found within the accessible time frame." });
        }
        return res.status(200).json({
            success: true,
            orders: accessibleOrders,
        });
    }
    catch (error) {
        console.error("Error fetching user's orders:", error);
        return res.status(500).json({ error: "Failed to fetch user's orders." });
    }
};
exports.getUserOrders = getUserOrders;
const getAllOrders = async (req, res) => {
    try {
        const orders = await orderModel_1.OrderModel.find().populate("userId", "name email");
        return res.status(200).json({
            success: true,
            orders,
        });
    }
    catch (error) {
        console.error("Error fetching all orders:", error);
        return res.status(500).json({ error: "Failed to fetch all orders." });
    }
};
exports.getAllOrders = getAllOrders;
const updateOrderStatus = async (req, res) => {
    const { orderId } = req.params;
    const { status } = req.body;
    const admin = req.user;
    if (!admin || admin.role !== "admin") {
        return res.status(403).json({ message: "Access denied. Admins only." });
    }
    try {
        const order = await orderModel_1.OrderModel.findById(orderId);
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }
        if (!["confirmed", "rejected"].includes(status)) {
            return res.status(400).json({ message: "Invalid status. Use 'confirmed' or 'rejected'." });
        }
        order.status = status;
        await order.save();
        const message = status === "confirmed"
            ? "Your order has been confirmed by the admin."
            : "Your order has been rejected by the admin.";
        return res.status(200).json({
            success: true,
            message,
            order,
        });
    }
    catch (error) {
        console.error("Error updating order status:", error);
        return res.status(500).json({ error: "Failed to update order status." });
    }
};
exports.updateOrderStatus = updateOrderStatus;
// export const getOrderById = async (req: Request, res: Response) => {
//   const { id } = req.params;
//   try {
//     const order = await OrderModel.findById(id).populate("userId");
//     if (!order) return res.status(404).json({ error: "Order not found" });
//     res.json(order);
//   } catch (error) {
//     res.status(500).json({ error: "Error fetching order" });
//   }
// };
// export const getUserOrders = async (req: Request, res: Response) => {
//   const { userId } = req.params;
//   try {
//     const user = await UserModel.findById(userId).populate({
//       path: "orders",
//       model: "Order",
//     });
//     if (!user) {
//       return res.status(404).json({ error: "User not found" });
//     }
//     res.json({ orders: user.orders });
//   } catch (error) {
//     console.error("Error fetching user's orders:", error);
//     res.status(500).json({ error: "Failed to fetch user's orders." });
//   }
// };
