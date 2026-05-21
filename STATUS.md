# App Revista — Status do Projeto

Última atualização: 21/05/2026

## Stack

- **Frontend**: Next.js 16.1.6 (Turbopack) + React 19.2 + Tailwind v4 + Framer Motion
- **Backend**: NestJS 11 + postgres.js + JWT (Passport) + Multer
- **Banco**: Postgres 15 (compartilhado com supabase-db) — database `apprevista`
- **Storage**: Supabase Storage (bucket `apprevista`, público, 5MB)
- **Auth**: SSO via `auth-central` (https://auth.appgroupbrasil.com.br) — JWT compartilhado entre todos os apps do grupo
- **Hospedagem**: Hetzner (46.225.191.114), containers Docker, Traefik com Let's Encrypt
- **CI/CD**: GitHub Actions (`AppGroupBrasil/app-revista`) → SSH `git pull` → `docker compose build`

## URLs

| Ambiente | URL |
|---|---|
| Site institucional | https://apprevista.com.br |
| API | https://api.apprevista.com.br/api/v1 |
| Health | https://api.apprevista.com.br/api/v1/health |
| Login | https://apprevista.com.br/login |
| Painel | https://apprevista.com.br/painel |
| Master (superadmin) | https://apprevista.com.br/master |
| Revista pública | https://apprevista.com.br/revista/[condoId] |

## Conta superadmin

- E-mail: `eduardodominikus@hotmail.com`
- Senha: `123456`
- Role: `superadmin` no auth-central + licença `app-revista` ativa

## Arquitetura

```
┌──────────────────────────────────────────────────────────┐
│ Hetzner — 46.225.191.114                                 │
│                                                          │
│  ┌────────────────┐    ┌─────────────────┐              │
│  │ auth-central   │    │ supabase-db     │  ← postgres   │
│  │ (NestJS :3100) │    │ (porta 5432)    │  + storage    │
│  │ auth_central   │    │ ├─ apprevista   │               │
│  │  └─ usuarios   │    │ │   └─ tabelas  │               │
│  │  └─ apps       │    │ ├─ outros apps  │               │
│  │  └─ licencas   │    │ └─ storage.*    │               │
│  └────────┬───────┘    └────────┬────────┘               │
│           │ JWT (HS256)         │                        │
│           │ webhook             │                        │
│           ▼                     ▼                        │
│  ┌────────────────────────────────────┐                  │
│  │ apprevista-api (NestJS :3200)      │                  │
│  │  └─ valida JWT do auth-central     │                  │
│  │  └─ checa licença app-revista      │                  │
│  └────────┬───────────────────────────┘                  │
│           │ Traefik (TLS LE)                             │
│           ▼                                              │
│  ┌────────────────────────────────────┐                  │
│  │ apprevista-web (Next.js :3000)     │                  │
│  └────────────────────────────────────┘                  │
└──────────────────────────────────────────────────────────┘
```

## O que está pronto

### Backend (apprevista-api)

| Módulo | Endpoints | Status |
|---|---|---|
| `health`         | GET /health                                          | ✅ |
| `auth`           | JWT guard + verificação de licença app-revista       | ✅ |
| `condominios`    | GET /, POST /, GET /:id                              | ✅ |
| `master`         | GET /condominios, PATCH bloqueio/assinatura          | ✅ |
| `provisioning`   | POST /usuario (webhook HMAC do auth-central)         | ✅ |
| `uploads`        | POST (multipart, JWT), GET stream público            | ✅ |
| `diario`         | CRUD /condominios/:id/posts                          | ✅ |
| `kpis`           | CRUD /condominios/:id/kpis                           | ✅ |
| `avaliacoes`     | CRUD admin + POST /publico/.../avaliacoes + /mural   | ✅ |
| `revista`        | CRUD edicoes + secoes + parceiros + GET público      | ✅ |

### Frontend

| Rota | Descrição | Status |
|---|---|---|
| `/`                                 | Landing institucional                                | ✅ |
| `/apresentacao`, `/contrato`        | Páginas institucionais                               | ✅ |
| `/demo/*`                           | Páginas de demonstração (estáticas, sem backend)     | ✅ |
| `/login`                            | Login real via auth-central                          | ✅ |
| `/demo/cadastro`                    | Cadastro real (registra no auth-central + cria condomínio) | ✅ |
| `/painel`                           | Lista de condomínios do usuário                      | ✅ |
| `/painel/novo`                      | Form criar condomínio                                | ✅ |
| `/painel/[id]`                      | Detalhe do condomínio + cards dos módulos            | ✅ |
| `/painel/[id]/diario`               | Diário do Condomínio (5 categorias + antes/depois)   | ✅ |
| `/painel/[id]/kpis`                 | KPIs em Destaque (CRUD com 6 cores)                  | ✅ |
| `/painel/[id]/avaliacoes`           | NPS + moderação de avaliações                        | ✅ |
| `/painel/[id]/revista`              | Lista de edições da revista                          | ✅ |
| `/painel/[id]/revista/[edicaoId]`   | Editor de seções (11 categorias)                     | ✅ |
| `/painel/[id]/parceiros`            | CRUD de parceiros/fornecedores/prestadores           | ✅ |
| `/master`                           | Painel superadmin (bloqueio, status assinatura)      | ✅ |
| `/revista/[condoId]`                | Revista pública com 3 modos (página/scroll/stories)  | ✅ |

### Componentes UI

- `Container`, `Button`, `PageHeader`, `Card` (em `src/components/ui/`)
- `AppHeader` (top bar com logo, avatar, botões Master/Sair)
- `RequireAuth` (guard de rota, redireciona pra `/login?next=...`)
- `PhotoUpload` (input de fotos com preview, validação MIME, integrado ao bucket)
- `ShareButton` (Web Share API + WhatsApp fallback + copy link)

### Categorias da Revista (11)

1. 📢 Mensagem do Síndico
2. 🏆 Realizações
3. 🛒 Aquisições
4. ✅ Ocorrências Finalizadas
5. 🔧 Manutenções Finalizadas
6. 📣 Comunicados
7. 💡 Dicas
8. 📞 Telefones Úteis
9. 🎉 Eventos
10. 🖼️ Galeria de Imagens
11. 💬 Sugestões, Reclamações e Elogios

Cada categoria aceita múltiplas seções por edição.

## Banco de Dados — Estrutura atual

Database `apprevista`:

- `condominios` (dono_id, perfil, nome, endereco, cnpj, theme/accent, status_assinatura, bloqueado)
- `administradoras`, `administradora_condominios`
- `provisioning_log` (webhooks do auth-central)
- `posts` (diário: categoria enum, fotos JSONB, antes_depois, publicado)
- `kpis` (rotulo, valor, descricao, icone, cor, ordem, visivel)
- `avaliacoes` (nota 1-5, contexto enum, comentario, publicada, destaque)
- `edicoes` (numero, titulo, mes, ano, capa_url, theme/accent, publicada)
- `secoes` (edicao_id, categoria enum, titulo, conteudo, fotos JSONB, dados JSONB, ordem)
- `parceiros` (tipo enum, nome, categoria, logo_url, telefone, whatsapp, link, destaque, ativo)

**Migrations** em `db/migrations/`:
- `001` schema inicial (implícito em `db/schema.sql`)
- `002` diário, kpis, avaliações
- `003` revista (edicoes, secoes, parceiros)
- `004` +2 categorias (ocorrencias_finalizadas, manutencoes_finalizadas)
- `005` +1 categoria (sugestoes_reclamacoes_elogios)

## Configuração do servidor

- Diretório: `/root/apprevista` (clone do repo GitHub)
- Compose: `docker-compose.prod.yml` (services: apprevista-web, apprevista-api)
- Rede Docker: `coolify` (compartilhada com auth-central e supabase)
- `.env` da API em `/root/apprevista/api/.env`:
  - `DATABASE_URL=postgres://apprevista:***@supabase-db:5432/apprevista`
  - `JWT_SECRET=...` (mesmo do auth-central)
  - `WEBHOOK_SECRET=...` (auth-central → apprevista-api)
  - `STORAGE_URL=http://supabase-storage:5000`
  - `STORAGE_SERVICE_KEY=...`
  - `STORAGE_BUCKET=apprevista`
- Credenciais em `/root/.apprevista-credentials` (DBPASS, WEBHOOK_SECRET)

## CI/CD

- GitHub: `AppGroupBrasil/app-revista` (main branch)
- Secrets: `SSH_PRIVATE_KEY`, `SERVER_HOST`, `SERVER_USER`
- Workflows: `.github/workflows/deploy-api.yml` e `deploy-web.yml`
- Trigger por path filter:
  - `api/**`, `db/**`, `docker-compose.prod.yml`, `deploy-api.sh` → Deploy API
  - resto de `src/**` → Deploy Web

## Pendências / Próximas fases

### Módulos ainda placeholder no painel do condomínio
- 🔧 **Chamados** — solicitações de moradores (kanban + endpoint público pra abrir via QR Code)
- 🏷 **Classificados** — anúncios dos moradores (moderação + página pública)
- 🚗 **Caronas** — caronas compartilhadas
- 👷 **Funcionários** — tarefas, checklists, vistorias com QR Code

### Melhorias da revista
- Página pública: revisar SEO / OG tags / meta da revista publicada
- Adicionar mais modos (newspaper, slides, timeline) reutilizando os componentes existentes em `src/components/revista/`
- Drag-and-drop pra reordenar seções no editor
- Upload de capa da edição (hoje só URL ou via PhotoUpload em outra tela)

### Página pública geral
- `/c/[slug]` — mini-site institucional do condomínio (revista atual + KPIs + mural NPS + parceiros)
- Avaliação pública (endpoint já existe `/publico/condominios/:id/avaliacoes`, falta UI)

### Painel master
- Listar usuários (não apenas condomínios)
- Liberar/revogar licença do app-revista por usuário (hoje só via SQL)
- Métricas de uso

### Outras
- Substituir `Math.random()` por `nanoid` em códigos públicos (chamados, classificados)
- PWA real (manifest + service worker — já tem prompt mas falta SW)
- Cache de leitura em `/revista/[condoId]` (CDN ou Next ISR)
- Trocar `RouterModule` por subdomínio de storage (`storage.apprevista.com.br`) pra performance — hoje proxy via API

## Commits relevantes desta sessão

```
8ad0003 feat(revista): +1 categoria — Sugestões, Reclamações e Elogios
d80ec04 fix(api): filtra undefined antes de sql() em todos os PATCH
8d64c9b feat(revista): pagina publica /revista/[condoId] com 3 modos
6d7ca52 feat(revista): hint textual em cada categoria do editor
0e1f3e5 feat(revista): +2 categorias — Ocorrências e Manutenções Finalizadas
9eddf7a fix(secoes): cast para postgres JSONValue
6bcee11 feat(fase-4): Revista Digital — edicoes, secoes (8 categorias), parceiros
1654bb5 feat(uploads): upload de fotos via Supabase Storage
1191a13 feat(fase-3): diario de bordo + KPIs em destaque + avaliacoes/NPS + share
3c74f48 feat(painel/master): replica layout das páginas demo
6f8622b feat(fase-2): /painel + /master + RequireAuth + endpoints master
28bd2e4 chore(api): adiciona package-lock.json
3bafaec feat(fase-1): backend NestJS + integração auth-central + UI tokens
```

## Como continuar amanhã

1. **Login**: `eduardodominikus@hotmail.com` / `123456` em https://apprevista.com.br/login
2. **Verificar estado**: `git pull` no servidor confirma sync. API health em https://api.apprevista.com.br/api/v1/health
3. **Próximo módulo sugerido**: **Chamados** (alta utilização, baixa complexidade)
   - Schema: `chamados` (categoria, titulo, descricao, status enum, prioridade, autor_nome, autor_unidade, fotos, codigo público para tracking)
   - API: CRUD + `POST /publico/condominios/:id/chamados` (abertura via QR Code) + `GET /publico/chamados/:codigo` (acompanhamento)
   - Frontend admin: kanban (`/painel/[id]/chamados`) com 4 colunas (aberto, em andamento, resolvido, problema)
   - Frontend público: formulário de abertura + página de acompanhamento
   - Habilitar card no `/painel/[id]`
