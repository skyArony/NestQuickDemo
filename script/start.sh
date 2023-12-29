docker compose --env-file ../.env pull
docker compose --env-file ../.env down --remove-orphans
docker compose --env-file ../.env up -d
