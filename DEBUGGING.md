# 🔧 Guide de débogage - ImportData

## 📋 Système de logs mis en place

Le système de logs complet a été ajouté pour diagnostiquer les erreurs 500 sur l'environnement Coolify.

### 🎯 Objectif

Identifier précisément où se produisent les erreurs 500 :

- Authentification Logto
- Connexion base de données Prisma
- Chargement des pages
- Appels API
- Erreurs côté client

## 🔍 Structure des logs

### Côté serveur

**Format:** `[COMPOSANT] Message détaillé`

- `🚀 [HOOKS]` - Authentification et middleware
- `🔧 [CATEGORIES]` - Page catégories (load function)
- `🔧 [KITS]` - Page kits (load function)
- `🔧 [IMPORT]` - Page import (load function)
- `📡 [API-CATEGORIES]` - Endpoints API catégories
- `📡 [API-KITS]` - Endpoints API kits
- `🔍 [DB-TEST]` - Tests de connectivité base de données

**Émojis utilisés:**

- 🚀 Démarrage/initialisation
- 📡 Appels API/réseau
- 📊 Données récupérées
- ✅ Succès
- ❌ Erreurs
- 🔍 Vérifications
- 🔌 Connexions/déconnexions

### Côté client

**Format:** `[DEBUG-LOGGER] ou [FETCH-CONTEXT]`

- Interception des erreurs JavaScript
- Logs détaillés des appels fetch
- Changements de page
- Promesses rejetées

## 🎯 Comment utiliser

### 1. Sur l'environnement local

```bash
# Démarrer le serveur
pnpm dev

# Ouvrir la console navigateur (F12)
# Naviguer sur les pages problématiques
# Observer les logs dans le terminal ET la console
```

### 2. Sur Coolify

```bash
# Consulter les logs du container
coolify logs <nom-du-container>

# Ou en temps réel
coolify logs <nom-du-container> -f

# Filtrer par composant
coolify logs <nom-du-container> | grep "\[HOOKS\]"
coolify logs <nom-du-container> | grep "❌"
```

### 3. Tests de connectivité

Endpoint spécial créé : `/api/debug/db-test`

- Teste la connexion Prisma
- Vérifie toutes les tables
- Compte les enregistrements
- Retourne un rapport JSON complet

```bash
curl http://localhost:5173/api/debug/db-test
# ou sur Coolify
curl https://votre-domaine.com/api/debug/db-test
```

## 🔧 Points de contrôle

### Variables d'environnement Logto

```
[HOOKS] Variables d'environnement:
  endpoint: DÉFINI/NON DÉFINI
  appId: DÉFINI/NON DÉFINI
  appSecret: DÉFINI/NON DÉFINI
  encryptionKey: DÉFINI/NON DÉFINI
```

### Connexion base de données

```
[API-CATEGORIES] Vérification de la connexion Prisma
[API-CATEGORIES] Connexion Prisma établie
[API-CATEGORIES] Données récupérées: count=42
```

### Authentification utilisateur

```
[HOOKS] État utilisateur après auth:
  userExists: true/false
  userId: xxx
  userEmail: xxx
```

## 🚨 Diagnostic des erreurs 500

### 1. Erreur d'authentification

**Rechercher:** `[HOOKS]` + `❌`
**Causes possibles:**

- Variables d'environnement Logto manquantes
- Problème de connexion avec le serveur Logto
- Clé de chiffrement invalide

### 2. Erreur de base de données

**Rechercher:** `[API-*]` + `Prisma` + `❌`
**Causes possibles:**

- DATABASE_URL incorrect
- Serveur PostgreSQL inaccessible
- Schéma de base manquant

### 3. Erreur de chargement de page

**Rechercher:** `[CATEGORIES|KITS|IMPORT]` + `❌`
**Causes possibles:**

- Échec de l'appel API interne
- Validation SuperForms échouée
- Données corrompues

### 4. Erreur côté client

**Rechercher:** `[DEBUG-LOGGER]` + `❌`
**Causes possibles:**

- Erreurs JavaScript
- Problèmes réseau/CORS
- Données JSON malformées

## 📋 Checklist de débogage

### ✅ Avant déploiement

- [ ] Tester localement avec `pnpm dev`
- [ ] Vérifier `/api/debug/db-test` fonctionne
- [ ] Observer les logs dans la console navigateur
- [ ] Tester les 3 pages principales (categories, kits, import)

### ✅ Après déploiement

- [ ] Vérifier les variables d'environnement dans Coolify
- [ ] Consulter les logs : `coolify logs <container>`
- [ ] Tester l'endpoint de debug : `curl .../api/debug/db-test`
- [ ] Identifier le premier `❌` dans les logs

## 🎯 Exemple de diagnostic

```bash
# Logs Coolify montrent:
❌ [HOOKS] Erreur dans le handle: Error: fetch failed
❌ [API-CATEGORIES] Erreur lors de la récupération: connect ECONNREFUSED

# Diagnostic: Problème de connexion réseau/BDD
# Solution: Vérifier DATABASE_URL et connectivité PostgreSQL
```

## 📞 Résolution rapide

**Erreur 500 systématique :**

1. Consulter `coolify logs`
2. Chercher le premier `❌`
3. Identifier le composant `[XXX]`
4. Appliquer la solution correspondante

Le système de logs est maintenant exhaustif pour identifier rapidement la cause des erreurs 500 !
