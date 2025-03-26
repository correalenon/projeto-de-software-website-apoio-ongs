import express from "express";
import bcrypt from "bcryptjs"; // Alterado para bcryptjs
import { PrismaClient } from "@prisma/client";
import { authenticateUser } from "../src/services/authentication.js";

const router = express.Router();
const prisma = new PrismaClient();

router.get("/", authenticateUser, async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
            },
        });
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: "Erro ao buscar usuários" });
    }
});

router.get("/:id", authenticateUser, async (req, res) => {
    try {
        const { id } = req.params;
        const user = await prisma.user.findUnique({
            where: { id: parseInt(id) },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
            },
        });
        if (!user) {
            return res.status(404).json({ error: "Usuário não encontrado" });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: "Erro ao buscar usuário" });
    }
});

router.post("/", authenticateUser, async (req, res) => {
    const { email, password, name, role } = req.body;

    if (!email || !password || !name) {
        return res.status(400).json({ error: "Todos os campos são obrigatórios" });
    }

    try {
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ error: "E-mail já cadastrado" });
        }

        const hashedPassword = await bcrypt.hash(password, 10); // bcryptjs funciona da mesma forma

        const newUser = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
                role,
            },
        });

        const { password: _, ...userWithoutPassword } = newUser;
        return res.status(201).json(userWithoutPassword);
    } catch (error) {
        return res.status(500).json({ error: "Erro ao criar usuário" });
    }
});

router.put("/:id", authenticateUser, async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, password, role } = req.body;
        const user = await prisma.user.findUnique({ where: { id: parseInt(id) } });
        if (!user) {
            return res.status(404).json({ error: "Usuário não encontrado" });
        }
        const updatedUser = await prisma.user.update({
            where: { id: parseInt(id) },
            data: { name, email, password, role },
        });
        const { password: _, ...userWithoutPassword } = updatedUser;
        res.status(200).json(userWithoutPassword);
    } catch (error) {
        res.status(500).json({ error: "Erro ao atualizar usuário" });
    }
});

router.delete("/:id", authenticateUser, async (req, res) => {
    try {
        const { id } = req.params;
        const user = await prisma.user.findUnique({ where: { id: parseInt(id) } });
        if (!user) {
            return res.status(404).json({ error: "Usuário não encontrado" });
        }
        await prisma.user.delete({ where: { id: parseInt(id) } });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: "Erro ao deletar usuário" });
    }
});

export default router;
