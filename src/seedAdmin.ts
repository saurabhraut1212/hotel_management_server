// seedAdmin.ts
import mongoose from "mongoose";
import { AuthModel, IUser } from "./models/authModel";
import bcrypt from "bcryptjs";
import { registerValidationSchema } from "./validations/authValidations"; 
import dotenv from "dotenv";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI as string; 
const adminEmail = process.env.ADMIN_EMAIL as string; 
const adminPassword = process.env.ADMIN_PASSWORD as string;
const adminPhone = process.env.ADMIN_PHONE ? Number(process.env.ADMIN_PHONE) : 0; 


const createAdminUser = async (): Promise<void> => {
  try {
   
    await mongoose.connect(MONGO_URI!);
    console.log("Database connected successfully");

    
    const existingAdmin: IUser | null = await AuthModel.findOne({ email: adminEmail, role: "admin" });
    if (existingAdmin) {
      console.log("Admin user already exists!");
      return;
    }

    
    const { error } = registerValidationSchema.validate({
      name: "Admin User",
      email: adminEmail,
      password: adminPassword,
      phone: 9999999999, 
      address: "Admin Address",
      role: "admin", 
    });

    if (error) {
      console.error("Validation error:", error.details);
      return;
    }

    const hashedPassword: string = await bcrypt.hash(adminPassword, 10);

    const adminUser: IUser = new AuthModel({
      name: "Admin User",
      email: adminEmail,
      password: hashedPassword,
      phone: adminPhone, 
      address: "Admin Address",
      role: "admin",  
    });

    await adminUser.save();
    console.log("Admin user created successfully!");

  } catch (error) {
    console.error("Error creating admin user:", error);
  } finally {
    
    await mongoose.connection.close();
    console.log("Database connection closed");
  }
};

// Run the function
createAdminUser();
