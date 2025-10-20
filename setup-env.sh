#!/bin/bash

# Script de configuration automatique des variables d'environnement PRODUCTION
# Usage: bash setup-env.sh

set -e

echo "🚀 Configuration PRODUCTION - Fytli sur Render"
echo "===================================================="
echo ""

# Couleurs
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}⚠️  Ce script affiche les variables d'environnement à configurer sur Render${NC}"
echo ""
echo "===================================================="
echo -e "${BLUE}VARIABLES D'ENVIRONNEMENT BACKEND${NC}"
echo "===================================================="
echo ""
echo "Copiez ces variables dans Render Dashboard → fytli-backend → Environment:"
echo ""
echo "NODE_ENV=production"
echo ""
echo "# Base de données OVH MySQL"
echo "DB_HOST=hg101756-001.eu.clouddb.ovh.net"
echo "DB_PORT=35419"
echo "DB_USER=admin"
echo "DB_PASSWORD=FytliApp2025"
echo "DB_NAME=lyfti"
echo ""
echo "# JWT Secret"
echo "JWT_SECRET=YAPjoHksbZK87QcIInTwO1bVjqcY4hjw9+EkRLk/hNxB/yulgYMP7OZ2TjORCH1f8vTJkcSMEeayREH0gCy0Tw=="
echo ""
echo "# CORS - Frontend URL"
echo "FRONTEND_URL=https://fytli-frontend.onrender.com"
echo ""
echo "# Base URL pour les fichiers uploadés"
echo "BASE_URL=https://fytli.onrender.com"
echo ""
echo "# Email (optionnel)"
echo "EMAIL_HOST=smtp.gmail.com"
echo "EMAIL_PORT=587"
echo "EMAIL_USER="
echo "EMAIL_PASSWORD="
echo ""
echo "===================================================="
echo -e "${BLUE}VARIABLES D'ENVIRONNEMENT FRONTEND${NC}"
echo "===================================================="
echo ""
echo "Copiez cette variable dans Render Dashboard → fytli-frontend → Environment:"
echo ""
echo "VITE_API_URL=https://fytli.onrender.com"
echo ""
echo "===================================================="
echo -e "${BLUE}VARIABLES D'ENVIRONNEMENT ADMIN PANEL${NC}"
echo "===================================================="
echo ""
echo "Copiez cette variable dans Render Dashboard → fytli-admin → Environment:"
echo ""
echo "VITE_API_URL=https://fytli.onrender.com"
echo ""
echo "===================================================="
echo -e "${GREEN}✅ Instructions${NC}"
echo "===================================================="
echo ""
echo "1. Allez sur https://dashboard.render.com"
echo "2. Pour chaque service (backend, frontend, admin):"
echo "   - Cliquez sur le service"
echo "   - Allez dans 'Environment'"
echo "   - Cliquez sur 'Add Environment Variable'"
echo "   - Copiez-collez chaque variable ci-dessus"
echo "3. Sauvegardez et redéployez chaque service"
echo ""
echo -e "${RED}⚠️  SÉCURITÉ: Ne jamais commit les fichiers .env avec les vraies valeurs!${NC}"
echo "===================================================="

