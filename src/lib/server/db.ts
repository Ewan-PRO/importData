// src/lib/server/db.ts
// Polyfill __dirname et __filename pour ES modules AVANT d'importer Prisma
if (typeof globalThis.__dirname === 'undefined') {
	globalThis.__dirname = '/app';
}
if (typeof globalThis.__filename === 'undefined') {
	globalThis.__filename = '/app/index.js';
}

import { PrismaClient } from '@prisma/client';
import { dev } from '$app/environment';
import { env } from '$env/dynamic/private';

// Créer le client Prisma avec des options explicites pour ES modules
const prisma = new PrismaClient({
	log: ['error', 'warn'],
	errorFormat: 'pretty'
});

// Types pour les paramètres
interface KitCombinationData {
	kit_label: string;
	atr_label: string;
	atr_val: string;
	kat_valeur: number;
}

// Types pour les clauses where et données basés sur l'usage réel
interface CategoryWhereInput {
	atr_id?: number;
	atr_0_label?: string;
	atr_1_label?: string;
	atr_2_label?: string;
	atr_3_label?: string;
	atr_4_label?: string;
	atr_5_label?: string;
	atr_6_label?: string;
	atr_7_label?: string;
	row_key?: number; // pour v_categories_dev
}

interface AttributeWhereInput {
	atr_id?: number;
	atr_nat?: string;
	atr_val?: string;
	atr_label?: string;
}

interface AttributeCreateInput {
	atr_nat?: string;
	atr_val?: string;
	atr_label?: string;
}

// Fonction pour récupérer les catégories selon l'environnement
export async function getCategories(sortOrder: 'asc' | 'desc' = 'asc') {
	const useDevViews = env.USE_DEV_VIEWS === 'true' || dev;
	if (useDevViews) {
		return await prisma.v_categories_dev.findMany({
			orderBy: { row_key: sortOrder } // row_key conserve l'ordre alphabétique de la vue
		});
	} else {
		return await prisma.v_categories.findMany({
			orderBy: { atr_id: sortOrder }
		});
	}
}

// Fonction pour récupérer les kits selon l'environnement  
export async function getKits(sortOrder: 'asc' | 'desc' = 'asc') {
	const useDevViews = env.USE_DEV_VIEWS === 'true' || dev;
	if (useDevViews) {
		return await prisma.v_kit_carac_dev.findMany({
			orderBy: { id: sortOrder }
		});
	} else {
		return await prisma.v_kit_carac.findMany({
			orderBy: { id: sortOrder }
		});
	}
}

// Fonction pour trouver une combinaison kit spécifique
export async function findKitCombination(data: KitCombinationData) {
	const useDevViews = env.USE_DEV_VIEWS === 'true' || dev;
	if (useDevViews) {
		return await prisma.v_kit_carac_dev.findFirst({
			where: data
		});
	} else {
		return await prisma.v_kit_carac.findFirst({
			where: data
		});
	}
}

// Fonction pour trouver des combinaisons similaires
export async function findSimilarKitCombinations(kit_label: string, atr_label: string) {
	const useDevViews = env.USE_DEV_VIEWS === 'true' || dev;
	if (useDevViews) {
		return await prisma.v_kit_carac_dev.findMany({
			where: { kit_label, atr_label }
		});
	} else {
		return await prisma.v_kit_carac.findMany({
			where: { kit_label, atr_label }
		});
	}
}

// Fonction helper pour déterminer l'environnement
function useDevTables() {
	return env.USE_DEV_VIEWS === 'true' || dev;
}

// Fonctions pour les vues categories avec condition de recherche
export async function findCategoryInView(whereClause: CategoryWhereInput) {
	if (useDevTables()) {
		return await prisma.v_categories_dev.findFirst({ where: whereClause });
	} else {
		return await prisma.v_categories.findFirst({ where: whereClause });
	}
}

// Fonctions pour les tables attributes
export async function findAttribute(whereClause: AttributeWhereInput) {
	if (useDevTables()) {
		return await prisma.attribute_dev.findFirst({ where: whereClause });
	} else {
		return await prisma.attribute.findFirst({ where: whereClause });
	}
}

export async function createAttribute(data: AttributeCreateInput) {
	if (useDevTables()) {
		return await prisma.attribute_dev.create({ data });
	} else {
		return await prisma.attribute.create({ data });
	}
}

// Export du client Prisma
export { prisma };
