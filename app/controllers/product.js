import { prisma } from "../../app.js";

const addLinks = (product, req) => {
    const baseUrl = `${req.protocol}://${req.get("host")}/api/products/${product.id}`;
    
    return {
        ...product,
        links: [
            { rel: "self", method: "GET", href: baseUrl },
            { rel: "update", method: "PUT", href: baseUrl },
            { rel: "delete", method: "DELETE", href: baseUrl }
        ]
    };
};

export const getAll = async (req, res) => {
    try {
        
        const result = await prisma.product.findMany({
            where: { userId: req.auth.userId }
        });

        const productsWithLinks = result.map(p => addLinks(p, req));
        return res.status(200).json({ result: productsWithLinks });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const create = async (req, res) => {
    try {
        const { name, quantity } = req.body;
        
        const result = await prisma.product.create({
            data: {
                name,
                quantity,
                userId: req.auth.userId
            }
        });

        return res.status(201).json({ 
            message: "Product created", 
            data: addLinks(result, req) 
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const update = async (req, res) => {
    try {
        const { name, quantity } = req.body;
        const id = parseInt(req.params.id);

        const result = await prisma.product.update({
            where: { id },
            data: { name, quantity }
        });

        return res.status(200).json({ 
            message: "Product Updated", 
            data: addLinks(result, req) 
        });
    } catch (err) {
        if (err.code === "P2025") {
            return res.status(404).json({ message: "Product not found" });
        }
        console.error(err);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const remove = async (req, res) => {
    try {
        const id = parseInt(req.params.id);

        await prisma.product.delete({
            where: { id }
        });

        return res.status(204).send();
    } catch (err) {
        if (err.code === "P2025") {
            return res.status(404).json({ message: "Product not found" });
        }
        console.error(err);
        return res.status(500).json({ message: "Internal server error" });
    }
};