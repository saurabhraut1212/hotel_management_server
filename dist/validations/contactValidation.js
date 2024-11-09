"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.contactValidationSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.contactValidationSchema = joi_1.default.object({
    name: joi_1.default.string().min(3).max(50).required().messages({
        "string.empty": "Name is required",
        "string.min": "Name should be at least 3 characters",
        "string.max": "Name should be at most 50 characters",
    }),
    email: joi_1.default.string().email().required().messages({
        "string.empty": "Email is required",
        "string.email": "Please enter a valid email address",
    }),
    message: joi_1.default.string().min(10).max(500).required().messages({
        "string.empty": "Message is required",
        "string.min": "Message should be at least 10 characters long",
        "string.max": "Message should be at most 500 characters long",
    }),
});
