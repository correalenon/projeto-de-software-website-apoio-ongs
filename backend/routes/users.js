import express from "express";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

router.get("/", async (req, res) => {
    try {
        const users = await prisma.user.findMany();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: "Erro ao buscar usuários" });
    }
});

router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const user = await prisma.user.findUnique({ where: { id: parseInt(id) } });
        if (!user) {
            return res.status(404).json({ error: "Usuário não encontrado" });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: "Erro ao buscar usuário" });
    }
});

router.post("/", async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        const newUser = await prisma.user.create({
            data: { name, email, password, role },
        });
        res.status(201).json(newUser);
    } catch (error) {
        res.status(500).json({ error: "Erro ao criar usuário" });
    }
});

router.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, password, role } = req.body;
        const updatedUser = await prisma.user.update({
            where: { id: parseInt(id) },
            data: { name, email, password, role },
        });
        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).json({ error: "Erro ao atualizar usuário" });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.user.delete({ where: { id: parseInt(id) } });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: "Erro ao deletar usuário" });
    }
});

export default router;
