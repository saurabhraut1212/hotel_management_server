import mongoose, { Document, Schema, Model, PopulatedDoc } from "mongoose";

//import { IOrder } from "./Order"; 

// User Interface
interface IUser extends Document {
    _id: string;
    name: string;
    email: string;
    password: string;
    phone: number;
    address: string;
    role: 'admin' | 'user';
    orders?: PopulatedDoc< Document>[]; //add IOrder &
    createdAt?: Date;
    updatedAt?: Date;
}


const userSchema = new Schema<IUser>(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        phone: { type: Number, required: true },
        address: { type: String, required: true },
        role: { type: String, enum: ["admin", "user"], default: "user" }, 
        orders: [{ type: Schema.Types.ObjectId, ref: "Order" }],
    },
    {
        timestamps: true,
    }
);


const AuthModel: Model<IUser> =
    mongoose.models.Auth || mongoose.model<IUser>("Auth", userSchema);

export { AuthModel, IUser };
