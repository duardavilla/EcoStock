import express, { Request, Response } from 'express';
import { Pool } from 'pg';
import 'dotenv/config';
import cors from 'cors';
import { initializeRoutes } from './routes';

const app = express();
const port = process.env.PORT || 3001;

// Log para verificar a variável de ambiente
console.log('DATABASE_URL:', process.env.DATABASE_URL);

// Configuração do banco de dados
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// Testar a conexão com o banco de dados
(async () => {
  try {
    const client = await pool.connect();
    console.log('Conexão com o banco de dados bem-sucedida');
    client.release();
  } catch (err: any) { // Tipagem explícita para corrigir erro TS18046
    console.error('Erro ao conectar ao banco de dados:', err.stack);
  }
})();

// Middleware para CORS e parsing de JSON
app.use(cors());
app.use(express.json());

// Inicializar e usar as rotas
app.use('/', initializeRoutes(pool));

// Iniciar o servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});