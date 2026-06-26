import { prisma } from "../../app.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { promisify } from "node:util";

const signAsync = promisify(jwt.sign);

export const signup = async (req, res) => {
    try {
        const { email, password } = req.body;

        const hash = await bcrypt.hash(password, 10);

        const result = await prisma.user.create({
            data: {
                email,
                password: hash,
            },
        });

        return res.status(201).json({
            message: "User created.",
            user: { id: result.id, email: result.email },
        });
    } catch (err) {
        if (err.code === "P2002") {
            return res.status(409).json({ message: "Email already registered" });
        }
        console.error("Signup error:", err);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const findUser = await prisma.user.findUnique({
            where: { email },
        });

        if (!findUser) {
            return res.status(404).json({ message: "User not found" });
        }

        const isPasswordValid = await bcrypt.compare(password, findUser.password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: "Wrong password" });
        }

        const token = await signAsync(
            { userId: findUser.id, email: findUser.email },
            process.env.JWT_SECRET,
            { expiresIn: Number(process.env.JWT_EXPIRATION) || 86400 }
        );

        return res.status(200).json({
            message: "Welcome!",
            user: { id: findUser.id, email: findUser.email },
            token,
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal server error" });
    }
};