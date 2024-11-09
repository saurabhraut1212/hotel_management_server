"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// seedAdmin.ts
const mongoose_1 = __importDefault(require("mongoose"));
const authModel_1 = require("./models/authModel");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const authValidations_1 = require("./validations/authValidations");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const MONGO_URI = process.env.MONGO_URI;
const adminEmail = process.env.ADMIN_EMAIL;
const adminPassword = process.env.ADMIN_PASSWORD;
const adminPhone = process.env.ADMIN_PHONE ? Number(process.env.ADMIN_PHONE) : 0;
const createAdminUser = async () => {
    try {
        await mongoose_1.default.connect(MONGO_URI);
        console.log("Database connected successfully");
        const existingAdmin = await authModel_1.AuthModel.findOne({ email: adminEmail, role: "admin" });
        if (existingAdmin) {
            console.log("Admin user already exists!");
            return;
        }
        const { error } = authValidations_1.registerValidationSchema.validate({
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
        const hashedPassword = await bcryptjs_1.default.hash(adminPassword, 10);
        const adminUser = new authModel_1.AuthModel({
            name: "Admin User",
            email: adminEmail,
            password: hashedPassword,
            phone: adminPhone,
            address: "Admin Address",
            role: "admin",
        });
        await adminUser.save();
        console.log("Admin user created successfully!");
    }
    catch (error) {
        console.error("Error creating admin user:", error);
    }
    finally {
        await mongoose_1.default.connection.close();
        console.log("Database connection closed");
    }
};
// Run the function
createAdminUser();
