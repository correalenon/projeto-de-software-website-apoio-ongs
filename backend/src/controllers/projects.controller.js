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

export const postRequestVolunteer = async (req, res) => {
    const { id: userId, tipo: userType } = req.user;
    const { projectId } = req.params;
    const { userId: requesterUserId } = req.body;

    // 1. Validações de Segurança
    if (!userId || !projectId || !requesterUserId) {
        return res.status(400).json({ error: "Dados incompletos para a solicitação de voluntariado." });
    }
    // Garanta que o usuário logado é quem está fazendo a solicitação
    if (userId !== requesterUserId) {
        return res.status(403).json({ error: "Requisição não autorizada." });
    }
    // Verifique se é um usuário (não uma ONG)
    if (userType !== 'VOLUNTRY') {
        return res.status(403).json({ error: "ONGs e Colaboradores não podem se voluntariar para projetos." });
    }

    try {
        const parsedProjectId = parseInt(projectId); 

        // 2. Buscar o Projeto e a ONG Vinculada
        const project = await prisma.project.findUnique({
            where: { id: parsedProjectId },
            select: {
                id: true,
                name: true,
                ongId: true,
                ong: {
                    select: { id: true, nameONG: true, emailONG: true }
                }
            }
        });

        if (!project) {
            return res.status(404).json({ error: "Projeto não encontrado." });
        }
        if (!project.ongId || !project.ong) {
            return res.status(500).json({ error: "Projeto não vinculado a uma ONG válida." });
        }

        // 3. Validar se o usuário já tem uma solicitação (pendente/aceita/rejeitada) para este projeto
        const existingRequest = await prisma.userAssociateProject.findFirst({
            where: {
                userId: userId,
                projectId: parsedProjectId,
                status: {
                    in: [AssociateStatus.REQUEST_PENDING_USER_TO_ONG, AssociateStatus.ACCEPTED, AssociateStatus.REJECTED_BY_ONG]
                }
            }
        });

        if (existingRequest && existingRequest.status === AssociateStatus.ACCEPTED) {
            return res.status(409).json({ error: "Você já é um voluntário aceito para este projeto." });
        }
        if (existingRequest && existingRequest.status === AssociateStatus.REQUEST_PENDING_USER_TO_ONG) {
            return res.status(409).json({ error: "Sua solicitação de voluntariado para este projeto já está pendente." });
        }
        // Se existir e for REJECTED_BY_ONG, você pode permitir uma nova solicitação ou não
        if (existingRequest && existingRequest.status === AssociateStatus.REJECTED_BY_ONG) {
            // Opção 1: Reativar a solicitação (se o frontend permitir)
            const updatedRequest = await prisma.userAssociateProject.update({
                where: { id: existingRequest.id },
                data: { status: AssociateStatus.REQUEST_PENDING_USER_TO_ONG }
            });
             return res.status(200).json({ message: "Sua solicitação anterior foi reativada!", requestId: updatedRequest.id });
            // Opção 2: Não permitir nova solicitação após rejeição
            // return res.status(409).json({ error: "Sua solicitação para este projeto foi rejeitada anteriormente." });
        }

        // 4. Criar a nova solicitação
        const newRequest = await prisma.userAssociateProject.create({
            data: {
                userId: userId,
                projectId: parsedProjectId,
                status: AssociateStatus.REQUEST_PENDING_USER_TO_ONG, // Status: Solicitado
            }
        });

        res.status(201).json({ message: "Solicitação de voluntariado enviada com sucesso!", requestId: newRequest.id });

    } catch (error) {
        console.error("Erro ao registrar solicitação de voluntariado:", error);
        res.status(500).json({ error: "Erro interno ao registrar solicitação de voluntariado." });
    }
};

