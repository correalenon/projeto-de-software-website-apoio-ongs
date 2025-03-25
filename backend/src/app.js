import express from 'express';
import routes from '../routes/index.js';

conexao.on('error', (erro) => {
    console.error("erro de conexão", erro);
});

conexao.once('open', () => {
    console.log('Conexao com o banco realizada com sucesso');
});

const app = express();
routes(app);

export default app;