// src/lib/server/db.ts
import { PrismaClient } from '@prisma/client';
import { dev } from '$app/environment';
import { env } from '$env/dynamic/private';

// Créer le client Prisma avec des options explicites pour ES modules
const prisma = new PrismaClient({
	log: ['error', 'warn'],
	errorFormat: 'pretty'
});

// Fonction helper pour déterminer l'environnement
function useDevTables() {
	return env.USE_DEV_VIEWS === 'true' || dev;
}

// Export du client Prisma et fonction helper
export { prisma, useDevTables };
