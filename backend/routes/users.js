import express from "express";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import { authenticateUser } from "../src/services/authentication.js";

const router = express.Router();
const prisma = new PrismaClient();

router.get("/", authenticateUser, async (req, res) => {
    try {
        const users = await prisma.users.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                location: true,
                views: true,
                connections: true,
                role: true,
                description: true,
                createdAt: true,
                activity: {
                    select: {
                        description: true
                    }
                },
                tags: {
                    select: {
                        name: true
                    }
                },
                images: {
                    select: {
                        url: true
                    }
                },
                ongs: {
                    select: {
                        name: true,
                        cnpj: true,
                        contact: true,
                        images: {
                            select: {
                                url: true
                            }
                        }
                    }
                }
            }
        });
        res.status(200).json(users);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Erro ao buscar usuários" });
    }
});

router.get("/:id", authenticateUser, async (req, res) => {
    try {
        const { id } = req.params;
        const user = await prisma.users.findUnique({
            where: { id: parseInt(id) },
            select: {
                id: true,
                name: true,
                email: true,
                location: true,
                views: true,
                connections: true,
                role: true,
                description: true,
                createdAt: true,
                activity: {
                    select: {
                        description: true
                    }
                },
                tags: {
                    select: {
                        name: true
                    }
                },
                images: {
                    select: {
                        url: true
                    }
                },
                ongs: {
                    select: {
                        name: true,
                        cnpj: true,
                        contact: true,
                        images: {
                            select: {
                                url: true
                            }
                        }
                    }
                }
            }
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
    const { 
        name, 
        email, 
        password, 
        location,
        role, 
        description,
        tags,
        images
    } = req.body;
    if (!name || !email || !password || !location || !role || !description || !tags) {
        return res.status(400).json({ error: "Todos os campos são obrigatórios" });
    }
    try {
        const existingUser = await prisma.users.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ error: "E-mail já cadastrado" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await prisma.users.create({
            data: {
                name,
                email,
                password: hashedPassword,
                location,
                role,
                description,
                tags: {
                    create: tags
                },
                images: {
                    create: images && images.length > 0 ? images : [{ url: "https://avatars.githubusercontent.com/u/136519252?v=4" }]
                }
            }
        });
        const { password: _, updatedAt, ...userWithoutPassword } = newUser;
        return res.status(201).json(userWithoutPassword);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Erro ao criar usuário" });
    }
});

router.put("/:id", authenticateUser, async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, password, location, role, description, tags, images } = req.body;
        const user = await prisma.users.findUnique({ where: { id: parseInt(id) }, include: { images: true } });
        if (!user) {
            return res.status(404).json({ error: "Usuário não encontrado" });
        }
        const updateData = { name, email, password, location, role, description};
        if (images && images.length > 0) {
            updateData.images = {
                deleteMany: {},
                create: { url: images[0].url }
            };
        }
        if (tags && images.length > 0) {
            updateData.tags = {
                deleteMany: {},
                create: tags
            };
        }
        const updatedUser = await prisma.users.update({
            where: { id: parseInt(id) },
            data: updateData,
        });
        const { password: _, ...userWithoutPassword } = updatedUser;
        res.status(200).json(userWithoutPassword);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Erro ao atualizar usuário" });
    }
});

router.delete("/:id", authenticateUser, async (req, res) => {
    try {
        const { id } = req.params;
        const user = await prisma.users.findUnique({ where: { id: parseInt(id) } });
        if (!user) {
            return res.status(404).json({ error: "Usuário não encontrado" });
        }
        await prisma.users.delete({ where: { id: parseInt(id) } });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: "Erro ao deletar usuário" });
    }
});

export default router;
