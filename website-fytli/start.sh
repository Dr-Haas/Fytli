#!/bin/bash

# Script de lancement rapide pour la Landing Page Fytli
# Usage: ./start.sh

echo "🚀 Lancement de la Landing Page Fytli"
echo "======================================"
echo ""

# Vérifier si .env.local existe
if [ ! -f .env.local ]; then
    echo "⚠️  Le fichier .env.local n'existe pas."
    echo "📝 Création du fichier .env.local..."
    echo "NEXT_PUBLIC_API_URL=http://localhost:9001" > .env.local
    echo "✅ Fichier .env.local créé !"
    echo ""
fi

# Vérifier si node_modules existe
if [ ! -d node_modules ]; then
    echo "📦 Installation des dépendances..."
    npm install
    echo ""
fi

# Vérifier si le backend est accessible
echo "🔍 Vérification du backend..."
if curl -s http://localhost:9001 > /dev/null 2>&1; then
    echo "✅ Backend accessible sur http://localhost:9001"
else
    echo "⚠️  Backend non accessible sur http://localhost:9001"
    echo "⚠️  Lancez d'abord le backend avec : cd ../backend-followsport && npm start"
    echo ""
    read -p "Continuer quand même ? (o/n) " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Oo]$ ]]; then
        exit 1
    fi
fi

echo ""
echo "🎨 Démarrage de la landing page..."
echo "📍 URL : http://localhost:3000"
echo ""
echo "Pour arrêter : Ctrl+C"
echo "======================================"
echo ""

# Lancer le serveur de développement
npm run dev

