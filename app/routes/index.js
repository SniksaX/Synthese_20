import express from "express";
import userRoutes from "./user.js";
import productRoutes from "./product.js";

export const router = express.Router();

router.use("/auth", userRoutes);
router.use("/products", productRoutes);