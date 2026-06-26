import { prisma } from "../../app.js";

export const checkOwnership = async (req, res, next) => {
    try {
        const productId = parseInt(req.params.id);
        const userId = req.auth.userId;

        const product = await prisma.product.findUnique({
            where: { id: productId }
        });

        if (!product || product.userId !== userId) {
            return res.status(404).json({ message: "Product not found" });
        }

        next();
    } catch (err) {
        console.error("Ownership check error:", err);
        return res.status(500).json({ message: "Internal server error" });
    }
};
