import express from "express";
import prisma from "../db/client.js";

export const getProjects = async (req , res) => {
    try {
        const projects = await prisma.projects.findMany({
            select: {
                id: true,
                name: true,
                description: true,
                ong: {
                    select: {
                        id: true,
                        nameONG: true,
                        cellphone: true
                    }
                },
                ongId: true,
                images: {
                    select: {
                        content: true,
                    }
                }
            }
        });
        res.status(200).json(projects);
    } catch (error) {
        res.status(500).json({ error: "Erro ao buscar projetos" });
    }
};

export const getProjectsByID = async (req, res) => {
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
                        nameONG: true,
                        cellphone: true,
                    }
                },
                images: {
                    select: {
                        content: true,
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
};

export const postProject =  async (req, res) => {
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
                    create: images && images.length > 0 ? images : [{ content: "https://avatars.githubusercontent.com/u/136519252?v=4" }]
                }
            }
        });
        const { createdAt, updatedAt, ...projectsWithoutTimestamps } = newProject;
        res.status(201).json(projectsWithoutTimestamps);
    } catch (error) {
        res.status(500).json({ error: "Erro ao criar projeto" });
    }
};

export const putProjectByID = async (req, res) => {
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
            ? images.filter((image) => !project.images.some(existingImage => existingImage.content === image.content))
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
        projectsWithoutTimestamps.images = images.map(image => ({ content: image.content }));
        res.status(200).json(projectsWithoutTimestamps);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Erro ao atualizar projeto" });
    }
};

export const deleteProjectByID =  async (req, res) => {
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
};

