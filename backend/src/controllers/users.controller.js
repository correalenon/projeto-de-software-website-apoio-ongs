import bcrypt from "bcryptjs";
import prisma from "../db/client.js";

export const getMe = async (req, res) => {
    try {
        if (req.user.tipo !== "USER") {
            return res.status(403).json({ error: "Você não tem permissão para acessar essa rota"});
        }

        const { password, ...userWithoutPassword } = req.user; // Remove a senha do objeto req.user
        const { id } = req.user;

        const users = await prisma.users.findUnique({
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
                        description: true,
                    },
                },
                tags: {
                    select: {
                        name: true,
                    },
                },
                skills: true,
                ong: {
                    select: {
                        id: true,
                        nameONG: true,
                        emailONG: true,
                        cnpj: true,
                    },
                },
                contributions: true,
                profileImage: true,
                coverImage: true
            },
        });

        // Combina os dados de userWithoutPassword com os dados de users
        const combinedUserData = {
            ...userWithoutPassword,
            ...users,
        };

        return res.status(200).json(combinedUserData);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Erro ao buscar usuário /me" });
    }
};

export const getUsers = async (req, res) => {
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
                ong: {
                    select: {
                        id: true,
                        nameONG: true,
                        emailONG: true,
                        cnpj: true,
                    }
                },
            }
        });
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: "Erro ao buscar usuários" });
    }
};

export const getUserByID = async (req, res) => {
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
                ong: {
                    select: {
                        id: true,
                        nameONG: true,
                        emailONG: true,
                        cnpj: true,
                    }
                },
            }
        });
        if (!user) {
            return res.status(404).json({ error: "Usuário não encontrado" });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: "Erro ao buscar usuário" });
    }
};

export const postUser = async (req, res) => {
    const { 
        name, 
        email, 
        password, 
        location,
        role, 
        description,
        tags,
    } = req.body;
    if (!name || !email || !password || !location || !role) {
        return res.status(400).json({ error: "Campos nome, email, senha, localização, tipo do usuário obrigatórios" });
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
                    create: tags && tags.length > 0 ? tags : [{ name: "Sem tags" }]
                }
            }
        });
        const { password: _, updatedAt, ...userWithoutPassword } = newUser;
        return res.status(201).json(userWithoutPassword);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Erro ao criar usuário" });
    }
};

export const putUser = async (req, res) => {
    try {
        const { id } = req.user;
        const { name, email, password, location, role, description, industry, tags, skills, profileImage, coverImage } = req.body;
        
        const user = await prisma.users.findUnique({ where: { id: parseInt(id) }});
        if (!user) {
            return res.status(404).json({ error: "Usuário não encontrado" });
        }
        const updateData = { name, email, password, location, role, description, industry};
        if (profileImage) updateData.profileImage = profileImage;
        if (coverImage) updateData.coverImage = coverImage;

        if (tags && tags.length > 0) {
            updateData.tags = {
                deleteMany: {},
                create: tags
            };
        }

        if (skills && Array.isArray(skills)) {
            updateData.skills = skills;
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
};

export const deleteUserByID = async (req, res) => {
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
};

export const PostEmailUser = async (req, res) => {
    try {
        const { email } = req.body;

        const emailUser = await prisma.users.findUnique({ where: { email }});

        if (!emailUser) {
            return res.status(404).json({ error: "E-mail não encontrado" });
        }

        res.status(200).json(emailUser);
    }
    catch (error) {
        res.status(500).json({ error: "Erro ao buscar e-mail"});
    }
}

export const PutPasswordUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.users.update({
            where: { email },
            data: { password: hashedPassword }
        })

        if (!user) {
            return res.status(404).json( { error: "Usuário não encontrado" });
        }

        res.status(200).json( { message: "Senha atualizada com sucesso"});
    }
    catch (error) {
        res.status(500).json({ error: "Erro ao atualizar senha"});
    }
}

export const PutUserONG = async (req, res) => {
    try {
        const { id, tipo } = req.user;
        const { ongId } = req.body; // ID da ONG para a qual o usuário quer solicitar associação

        // 1. Validações Iniciais
        if (!id || !ongId) {
            return res.status(400).json({ error: "ID do usuário ou da ONG não informados." });
        }

        // 2. Valida se o usuário logado é um "Colaborador" (ou User) e não uma ONG
        if (tipo === "ONG") {
            return res.status(403).json({ error: "Acesso não permitido a ONGs." });
        }
        else 
        if (tipo !== 'COLLABORATOR') {
            return res.status(403).json({ error: "Acesso não permitido a Voluntários." });
        }

        // 3. Valida se o usuário já pertence a ALGUMA ONG (se a regra é 1 ONG por usuário)
        const currentUser = await prisma.user.findUnique({
            where: { id: id }, // Use id diretamente, não parsedid se for String
            select: { ongId: true }
        });

        if (currentUser && currentUser.ongId) {
            return res.status(403).json({ error: "Você já está associado a uma ONG. Um colaborador pode pertencer a no máximo 1 ONG." });
        }

        // 4. Valida se já existe uma solicitação PENDENTE para ESTA ONG
        const existingRequest = await prisma.associateUserONG.findFirst({
            where: {
                id,
                parsedOngId,
                status: 1 // Status de "Solicitado"
            }
        });

        if (existingRequest) {
            return res.status(409).json({ error: "Você já tem uma solicitação pendente para esta ONG." });
        }

        // 5. Valida se o usuário já foi ACEITO por ESTA ONG (ou rejeitado e quer tentar de novo)
        const existingAcceptedOrRejected = await prisma.associateUserONG.findFirst({
            where: {
                id,
                ongId,
                status: {
                    in: [2, 3] // Status de "Aceito" ou "Negado"
                }
            }
        });

        if (existingAcceptedOrRejected && existingAcceptedOrRejected.status === 2) {
            return res.status(409).json({ error: "Você já é associado a esta ONG." });
        }
        if (existingAcceptedOrRejected && existingAcceptedOrRejected.status === 3) {
            // Pode permitir uma nova solicitação ou dar uma mensagem específica
            // Para este exemplo, vamos permitir uma nova solicitação atualizando o status
            const updatedRequest = await prisma.associateUserONG.update({
                where: { id: existingAcceptedOrRejected.id },
                data: { status: 1 } // Muda para Solicitado novamente
            });
            return res.status(200).json({ message: "Sua solicitação anterior foi reativada.", request: updatedRequest });
        }


        // 6. Cria a nova solicitação de associação
        const newRequest = await prisma.associateUserONG.create({
            data: {
                id,
                ongId,
                status: 1 // Status: Solicitado
            }
        });

        res.status(200).json({ message: "Solicitação de associação enviada com sucesso!", request: newRequest });

    } catch (error) {
        console.error("Erro ao solicitar associação de usuário com ONG:", error);
        res.status(500).json({ error: "Erro ao solicitar associação de usuário com ONG" });
    }
};
