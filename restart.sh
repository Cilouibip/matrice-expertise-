#!/bin/bash
echo "🔄 Redémarrage du serveur Next.js..."

echo "📛 Arrêt des processus sur le port 3001..."
lsof -ti:3001 | xargs kill -9 2>/dev/null || true

echo "🧹 Nettoyage du cache..."
rm -rf .next
rm -rf node_modules/.cache

echo "🚀 Démarrage du serveur..."
npm run dev -- -p 3001 &

echo "⏳ Attente du démarrage..."
sleep 4
open http://localhost:3001
