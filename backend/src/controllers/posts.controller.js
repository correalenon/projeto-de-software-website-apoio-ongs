import express from "express";
import prisma from "../db/client.js";

export const getPosts = async (req, res) => {
    try {
        const posts = await prisma.posts.findMany({
            select: {
                id: true,
                title: true,
                description: true,
                createdAt: true,
                updatedAt: true,
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        location: true,
                        images: {
                            select: {
                                url: true
                            }
                        }
                    }
                },
                project: {
                    select: {
                        id: true,
                        name: true,
                    }
                },
                images: {
                    select: {
                        url: true,
                    }
                },
                likes: {
                    select: {
                        id: true,
                        createdAt: true,
                        updatedAt: true,
                        user: {
                            select: {
                                id: true,
                                name: true,
                            }
                        }
                    }
                },
                comments: {
                    select: {
                        id: true,
                        description: true,
                        createdAt: true,
                        updatedAt: true,
                        user: {
                            select: {
                                id: true,
                                name: true,
                            }
                        }
                    }
                },
                tags: {
                    select: {
                        name: true
                    }
                }
            }
        });
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ error: "Erro ao buscar posts" });
    }
};

export const getPostByID = async (req, res) => {
    try {
        const { id } = req.params;
        const post = await prisma.posts.findUnique({
            where: { id: parseInt(id) },
            select: {
                id: true,
                title: true,
                description: true,
                createdAt: true,
                updatedAt: true,
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        location: true,
                        images: {
                            select: {
                                url: true
                            }
                        }
                    }
                },
                project: {
                    select: {
                        id: true,
                        name: true,
                    }
                },
                images: {
                    select: {
                        url: true,
                    }
                },
                likes: {
                    select: {
                        id: true,
                        createdAt: true,
                        updatedAt: true,
                        user: {
                            select: {
                                id: true,
                                name: true,
                            }
                        }
                    }
                },
                comments: {
                    select: {
                        id: true,
                        description: true,
                        createdAt: true,
                        updatedAt: true,
                        user: {
                            select: {
                                id: true,
                                name: true,
                            }
                        }
                    }
                },
                tags: {
                    select: {
                        name: true
                    }
                }
            }
        });
        if (!post) {
            return res.status(404).json({ error: "Post não encontrado" });
        }
        res.status(200).json(post);
    } catch (error) {
        res.status(500).json({ error: "Erro ao buscar post" });
    }
};

export const postPost = async (req, res) => {
    const { title, description, userId, projectId, images, tags } = req.body;
    if (!title || !description || !userId || !projectId) {
        return res.status(400).json({ error: "Todos os campos são obrigatórios" });
    }
    try {
        const existingPost = await prisma.posts.findFirst({
            where: {
                title,
                description,
                userId,
                projectId
            },
        });
        if (existingPost) {
            return res.status(400).json({ error: "Já existe um post com title, description, userId e projectId idênticos" });
        }
        const newPost = await prisma.posts.create({
            data: {
                title,
                description,
                userId,
                projectId,
                images: {
                    create: images && images.length > 0 ? images : [{ url: "https://avatars.githubusercontent.com/u/136519252?v=4" }]
                },
                tags: {
                    create: tags && tags.length > 0 ? tags : []
                }
            },
            include: {
                images: {
                    select: {
                        url: true
                    }
                },
                tags: {
                    select: {
                        name: true
                    }
                }
            }
        });
        const { updatedAt, ...postWithoutTimestamps } = newPost;
        res.status(201).json(postWithoutTimestamps);
    } catch (error) {
        res.status(500).json({ error: "Erro ao criar post" });
    }
};

export const putPostByID = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, userId, projectId, images, likes, comments, activities, tags } = req.body;
        const post = await prisma.posts.findUnique({
            where: { id: parseInt(id) },
            include: {
                images: true,
                likes: true,
                comments: true,
                activities: true,
                tags: true
            }
        });
        if (!post) {
            return res.status(404).json({ error: "Post não encontrado" });
        }
        const filteredImages = images && images.length > 0
            ? images.filter((image) => !post.images.some(existingImage => existingImage.url === image.url))
            : [];
        const filteredTags = tags && tags.length > 0
            ? tags.filter((tag) => !post.tags.some(existingTag => existingTag.name === tag.name))
            : [];
        const updatedPost = await prisma.posts.update({
            where: { id: parseInt(id) },
            data: {
                title,
                description,
                userId,
                projectId,
                images: {
                    create: filteredImages
                },
                likes: {
                    create: likes && likes.length > 0 ? likes : []
                },
                comments: {
                    create: comments && comments.length > 0 ? comments : []
                },
                activities: {
                    create: activities && activities.length > 0 ? activities : []
                },
                tags: {
                    create: filteredTags
                }
            },
            include: {
                images: {
                    select: {
                        url: true
                    }
                },
                tags: {
                    select: {
                        name: true
                    }
                },
                likes: {
                    select: {
                        id: true,
                        user: {
                            select: {
                                id: true,
                                name: true,
                                images: {
                                    select: {
                                        url: true
                                    }
                                }
                            }
                        }
                    }
                },
                comments: {
                    select: {
                        id: true,
                        description: true,
                        createdAt: true,
                        updatedAt: true,
                        user: {
                            select: {
                                id: true,
                                name: true,
                                images: {
                                    select: {
                                        url: true
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });
        res.status(200).json(updatedPost);
    } catch (error) {
        res.status(500).json({ error: "Erro ao atualizar post" });
    }
};

export const deletePostByID = async (req, res) => {
    try {
        const { id } = req.params;
        const post = await prisma.posts.findUnique({ where: { id: parseInt(id) } });
        if (!post) {
            return res.status(404).json({ error: "Post não encontrado" });
        }
        await prisma.posts.delete({ where: { id: parseInt(id) } });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: "Erro ao deletar Post" });
    }
};
