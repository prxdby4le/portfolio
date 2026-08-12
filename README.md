# alethia Portfolio

Um site de portfólio moderno e interativo desenvolvido para o artista **alethia**.

## Tecnologias Utilizadas

Este projeto foi construído com as melhores e mais modernas ferramentas do ecossistema front-end e back-end:

- **Frontend:** [React 18](https://react.dev/) com [TypeScript](https://www.typescriptlang.org/)
- **Build Tool:** [Vite](https://vitejs.dev/)
- **Estilização:** [Tailwind CSS](https://tailwindcss.com/)
- **Componentes de UI:** [shadcn/ui](https://ui.shadcn.com/) (baseado em [Radix UI](https://www.radix-ui.com/))
- **Animações:** [Framer Motion](https://www.framer.com/motion/)
- **Gerenciamento de Estado/Dados:** [TanStack React Query](https://tanstack.com/query/latest)
- **Roteamento:** [React Router](https://reactrouter.com/)
- **Formulários e Validação:** [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)
- **Backend/Database:** [Supabase](https://supabase.com/)
- **Hospedagem/Deploy:** [Vercel](https://vercel.com/)

## Principais Funcionalidades

- Interface de usuário responsiva e acessível
- Animações fluidas de página e componentes
- Suporte a temas (Dark/Light mode)
- Integração de dados em tempo real com o Supabase

## Como Executar Localmente

### Pré-requisitos

Certifique-se de ter o [Node.js](https://nodejs.org/) (versão 18+ recomendada) e um gerenciador de pacotes (npm, yarn, pnpm ou bun) instalados em sua máquina. O projeto usa o `bun` como gerenciador de pacotes padrão, mas também pode ser executado com o `npm`.

### Passos

1. **Clone o repositório:**
   ```bash
   git clone <url-do-repositorio>
   cd portfolio
   ```

2. **Instale as dependências:**
   ```bash
   bun install
   # ou
   npm install
   ```

3. **Configuração do Ambiente:**
   Copie o arquivo de exemplo para criar seu `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
   Em seguida, preencha o `.env.local` com as suas credenciais do Supabase.

4. **Inicie o servidor de desenvolvimento:**
   ```bash
   bun run dev
   # ou
   npm run dev
   ```

5. Acesse `http://localhost:5173` no seu navegador.

## 📦 Scripts Disponíveis

- `npm run dev` / `bun run dev`: Inicia o servidor de desenvolvimento com o Vite.
- `npm run build` / `bun run build`: Cria a versão de produção otimizada.
- `npm run lint` / `bun run lint`: Executa a verificação de código usando ESLint.
- `npm run preview` / `bun run preview`: Inicia um servidor local para visualizar o build de produção.