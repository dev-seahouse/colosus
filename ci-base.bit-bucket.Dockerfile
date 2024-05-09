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

COPY --chown=colossus:colossus . .

RUN yarn install --frozen-lockfile --prod --ignore-scripts && \
    ls -l

