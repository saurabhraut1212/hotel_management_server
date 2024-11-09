import mongoose, { Schema, Document, Model } from "mongoose";

 interface IContact extends Document {
  name: string;
  email: string;
  message: string;
  createdAt: Date;
}

const ContactSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const ContactModel: Model<IContact> =mongoose.models.Contact || mongoose.model<IContact>("Contact", ContactSchema);
export {ContactModel,IContact}
