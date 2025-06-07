import bcrypt from "bcryptjs";
import prisma from "../db/client.js";

export const getMe = async (req, res) => {
    try {
        if (req.user.tipo !== "ONG") {
            return res.status(403).json({ error: "Você não tem permissão para acessar essa rota"});
        }

        const { password, ...ongWithoutPassword } = req.user; // Remove a senha do objeto req.user
        const { id } = req.user;

        const ongs = await prisma.ongs.findUnique({
            where: { id: parseInt(id) },
            select: {
                id: true,
                nameONG: true,
                emailONG: true,
                socialName: true,
                cnpj: true,
                foundationDate: true,
                area: true,
                goals: true,
                cep: true,
                street: true,
                number: true,
                complement: true,
                district: true,
                state: true,
                cellphone: true,
                emailONG: true,
                socialMedia: true,
                nameLegalGuardian: true,
                cpfLegalGuardian: true,
                rgLegalGuardian: true,
                cellphoneLegalGuardian: true,
                description: true,
                createdAt: true,
                updatedAt: true,
                projects: true,
                tags: {
                    select: {
                        name: true,
                    },
                },
                profileImage: true,
                coverImage: true,
                role: true
            },
        });

        // Combina os dados de ongWithoutPassword com os dados de ongs
        const combinedOngData = {
            ...ongWithoutPassword,
            ...ongs,
        };

        return res.status(200).json(combinedOngData);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Erro ao buscar ong /me" });
    }
};

export const getOngs = async (req, res) => {
    try {
        const ongs = await prisma.ongs.findMany({
            select: {
                id: true,
                nameONG: true,
                cnpj: true,
                foundationDate: true,
                area: true,
                goals: true,
                cep: true,
                street: true,
                number: true,
                complement: true,
                city: true,
                district: true,
                state: true,
                cellphone: true,
                emailONG: true,
                socialMedia: true,
                nameLegalGuardian: true,
                description: true,
                profileImage: true,
                coverImage: true,
                role: true
            }
        });

        if (!ongs) {
            return res.status(500).json({error: `Erro ao buscar ONGS`});
        }

        res.status(200).json(ongs);
    } catch (error) {
        res.status(500).json({ error: `Erro ao buscar ONGs: ${error}` });
    }
};

export const getOngProjects = async (req, res) => {
    try {
        const { id } = req.user

        const projectsOng = await prisma.projects.findMany({
            where: {ongId: parseInt(id)}
        })

        res.status(200).json(projectsOng);

    } catch (error) {
        res.status(500).json({error: "Erro ao buscar projetos de ong"});
    }
}

export const getOngByID = async (req, res) => {
    try {
        const { id } = req.params;
        const ong = await prisma.ongs.findUnique({
            where: { id: parseInt(id) },
            select: {
                id: true,
                nameONG: true,
                socialName: true,
                cnpj: true,
                foundationDate: true,
                area: true,
                goals: true,
                cep: true,
                street: true,
                number: true,
                complement: true,
                city: true,
                district: true,
                state: true,
                cellphone: true,
                emailONG: true,
                socialMedia: true,
                nameLegalGuardian: true,
                description: true,
                profileImage: true,
                coverImage: true,
                projects: {
                    select: {
                        name: true,
                        description: true,
                        projectImage: true,
                        complementImages: true,
                        additionalInfo: true,
                        contributionProject: true,
                        id: true
                    }
                },
                description: true,
            }
        });
        if (!ong) {
            return res.status(404).json({ error: "ONG não encontrada" });
        }
        res.status(200).json(ong);
    } catch (error) {
        res.status(500).json({ error: "Erro ao buscar ONG" });
    }
};

export const postOng = async (req, res) => {
    const { nameONG, socialName, cnpj, foundationDate, area, goals, cep, street, number, complement, city, district, 
        state, cellphone, emailONG, socialMedia, nameLegalGuardian, cpfLegalGuardian, rgLegalGuardian, cellphoneLegalGuardian, description, password} = req.body;
    try {
        const existingOng = await prisma.ongs.findUnique({ where: { cnpj } });
        if (existingOng) {
            return res.status(400).json({ error: "Já existe uma ONG com este CNPJ" });
        }
        
        const hashedPassword = await bcrypt.hash(password, 10);

        const data = {
            nameONG,
            socialName,
            cnpj,
            foundationDate: new Date(foundationDate),
            area,
            goals,
            cep,
            street,
            emailONG,
            nameLegalGuardian,
            password: hashedPassword
        }

        if (number) data.number = number;
        if (complement) data.complement = complement;
        if (city) data.city = city;
        if (district) data.district = district;
        if (state) data.state = state;
        if (cellphone) data.cellphone = cellphone;
        if (socialMedia) data.socialMedia = socialMedia;
        if (cpfLegalGuardian) data.cpfLegalGuardian = cpfLegalGuardian;
        if (rgLegalGuardian) data.rgLegalGuardian = rgLegalGuardian;
        if (description) data.description = description;
        if (cellphoneLegalGuardian) data.cellphoneLegalGuardian = cellphoneLegalGuardian;

        const newOng = await prisma.ongs.create({data});

        const { password: _, updatedAt, ...ongWithoutTimestamps } = newOng;
        res.status(201).json(ongWithoutTimestamps);
    } catch (error) {
        res.status(500).json({ error: "Erro ao criar ONG" });
        console.error(error);
    }
};

