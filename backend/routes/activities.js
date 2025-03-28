import express from "express";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import { authenticateUser } from "../src/services/authentication.js";

const router = express.Router();
const prisma = new PrismaClient();

router.get("/", authenticateUser, async (req, res) => {
    try {
        const activities = await prisma.activities.findMany({
            select: {
                id: true,
                description: true,
                createdAt: true,
                users: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        role: true,
                        images: {
                            select: {
                                url: true
                            }
                        }
                    }
                }
            }
        });
        res.status(200).json(activities);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Erro ao buscar atividades" });
    }
});

router.get("/:id", authenticateUser, async (req, res) => {
    try {
        const { id } = req.params;
        const activity = await prisma.activities.findUnique({
            where: { id: parseInt(id) },
            select: {
                id: true,
                description: true,
                createdAt: true,
                users: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        role: true,
                        images: {
                            select: {
                                url: true
                            }
                        }
                    }
                }
            }
        });
        if (!activity) {
            return res.status(404).json({ error: "Atividade não encontrada" });
        }
        res.status(200).json(activity);
    } catch (error) {
        res.status(500).json({ error: "Erro ao buscar atividade" });
    }
});

export default router;
