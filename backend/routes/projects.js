import express from "express";
import { PrismaClient } from "@prisma/client";
import { authenticateUser } from "../src/services/authentication.js";

const router = express.Router();
const prisma = new PrismaClient();

router.get("/", authenticateUser, async (req, res) => {
    try {
        const projects = await prisma.projects.findMany({
            select: {
                id: true,
                name: true,
                description: true,
                ong: {
                    select: {
                        id: true,
                        name: true,
                        contact: true,
                        user: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                                images: {
                                    select: {
                                        url: true
                                    }
                                }
                            },
                        }
                    }
                },
                images: {
                    select: {
                        url: true,
                    }
                }
            }
        });
        res.status(200).json(projects);
    } catch (error) {
        res.status(500).json({ error: "Erro ao buscar projetos" });
    }
});

router.get("/:id", authenticateUser, async (req, res) => {
    try {
        const { id } = req.params;
        const project = await prisma.projects.findUnique({
            where: { id: parseInt(id) },
            select: {
                id: true,
                name: true,
                description: true,
                ong: {
                    select: {
                        id: true,
                        name: true,
                        contact: true,
                        user: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                                images: {
                                    select: {
                                        url: true
                                    }
                                }
                            },
                        }
                    }
                },
                images: {
                    select: {
                        url: true,
                    }
                }
            }
        });
        if (!project) {
            return res.status(404).json({ error: "Projeto não encontrado" });
        }
        res.status(200).json(project);
    } catch (error) {
        res.status(500).json({ error: "Erro ao buscar projeto" });
    }
});

router.post("/", authenticateUser, async (req, res) => {
    const { name, description, ongId, images } = req.body;
    if (!name || !description || !ongId) {
        return res.status(400).json({ error: "Todos os campos são obrigatórios" });
    }
    try {
        const existingProject = await prisma.projects.findFirst({
            where: {
                name,
                ongId,
            },
        });
        if (existingProject) {
            return res.status(400).json({ error: "Já existe um projeto com este nome vinculado a esta ONG" });
        }
        const newProject = await prisma.projects.create({
            data: {
                name,
                description,
                ongId,
                images: {
                    create: images && images.length > 0 ? images : [{ url: "https://avatars.githubusercontent.com/u/136519252?v=4" }]
                }
            }
        });
        const { createdAt, updatedAt, ...projectsWithoutTimestamps } = newProject;
        res.status(201).json(projectsWithoutTimestamps);
    } catch (error) {
        res.status(500).json({ error: "Erro ao criar projeto" });
    }
});

router.put("/:id", authenticateUser, async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, ongId, images } = req.body;
        const project = await prisma.projects.findUnique({
            where: { id: parseInt(id) },
            include: {
                images: true
            }
        });
        if (!project) {
            return res.status(404).json({ error: "Projeto não encontrado" });
        }
        const existingProject = await prisma.projects.findFirst({
            where: {
                name,
                ongId: ongId || project.ongId,
                NOT: { id: parseInt(id) },
            },
        });
        if (existingProject) {
            return res.status(400).json({
                error: "Já existe um projeto com este nome vinculado a esta ONG. Não é possível atualizar o campo ongId.",
            });
        }
        const filteredImages = images && images.length > 0
            ? images.filter((image) => !project.images.some(existingImage => existingImage.url === image.url))
            : [];
        const updatedProject = await prisma.projects.update({
            where: { id: parseInt(id) },
            data: {
                name,
                description,
                ongId: existingProject ? project.ongId : ongId,
                images: {
                    create: filteredImages,
                }
            },
            include: {
                images: true,
            }
        });
        const { createdAt, updatedAt, updatedImages, ...projectsWithoutTimestamps } = updatedProject;
        projectsWithoutTimestamps.images = images.map(image => ({ url: image.url }));
        res.status(200).json(projectsWithoutTimestamps);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Erro ao atualizar projeto" });
    }
});

router.delete("/:id", authenticateUser, async (req, res) => {
    try {
        const { id } = req.params;
        const project = await prisma.projects.findUnique({ where: { id: parseInt(id) } });
        if (!project) {
            return res.status(404).json({ error: "Projeto não encontrado" });
        }
        await prisma.projects.delete({ where: { id: parseInt(id) } });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: "Erro ao deletar projeto" });
    }
});

export default router;
