# Configuration Docker Compose - Local vs Production

## Mode Production (compose.yml)
- Ports non exposés (utilise un reverse proxy externe)
- NODE_ENV: production
- VITE_API_URL: /api (relatif au domaine)
- Réseaux: gmao-network + npm-network

## Mode Développement Local

### Prérequis
- Docker Desktop installé
- Port 5173 disponible (frontend)
- Port 3000 disponible (backend)
- Port 5432 disponible (PostgreSQL)
- Port 5050 disponible (pgAdmin)

### Démarrage

1. **Copier le fichier .env.example en .env:**
```bash
copy .env.example .env
```

2. **Démarrer les conteneurs:**
```bash
docker-compose up -d
```

> Le fichier `docker-compose.override.yml` est automatiquement chargé et configure les ports pour le développement local.

### URLs locales
- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:3000
- **API**: http://localhost:3000/api
- **pgAdmin**: http://localhost:5050
- **Database**: localhost:5432

### Variables d'environnement (.env)

```env
NODE_ENV=development              # development ou production
BACKEND_PORT=3000                # Port backend (local)
FRONTEND_PORT=5173               # Port frontend (local)
DB_PORT=5432                     # Port PostgreSQL (local)
PGADMIN_PORT=5050                # Port pgAdmin (local)
VITE_API_URL=http://localhost:3000/api   # URL API vue du frontend
```

### Modifications importantes

✅ **compose.yml** - Config production
- Ajout de variables d'environnement (NODE_ENV, BACKEND_PORT, FRONTEND_PORT, VITE_API_URL)
- `expose` remplacé par `ports` pour exposer les services localement

✅ **docker-compose.override.yml** - Config locale (automatique)
- Expose tous les ports
- Définit NODE_ENV=development
- Override les ports avec les valeurs du .env

✅ **.env.example** - Template variables

### Troubleshooting

**Port déjà utilisé:**
```bash
# Changer dans .env
FRONTEND_PORT=3001
BACKEND_PORT=3001
```

**Voir les logs:**
```bash
docker-compose logs -f frontend
docker-compose logs -f backend
docker-compose logs -f db
```

**Rebuilder après changements:**
```bash
docker-compose up --build
```

**Arrêter les conteneurs:**
```bash
docker-compose down
```

### Notes importantes
- Le fichier `docker-compose.override.yml` ne doit **PAS** être versionné en production
- Ajouter `docker-compose.override.yml` au .gitignore si ce n'est pas déjà fait
- En production, seul `compose.yml` doit être utilisé
