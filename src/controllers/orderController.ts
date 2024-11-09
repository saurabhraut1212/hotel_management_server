import { Request, Response } from "express";
import { OrderModel, IOrder } from "../models/orderModel";
import { AuthModel, IUser } from "../models/authModel";
import { orderValidationSchema } from "../validations/orderValidations";

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
