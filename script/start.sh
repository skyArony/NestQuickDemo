docker compose -p nest-quick-demo --env-file ../.env pull
docker compose -p nest-quick-demo --env-file ../.env down --remove-orphans
docker compose -p nest-quick-demo --env-file ../.env up -d
