import express from "express";
import prisma from "../db/client.js";

export const getProjects = async (req , res) => {
    try {
        const projects = await prisma.projects.findMany({
            select: {
                id: true,
                name: true,
                description: true,
                projectImage: true,
                additionalInfo: true,
                contributionProject: true,
                complementImages: true,
                ong: {
                    select: {
                        id: true,
                        nameONG: true,
                        cellphone: true
                    }
                },
                ongId: true,

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
                additionalInfo: true,
                projectImage: true,
                contributionProject: true,
                complementImages: true,
                ong: {
                    select: {
                        id: true,
                        nameONG: true,
                        cellphone: true,
                        emailONG: true,
                        street: true,
                        number: true,
                        complement: true,
                        city: true,
                        district: true,
                        state: true,
                    }
                },
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
    const { name, description, ongId, complementImages, additionalInfo, projectImage, contributionProject } = req.body;
    if (!name || !description || !ongId) {
        return res.status(400).json({ error: "Os campos nome, descrição e OngId são obrigatórios" });
    }

    const data = {
        name,
        description,
        ongId: parseInt(ongId)
    }

    if (complementImages) data.complementImages = complementImages;
    if (additionalInfo) data.additionalInfo = additionalInfo;
    if (projectImage) data.projectImage = projectImage;
    if (contributionProject) data.contributionProject = contributionProject;

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

        const newProject = await prisma.projects.create({data});

        const { createdAt, updatedAt, ...projectsWithoutTimestamps } = newProject;
        res.status(201).json(projectsWithoutTimestamps);
    } catch (error) {
        res.status(500).json({ error: "Erro ao criar projeto" });
    }
};

export const putProjectByID = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, ongId, complementImages, additionalInfo, projectImage, contributionProject } = req.body;

        const project = await prisma.projects.findUnique({ where: { id: parseInt(id) } });

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

        const data = {};

        if (name) data.name = name;
        if (description) data.description = description;
        if (additionalInfo) data.additionalInfo = additionalInfo;
        if (projectImage) data.projectImage = projectImage;

        if (contributionProject && Array.isArray(contributionProject)) {
            data.contributionProject = contributionProject;
        }

        if (complementImages && Array.isArray(complementImages)) {
            data.complementImages = complementImages;
        }

        const updatedProject = await prisma.projects.update({
            where: { id: parseInt(id) },
            data
        });

        const { createdAt, updatedAt, updatedImages, ...projectsWithoutTimestamps } = updatedProject;

        res.status(200).json(projectsWithoutTimestamps);

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Erro ao atualizar projeto" });
    }
};

export const deleteProjectByID = async (req, res) => {
    try {
        const { id } = req.params;
        const project = await prisma.projects.findUnique({ where: { id: parseInt(id) } });

        if (!project) {
            return res.status(404).json({ error: "Projeto não encontrado" });
        }

        await prisma.projects.delete({ where: { id: parseInt(id) } });

        res.status(200).json({ message: "Projeto deletado com sucesso"});
    } catch (error) {
        res.status(500).json({ error: "Erro ao deletar projeto" });
    }
};

