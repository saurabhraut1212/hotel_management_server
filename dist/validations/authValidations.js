"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginValidationSchema = exports.registerValidationSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.registerValidationSchema = joi_1.default.object({
    name: joi_1.default.string().min(3).max(30).required().messages({
        "string.empty": "Name is required",
        "string.min": "Name should be at least 3 characters",
        "string.max": "Name should be at most 30 characters",
    }),
    email: joi_1.default.string().email().required().messages({
        "string.empty": "Email is required",
        "string.email": "Please enter a valid email address",
    }),
    password: joi_1.default.string().min(6).required().messages({
        "string.empty": "Password is required",
        "string.min": "Password should be at least 6 characters long",
    }),
    phone: joi_1.default.number().min(1000000000).max(9999999999).required().messages({
        "number.base": "Phone number must be a number",
        "number.min": "Phone number must be at least 10 digits",
        "number.max": "Phone number must be at most 10 digits",
        "any.required": "Phone number is required",
    }),
    address: joi_1.default.string().min(5).required().messages({
        "string.empty": "Address is required",
        "string.min": "Address should be at least 5 characters long",
    }),
    role: joi_1.default.string().valid("user", "admin").default("user"),
    orders: joi_1.default.array().items(joi_1.default.string().regex(/^[0-9a-fA-F]{24}$/)).default([]).messages({
        "array.base": "Orders must be an array",
        "string.pattern.base": "Each order ID must be a valid ObjectId",
    }),
});
exports.loginValidationSchema = joi_1.default.object({
    email: joi_1.default.string().email().required().messages({
        "string.empty": "Email is required",
        "string.email": "Please enter a valid email address",
    }),
    password: joi_1.default.string().min(6).required().messages({
        "string.empty": "Password is required",
        "string.min": "Password should be at least 6 characters long",
    }),
});
