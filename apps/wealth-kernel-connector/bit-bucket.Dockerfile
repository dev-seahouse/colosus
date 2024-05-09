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

COPY --chown=colossus:colossus dist/apps/wealth-kernel-connector/package.json ./package.json
COPY --chown=colossus:colossus dist/apps/wealth-kernel-connector/yarn.lock ./yarn.lock

RUN yarn install --production --ignore-scripts --prefer-offline --frozen-lockfile && \
    yarn list

COPY --chown=colossus:colossus node_modules/@bambu/colossus/prisma/central-db ./node_modules/@bambu/colossus/prisma/central-db

COPY --chown=colossus:colossus dist/apps/wealth-kernel-connector ./apps/wealth-kernel-connector
COPY --chown=colossus:colossus dist/libs/@bambu ./libs/@bambu
COPY --chown=colossus:colossus dist/libs/shared ./libs/shared

RUN ls -l

EXPOSE 9001

ENV HOST=0.0.0.0
ENV PORT=9001

CMD [ "node", "./apps/wealth-kernel-connector/main.js" ]
