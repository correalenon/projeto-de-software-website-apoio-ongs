import express from 'express';
import routes from '../routes/index.js';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function validateDatabaseConnection() {
    try {
        prisma.$connect();
        console.log('Conexão com o banco realizada com sucesso');
    } catch (error) {
        console.error('Erro de conexão com o banco:', error);
        process.exit(1);
    }
}

validateDatabaseConnection();

const app = express();
routes(app);

export default app;