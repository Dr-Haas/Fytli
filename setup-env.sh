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

# Fonction pour créer le .env du backend
create_backend_env() {
    local ENV_FILE="$1"
    local ENV_TYPE="$2"
    
    echo -e "${BLUE}📝 Création de ${ENV_FILE}...${NC}"
    
    if [ "$ENV_TYPE" = "production" ]; then
        # Configuration PRODUCTION (OVH)
        cat > "$ENV_FILE" << 'EOF'
# ========================================
# CONFIGURATION PRODUCTION (OVH + RENDER)
# ========================================
# ⚠️ Sur Render: Définir ces variables dans Dashboard → Environment
# Ce fichier est pour référence uniquement

NODE_ENV=production

# Base de données OVH MySQL
DB_HOST=hg101756-001.eu.clouddb.ovh.net
DB_PORT=35419
DB_USER=admin
DB_PASSWORD=FytliApp2025
DB_NAME=lyfti

# JWT Secret
JWT_SECRET=YAPjoHksbZK87QcIInTwO1bVjqcY4hjw9+EkRLk/hNxB/yulgYMP7OZ2TjORCH1f8vTJkcSMEeayREH0gCy0Tw==

# CORS - Frontend URL
FRONTEND_URL=https://fytli-frontend.onrender.com

# Base URL pour les fichiers uploadés
BASE_URL=https://fytli.onrender.com

# Email (optionnel)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=
EMAIL_PASSWORD=

# Logging
LOG_LEVEL=info
EOF
    else
        # Configuration DÉVELOPPEMENT (Local)
        JWT_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))" 2>/dev/null || echo "generate_your_own_secret_here")
        
        cat > "$ENV_FILE" << EOF
# ========================================
# CONFIGURATION DÉVELOPPEMENT LOCAL
# ========================================

NODE_ENV=development
PORT=9001

# Base de données locale (ou OVH pour tests)
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=votre_mot_de_passe_mysql
DB_NAME=fytli_local
DB_PORT=3306

# JWT Secret (généré automatiquement)
JWT_SECRET=$JWT_SECRET

# Email (optionnel)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=
EMAIL_PASSWORD=

# Logging
LOG_LEVEL=debug
EOF
    fi
    
    echo -e "${GREEN}✅ ${ENV_FILE} créé${NC}"
}

# Fonction pour créer le .env du frontend
create_frontend_env() {
    local ENV_FILE="$1"
    local ENV_TYPE="$2"
    
    echo -e "${BLUE}📝 Création de ${ENV_FILE}...${NC}"
    
    if [ "$ENV_TYPE" = "production" ]; then
        cat > "$ENV_FILE" << 'EOF'
# Configuration Frontend Production
VITE_API_URL=https://fytli.onrender.com
EOF
    else
        cat > "$ENV_FILE" << 'EOF'
# Configuration Frontend Local
VITE_API_URL=http://localhost:9001
EOF
    fi
    
    echo -e "${GREEN}✅ ${ENV_FILE} créé${NC}"
}

# Menu principal
echo "Choisissez la configuration à créer:"
echo ""
echo "1) Développement LOCAL (toutes les apps)"
echo "2) Production OVH (référence pour Render)"
echo "3) Les deux"
echo "4) Quitter"
echo ""
read -p "Votre choix [1-4]: " choice

case $choice in
    1)
        echo ""
        echo -e "${YELLOW}📦 Configuration LOCALE${NC}"
        echo ""
        
        # Backend
        if [ -f "backend-fytli/.env" ]; then
            read -p "⚠️  backend-fytli/.env existe déjà. Écraser? [y/N]: " overwrite
            if [ "$overwrite" = "y" ] || [ "$overwrite" = "Y" ]; then
                create_backend_env "backend-fytli/.env" "local"
            else
                echo -e "${YELLOW}⏭️  Backend .env ignoré${NC}"
            fi
        else
            create_backend_env "backend-fytli/.env" "local"
        fi
        
        # Frontend
        if [ ! -f "frontend-fytli/.env" ]; then
            create_frontend_env "frontend-fytli/.env" "local"
        else
            echo -e "${YELLOW}⏭️  Frontend .env existe déjà${NC}"
        fi
        
        # Admin
        if [ ! -f "admin-panel/.env" ]; then
            create_frontend_env "admin-panel/.env" "local"
        else
            echo -e "${YELLOW}⏭️  Admin .env existe déjà${NC}"
        fi
        ;;
        
    2)
        echo ""
        echo -e "${YELLOW}🚀 Configuration PRODUCTION (OVH)${NC}"
        echo ""
        create_backend_env "backend-fytli/.env.production" "production"
        echo ""
        echo -e "${BLUE}📌 IMPORTANT:${NC}"
        echo -e "   Sur Render, copiez ces valeurs dans:"
        echo -e "   Dashboard → Environment → Add Environment Variable"
        echo -e "   ${RED}Ne PAS commit ce fichier avec les vraies valeurs!${NC}"
        ;;
        
    3)
        echo ""
        echo -e "${YELLOW}📦 Configuration COMPLÈTE${NC}"
        echo ""
        create_backend_env "backend-fytli/.env" "local"
        create_backend_env "backend-fytli/.env.production" "production"
        create_frontend_env "frontend-fytli/.env" "local"
        create_frontend_env "admin-panel/.env" "local"
        ;;
        
    4)
        echo "👋 Au revoir!"
        exit 0
        ;;
        
    *)
        echo -e "${RED}❌ Choix invalide${NC}"
        exit 1
        ;;
esac

>>>>>>> AppMobil
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

