#!/bin/bash

# Script simple pour tester les logs de débogage
# Usage: ./scripts/test-logs.sh [URL_BASE]

BASE_URL="${1:-http://localhost:5173}"

echo "🔧 Test des logs de débogage - ImportData"
echo "=========================================="
echo "Base URL: $BASE_URL"
echo ""

# Fonction pour tester un endpoint
test_endpoint() {
    local path="$1"
    local url="$BASE_URL$path"
    
    echo "🧪 Test de $path..."
    
    if command -v curl >/dev/null 2>&1; then
        response=$(curl -s -w "HTTPSTATUS:%{http_code}" "$url" 2>/dev/null)
        status_code=$(echo "$response" | grep -o "HTTPSTATUS:[0-9]*" | cut -d: -f2)
        
        if [ "$status_code" = "200" ]; then
            echo "✅ $path - HTTP $status_code"
        else
            echo "❌ $path - HTTP $status_code"
        fi
    else
        echo "⚠️  curl non disponible, test manuel requis"
    fi
    echo ""
}

# Tests des endpoints principaux
echo "📡 Test des endpoints API:"
test_endpoint "/api/debug/db-test"
test_endpoint "/categories/api"
test_endpoint "/kits/api"

echo "📋 Instructions manuelles:"
echo "========================="
echo ""
echo "1. 🚀 Démarrer le serveur:"
echo "   pnpm dev"
echo ""
echo "2. 🌐 Ouvrir dans le navigateur:"
echo "   - $BASE_URL/categories"
echo "   - $BASE_URL/kits"
echo "   - $BASE_URL/import"
echo "   - $BASE_URL/api/debug/db-test"
echo ""
echo "3. 🔍 Vérifier les logs:"
echo "   - Terminal du serveur (emojis 🚀📡✅❌)"
echo "   - Console navigateur F12 (DEBUG-LOGGER)"
echo "   - Logs Coolify: coolify logs <container>"
echo ""
echo "4. 🎯 Chercher les erreurs:"
echo "   grep '❌' dans les logs"
echo "   Identifier le composant [HOOKS], [API-*], etc."
echo ""
echo "✅ Système de logs prêt pour diagnostic des erreurs 500 !"
