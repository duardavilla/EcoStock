import express, { Request, Response } from 'express';
import { Pool } from 'pg';
import cors from 'cors';
import { initializeRoutes } from '../src/routes';

const app = express();

// Carrega variáveis de ambiente apenas em desenvolvimento
if (process.env.NODE_ENV !== 'production') {
  console.log('Carregando .env para desenvolvimento...');
  import('dotenv/config');
}

console.log('1. Iniciando o servidor...');
console.log('2. DATABASE_URL:', process.env.DATABASE_URL);

if (!process.env.DATABASE_URL) {
  console.error('Erro: DATABASE_URL não está definida');
  process.exit(1);
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

console.log('3. Tentando conectar ao banco de dados...');
(async () => {
  try {
    const client = await pool.connect();
    console.log('4. Conexão com o banco de dados bem-sucedida');
    client.release();
  } catch (err: any) {
    console.error('Erro ao conectar ao banco de dados:', err.stack);
    process.exit(1);
  }
})();

console.log('5. Configurando middlewares...');
app.use(cors());
app.use(express.json());

console.log('6. Configurando rotas...');
app.get('/health', (req: Request, res: Response) => {
  res.status(200).send('Servidor OK');
});
app.use('/', initializeRoutes(pool));

// Exporta o app como uma função serverless para o Vercel
export default app;