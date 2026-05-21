#!/bin/bash
set -euo pipefail
cd "$(dirname "$0")"

echo "[apprevista] Build + restart API"
docker compose -f docker-compose.prod.yml up -d --build apprevista-api
docker compose -f docker-compose.prod.yml ps apprevista-api
echo "[apprevista] API OK"
