#!/bin/bash

# Script d'installation automatique pour Fytli
# Usage: bash install.sh

set -e

echo "🏋️ Installation de Fytli - Application de suivi sportif"
echo "=================================================="
echo ""

# Vérifier Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js n'est pas installé"
    echo "   Installer Node.js 20+ depuis https://nodejs.org"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 20 ]; then
    echo "⚠️  Node.js version $NODE_VERSION détectée. Version 20+ recommandée."
fi

echo "✅ Node.js $(node -v) détecté"
echo "✅ npm $(npm -v) détecté"
echo ""

# Fonction pour installer un projet
install_project() {
    local project_name=$1
    local project_path=$2
    
    echo "📦 Installation de $project_name..."
    cd "$project_path"
    
    if [ -d "node_modules" ]; then
        echo "   node_modules existe déjà, nettoyage..."
        rm -rf node_modules package-lock.json
    fi
    
    npm install
    
    if [ $? -eq 0 ]; then
        echo "   ✅ $project_name installé avec succès"
    else
        echo "   ❌ Erreur lors de l'installation de $project_name"
        exit 1
    fi
    
    cd - > /dev/null
    echo ""
}

# Répertoire du script
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
cd "$SCRIPT_DIR"

# Installation du Frontend
if [ -d "frontend-followsport" ]; then
    install_project "Frontend" "$SCRIPT_DIR/frontend-followsport"
else
    echo "⚠️  Dossier frontend-followsport introuvable"
fi

# Installation de l'Admin Panel
if [ -d "admin-panel" ]; then
    install_project "Admin Panel" "$SCRIPT_DIR/admin-panel"
else
    echo "⚠️  Dossier admin-panel introuvable"
fi

# Installation du Backend
if [ -d "backend-followsport" ]; then
    install_project "Backend" "$SCRIPT_DIR/backend-followsport"
else
    echo "⚠️  Dossier backend-followsport introuvable"
fi

echo "=================================================="
echo "🎉 Installation terminée avec succès !"
echo ""
echo "📝 Prochaines étapes :"
echo ""
echo "1. Configurer la base de données MySQL :"
echo "   mysql -u root -p < backend-followsport/database/enrollment_system.sql"
echo ""
echo "2. Créer les fichiers .env :"
echo "   - backend-followsport/.env"
echo "   - frontend-followsport/.env"
echo "   - admin-panel/.env"
echo ""
echo "3. Lancer les applications :"
echo "   Backend:   cd backend-followsport && npm run dev"
echo "   Frontend:  cd frontend-followsport && npm run dev"
echo "   Admin:     cd admin-panel && npm run dev"
echo ""
echo "📚 Consulter COMMANDS.md pour plus d'informations"
echo "=================================================="

