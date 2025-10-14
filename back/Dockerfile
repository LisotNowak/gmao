# Builder
FROM node:18-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm install
COPY . .

ARG POSTGRES_USER
ARG POSTGRES_PASSWORD
ARG POSTGRES_DB

# Définir DATABASE_URL pour prisma generate
# ENV DATABASE_URL=postgresql://$POSTGRES_USER:$POSTGRES_PASSWORD@db:5432/$POSTGRES_DB

# Générer Prisma client dans node_modules/.prisma/client
RUN npx prisma generate

# Build TypeScript
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
RUN apk add --no-cache postgresql-client

# Copier le dump de données dans le container
COPY prisma/seed/dump-gmao-data.sql /tmp/dump-gmao-data.sql

# Appliquer les migrations puis le dump de données puis démarrer le serveur
CMD sh -c "\
    npx prisma migrate deploy && \
    psql $DATABASE_URL -f /tmp/dump-gmao-data.sql && \
    node dist/app.js \
"
