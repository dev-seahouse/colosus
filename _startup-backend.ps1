$ErrorActionPreference = "Stop"

.\_nvmrc-windows.ps1

yarn install;
yarn docker:build:keycloak:dev;
docker compose build;
# docker compose up -d;
yarn nx run @bambu-server-core-db-central-db:prisma-migrate;
yarn nx run @bambu-server-core-db-central-db:prisma-seed-central-db;
# yarn nx run colossus:serve;
# yarn start:colossus:backend;
yarn concurrently "yarn nx run colossus:serve" "docker compose watch"
