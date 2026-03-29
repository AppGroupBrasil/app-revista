#!/bin/bash
# Deploy APP REVISTA (Next.js) to Hetzner
# Usage: bash deploy.sh

set -e

SERVER="root@46.225.191.114"
SSH_KEY="~/.ssh/hetzner_key"
REMOTE_DIR="/root/apprevista/nextjs"
CONTAINER="apprevista-web"

echo "=== APP REVISTA — Deploy Hetzner ==="

# 1. Build locally
echo "[1/5] Building production..."
npm run build

# 2. Create deploy package (exclude dev files)
echo "[2/5] Packaging..."
tar czf /tmp/apprevista-deploy.tar.gz \
  --exclude=node_modules \
  --exclude=.next \
  --exclude=.git \
  --exclude=scripts \
  --exclude="*.md" \
  .

# 3. Upload to server
echo "[3/5] Uploading to server..."
ssh -i $SSH_KEY $SERVER "mkdir -p $REMOTE_DIR"
scp -i $SSH_KEY /tmp/apprevista-deploy.tar.gz $SERVER:$REMOTE_DIR/deploy.tar.gz

# 4. Extract and build on server
echo "[4/5] Building Docker image on server..."
ssh -i $SSH_KEY $SERVER << 'ENDSSH'
  cd /root/apprevista/nextjs
  tar xzf deploy.tar.gz
  rm deploy.tar.gz

  # Stop old container
  docker stop apprevista-web 2>/dev/null || true
  docker rm apprevista-web 2>/dev/null || true

  # Build new image
  docker compose build --no-cache

  # Start
  docker compose up -d

  # Cleanup old images
  docker image prune -f

  echo "Container status:"
  docker ps --filter name=apprevista-web --format "{{.Names}} {{.Status}} {{.Ports}}"
ENDSSH

# 5. Verify
echo "[5/5] Verifying..."
sleep 5
STATUS=$(ssh -i $SSH_KEY $SERVER "docker inspect apprevista-web --format '{{.State.Status}}' 2>/dev/null")
if [ "$STATUS" = "running" ]; then
  echo ""
  echo "✅ Deploy concluído com sucesso!"
  echo "🌐 https://apprevista.com.br"
else
  echo "❌ Container não está rodando. Status: $STATUS"
  echo "Logs:"
  ssh -i $SSH_KEY $SERVER "docker logs apprevista-web --tail 20"
fi