export const putOng = async (req, res) => {
    try {

        if (req.user.tipo !== "ONG") {
            return res.status(403).json({ error: "Você não tem permissão para acessar essa rota"});
        }
        const {id} = req.user;

        const { nameONG, socialName, cnpj, foundationDate, area, goals, cep, street, number, complement, city, district, 
        state, cellphone, socialMedia, nameLegalGuardian, cpfLegalGuardian, rgLegalGuardian, cellphoneLegalGuardian, description, profileImage, coverImage} = req.body;

        const ong = await prisma.ongs.findUnique({ where: { id: parseInt(id) } });

        if (!ong) {
            return res.status(404).json({ error: "ONG não encontrada" });
        }

        if (cnpj) {
            const existingOngCNPJ = await prisma.ongs.findUnique({ where: { cnpj } });

            if (existingOngCNPJ && existingOngCNPJ.id !== parseInt(id)) {
                return res.status(400).json({ error: "Já existe uma ONG com este CNPJ" });
            }
        }

        const data = { };

        if (complement) data.complement = complement;
        if (city) data.city = city;
        if (district) data.district = district;
        if (state) data.state = state;
        if (cellphone) data.cellphone = cellphone;
        if (socialMedia) data.socialMedia = socialMedia;
        if (cpfLegalGuardian) data.cpfLegalGuardian = cpfLegalGuardian;
        if (rgLegalGuardian) data.rgLegalGuardian = rgLegalGuardian;
        if (description) data.description = description;
        if (cellphoneLegalGuardian) data.cellphoneLegalGuardian = cellphoneLegalGuardian;
        if (nameONG) data.nameONG = nameONG;
        if (socialName) data.socialName = socialName;
        if (number) data.number = number;
        if (cnpj) data.cnpj = cnpj;
        if (foundationDate) data.foundationDate = new Date(foundationDate);
        if (area) data.area = area;
        if (goals) data.goals = goals;
        if (cep) data.cep = cep;
        if (street) data.street = street;
        if (nameLegalGuardian) data.nameLegalGuardian = nameLegalGuardian;
        if (profileImage) data.profileImage = profileImage;
        if (coverImage) data.coverImage = coverImage;

        const updatedOng = await prisma.ongs.update({ where: { id: parseInt(id) }, data});

        const { createdAt, updatedAt, updatedImages, password, ...ongWithoutTimestamps } = updatedOng;

        res.status(200).json(ongWithoutTimestamps);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Erro ao atualizar ONG" });
    }
};

export const deleteOngByID = async (req, res) => {
    try {
        if (req.user.tipo !== "ONG") {
            return res.status(403).json({ error: "Você não tem permissão para acessar essa rota"});
        }

        const { id } = req.params;
        const ong = await prisma.ongs.findUnique({ where: { id: parseInt(id) } });

        if (!ong) {
            return res.status(404).json({ error: "ONG não encontrada" });
        }

        await prisma.ongs.delete({ where: { id: parseInt(id) } });
        res.status(204).send();

    } catch (error) {
        res.status(500).json({ error: "Erro ao deletar ONG" });
    }
};

export const getCNPJ = async (req, res) => {
    try {
        const { cnpj } = req.params

        const response = await fetch(`https://www.receitaws.com.br/v1/cnpj/${cnpj}`, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json"
            }
        });

        const data = await response.json();

        res.status(200).json(data);
    } catch (error) {
        return res.status(500).json({message: `Erro ao consultar dados de CNPJ: ${error}`});
    }
};

export const PutPasswordOng = async (req, res) => {
    try {
        if (req.user.tipo !== "ONG") {
            return res.status(403).json({ error: "Você não tem permissão para acessar essa rota"});
        }

        const { email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const ong = await prisma.ongs.update({
            where: { emailONG: email },
            data: { password: hashedPassword }
        })

        if (!ong) {
            return res.status(404).json( { message: "ONG não encontrada" });
        }

        res.status(200).json( { message: "Senha atualizada com sucesso"});
    }
    catch (error) {
        res.status(500).json({ message: "Erro ao atualizar senha"});
    }
}