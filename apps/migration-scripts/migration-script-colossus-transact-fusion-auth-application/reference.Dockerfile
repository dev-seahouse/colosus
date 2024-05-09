# This file is generated by Nx.
#
# Build the docker image with `npx nx docker-build migration-scripts-migration-script-colossus-transact-fusion-auth-application`.
# Tip: Modify "docker-build" options in project.json to change docker build args.
#
# Run the container with `docker run -p 3000:3000 -t migration-scripts-migration-script-colossus-transact-fusion-auth-application`.
FROM docker.io/node:lts-alpine

ENV HOST=0.0.0.0
ENV PORT=3000

WORKDIR /app

RUN addgroup --system migration-scripts-migration-script-colossus-transact-fusion-auth-application && \
          adduser --system -G migration-scripts-migration-script-colossus-transact-fusion-auth-application migration-scripts-migration-script-colossus-transact-fusion-auth-application

COPY dist/apps/migration-scripts/migration-script-colossus-transact-fusion-auth-application migration-scripts-migration-script-colossus-transact-fusion-auth-application
RUN chown -R migration-scripts-migration-script-colossus-transact-fusion-auth-application:migration-scripts-migration-script-colossus-transact-fusion-auth-application .

# You can remove this install step if you build with `--bundle` option.
# The bundled output will include external dependencies.
RUN npm --prefix migration-scripts-migration-script-colossus-transact-fusion-auth-application --omit=dev -f install

CMD [ "node", "migration-scripts-migration-script-colossus-transact-fusion-auth-application" ]