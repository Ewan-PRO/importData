// src/routes/export/export-client-utils.ts
// Utilitaires client pour la page d'export

import {
	Rocket as RocketIcon,
	Settings as SettingsIcon,
	LockOpen as LockOpenIcon,
	Package as PackageIcon,
	Eye,
	Database
} from 'lucide-svelte';
import type { ComponentType } from 'svelte';

export {
	RocketIcon as Rocket,
	SettingsIcon as Settings,
	LockOpenIcon as LockOpen,
	PackageIcon as Package
};

// Configuration des bases de données
export const DATABASE_CONFIG = {
	cenov: { icon: RocketIcon, variant: 'bleu' as const, emoji: '🚀' },
	cenov_dev: { icon: SettingsIcon, variant: 'orange' as const, emoji: '⚙️' }
} as const;

// Configuration des schémas
export const SCHEMA_CONFIG = {
	produit: { icon: PackageIcon, label: 'Produit', variant: 'purple' as const },
	public: { icon: LockOpenIcon, label: 'Public', variant: 'cyan' as const }
} as const;

// Types dérivés pour type safety
export type DatabaseName = keyof typeof DATABASE_CONFIG;
export type SchemaName = keyof typeof SCHEMA_CONFIG;

export type DatabaseConfig = {
	icon: ComponentType;
	variant: 'bleu' | 'orange';
	emoji: string;
};

export type SchemaConfig = {
	icon: ComponentType;
	label: string;
	variant: 'purple' | 'cyan';
};

// Fonction pour obtenir l'icône d'une base de données
export function getDatabaseIcon(database: string) {
	return database.includes('dev') ? DATABASE_CONFIG.cenov_dev.icon : DATABASE_CONFIG.cenov.icon;
}

// Fonction pour obtenir l'icône d'un schéma
export function getSchemaIcon(schema: string) {
	return SCHEMA_CONFIG[schema as keyof typeof SCHEMA_CONFIG]?.icon || LockOpenIcon;
}

// Fonction pour obtenir l'icône selon le type de table
export function getTableIcon(category: string) {
	return category === 'views' || category === 'view' ? Eye : Database;
}

// Fonction pour obtenir la variante de badge selon la catégorie
export function getBadgeVariant(category: string): 'vert' | 'noir' {
	return category === 'view' ? 'vert' : 'noir';
}

// Fonction pour obtenir les informations de badge d'une base de données
export function getDatabaseBadgeInfo(database: string): {
	variant: 'bleu' | 'noir' | 'orange';
	label: string;
} {
	const config = database.includes('dev') ? DATABASE_CONFIG.cenov_dev : DATABASE_CONFIG.cenov;
	return {
		variant: config.variant,
		label: `${config.emoji} ${database.toUpperCase()}`
	};
}

// Fonction pour parser un tableName au format "database-tablename"
export function parseTableName(tableName: string): string {
	if (tableName.includes('-')) {
		return tableName.split('-').slice(1).join('-');
	}
	return tableName;
}
