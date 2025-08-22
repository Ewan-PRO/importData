# Scripts de récupération des données Cenov

Ce dossier contient des scripts pour récupérer toutes les données de la base de données Cenov (schéma public) en mode **lecture seule**.

## Scripts disponibles

### 📊 `fetch-all-tables.mjs`
Récupère toutes les données des tables du schéma public.

**Utilisation :**
```bash
node scripts/fetch-all-tables.mjs
```

**Fonctionnalités :**
- Liste toutes les tables du schéma public
- Récupère toutes les données de chaque table (SELECT uniquement)
- Sauvegarde les résultats en JSON avec horodatage
- Affiche un résumé détaillé avec comptage des lignes

### 👁️ `fetch-all-views.mjs`
Récupère toutes les données des vues (normales et matérialisées) du schéma public.

**Utilisation :**
```bash
node scripts/fetch-all-views.mjs
```

**Fonctionnalités :**
- Liste toutes les vues et vues matérialisées du schéma public
- Récupère les données, définitions et structures des colonnes
- Sauvegarde les résultats en JSON avec métadonnées complètes
- Distingue les vues normales des vues matérialisées

### 🚀 `fetch-cenov-data.mjs` (Script principal)
Script principal qui récupère **toutes les données** (tables + vues) en une seule exécution.

**Utilisation :**
```bash
node scripts/fetch-cenov-data.mjs
```

**Fonctionnalités :**
- Exécute les deux scripts précédents en parallèle
- Récupère les informations générales sur la base de données
- Génère un rapport complet avec résumé et métriques
- Crée deux fichiers : données complètes + résumé léger
- Affiche des statistiques détaillées de performance

## 📁 Fichiers de sortie

Les scripts créent un dossier `scripts/output/` avec :

- `cenov-complete-data-YYYY-MM-DD.json` - Toutes les données récupérées
- `cenov-summary-YYYY-MM-DD.json` - Résumé avec métadonnées uniquement
- `tables-data-YYYY-MM-DD.json` - Données des tables uniquement
- `views-data-YYYY-MM-DD.json` - Données des vues uniquement

## 🔒 Sécurité

Ces scripts fonctionnent en **mode lecture seule** :
- ✅ SELECT sur toutes les tables et vues
- ❌ Aucune modification (INSERT/UPDATE/DELETE)
- ❌ Aucune suppression
- ❌ Aucune création d'objets

## ⚡ Performance

- Exécution parallèle des requêtes quand possible
- Gestion des erreurs par table/vue individuelle
- Affichage du progrès en temps réel
- Mesure du temps d'exécution

## 🛠️ Prérequis

- Node.js avec support des modules ES6
- Prisma configuré avec accès à la base Cenov
- Variables d'environnement de connexion configurées

## 📋 Utilisation recommandée

Pour une récupération complète, utilisez le script principal :

```bash
pnpm node scripts/fetch-cenov-data.mjs
```

Cela vous donnera accès à toutes les informations de la base Cenov pour consultation et analyse.