import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const authenticateUser = async (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.status(401).json({ error: "Token não fornecido" });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await prisma.users.findUnique({ where: { id: decoded.id } });

        if (!user) {
            return res.status(401).json({ error: "Usuário inválido" });
        }
        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({ error: "Token inválido ou expirado" });
    }
};

const generateToken = (user) => {
    const payload = { id: user.id, email: user.email, role: user.role };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });
    return token;
};

export { authenticateUser, generateToken };
