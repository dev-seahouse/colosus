# syntax = docker/dockerfile:1.2

FROM node:18.17.1-alpine3.18

# Patch OS Lib Issues and set workdir
RUN apk update && \
    apk upgrade && \
    addgroup --system colossus && \
    adduser --system -G colossus colossus && \
    mkdir /app && \
    chown colossus:colossus /app

USER colossus
WORKDIR /app

COPY --chown=node:node package.json yarn.lock ./

RUN yarn install --frozen-lockfile --prod --ignore-scripts && \
    ls -l

# COPY --chown=node:node . .
COPY --chown=node:node ./apps ./apps
COPY --chown=node:node ./libs ./libs
COPY --chown=node:node ./scripts ./scripts
COPY --chown=node:node ./tools ./tools
COPY --chown=node:node ./.prettierrc ./.prettierrc
COPY --chown=node:node ./nx.json ./nx.json
COPY --chown=node:node ./tsconfig.base.json ./tsconfig.base.json

COPY --chown=colossus:colossus node_modules/@bambu/colossus/prisma/central-db ./node_modules/@bambu/colossus/prisma/central-db

RUN ls -l
