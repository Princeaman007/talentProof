#!/bin/bash
# Script de test des correctifs Phase 2

echo "🧪 Test Phase 2 - Correctifs Implémentés"
echo "=========================================="

# Test 1: Vérifier que le serveur démarre
echo ""
echo "1️⃣ Démarrage du serveur..."
cd backend
npm start &
BACKEND_PID=$!
sleep 3

# Test 2: Health check
echo ""
echo "2️⃣ Vérification de la santé du serveur..."
curl -s http://localhost:5000/api/health | jq '.'

# Test 3: Documentation Swagger
echo ""
echo "3️⃣ Accès à Swagger..."
echo "📚 Ouvrir: http://localhost:5000/api-docs"

# Test 4: Test d'authentification avec gestion d'erreurs
echo ""
echo "4️⃣ Test validation ErrorHandler..."
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "invalid-email",
    "password": "short"
  }' | jq '.error'

# Test 5: Test pagination
echo ""
echo "5️⃣ Test pagination sécurisée..."
curl -s 'http://localhost:5000/api/talents?page=1&limit=50000' \
  | jq '.pagination.limit' # Doit être 100 max

# Cleanup
echo ""
echo "🛑 Arrêt du serveur..."
kill $BACKEND_PID

echo ""
echo "✅ Tests terminés!"
