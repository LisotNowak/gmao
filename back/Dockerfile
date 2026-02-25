# Builder
FROM node:18-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci --prefer-offline --no-audit

COPY . .

# Build TypeScript without running prisma generate
RUN npm run build

# Image finale
FROM node:18-alpine
WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY package*.json ./

ENV NODE_ENV=production
ENV DATABASE_URL=${DATABASE_URL}

# Installation du client PSQL
RUN apk add --no-cache postgresql-client bash

# Copier le dump de données dans le container
COPY prisma/seed/dump-gmao-data.sql /tmp/dump-gmao-data.sql
COPY prisma/seed/cleanup.sql /tmp/cleanup.sql
COPY prisma/seed/finalize.sql /tmp/finalize.sql

# Appliquer les migrations puis le dump de données puis démarrer le serveur
CMD sh -c "\
    echo 'Generating Prisma client...' && \
    node --max-old-space-size=4096 node_modules/.bin/prisma generate && \
    echo 'Running migrations...' && \
    npx prisma migrate deploy && \
    if [ \"\$RESET_DATABASE\" = \"true\" ]; then echo 'Cleaning up data...' && psql \$DATABASE_URL -f /tmp/cleanup.sql && echo 'Restoring data...' && psql \$DATABASE_URL -f /tmp/dump-gmao-data.sql && echo 'Finalizing sequences...' && psql \$DATABASE_URL -f /tmp/finalize.sql; fi && \
    echo 'Starting application...' && \
    node dist/app.js \
"
