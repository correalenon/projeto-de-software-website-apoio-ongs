import express from "express";
import { PrismaClient } from "@prisma/client";
import { authenticateUser } from "../src/services/authentication.js";

const router = express.Router();
const prisma = new PrismaClient();

router.get("/", authenticateUser, async (req, res) => {
    try {
        const ongs = await prisma.ongs.findMany({
            select: {
                id: true,
                name: true,
                cnpj: true,
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    }
                },
                contact: true,
                description: true,
                images: {
                    select: {
                        url: true,
                    }
                }
            }
        });
        res.status(200).json(ongs);
    } catch (error) {
        res.status(500).json({ error: "Erro ao buscar ONGs" });
    }
});

router.get("/:id", authenticateUser, async (req, res) => {
    try {
        const { id } = req.params;
        const ong = await prisma.ongs.findUnique({
            where: { id: parseInt(id) },
            select: {
                id: true,
                name: true,
                cnpj: true,
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    }
                },
                contact: true,
                description: true,
                images: {
                    select: {
                        url: true,
                    }
                }
            }
        });
        if (!ong) {
            return res.status(404).json({ error: "ONG não encontrada" });
        }
        res.status(200).json(ong);
    } catch (error) {
        res.status(500).json({ error: "Erro ao buscar ONG" });
    }
});

router.post("/", authenticateUser, async (req, res) => {
    const { name, cnpj, userId, contact, description } = req.body;
    if (!name || !cnpj || !userId || !contact || !description) {
        return res.status(400).json({ error: "Todos os campos são obrigatórios" });
    }
    try {
        const existingOng = await prisma.ongs.findUnique({ where: { cnpj } });
        if (existingOng) {
            return res.status(400).json({ error: "Já existe uma ONG com este CNPJ" });
        }
        const newOng = await prisma.ongs.create({
            data: {
                name,
                cnpj,
                userId,
                contact,
                description,
            },
        });
        res.status(201).json(newOng);
    } catch (error) {
        res.status(500).json({ error: "Erro ao criar ONG" });
    }
});

router.put("/:id", authenticateUser, async (req, res) => {
    try {
        const { id } = req.params;
        const { name, cnpj, userId, contact, description } = req.body;
        const ong = await prisma.ongs.findUnique({ where: { id: parseInt(id) } });
        if (!ong) {
            return res.status(404).json({ error: "ONG não encontrada" });
        }
        const existingOngCNPJ = await prisma.ongs.findUnique({ where: { cnpj } });
        if (existingOngCNPJ && existingOngCNPJ.id !== parseInt(id)) {
            return res.status(400).json({ error: "Já existe uma ONG com este CNPJ" });
        }
        const updatedOng = await prisma.ongs.update({
            where: { id: parseInt(id) },
            data: { name, cnpj, userId, contact, description },
        });
        res.status(200).json(updatedOng);
    } catch (error) {
        res.status(500).json({ error: "Erro ao atualizar ONG" });
    }
});

router.delete("/:id", authenticateUser, async (req, res) => {
    try {
        const { id } = req.params;
        const ong = await prisma.ongs.findUnique({ where: { id: parseInt(id) } });
        if (!ong) {
            return res.status(404).json({ error: "ONG não encontrada" });
        }
        await prisma.ongs.delete({ where: { id: parseInt(id) } });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: "Erro ao deletar ONG" });
    }
});

export default router;
