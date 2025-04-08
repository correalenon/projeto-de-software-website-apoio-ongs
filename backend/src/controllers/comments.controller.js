import express from "express";
import prisma from "../db/client.js";


export const getComments = async (req, res) => {
    try {
        const comments = await prisma.comments.findMany({
            include: {
                user: true,
                post: true,
            },
        });
        res.status(200).json(comments);
    } catch (error) {
        res.status(500).json({ error: "Erro ao buscar comentários" });
    }
};

export const getCommentsByPostID = async (req, res) => {
    try {
        const { postId } = req.params;
        const comments = await prisma.comments.findMany({
            where: { postId: parseInt(postId) },
            include: {
                user: true,
            },
        });
        res.status(200).json(comments);
    } catch (error) {
        res.status(500).json({ error: "Erro ao buscar comentários" });
    }
}

export const getCommentByID = async (req, res) => {
    try {
        const { id } = req.params;
        const comment = await prisma.comments.findUnique({
            where: { id: parseInt(id) },
            include: {
                user: true,
                post: true,
            },
        });
        if (!comment) {
            return res.status(404).json({ error: "Comentário não encontrado" });
        }
        res.status(200).json(comment);
    } catch (error) {
        res.status(500).json({ error: "Erro ao buscar comentário" });
    }
};

export const postComment = async (req, res) => {
    try {
        const { postId, userId, description } = req.body;
        const newComment = await prisma.comments.create({
            data: {
                postId,
                userId,
                description,
            },
            include: {
                user: true,
                post: true,
            },
        });
        res.status(201).json(newComment);
    } catch (error) {
        res.status(500).json({ error: "Erro ao criar comentário" });
    }
};


export const deleteCommentByID = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedComment = await prisma.comments.delete({
            where: { id: parseInt(id) },
            include: {
                user: true,
                post: true,
            },
        });
        res.status(200).json(deletedComment);
    } catch (error) {
        res.status(500).json({ error: "Erro ao deletar comentário" });
    }
};

export const putCommentByID = async (req, res) => {
    try {
        const { id } = req.params;
        const { description } = req.body;
        const updatedComment = await prisma.comments.update({
            where: { id: parseInt(id) },
            data: { description },
            include: {
                user: true,
                post: true,
            },
        });
        res.status(200).json(updatedComment);
    } catch (error) {
        res.status(500).json({ error: "Erro ao atualizar comentário" });
    }
};