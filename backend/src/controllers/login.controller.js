import bcrypt from "bcryptjs"; // Alterado para bcryptjs
import prisma from "../db/client.js";
import { generateToken } from "../services/authentication.js";
import { request, response } from "express";

export const postLogin = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: "Email e senha são obrigatórios" });
    }
    try {
        const user = await prisma.users.findUnique({ where: { email } });
        if (!user) {
            return res.status(401).json({ error: "Credenciais inválidas" });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password); // bcryptjs funciona da mesma forma
        if (!isPasswordValid) {
            return res.status(401).json({ error: "Credenciais inválidas" });
        }
        const token = generateToken(user);
        return res.status(200).json({ token });
    } catch (error) {
        return res.status(500).json({ error: "Erro interno do servidor" });
    }
};
