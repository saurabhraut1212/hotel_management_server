import Joi from "joi";

export const contactValidationSchema = Joi.object({
  name: Joi.string().min(3).max(50).required().messages({
    "string.empty": "Name is required",
    "string.min": "Name should be at least 3 characters",
    "string.max": "Name should be at most 50 characters",
  }),
  email: Joi.string().email().required().messages({
    "string.empty": "Email is required",
    "string.email": "Please enter a valid email address",
  }),
  message: Joi.string().min(10).max(500).required().messages({
    "string.empty": "Message is required",
    "string.min": "Message should be at least 10 characters long",
    "string.max": "Message should be at most 500 characters long",
  }),
});
