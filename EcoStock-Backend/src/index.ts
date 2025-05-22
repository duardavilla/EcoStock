import express, { Request, Response } from 'express';
import { Pool } from 'pg';
import 'dotenv/config';
import cors from 'cors';
import { initializeRoutes } from './routes';

const app = express();
const port = process.env.PORT || 3001;

// Configuração do CORS para aceitar o domínio do frontend no Vercel
const allowedOrigins = [
  'http://localhost:3000', // Para desenvolvimento local
  process.env.FRONTEND_URL || 'ecostockfinal.vercel.app' // URL do frontend no Vercel
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());

// Log para verificar variáveis de ambiente
console.log('DATABASE_URL:', process.env.DATABASE_URL);
console.log('PORT:', process.env.PORT);
console.log('FRONTEND_URL:', process.env.FRONTEND_URL);

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
  } catch (err: any) {
    console.error('Erro ao conectar ao banco de dados:', err.stack);
  }
})();

// Inicializar e usar as rotas
app.use('/', initializeRoutes(pool));

// Iniciar o servidor
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});