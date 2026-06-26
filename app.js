import { PrismaClient } from "./generated/prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import express from "express";
import { router } from "./app/routes/index.js";
import dotenv from 'dotenv';
import cors from "cors"

dotenv.config();

export const app = express();

app.use(express.json());
app.use(cors({ origin : process.env.CORS_ALLOW_URL || "http://localhost:8080"}));
app.use("/api", router);

const databaseUrl = new URL(process.env.DATABASE_URL);
const adapter = new PrismaMariaDb({
    host: databaseUrl.hostname,
    port: Number(databaseUrl.port || 3306),
    user: databaseUrl.username,
    password: decodeURIComponent(databaseUrl.password),
    database: databaseUrl.pathname.replace("/", ""),
});

export const prisma = new PrismaClient({ adapter });

prisma.$connect()
  .then(() => console.log("Database connected..."))
  .catch((err) => console.error("Database connection error:", err));