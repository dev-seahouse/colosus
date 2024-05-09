# syntax = docker/dockerfile:1.2

FROM --platform=$BUILDPLATFORM node:18.17.1-alpine3.18 as base

# Patch OS Lib Issues and set workdir
RUN apk update && \
    apk upgrade && \
    mkdir /app && \
    chown node:node /app

USER node
WORKDIR /app

# We are doing this because we want to cache the node_modules more effectively.
# Prior to this, we just did "COPY --chown=node:node . ." and then "yarn install --frozen-lockfile".
# The issue here is that even a small change in the codebase will invalidate all the cache after that command,
# even if dependencies never changed.
# So, we are doing a two-step process here:
# 1. Copy only the package.json and yarn.lock files, and install dependencies.
# 2. Copy the rest of the codebase and install dependencies again.
#    This is for the prepare command that generates the Prisma client.
# This way, we can cache the dependencies more effectively.
# Ref: https://docs.docker.com/build/cache/#order-your-layers

COPY --chown=node:node package.json yarn.lock ./

RUN yarn install --frozen-lockfile --ignore-scripts --prefer-offline && \
    yarn list

# COPY --chown=node:node . .
COPY --chown=node:node ./apps ./apps
COPY --chown=node:node ./libs ./libs
COPY --chown=node:node ./scripts ./scripts
COPY --chown=node:node ./tools ./tools
COPY --chown=node:node ./.prettierrc ./.prettierrc
COPY --chown=node:node ./nx.json ./nx.json
COPY --chown=node:node ./tsconfig.base.json ./tsconfig.base.json

RUN yarn prepare:db-schema-generator && ls -l

FROM --platform=$BUILDPLATFORM base as builder

RUN yarn nx run-many --target=build --projects=wealth-kernel-connector --verbose && ls -l

FROM --platform=$BUILDPLATFORM base as deps

RUN yarn install --frozen-lockfile --ignore-scripts --prod && \
    ls -l

FROM --platform=$BUILDPLATFORM node:18.17.1-alpine3.18

# Patch OS Lib Issues and set workdir
RUN apk update && \
    apk upgrade && \
    addgroup --system colossus && \
    adduser --system -G colossus colossus && \
    mkdir /app && \
    chown colossus:colossus /app

USER colossus
WORKDIR /app

COPY --chown=colossus:colossus --from=deps /app/node_modules ./node_modules
COPY --chown=colossus:colossus --from=builder /app/node_modules/@bambu/colossus/prisma/central-db ./node_modules/@bambu/colossus/prisma/central-db
COPY --chown=colossus:colossus --from=builder /app/dist/apps/wealth-kernel-connector ./apps/wealth-kernel-connector
COPY --chown=colossus:colossus --from=builder /app/dist/libs/@bambu ./libs/@bambu
COPY --chown=colossus:colossus --from=builder /app/dist/libs/shared ./libs/shared

RUN ls -l

EXPOSE 9001

ENV HOST=0.0.0.0
ENV PORT=9001

CMD [ "node", "./apps/wealth-kernel-connector/main.js" ]
