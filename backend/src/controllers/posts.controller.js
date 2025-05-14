import prisma from "../db/client.js";

export const getPosts = async (req, res) => {
    try {
        const posts = await prisma.posts.findMany({
            select: {
                id: true,
                description: true,
                createdAt: true,
                updatedAt: true,
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        location: true,
                        profileImage: true
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
                        content: true,
                        caption: true
                    }
                },
                likes: {
                    select: {
                        id: true,
                        createdAt: true,
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
                                profileImage: true
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
                description: true,
                createdAt: true,
                updatedAt: true,
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        location: true,
                        profileImage: true
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
                        content: true,
                        caption: true
                    }
                },
                likes: {
                    select: {
                        id: true,
                        createdAt: true,
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
                                profileImage: true
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
    const { description, userId, projectId, images, tags } = req.body;
    if (!description || !userId || !projectId) {
        return res.status(400).json({ error: "Todos os campos são obrigatórios" });
    }
    try {
        const existingPost = await prisma.posts.findFirst({
            where: {
                description,
                userId,
                projectId
            },
        });
        if (existingPost) {
            return res.status(400).json({ error: "Já existe um post com description, userId e projectId idênticos" });
        }
        const newPost = await prisma.posts.create({
            data: {
                description,
                userId,
                projectId,
                images: {
                    create: images && images.length > 0 ? images : [{
                        content: null,
                        caption: null
                    }],
                },
                tags: {
                    create: tags && tags.length > 0 ? tags : []
                }
            },
            include: {
                images: {
                    select: {
                        content: true,
                        caption: true
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

export const postLike =  async (req, res) => {
    const { id } = req.user;
    const { postId } = req.params;

    if (!postId) {
        return res.status(400).json({ error: "Preencha todos os campos obrigatórios"});
    }

    try {

        const data = {
            userId: parseInt(id),
            postId: parseInt(postId)
        };

        const createLike = await prisma.likes.create({ data });
        const like = await prisma.likes.findUnique({
            where: { id: createLike.id },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                    }
                },
                post: {
                    select: {
                        id: true,
                        description: true,
                        user: {
                            select: {
                                id: true,
                                name: true,
                            }
                        }
                    }
                }
            }
        });

        const createActivity = await prisma.activities.create({
            data: {
                description: like.user.name + ' curtiu o post de ' + like.post.user.name,
                userId: parseInt(id),
                postId: parseInt(postId)
            }
        });

        res.status(201).json(like);
    } catch (error) {
        res.status(500).json({ error: "Erro ao cadastrar like de usuário" });
    }
};

export const postComment =  async (req, res) => {
    const { id } = req.user;
    const { postId } = req.params;
    const { description } = req.body;

    if (!postId|| !description) {
        return res.status(400).json({ error: "Preencha todos os campos obrigatórios"});
    }

    try {

        const data = {
            description: description,
            userId: parseInt(id),
            postId: parseInt(postId)
        };

        const createComment = await prisma.comments.create({ data });
        const comment = await prisma.comments.findUnique({
            where: { id: createComment.id },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        profileImage: true
                    }
                },
                post: {
                    select: {
                        id: true,
                        description: true,
                        user: {
                            select: {
                                id: true,
                                name: true,
                                profileImage: true
                            }
                        }
                    }
                }
            }
        });
        
        const createActivity = await prisma.activities.create({
            data: {
                description: comment.user.name + ' comentou no post de ' + comment.post.user.name,
                userId: parseInt(id),
                postId: parseInt(postId)
            }
        });

        res.status(201).json(comment);
    } catch (error) {
        res.status(500).json({ error: "Erro ao cadastrar comentário no post" });
    }
};

export const putPostByID = async (req, res) => {
    try {
        const { id } = req.params;
        const { description, userId, projectId, images, likes, comments, activities, tags } = req.body;
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
            ? images.filter((image) => !post.images.some(existingImage => existingImage.content === image.content))
            : [];
        const filteredTags = tags && tags.length > 0
            ? tags.filter((tag) => !post.tags.some(existingTag => existingTag.name === tag.name))
            : [];
        const updatedPost = await prisma.posts.update({
            where: { id: parseInt(id) },
            data: {
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
                        content: true,
                        caption: true
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
                                profileImage: true
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

export const putCommentByID = async (req, res) => {
    try {
        const { postId } = req.params;
        const { commentId } = req.params;
        const { description } = req.body;
       
        const post = await prisma.posts.findUnique({ where: { id: parseInt(postId) }});
        const comment = await prisma.comments.findUnique({ where: { id: parseInt(commentId) }});
        if (!post || !comment) {
            return res.status(404).json({ error: "Post ou Comentário não encontrado" });
        }
        
        const updateComment = await prisma.comments.update({
            where: { id: parseInt(commentId) },
            data: {
                description,
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        profileImage: true
                    }
                }
            }
        });
        res.status(200).json(updateComment);
    } catch (error) {
        res.status(500).json({ error: "Erro ao atualizar comentário" });
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

export const deleteLikeByID =  async (req, res) => {
    try {
        const { postId } = req.params;
        const { likeId } = req.params;

        const post = await prisma.posts.findUnique({ where: { id: parseInt(postId) }});
        const like = await prisma.likes.findUnique({ where: { id: parseInt(likeId) }});
        if (!post || !like) {
            return res.status(404).json({ error: "Post ou Like não encontrado" });
        }

        await prisma.likes.delete({ where: { id: parseInt(likeId) } });
        res.status(204).json({ message: "Like deletado com sucesso"});
    } catch (error) {
        res.status(500).json({ error: "Erro ao deletar like" });
    }
};

export const deleteCommentByID =  async (req, res) => {
    try {
        const { postId } = req.params;
        const { commentId } = req.params;

        const post = await prisma.posts.findUnique({ where: { id: parseInt(postId) }});
        const comment = await prisma.comments.findUnique({ where: { id: parseInt(commentId) }});
        if (!post || !comment) {
            return res.status(404).json({ error: "Post ou comentário não encontrado" });
        }

        await prisma.comments.delete({ where: { id: parseInt(commentId) } });
        res.status(204).json({ message: "Comentário deletado com sucesso"});
    } catch (error) {
        res.status(500).json({ error: "Erro ao deletar like" });
    }
};
