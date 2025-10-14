#!/bin/bash

# ------------------------------
# Backup automatique GMAO + seed
# ------------------------------

# Config
DOCKER_CONTAINER="gmao-db"
DB_NAME="gmao"
DB_USER="postgres"
BACKUP_DIR="/home/admdocker/gmao/Projet-GMAO/backups"       # historique
SEED_DIR="/home/admdocker/gmao/Projet-GMAO/back/prisma/seed"     # dernier dump pour seed
RETENTION_DAYS=7

# Création des dossiers si besoin
mkdir -p "$BACKUP_DIR"
mkdir -p "$SEED_DIR"

# Timestamp + noms de fichiers
TIMESTAMP=$(date +'%Y%m%d_%H%M')
BACKUP_FILE="$BACKUP_DIR/dump-gmao-$TIMESTAMP.sql"
SEED_FILE="$SEED_DIR/dump-gmao-data.sql"

# --- Dump SQL ---
echo "Export de la base '$DB_NAME'..."
docker exec -t "$DOCKER_CONTAINER" pg_dump -U "$DB_USER" --data-only --no-owner --no-acl --format=plain "$DB_NAME" > "$BACKUP_FILE"

if [[ -f "$BACKUP_FILE" ]]; then
    echo "Sauvegarde OK : $BACKUP_FILE"

    # Supprime l’ancien seed et copie le dernier
    rm -f "$SEED_FILE"
    cp "$BACKUP_FILE" "$SEED_FILE"
    echo "Seed mis à jour : $SEED_FILE"
else
    echo "❌ Erreur dump"
    exit 1
fi

# --- Nettoyage des anciens backups ---
echo "Suppression des backups de +$RETENTION_DAYS jours..."
find "$BACKUP_DIR" -type f -name "dump-gmao-*.sql" -mtime +$RETENTION_DAYS -exec rm -f {} \;

echo "✅ Backup + Seed terminé."


# INFOS IMPORTANTES :

# Instructions pour automatisation

# Rendre le script exécutable :
# chmod +x /home/admdocker/gmao/Projet-GMAO/scripts/backup-gmao.sh

# Planifier le script avec cron (exemple : tous les jours à 2h00) :
# crontab -e

# Puis ajouter la ligne :
# 0 2 * * * /home/admdocker/gmao/Projet-GMAO/scripts/backup-gmao.sh

# Logs : tout est enregistré dans /home/admdocker/gmao/Projet-GMAO/scripts/backup-gmao.sh