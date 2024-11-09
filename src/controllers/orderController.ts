import { Request, Response } from "express";
import { OrderModel, IOrder } from "../models/orderModel";
import { AuthModel, IUser } from "../models/authModel";
import { orderValidationSchema } from "../validations/orderValidations";
import { canModifyOrder, sendEmail } from "../utils/helper";

export const createOrder = async (req: Request, res: Response): Promise<Response> => {
  const { items, totalPrice } = req.body;
    const userId = (req.user as IUser)._id;

  const { error } = orderValidationSchema.validate({ userId, items, totalPrice });
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  try {
  
    const user: IUser | null = await AuthModel.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const order: IOrder = new OrderModel({ userId, items, totalPrice });
    await order.save();
 
    user.orders?.push(order._id);
    await user.save();

    return res.status(201).json({ message: "Order created successfully", order });
  } catch (error) {
    console.error("Error creating order:", error);
    return res.status(500).json({ error: "Failed to create order. Please try again later." });
  }
};

export const updateOrder = async (req: Request, res: Response): Promise<Response> => {
  const  orderId  = req.params.id;
  const { items, totalPrice } = req.body;
  const userId = (req.user as IUser)._id;

  try {
    const order: IOrder | null = await OrderModel.findById(orderId);

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

   
    if (order.userId.toString() !== userId.toString()) {
      return res.status(403).json({ error: "You are not authorized to update this order" });
    }

   
    if (!canModifyOrder(order.createdAt)) {
      return res.status(403).json({ error: "Order can only be modified within 10 minutes of creation" });
    }

    
    order.items = items || order.items;
    order.totalPrice = totalPrice || order.totalPrice;

    await order.save();

    return res.status(200).json({ message: "Order updated successfully", order });
  } catch (error) {
    console.error("Error updating order:", error);
    return res.status(500).json({ error: "Failed to update order" });
  }
};

export const deleteOrder = async (req: Request, res: Response): Promise<Response> => {
  const  orderId  = req.params.id;
  const userId = (req.user as IUser)._id;

  try {
    const order: IOrder | null = await OrderModel.findById(orderId);

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    if (order.userId.toString() !== userId.toString()) {
      return res.status(403).json({ error: "You are not authorized to delete this order" });
    }

    if (!canModifyOrder(order.createdAt)) {
      return res.status(403).json({ error: "Order can only be deleted within 10 minutes of creation" });
    }

   
    await OrderModel.findByIdAndDelete(orderId);

    
    await AuthModel.findByIdAndUpdate(userId, {
      $pull: { orders: orderId },
    });

    return res.status(200).json({ message: "Order deleted successfully " });
  } catch (error) {
    console.error("Error deleting order:", error);
    return res.status(500).json({ error: "Failed to delete order" });
  }
};

export const getUserOrders = async (req: Request, res: Response): Promise<Response> => {
  const userId = (req.user as IUser)?._id; 

  try {
    const orders: IOrder[] = await OrderModel.find({ userId });

    const accessibleOrders: IOrder[] = orders.filter((order: IOrder) =>
      canModifyOrder(order.createdAt)
    );

    if (accessibleOrders.length === 0) {
      return res.status(404).json({ message: "No orders found within the accessible time frame." });
    }

    return res.status(200).json({
      success: true,
      orders: accessibleOrders,
    });
  } catch (error: unknown) {
    console.error("Error fetching user's orders:", error);
    return res.status(500).json({ error: "Failed to fetch user's orders." });
  }
};

export const getAllOrders = async (req: Request, res: Response): Promise<Response> => {
  try {
    const orders: IOrder[] = await OrderModel.find().populate("userId", "name email");

    return res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error("Error fetching all orders:", error);
    return res.status(500).json({ error: "Failed to fetch all orders." });
  }
};

export const updateOrderStatus = async (req: Request, res: Response): Promise<Response> => {
  const orderId  = req.params.id;
  const { status } = req.body;
  const admin = req.user as IUser;

  if (!admin || admin.role !== "admin") {
    return res.status(403).json({ message: "Access denied. Admins only." });
  }

  try {
    const order: IOrder | null = await OrderModel.findById(orderId).populate("userId");
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const user: IUser | null = await AuthModel.findById(order.userId);
    if (!user || !user.email) {
      return res.status(404).json({ message: "User not found or email not provided" });
    }

    if (!["confirmed", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status. Use 'confirmed' or 'rejected'." });
    }

    order.status = status;
    await order.save();

   
    const subject = `Your Order #${orderId} has been ${status}`;
    const emailMessage =
      status === "confirmed"
        ? `Dear ${user.name},\n\nYour order has been confirmed successfully. You can expect delivery soon.\n\nThank you for shopping with us!`
        : `Dear ${user.name},\n\nWe regret to inform you that your order has been rejected due to certain issues.\n\nPlease contact support for more details.`;

    await sendEmail(user.email, subject, emailMessage);

    return res.status(200).json({
      success: true,
      message: `Order ${status} successfully. User has been notified via email.`,
      order,
    });
  } catch (error) {
    console.error("Error updating order status:", error);
    return res.status(500).json({ error: "Failed to update order status." });
  }
};

