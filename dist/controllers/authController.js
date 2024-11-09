"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
const authModel_1 = require("../models/authModel");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authValidations_1 = require("../validations/authValidations");
const generateToken = (user) => {
    const data = {
        id: user._id,
        email: user.email,
        role: user.role
    };
    const token = jsonwebtoken_1.default.sign(data, process.env.JWT_SECRET, {
        expiresIn: "1d",
    });
    return token;
};
const register = async (req, res) => {
    try {
        const { error } = authValidations_1.registerValidationSchema.validate(req.body);
        if (error) {
            return res.status(400).json({
                success: false,
                message: error.details[0].message,
            });
        }
        const { name, email, password, phone, address } = req.body;
        const existingUser = await authModel_1.AuthModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User with that email already exists",
            });
        }
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        const user = await authModel_1.AuthModel.create({
            name,
            email,
            password: hashedPassword,
            phone,
            address,
            role: "user",
        });
        const token = generateToken(user);
        return res.status(201).json({
            success: true,
            message: "User registered successfully",
            token,
            user,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};
exports.register = register;
const login = async (req, res) => {
    try {
        const { error } = authValidations_1.loginValidationSchema.validate(req.body);
        if (error) {
            return res.status(400).json({
                success: false,
                message: error.details[0].message,
            });
        }
        const { email, password } = req.body;
        const existingUser = await authModel_1.AuthModel.findOne({ email });
        if (!existingUser) {
            return res.status(400).json({
                success: false,
                message: "User with that email id does not exist",
            });
        }
        if (!existingUser.password) {
            return res.status(400).json({
                success: false,
                message: "This user is registered with Google, please use Google login",
            });
        }
        const isMatchedPassword = await bcryptjs_1.default.compare(password, existingUser.password);
        if (!isMatchedPassword) {
            return res.status(400).json({
                success: false,
                message: "Invalid credentials",
            });
        }
        const token = generateToken(existingUser);
        return res.status(200).json({
            success: true,
            message: "User logged in successfully",
            token,
            user: existingUser,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};
exports.login = login;
