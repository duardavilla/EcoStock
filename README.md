## EcoStock - Plataforma de Trocas Sustentáveis
Bem-vindo ao EcoStock, uma plataforma web inovadora que conecta empresas para facilitar a troca de produtos e recursos, promovendo sustentabilidade e economia circular. Desenvolvida com tecnologias modernas, a EcoStock permite que empresas parceiras gerenciem trocas, produtos e categorias de forma eficiente, reduzindo desperdícios e fortalecendo parcerias comerciais.

## 📖 Sobre o Projeto
A EcoStock é uma aplicação full-stack que oferece uma interface intuitiva para administradores gerenciarem empresas, categorias, produtos e trocas. Com um backend robusto e um frontend responsivo, a plataforma garante uma experiência fluida tanto em ambientes locais quanto em produção.

## 🎯 Objetivos

Sustentabilidade: Incentivar a reutilização de recursos entre empresas.
Eficiência: Simplificar o processo de trocas com uma interface amigável.
Escalabilidade: Suportar um número crescente de empresas e transações.

## ✨ Funcionalidades

- Gerenciamento de Empresas: Cadastre, edite e visualize informações detalhadas de empresas parceiras.
- Sistema de Trocas: Registre, monitore e atualize trocas entre empresas, com suporte a diferentes status (pendente, em andamento, concluída, etc.).
- Categorias de Produtos: Organize produtos por categorias para facilitar a busca e o gerenciamento.
- Dashboard Analítico: Visualize estatísticas em tempo real, como total de produtos, empresas, categorias e trocas realizadas.
- Autenticação Segura: Login protegido para administradores, com verificação de sessão.
- Filtros e Pesquisa: Busque empresas e trocas rapidamente com filtros avançados.
- Notificações: Feedback visual com mensagens de sucesso e erro via toasts.

## 🛠️ Tecnologias Utilizadas

### Frontend
React: Biblioteca JavaScript para construção de interfaces dinâmicas.
TypeScript: Tipagem estática para maior robustez e manutenibilidade.
Vite: Ferramenta de build rápida e otimizada.
Shadcn/UI: Componentes UI acessíveis e personalizáveis.
Sonner: Biblioteca para notificações toast.
Axios: Cliente HTTP para chamadas à API.
React Router: Gerenciamento de rotas no frontend.
Tailwind CSS: Framework CSS para estilização rápida e responsiva.

### Backend

Node.js + Express: Servidor API RESTful escalável.
TypeScript: Tipagem estática no backend.
Prisma ORM: Acesso simplificado ao banco de dados.
PostgreSQL: Banco de dados relacional robusto.
CORS: Configuração para segurança em requisições cross-origin.

### Hospedagem

Frontend: Vercel (https://ecostockfinal.vercel.app)
Backend: Render (https://ecostock.onrender.com)
Banco de Dados: Hospedado no Render com PostgreSQL e Supabase.


## 🚀 Como Executar o Projeto

### Pré-requisitos
Node.js (v18 ou superior)
npm ou yarn
PostgreSQL (local ou hospedado)
Git

1. Clonar o Repositório
git clone https://github.com/seu-usuario/ecostock.git
cd ecostock

2. Configurar o Backend

3. Navegue até o diretório do backend:cd backend

4. Instale as dependências:npm install

5. Crie um arquivo .env com base no .env.example:DATABASE_URL="postgresql://user:password@localhost:5432/ecostock?schema=public"
PORT=3001

6. Execute as migrações do Prisma:npx prisma migrate dev

7. Inicie o servidor:npm run dev

## 3. Configurar o Frontend

1. Navegue até o diretório do frontend:cd frontend

2. Instale as dependências:npm install

3. Crie um arquivo .env com base no .env.example:VITE_API_URL=http://localhost:3001

4. Inicie o servidor de desenvolvimento:npm run dev

5. Acesse a aplicação em http://localhost:5173.

## 4. Configurar em Produção

### Frontend (Vercel):
Faça deploy do diretório frontend no Vercel.
Configure a variável de ambiente VITE_API_URL=https://ecostock.onrender.com no painel do Vercel.


### Backend (Render):
Faça deploy do diretório backend no Render.
Configure as variáveis de ambiente (DATABASE_URL, PORT) no painel do Render.
Certifique-se de que o CORS permite requisições de https://ecostockfinal.vercel.app.


## 📂 Estrutura do Projeto
### Frontend
frontend/
├── src/
│   ├── components/        # Componentes reutilizáveis
│   ├── pages/            # Páginas da aplicação (Dashboard, Empresas, Trocas)
│   ├── config.ts         # Configurações (ex.: API_URL)
│   ├── assets/           # Arquivos estáticos (imagens, ícones)
│   └── App.tsx           # Componente principal
├── .env                  # Variáveis de ambiente
└── vite.config.ts        # Configuração do Vite

### Backend
backend/
├── src/
│   ├── routes/           # Rotas da API
│   ├── controllers/      # Lógica de negócio
│   ├── models/           # Modelos Prisma
│   └── index.ts          # Ponto de entrada
├── prisma/
│   └── schema.prisma     # Esquema do banco de dados
├── .env                  # Variáveis de ambiente
└── package.json          # Dependências e scripts


## 🧪 Testando a Aplicação

### Testes Locais:

Configure o backend e o frontend localmente.
Acesse http://localhost:5173 e faça login com credenciais de administrador.
Teste as funcionalidades:
Crie/edit/visualize empresas na tela "Empresas".
Inicie trocas e atualize status na tela "Trocas".
Visualize estatísticas no "Dashboard".

## Testes em Produção:

Acesse https://ecostockfinal.vercel.app.
Verifique as requisições no console do navegador (F12 > Network).
Teste a criação, edição e exclusão de trocas/empresas.
Monitore erros de CORS ou API nos logs do Render.


## Depuração:

Use console.log no frontend/backend para inspecionar respostas da API.
Teste rotas diretamente com curl:curl -X GET https://ecostock.onrender.com/api/trocas


## 🌟 Destaques

Design Responsivo: Interface adaptável para desktops e dispositivos móveis.
Feedback ao Usuário: Notificações toast para ações bem-sucedidas ou erros.
Segurança: Autenticação baseada em sessão e validação de campos no frontend e backend.
Escalabilidade: Arquitetura modular que facilita a adição de novas funcionalidades.

## 🤝 Contribuindo
Quer ajudar a tornar a EcoStock ainda melhor? Siga estes passos:

1. Faça um fork do repositório.

2. Crie uma branch para sua feature:git checkout -b minha-feature

3. Commit suas mudanças:git commit -m "Adiciona minha feature"


4. Envie para o repositório remoto:git push origin minha-feature

5. Abra um Pull Request.

## 🌱 EcoStock: Conectando empresas, transformando o futuro. Junte-se à economia circular! 🚀
