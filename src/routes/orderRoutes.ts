import express from "express";
import { createOrder } from "../controllers/orderController";
import { isUser } from "../middleware/authMiddleware";

const router = express.Router();

router.post("/createOrder",isUser,createOrder);

export default router;
