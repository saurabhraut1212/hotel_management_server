"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderValidationSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.orderValidationSchema = joi_1.default.object({
    userId: joi_1.default.string().required().messages({
        "string.empty": "User ID is required.",
        "any.required": "User ID is required.",
    }),
    items: joi_1.default.array()
        .items(joi_1.default.object({
        menu: joi_1.default.string().required().messages({
            "string.empty": "Menu name is required.",
            "any.required": "Menu name is required.",
        }),
        price: joi_1.default.number().greater(0).required().messages({
            "number.base": "Price must be a number.",
            "number.greater": "Price must be greater than 0.",
            "any.required": "Price is required.",
        }),
        quantity: joi_1.default.number().greater(0).required().messages({
            "number.base": "Quantity must be a number.",
            "number.greater": "Quantity must be greater than 0.",
            "any.required": "Quantity is required.",
        }),
        totalPrice: joi_1.default.number().greater(0).required().messages({
            "number.base": "Total price must be a number.",
            "number.greater": "Total price must be greater than 0.",
            "any.required": "Total price is required.",
        }),
    }))
        .min(1)
        .required()
        .messages({
        "array.min": "At least one menu item is required.",
        "array.base": "Items must be an array.",
        "any.required": "Items are required.",
    }),
    totalPrice: joi_1.default.number().greater(0).required().messages({
        "number.base": "Total price must be a number.",
        "number.greater": "Total price must be greater than 0.",
        "any.required": "Total price is required.",
    }),
});
