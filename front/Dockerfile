# Étape 1 : builder
FROM node:18-alpine AS builder
WORKDIR /app

# Copier package.json et package-lock.json / pnpm-lock.yaml si nécessaire
COPY front/package*.json ./

# Installer les dépendances
RUN npm install

# Copier le reste du projet frontend
COPY front/ .

# Définir la variable d'environnement pour l'API
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

# Lancer le build Vite + TypeScript
RUN npm run build

# Étape 2 : Nginx
FROM nginx:alpine

# Copier le build du frontend
COPY --from=builder /app/dist /usr/share/nginx/html

# Copier le template nginx (traité via envsubst au démarrage)
COPY ./nginx/nginx.conf.template /etc/nginx/templates/default.conf.template

# Exposer le port 80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
