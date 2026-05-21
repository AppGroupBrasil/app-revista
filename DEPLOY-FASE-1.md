# Deploy Fase 1 — Backend App Revista

Este documento lista os passos manuais que precisam ser executados **uma única vez** para o backend entrar em produção. Os comandos rodam por SSH no servidor Hetzner.

## 0. Pré-requisitos

- Acesso SSH ao servidor (alias `simples-manutencao-hetzner`)
- Domínios apontados (DNS):
  - `apprevista.com.br` → 46.225.191.114
  - `api.apprevista.com.br` → 46.225.191.114
- Repositório GitHub criado e secrets configuradas (passo 4)

## 1. Criar banco `apprevista` no Postgres do Supabase

```bash
ssh simples-manutencao-hetzner

# Gerar senha forte e criar usuário + database
SENHA=$(openssl rand -base64 32 | tr -dc 'A-Za-z0-9' | head -c 32)
echo "DATABASE_PASSWORD=$SENHA"  # SALVE este valor

docker exec -i supabase-db psql -U postgres <<SQL
CREATE USER apprevista WITH PASSWORD '$SENHA';
CREATE DATABASE apprevista OWNER apprevista;
GRANT ALL PRIVILEGES ON DATABASE apprevista TO apprevista;
SQL

# Aplicar schema
docker exec -i supabase-db psql -U apprevista -d apprevista < /root/apprevista/db/schema.sql
```

## 2. Clonar repositório no servidor (substituir versão estática antiga)

```bash
# Backup da versão atual
mv /root/apprevista /root/apprevista.old.$(date +%Y%m%d)

# Clonar do GitHub (URL real do repo)
cd /root
git clone git@github.com:SEU_USUARIO/app-revista.git apprevista
cd apprevista
```

## 3. Criar `.env` da API

```bash
cat > /root/apprevista/api/.env <<EOF
DATABASE_URL=postgres://apprevista:SENHA_DO_PASSO_1@supabase-db:5432/apprevista
JWT_SECRET=$(docker inspect auth-central-api --format '{{range .Config.Env}}{{println .}}{{end}}' | grep '^JWT_SECRET=' | cut -d= -f2)
CORS_ORIGINS=https://apprevista.com.br,https://www.apprevista.com.br
WEBHOOK_SECRET=$(openssl rand -hex 32)
PORT=3200
EOF
chmod 600 /root/apprevista/api/.env

# Salve o WEBHOOK_SECRET — vai ser usado no passo 5
grep WEBHOOK_SECRET /root/apprevista/api/.env
```

> **Importante**: o `JWT_SECRET` precisa ser **idêntico** ao do `auth-central-api` — assim o JWT emitido pelo SSO é validado aqui.

## 4. Configurar secrets do GitHub Actions

No repositório GitHub → Settings → Secrets and variables → Actions, adicionar:

| Secret              | Valor                                          |
| ------------------- | ---------------------------------------------- |
| `SSH_PRIVATE_KEY`   | conteúdo de `~/.ssh/hetzner_key` (privada)     |
| `SERVER_HOST`       | `46.225.191.114`                               |
| `SERVER_USER`       | `root`                                         |

## 5. Adicionar webhook do App Revista no auth-central

```bash
ssh simples-manutencao-hetzner

# Editar env do auth-central
WEBHOOK_SECRET_APP_REVISTA=$(grep WEBHOOK_SECRET /root/apprevista/api/.env | cut -d= -f2)
echo "WEBHOOK_SECRET_APP_REVISTA=$WEBHOOK_SECRET_APP_REVISTA"

# Adicionar ao docker-compose do auth-central
cd /opt/auth-central
# editar docker-compose.prod.yml e adicionar:
#   WEBHOOK_URL_APP_REVISTA: https://api.apprevista.com.br/api/v1/provisioning/usuario
#   WEBHOOK_SECRET_APP_REVISTA: ${WEBHOOK_SECRET_APP_REVISTA}
# (no bloco environment do serviço api)

# Adicionar ao .env do auth-central
echo "WEBHOOK_URL_APP_REVISTA=https://api.apprevista.com.br/api/v1/provisioning/usuario" >> /opt/auth-central/.env
echo "WEBHOOK_SECRET_APP_REVISTA=$WEBHOOK_SECRET_APP_REVISTA" >> /opt/auth-central/.env

# Reiniciar auth-central
docker compose -f docker-compose.prod.yml up -d
```

## 6. Setar `url_publica` do app na tabela `apps`

```bash
docker exec -i auth-central-db psql -U auth -d auth_central <<SQL
UPDATE apps SET url_publica = 'https://apprevista.com.br' WHERE slug = 'app-revista';
SQL
```

## 7. Subir API + Web (primeiro deploy manual)

```bash
cd /root/apprevista

# Parar container antigo da versão estática
docker stop apprevista-web 2>/dev/null && docker rm apprevista-web 2>/dev/null

# Build + up
docker compose -f docker-compose.prod.yml up -d --build

# Verificar
docker logs apprevista-api --tail 30
curl https://api.apprevista.com.br/api/v1/health
```

A partir daqui, `git push` na `main` dispara deploy automático via GitHub Actions.

## 8. Criar conta de master (você)

Pelo `/demo/cadastro` no front, criar uma conta normal. Depois:

```bash
docker exec -i auth-central-db psql -U auth -d auth_central <<SQL
UPDATE usuarios SET role_global = 'superadmin' WHERE email = 'SEU_EMAIL_AQUI';
SQL
```

E liberar licença do app-revista para esse usuário:

```bash
docker exec -i auth-central-db psql -U auth -d auth_central <<SQL
INSERT INTO usuario_apps (usuario_id, app_id, role, status)
SELECT u.id, a.id, 'admin', 'ativa'
FROM usuarios u, apps a
WHERE u.email = 'SEU_EMAIL_AQUI' AND a.slug = 'app-revista';
SQL
```

## Verificação

```bash
# Health da API
curl https://api.apprevista.com.br/api/v1/health
# → {"ok":true,"service":"apprevista-api",...}

# Cadastro + login pelo front
# → https://apprevista.com.br/demo/cadastro
# → https://apprevista.com.br/login

# Logs em tempo real
ssh simples-manutencao-hetzner "docker logs -f apprevista-api"
```

## Próximas fases

- **Fase 2**: Edições + seções da revista, upload de imagens (Supabase Storage).
- **Fase 3**: Chamados (morador → síndico), classificados, caronas.
- **Fase 4**: Funcionários + tarefas/checklists/vistorias com QR Code.
- **Fase 5**: Painel master (`/master`) para gerenciar licenças, bloquear inadimplentes.
