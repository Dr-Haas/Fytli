#!/bin/bash

# Script de vérification de la configuration locale Fytli
# Ce script vérifie que tous les fichiers de configuration sont correctement configurés

echo "🔍 Vérification de la configuration locale Fytli..."
echo ""

# Couleurs
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Compteurs
ERRORS=0
WARNINGS=0

# Fonction pour afficher les résultats
check_result() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✅ $2${NC}"
    else
        echo -e "${RED}❌ $2${NC}"
        ERRORS=$((ERRORS + 1))
    fi
}

warn_result() {
    echo -e "${YELLOW}⚠️  $1${NC}"
    WARNINGS=$((WARNINGS + 1))
}

echo "📂 Vérification des fichiers .env..."
echo ""

# Vérifier frontend-fytli/.env
if [ -f "frontend-fytli/.env" ]; then
    check_result 0 "frontend-fytli/.env existe"
    
    # Vérifier le contenu
    if grep -q "VITE_API_URL=http://localhost:9001" "frontend-fytli/.env"; then
        check_result 0 "VITE_API_URL configuré sur http://localhost:9001"
    else
        check_result 1 "VITE_API_URL NON configuré correctement"
    fi
else
    check_result 1 "frontend-fytli/.env n'existe pas"
fi

echo ""

# Vérifier admin-panel/.env
if [ -f "admin-panel/.env" ]; then
    check_result 0 "admin-panel/.env existe"
    
    # Vérifier le contenu
    if grep -q "VITE_API_URL=http://localhost:9001" "admin-panel/.env"; then
        check_result 0 "VITE_API_URL configuré sur http://localhost:9001"
    else
        check_result 1 "VITE_API_URL NON configuré correctement"
    fi
else
    check_result 1 "admin-panel/.env n'existe pas"
fi

echo ""

# Vérifier backend-fytli/.env
if [ -f "backend-fytli/.env" ]; then
    check_result 0 "backend-fytli/.env existe"
    
    # Vérifier PORT
    if grep -q "^PORT=9001" "backend-fytli/.env"; then
        check_result 0 "PORT configuré sur 9001"
    else
        check_result 1 "PORT NON configuré sur 9001"
    fi
    
    # Vérifier BASE_URL
    if grep -q "BASE_URL=http://localhost:9001" "backend-fytli/.env"; then
        check_result 0 "BASE_URL configuré sur http://localhost:9001"
    else
        warn_result "BASE_URL peut ne pas être configuré pour localhost"
    fi
    
    # Vérifier FRONTEND_URL
    if grep -q "FRONTEND_URL=http://localhost:5173" "backend-fytli/.env"; then
        check_result 0 "FRONTEND_URL configuré sur http://localhost:5173"
    else
        check_result 1 "FRONTEND_URL NON configuré correctement (devrait être 5173)"
    fi
    
    # Vérifier DB_HOST
    if grep -q "^DB_HOST=" "backend-fytli/.env"; then
        check_result 0 "DB_HOST configuré"
    else
        check_result 1 "DB_HOST NON configuré"
    fi
else
    check_result 1 "backend-fytli/.env n'existe pas"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Vérifier si le backend est démarré
echo "🔍 Vérification du backend..."
if curl -s http://localhost:9001 > /dev/null 2>&1; then
    check_result 0 "Backend accessible sur http://localhost:9001"
else
    warn_result "Backend NON accessible (assurez-vous qu'il est démarré)"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Résumé
if [ $ERRORS -eq 0 ]; then
    echo -e "${GREEN}✅ Configuration validée ! Aucune erreur détectée.${NC}"
else
    echo -e "${RED}❌ $ERRORS erreur(s) détectée(s)${NC}"
fi

if [ $WARNINGS -gt 0 ]; then
    echo -e "${YELLOW}⚠️  $WARNINGS avertissement(s)${NC}"
fi

echo ""
echo "📖 Pour plus d'informations, consultez CONFIGURATION_LOCALE.md"
echo ""

exit $ERRORS

