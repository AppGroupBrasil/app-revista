# App Revista — Documentação Completa

> ⚠️ **NÃO COMMITAR em git público.** Este arquivo contém credenciais sensíveis.
> Última atualização: 2026-05-22

---

## 1. Identidade do produto

| Campo | Valor |
|---|---|
| Nome comercial | App Revista |
| Slug interno | `app-revista` |
| Domínio principal | https://apprevista.com.br |
| API | https://api.apprevista.com.br |
| Auth (SSO) | https://auth.appgroupbrasil.com.br |
| Email de contato | contato@apprevista.com.br |
| Email do envio (Resend) | no-reply@apprevista.com.br |
| Razão social / dono | AppGroupBrasil |

---

## 2. Pastas locais (Windows)

| Caminho | O que é |
|---|---|
| `C:\Users\HP\OneDrive\Área de Trabalho\PASTA APLICATIVOS\APPS PUBLICADOS\App Revista` | Repositório principal (web + api + capacitor + db) |
| `C:\Users\HP\OneDrive\Área de Trabalho\PASTA APLICATIVOS\App Revista` | **Este diretório** (documentação) |
| `C:\AppRevistaCap` | Junction para `capacitor/` (build Android — Gradle não aceita acentos no path) |
| `C:\Users\HP\OneDrive\Área de Trabalho\apprevista-release.jks` | Keystore Android (CRÍTICO) |
| `C:\Users\HP\OneDrive\Área de Trabalho\apprevista-keystore-CREDENCIAIS.txt` | Senhas do keystore |
| `C:\Users\HP\OneDrive\Área de Trabalho\app-revista-release.aab` | AAB assinado (último build) |
| `C:\Users\HP\OneDrive\Área de Trabalho\app-revista-debug.apk` | APK debug (instalação direta) |
| `C:\Users\HP\OneDrive\Área de Trabalho\app-revista-banner-1024x500.png` | Banner Play Store |

---

## 3. Stack técnico

### Frontend (`/`)
- Next.js 16.1.6 (App Router + Turbopack)
- React 19.2
- Tailwind v4
- Framer Motion, qrcode.react, lucide-react

### Backend (`/api`)
- NestJS 11
- Postgres 15 (via container `supabase-db` no servidor)
- `postgres` (driver), `passport-jwt`, `class-validator`, `nestjs-pino`, `resend`, `nanoid`

### Mobile (`/capacitor`)
- Capacitor 6, modo webview apontando para `https://apprevista.com.br`
- `appId`: `br.com.apprevista.app`

