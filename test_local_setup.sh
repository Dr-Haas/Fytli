#!/bin/bash

# Script de test local - Composition Corporelle

echo "🔵 === TEST LOCAL SETUP ==="
echo ""

# 1. Vérifier que MySQL est accessible
echo "1️⃣ Test connexion MySQL..."
if mysql -u root -e "SELECT 1" > /dev/null 2>&1; then
    echo "✅ MySQL accessible (sans mot de passe)"
    MYSQL_CMD="mysql -u root"
else
    echo "⚠️  MySQL nécessite un mot de passe"
    MYSQL_CMD="mysql -u root -p"
fi

# 2. Vérifier quelle base existe
echo ""
echo "2️⃣ Vérification des bases de données..."
$MYSQL_CMD -e "SHOW DATABASES LIKE 'lyfti';" 2>/dev/null | grep -q "lyfti"
if [ $? -eq 0 ]; then
    echo "✅ Base 'lyfti' existe"
    DB_NAME="lyfti"
else
    $MYSQL_CMD -e "SHOW DATABASES LIKE 'followSport_app';" 2>/dev/null | grep -q "followSport_app"
    if [ $? -eq 0 ]; then
        echo "✅ Base 'followSport_app' existe"
        DB_NAME="followSport_app"
    else
        echo "❌ Aucune base trouvée"
        exit 1
    fi
fi

# 3. Vérifier si les tables body_* existent
echo ""
echo "3️⃣ Vérification des tables body_*..."
TABLE_COUNT=$($MYSQL_CMD -D $DB_NAME -e "SHOW TABLES LIKE 'body_%';" 2>/dev/null | wc -l)

if [ $TABLE_COUNT -gt 1 ]; then
    echo "✅ Tables body_* trouvées ($((TABLE_COUNT - 1)) tables)"
    $MYSQL_CMD -D $DB_NAME -e "SHOW TABLES LIKE 'body_%';"
else
    echo "❌ Tables body_* NON trouvées"
    echo ""
    echo "📋 Exécution de la migration..."
    
    if [ -f "MIGRATION_BODY_COMPOSITION_OVH_SAFE.sql" ]; then
        $MYSQL_CMD $DB_NAME < MIGRATION_BODY_COMPOSITION_OVH_SAFE.sql
        
        if [ $? -eq 0 ]; then
            echo "✅ Migration exécutée avec succès"
        else
            echo "❌ Erreur lors de la migration"
            exit 1
        fi
    else
        echo "❌ Fichier MIGRATION_BODY_COMPOSITION_OVH_SAFE.sql introuvable"
        exit 1
    fi
fi

# 4. Vérifier le .env du backend
echo ""
echo "4️⃣ Vérification configuration backend..."
if [ -f "backend-fytli/.env" ]; then
    DB_NAME_ENV=$(grep "^DB_NAME=" backend-fytli/.env | cut -d'=' -f2)
    echo "   DB_NAME dans .env: $DB_NAME_ENV"
    
    if [ "$DB_NAME_ENV" != "$DB_NAME" ]; then
        echo "⚠️  ATTENTION: Le .env utilise '$DB_NAME_ENV' mais la base trouvée est '$DB_NAME'"
    fi
else
    echo "⚠️  Fichier backend-fytli/.env introuvable"
fi

echo ""
echo "🎯 === RÉSUMÉ ==="
echo "   Base de données: $DB_NAME"
echo "   Tables body_*: OK"
echo ""
echo "✅ Vous pouvez maintenant démarrer le backend:"
echo "   cd backend-fytli && npm start"

