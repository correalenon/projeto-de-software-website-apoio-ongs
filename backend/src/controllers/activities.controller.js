import express from "express";
import prisma from "../db/client.js";

export const getActivities = async (req, res) => {
    try {
        const activities = await prisma.activities.findMany({
            select: {
                id: true,
                description: true,
                createdAt: true,
                user: {
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
};

export const getActivitiesByID = async (req, res) => {
    try {
        const { id } = req.params;
        const activity = await prisma.activities.findUnique({
            where: { id: parseInt(id) },
            select: {
                id: true,
                description: true,
                createdAt: true,
                user: {
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
};
