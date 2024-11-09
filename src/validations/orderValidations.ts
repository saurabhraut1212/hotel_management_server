import Joi from "joi";

export const orderValidationSchema = Joi.object({
  userId: Joi.string().required().messages({
    "string.empty": "User ID is required.",
    "any.required": "User ID is required.",
  }),

  items: Joi.array()
    .items(
      Joi.object({
        menu: Joi.string().required().messages({
          "string.empty": "Menu name is required.",
          "any.required": "Menu name is required.",
        }),
        price: Joi.number().greater(0).required().messages({
          "number.base": "Price must be a number.",
          "number.greater": "Price must be greater than 0.",
          "any.required": "Price is required.",
        }),
        quantity: Joi.number().greater(0).required().messages({
          "number.base": "Quantity must be a number.",
          "number.greater": "Quantity must be greater than 0.",
          "any.required": "Quantity is required.",
        }),
        totalPrice: Joi.number().greater(0).required().messages({
          "number.base": "Total price must be a number.",
          "number.greater": "Total price must be greater than 0.",
          "any.required": "Total price is required.",
        }),
      })
    )
    .min(1)
    .required()
    .messages({
      "array.min": "At least one menu item is required.",
      "array.base": "Items must be an array.",
      "any.required": "Items are required.",
    }),

  totalPrice: Joi.number().greater(0).required().messages({
    "number.base": "Total price must be a number.",
    "number.greater": "Total price must be greater than 0.",
    "any.required": "Total price is required.",
  }),
});
