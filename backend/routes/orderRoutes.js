import express from "express";
import { createOrder, getAllOrders, updateOrderStatus,  getUserOrders } from "../controllers/orderController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// user creates order
router.post("/new", auth, createOrder);

// admin sees all orders
router.get("/", auth, getAllOrders);

// admin updates status
router.put("/:id", auth, updateOrderStatus);

// user sees own orders
router.get("/my", auth, getUserOrders);

export default router;
