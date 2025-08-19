# 🔧 Guide de test des logs de débogage

## 🚀 Utilisation rapide

### 1. Test automatique des endpoints

```bash
# Installer tsx si pas déjà fait
npm install -g tsx

# Lancer le serveur de dev
pnpm dev

# Dans un autre terminal, tester les endpoints
npx tsx scripts/test-debug.ts
```

### 2. Test manuel dans le navigateur

```bash
# Démarrer le serveur
pnpm dev

# Ouvrir le navigateur sur:
# http://localhost:5173/categories
# http://localhost:5173/kits
# http://localhost:5173/import
# http://localhost:5173/api/debug/db-test
```

### 3. Test sur Coolify

```bash
# Changer l'URL de base
BASE_URL=https://votre-domaine.com npx tsx scripts/test-debug.ts

# Ou directement
curl https://votre-domaine.com/api/debug/db-test
```

## 📊 Logs à surveiller

### Terminal du serveur (pnpm dev)

```
🚀 [HOOKS] Initialisation des hooks serveur
🔧 [HOOKS] Variables d'environnement: endpoint=DÉFINI...
🌐 [HOOKS] Requête entrante: GET /categories
📡 [API-CATEGORIES] Début GET /categories/api
✅ [API-CATEGORIES] Connexion Prisma établie
📊 [API-CATEGORIES] Données récupérées: count=42
```

### Console du navigateur (F12)

```
🔧 [DEBUG-LOGGER] Composant de debug initialisé
🌐 [DEBUG-LOGGER] Fetch intercepté: /categories/api
🌐 [DEBUG-LOGGER] Fetch réponse: status=200, duration=150ms
```

### Logs Coolify

```bash
coolify logs <container-name>
coolify logs <container-name> -f  # temps réel
coolify logs <container-name> | grep "❌"  # erreurs seulement
```

## 🎯 Diagnostic des erreurs 500

### Étapes de diagnostic

1. **Identifier le composant** qui échoue avec les préfixes `[HOOKS]`, `[API-*]`, etc.
2. **Localiser l'erreur** avec l'emoji ❌
3. **Analyser la stack trace** pour comprendre la cause
4. **Appliquer la solution** appropriée

### Causes fréquentes

**❌ [HOOKS] Variables d'environnement**

- Vérifier les secrets Logto dans Coolify
- Variables : `SECRET_LOGTO_*`

**❌ [API-*] Connexion Prisma**

- Vérifier `DATABASE_URL`
- Tester la connectivité PostgreSQL
- Vérifier les migrations

**❌ [DEBUG-LOGGER] Erreurs côté client**

- Problèmes réseau/CORS
- Données JSON malformées
- Erreurs JavaScript

## 🛠️ Actions correctives

### Variables d'environnement manquantes

```bash
# Dans Coolify, vérifier/ajouter:
SECRET_LOGTO_ENDPOINT=...
SECRET_LOGTO_APP_ID=...
SECRET_LOGTO_APP_SECRET=...
SECRET_LOGTO_COOKIE_ENCRYPTION_KEY=...
DATABASE_URL=...
```

### Test de connectivité BDD

```bash
# Endpoint de diagnostic
curl /api/debug/db-test

# Résultat attendu:
{
  "connection": true,
  "tables": {...},
  "views": {...},
  "errors": []
}
```

### Redéploiement après correction

```bash
# 1. Corriger les variables dans Coolify
# 2. Redéployer l'application
# 3. Vérifier les logs: coolify logs <container>
# 4. Tester: npx tsx scripts/test-debug.ts
```

Le système de logs va maintenant révéler précisément où se situent les erreurs 500 ! 🎯
