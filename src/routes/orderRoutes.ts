import express from "express";
import { createOrder, deleteOrder, getAllOrders, getUserOrders, updateOrder, updateOrderStatus } from "../controllers/orderController";
import { isAdmin, isUser } from "../middleware/authMiddleware";

const router = express.Router();

router.post('/createOrder', isUser, createOrder);
router.put('/updateOrder/:id', isUser, updateOrder);
router.delete('/deleteOrder/:id', isUser, deleteOrder);
router.get('/userOrders', isUser, getUserOrders);
router.get('/allOrders', isAdmin, getAllOrders);
router.put('/updateOrderStatus/:id',isAdmin,updateOrderStatus)


export default router;
