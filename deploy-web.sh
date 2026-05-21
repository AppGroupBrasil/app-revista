#!/bin/bash
set -euo pipefail
cd "$(dirname "$0")"

echo "[apprevista] Build + restart Web"
docker compose -f docker-compose.prod.yml up -d --build apprevista-web
docker compose -f docker-compose.prod.yml ps apprevista-web
echo "[apprevista] Web OK"
