#!/bin/bash

# Script de configuration automatique des variables d'environnement
# Usage: bash setup-env.sh

set -e

echo "🔐 Configuration des variables d'environnement - Fytli"
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
DB_HOST=recovvkfytli.mysql.db
DB_PORT=3306
DB_USER=recovvkfytli
DB_PASSWORD=FytliApp2025
DB_NAME=recovvkfytli

# JWT Secret
JWT_SECRET=01af8cee94dfbbb8f55d3391090ebb4a5be1c182620cc84b1eeba3ed3aa522a9

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
DB_NAME=followsport_local
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
VITE_API_URL=https://votre-backend.onrender.com
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
        if [ -f "backend-followsport/.env" ]; then
            read -p "⚠️  backend-followsport/.env existe déjà. Écraser? [y/N]: " overwrite
            if [ "$overwrite" = "y" ] || [ "$overwrite" = "Y" ]; then
                create_backend_env "backend-followsport/.env" "local"
            else
                echo -e "${YELLOW}⏭️  Backend .env ignoré${NC}"
            fi
        else
            create_backend_env "backend-followsport/.env" "local"
        fi
        
        # Frontend
        if [ ! -f "frontend-followsport/.env" ]; then
            create_frontend_env "frontend-followsport/.env" "local"
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
        create_backend_env "backend-followsport/.env.production" "production"
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
        create_backend_env "backend-followsport/.env" "local"
        create_backend_env "backend-followsport/.env.production" "production"
        create_frontend_env "frontend-followsport/.env" "local"
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

echo ""
echo "===================================================="
echo -e "${GREEN}✅ Configuration terminée!${NC}"
echo ""
echo "📝 Prochaines étapes:"
echo ""
echo "1. Vérifier les fichiers .env créés"
echo "2. Modifier les mots de passe si nécessaire"
echo "3. Backend: cd backend-followsport && npm run dev"
echo "4. Frontend: cd frontend-followsport && npm run dev"
echo ""
echo "📚 Documentation: ENV_CONFIG.md"
echo "===================================================="

