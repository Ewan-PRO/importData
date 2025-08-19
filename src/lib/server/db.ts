// src/lib/server/db.ts
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

// Fonction pour récupérer les catégories selon l'environnement
export async function getCategories() {
	const useDevViews = env.USE_DEV_VIEWS === 'true' || dev;
	if (useDevViews) {
		return await prisma.v_categories_dev.findMany();
	} else {
		return await prisma.v_categories.findMany();
	}
}

// Fonction pour récupérer les kits selon l'environnement
export async function getKits() {
	const useDevViews = env.USE_DEV_VIEWS === 'true' || dev;
	if (useDevViews) {
		return await prisma.v_kit_carac_dev.findMany();
	} else {
		return await prisma.v_kit_carac.findMany();
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

// Export du client Prisma
export { prisma };
