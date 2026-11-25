# HardwareStock — inventário de peças

MVP em React + Vite (JavaScript), Supabase Auth/Database e pronto para Vercel.

## Executar localmente
1. Instale Node.js LTS.
2. No terminal, dentro da pasta do projeto: `npm install`
3. Copie `.env.example` para `.env` e preencha os valores do Supabase.
4. Execute `npm run dev` e abra a URL exibida pelo Vite.
5. Para validar a compilação: `npm run build`.

## Configurar Supabase
1. Crie um projeto em https://supabase.com.
2. Em **SQL Editor**, execute o conteúdo de `supabase/schema.sql`.
3. Em **Project Settings → API** (ou seção equivalente de API), copie a Project URL e a chave pública anon/publishable. Use somente a chave pública no navegador; nunca coloque `service_role` no Vite ou na Vercel.
4. Preencha no `.env`:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
5. Em **Authentication → Providers**, confirme que Email está habilitado. Para testes, crie usuário em Authentication → Users ou use o cadastro da aplicação. Se confirmação de e-mail estiver habilitada, confirme o e-mail antes de entrar.

O app envia `user_id` ao criar o registro; as políticas RLS também validam `auth.uid()` em leitura, inserção, edição e exclusão. Portanto, a proteção não depende somente da interface.

## Deploy na Vercel
1. Envie o projeto para um repositório Git.
2. Na Vercel, importe o repositório. Framework preset: Vite; build command `npm run build`; output directory `dist`.
3. Em **Settings → Environment Variables**, cadastre `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` para os ambientes desejados.
4. Faça redeploy depois de cadastrar/alterar variáveis.
5. `vercel.json` inclui rewrite para que rotas internas do React Router funcionem ao atualizar a página.

## Estrutura
```text
src/
  components/   # Layout, rota protegida, formulário reutilizável
  contexts/     # sessão Supabase Auth
  lib/          # cliente Supabase
  pages/        # login/cadastro, inventário, detalhes e edição
  App.jsx
  main.jsx
  styles.css
supabase/schema.sql
```
