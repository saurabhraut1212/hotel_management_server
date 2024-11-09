
import Joi from "joi";

export const registerValidationSchema = Joi.object({
    name: Joi.string().min(3).max(30).required().messages({
        "string.empty": "Name is required",
        "string.min": "Name should be at least 3 characters",
        "string.max": "Name should be at most 30 characters",
    }),
    email: Joi.string().email().required().messages({
        "string.empty": "Email is required",
        "string.email": "Please enter a valid email address",
    }),
    password: Joi.string().min(6).required().messages({
        "string.empty": "Password is required",
        "string.min": "Password should be at least 6 characters long",
    }),
    phone: Joi.number().min(1000000000).max(9999999999).required().messages({
        "number.base": "Phone number must be a number",
        "number.min": "Phone number must be at least 10 digits",
        "number.max": "Phone number must be at most 10 digits",
        "any.required": "Phone number is required",
    }),
    address: Joi.string().min(5).required().messages({
        "string.empty": "Address is required",
        "string.min": "Address should be at least 5 characters long",
    }),
    role: Joi.string().valid("user", "admin").default("user"),
    orders: Joi.array().items(Joi.string().regex(/^[0-9a-fA-F]{24}$/)).default([]).messages({
    "array.base": "Orders must be an array",
    "string.pattern.base": "Each order ID must be a valid ObjectId",
}),
});


export const loginValidationSchema = Joi.object({
    email: Joi.string().email().required().messages({
        "string.empty": "Email is required",
        "string.email": "Please enter a valid email address",
    }),
    password: Joi.string().min(6).required().messages({
        "string.empty": "Password is required",
        "string.min": "Password should be at least 6 characters long",
    }),
});