### Infra
- Docker Compose prod (Traefik + Let's Encrypt)
- Hospedagem: servidor Hetzner único (`46.225.191.114`)
- Banco: container Postgres compartilhado (`supabase-db`)
- Auth: container compartilhado (`auth-central-api`, `auth-central-db`)

---

## 4. Servidor de produção (Hetzner)

| Campo | Valor |
|---|---|
| IP | `46.225.191.114` |
| Hostname interno | `manus-apps` |
| Alias SSH local | `simples-manutencao-hetzner` |
| Acesso | `ssh simples-manutencao-hetzner` |
| Diretório do app | `/root/apprevista` |
| Diretório do auth | `/opt/auth-central` |

### Containers relevantes
- `apprevista-web` (porta 3000, Traefik para apprevista.com.br)
- `apprevista-api` (porta 3200, Traefik para api.apprevista.com.br)
- `supabase-db` (Postgres compartilhado — banco `apprevista`, usuário `apprevista`)
- `auth-central-api` (porta 3100, SSO)
- `auth-central-db` (Postgres do auth)

### Comandos úteis

```bash
ssh simples-manutencao-hetzner

# Logs API
docker logs apprevista-api --tail 50

# Redeploy manual (igual ao GitHub Action faz)
cd /root/apprevista
git pull
bash deploy-api.sh    # rebuild + restart API
bash deploy-web.sh    # rebuild + restart Web

# Aplicar migration nova
docker exec -i supabase-db psql -U postgres -d apprevista -v ON_ERROR_STOP=1 < db/migrations/NNN_arquivo.sql
docker exec -i supabase-db psql -U postgres -d apprevista -c "ALTER TABLE nova_tabela OWNER TO apprevista"

# Acessar Postgres
docker exec -it supabase-db psql -U postgres -d apprevista

# Backup manual
/root/backup-apprevista.sh
ls /root/backups/apprevista/
```

### Backup automático
- Script: `/root/backup-apprevista.sh`
- Cron: `30 3 * * *` (todo dia 03:30 UTC)
- Destino: `/root/backups/apprevista/apprevista-YYYY-MM-DD.sql.gz`
- Retenção: 7 dias

---

## 5. Banco de dados

| Campo | Valor |
|---|---|
| Container | `supabase-db` (Postgres 15) |
| Banco | `apprevista` |
| Usuário aplicação | `apprevista` (senha em `/root/apprevista/api/.env`) |
| Superusuário | `postgres` (peer auth via `docker exec`) |

### Migrations (em `db/migrations/`)
- `001` schema base (condominios, usuarios_cache, edicoes, etc.)
- `002` diário, KPIs, avaliações
- `003` revista
- `004` categorias extras
- `005` sugestões/reclamações/elogios
- `006` chamados
- `007` classificados
- `008` caronas
- `009` funcionários (funcionarios, tarefas, tarefa_execucoes)
- `010` 39 categorias de marketing
- `011` usuarios_cache (para notificações)

Aplicar nova migration:
```bash
ssh simples-manutencao-hetzner "docker exec -i supabase-db psql -U postgres -d apprevista -v ON_ERROR_STOP=1" < db/migrations/0XX_*.sql
# se criar tabela nova:
ssh simples-manutencao-hetzner "docker exec -i supabase-db psql -U postgres -d apprevista -c 'ALTER TABLE nova_tabela OWNER TO apprevista'"
```

---

## 6. Variáveis de ambiente da API (servidor)

Arquivo: `/root/apprevista/api/.env` (chmod 600)

| Var | Valor | Observação |
|---|---|---|
| `DATABASE_URL` | `postgres://apprevista:SENHA_DB@supabase-db:5432/apprevista` | Senha gerada no setup inicial — ver `DEPLOY-FASE-1.md` |
| `JWT_SECRET` | (mesmo do `auth-central-api`) | Sincronizado para validar JWTs do SSO |
| `WEBHOOK_SECRET` | (gerado no setup) | Para webhook auth-central → app-revista |
| `CORS_ORIGINS` | `https://apprevista.com.br,https://www.apprevista.com.br` | |
| `PORT` | `3200` | |
| `RESEND_API_KEY` | `re_NjtnSnj4_BWcLdXgBX94pxJBuSdc4wdwD` | Notificações |
| `NOTIFY_FROM` | `App Revista <no-reply@apprevista.com.br>` | |
| `APP_URL` | `https://apprevista.com.br` | Usado nos links dos emails |
| `LOG_LEVEL` | (default `info`) | Opcional: `debug`, `warn`, `error` |

### Local (`api/.env`) — para desenvolvimento
Já existe um arquivo dev com valores fake. **Não usar em produção.**

### Frontend (`.env.local`)
```
NEXT_PUBLIC_API_URL=http://localhost:3200/api/v1     # dev
NEXT_PUBLIC_AUTH_URL=https://auth.appgroupbrasil.com.br/api/v1
```

Em produção, esses valores estão hard-codados em `docker-compose.prod.yml` (envs do container web).

---

## 7. GitHub

| Campo | Valor |
|---|---|
| Repositório | https://github.com/AppGroupBrasil/app-revista |
| Branch principal | `main` |
| Workflows | `.github/workflows/deploy-api.yml`, `.github/workflows/deploy-web.yml` |
| Trigger | `push` em `main` (com path filters) |

### Secrets do GitHub Actions (já configurados)
- `SSH_PRIVATE_KEY` — chave privada do servidor Hetzner
- `SERVER_HOST` — `46.225.191.114`
- `SERVER_USER` — `root`

### Fluxo de deploy
1. `git push origin main`
2. GitHub Actions detecta paths alterados
3. SSH no servidor → `git pull` + `deploy-api.sh` ou `deploy-web.sh`
4. Container reconstrói e reinicia

---

## 8. SSO / auth-central

Compartilhado entre 13 apps do AppGroupBrasil. **Mexer com cuidado.**

| Campo | Valor |
|---|---|
| Diretório no servidor | `/opt/auth-central/api/src/` |
| Slug do app | `app-revista` |
| App ID (apps table) | `f4b33e66-5050-472f-970e-212c29cdf828` |
| Webhook URL configurado | `https://api.apprevista.com.br/api/v1/provisioning/usuario` |

### Provisão automática de licença
- Modificado em 2026-05-22: `/auth/register` agora aceita `app_slug` opcional.
- Quando o cadastro vem via App Revista, cria automaticamente `usuario_apps` (trial, role=dono).
- Para conceder licença manual:
  ```bash
  ssh simples-manutencao-hetzner "docker exec -i auth-central-db psql -U auth -d auth_central -c \"INSERT INTO usuario_apps (usuario_id, app_id, role, status) SELECT u.id, a.id, 'dono', 'trial' FROM usuarios u, apps a WHERE u.email = 'EMAIL@AQUI' AND a.slug = 'app-revista' ON CONFLICT (usuario_id, app_id) DO UPDATE SET status = 'trial'\""
  ```

### Backup local dos arquivos modificados
- `/opt/auth-central/api/src/auth/auth.controller.ts.bak`
- `/opt/auth-central/api/src/auth/auth.service.ts.bak`

---

## 9. Resend (emails)

| Campo | Valor |
|---|---|
| Conta | (usar a do AppGroupBrasil) |
| Domínio verificado | `apprevista.com.br` |
| Região | São Paulo (sa-east-1) |
| API Key (produção) | `re_NjtnSnj4_BWcLdXgBX94pxJBuSdc4wdwD` |
| Remetente | `App Revista <no-reply@apprevista.com.br>` |
| Dashboard | https://resend.com/emails |

### DNS configurado no Cloudflare (zone apprevista.com.br)
- MX `send` → `feedback-smtp.sa-east-1.amazonses.com` priority 10
- TXT `send` → SPF (`v=spf1 include:amazonses.com ~all`)
- TXT `resend._domainkey` → DKIM
- TXT `_dmarc` → `v=DMARC1; p=none;`

### Quando dispara email
- Novo chamado público → email para o síndico
- Novo classificado pendente → email para o síndico (moderação)

---

## 10. Play Store (Android)

| Campo | Valor |
|---|---|
| Package ID | `br.com.apprevista.app` |
| Versão atual | `1.0.2` (versionCode `3`) |
| compileSdk / targetSdk | 35 |
| minSdk | 22 |
| Política de privacidade | https://apprevista.com.br/politica-privacidade |
| Excluir conta | https://apprevista.com.br/excluir-conta |
| Ajuda/FAQ | https://apprevista.com.br/ajuda |

### Keystore (CRÍTICO — sem isso não dá pra atualizar o app)
- Arquivo: `C:\Users\HP\OneDrive\Área de Trabalho\apprevista-release.jks`
- Alias: `apprevista`
- Senha keystore: `at3bb4jBc8urbxAMxsxQVwGx`
- Senha alias: `at3bb4jBc8urbxAMxsxQVwGx`
- Validade: 100 anos
- **Faça backup em outro lugar.**

### Como gerar nova versão do AAB

```bash
# 1. Bump versão em capacitor/android/app/build.gradle
#    versionCode N+1 e versionName "1.0.X"
sed -i 's/versionCode N/versionCode N+1/; s/versionName "1.0.X"/versionName "1.0.Y"/' /c/AppRevistaCap/android/app/build.gradle

# 2. (Se mudou código web, primeiro sync)
cd /c/AppRevistaCap
npm run sync

# 3. Build AAB
cd /c/AppRevistaCap/android
JAVA_HOME="/c/Users/HP/.jdk17-x64/jdk-17.0.19+10" PATH="$JAVA_HOME/bin:$PATH" ./gradlew bundleRelease

# 4. Copiar para área de trabalho
cp app/build/outputs/bundle/release/app-release.aab "/c/Users/HP/OneDrive/Área de Trabalho/app-revista-release.aab"
```

### Gotchas que descobrimos
- Path do projeto NÃO pode ter acentos → usar junction `C:\AppRevistaCap → capacitor/`
- JDK precisa ser **x64** (`/c/Users/HP/.jdk17-x64/jdk-17.0.19+10`) — não usa o bubblewrap (x86)
- `local.properties`: `sdk.dir=C\:/Users/HP/.bubblewrap/android_sdk` (forward slash, escape do `:`)
- `gradle.properties`:
  - `android.overridePathCheck=true`
  - `org.gradle.jvmargs=-Xmx2048m -XX:MaxMetaspaceSize=512m`

---

## 11. Credenciais e contas de teste

### Síndico de teste (Play Store revisor)
- Email: `eduardodominikus@hotmail.com`
- Senha: (a senha real do Eduardo)
- Tem 1 condomínio cadastrado: `teste` (id `b8c378d6-c1e1-471f-bdae-1d4515b9d071`)
- Licença `app-revista`: trial

### Outro usuário cadastrado
- `eduardo@appcorrespondencia.com.br` — licença manual concedida

---

## 12. URLs públicas importantes

| URL | Descrição |
|---|---|
| `/` | Landing comercial |
| `/login` | Login do síndico |
| `/demo/cadastro` | Cadastro (síndico ou administradora) |
| `/painel` | Painel do síndico (requer login) |
| `/apresentacao` | Apresentação comercial estática |
| `/contrato` | Geração do contrato |
| `/revista/[condoId]` | Revista pública (3 modos: página/scroll/stories) |
| `/c/[condoId]/chamados/novo` | Abrir chamado (QR público) |
| `/c/chamados/[codigo]` | Acompanhar chamado |
| `/c/[condoId]/classificados` | Listagem pública |
| `/c/[condoId]/classificados/novo` | Anunciar |
| `/c/[condoId]/caronas` | Listagem pública |
| `/c/[condoId]/caronas/novo` | Nova carona |
| `/avaliar/[condoId]` | Avaliação pública (NPS) |
| `/v/[token]` | Scan de vistoria/tarefa (público) |
| `/ajuda` | FAQ do morador |
| `/politica-privacidade` | LGPD |
| `/termos` | Termos de uso |
| `/excluir-conta` | Exclusão LGPD |

---

## 13. Endpoints da API (https://api.apprevista.com.br/api/v1)

### Públicos (sem JWT)
- `GET /health`
- `POST /publico/condominios/:id/chamados` — abrir chamado
- `GET /publico/chamados/:codigo` — acompanhar
- `POST /publico/condominios/:id/classificados` — anunciar
- `GET /publico/condominios/:id/classificados` — listar
- `POST /publico/condominios/:id/caronas` — nova carona
- `GET /publico/condominios/:id/caronas` — listar
- `POST /publico/condominios/:id/avaliacoes` — avaliar
- `GET /publico/condominios/:id/avaliacoes/mural` — mural público
- `GET /publico/vistorias/:token` — info da tarefa
- `POST /publico/vistorias/:token/registro` — registrar execução
- `GET /publico/condominios/:id/revista/atual` — última edição publicada
- `POST /provisioning/usuario` — webhook do auth-central (HMAC)

### Autenticados (JWT do auth-central)
- `/condominios/*` (CRUD)
- `/condominios/:id/posts/*` (diário)
- `/condominios/:id/edicoes/*` + `/secoes/*` (revista)
- `/condominios/:id/kpis/*`
- `/condominios/:id/avaliacoes/*` (moderação)
- `/condominios/:id/parceiros/*`
- `/condominios/:id/chamados/*` (kanban)
- `/condominios/:id/classificados/*` (moderação)
- `/condominios/:id/caronas/*`
- `/condominios/:id/funcionarios/*`
- `/condominios/:id/tarefas/*`
- `/uploads/*` (multipart)
- `/master/*` (somente superadmin)

---

## 14. 43 categorias da revista

Definidas em `src/lib/revistaCategorias.ts` e enum `secao_categoria` no Postgres. Site advertise "40+".

11 originais + 32 do marketing — todas funcionam ponta a ponta (testado em 22/05/2026, 43/43 OK).

---

## 15. Planos comerciais

| Plano | Valor | Condomínios |
|---|---|---|
| Síndico | R$ 199/mês | 1 |
| Administradora | R$ 299/mês | Ilimitados |

Pagamento via **boleto bancário** (sem cartão). Sem Stripe nem gateway integrado — cobrança e gestão manual.

---

## 16. Próximos passos / pendências

- Painel admin de cobrança/boletos (hoje manual)
- Monitoramento (Sentry para erros + UptimeRobot)
- Logs centralizados (Loki/Grafana) — hoje só `docker logs`
- Lighthouse pass mais profundo (otimização de imagens, lazy load)
- Push notifications (FCM) — hoje só email
- iOS via Capacitor (precisa Mac + Apple Developer)
- Tour guiado dentro do painel (hoje só onboarding inicial)
- Política de privacidade revisada por advogado (hoje é template LGPD)

---

## 17. Histórico de sessões

### 2026-05-22 (sessão inicial)
- Auditoria do código (estava parado em 11 categorias + 4 módulos faltando)
- Implementação dos 4 módulos novos: chamados, classificados, caronas, funcionários
- Webhook → email Resend para notificações
- Auto-provision de licença via `app_slug` no `/auth/register`
- 43 categorias da revista
- Ajuste de preços (Síndico R$199, Administradora R$299)
- Backup automático Postgres
- Logs estruturados (pino) + rotação Docker
- Páginas LGPD: `/politica-privacidade`, `/termos`, `/excluir-conta`
- FAQ: `/ajuda`
- PWA install prompt
- Capacitor 6 wrapper (webview → apprevista.com.br)
- APK debug + AAB assinado (versionCode 3, 1.0.2)
- Banner 1024×500 para Play Store

---

## 18. Contatos

- Email principal: contato@apprevista.com.br
- DPO/LGPD: contato@apprevista.com.br
- GitHub: AppGroupBrasil

---

**Backup desta documentação:** salve cópia em pelo menos 2 lugares (OneDrive já cobre 1).
