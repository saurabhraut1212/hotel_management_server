// models/orderModel.ts
import mongoose, { Schema, Document } from "mongoose";

interface IOrderItem {
  menu: string;
  price: number;
  quantity: number;
  totalPrice: number;
}

interface IOrder extends Document {
  userId: mongoose.Types.ObjectId;
  items: IOrderItem[]; 
  totalPrice: number;
  status: "pending" | "confirmed" | "rejected";
  createdAt: Date;
}

const OrderSchema: Schema = new Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: [
      {
        menu: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true },
        totalPrice: { type: Number, required: true },
      },
    ],
    totalPrice: { type: Number, required: true },
    status: { type: String, enum: ["pending", "confirmed", "rejected"], default: "pending" },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const OrderModel = mongoose.models.Order || mongoose.model<IOrder>("Order", OrderSchema);
export { OrderModel, IOrder };
