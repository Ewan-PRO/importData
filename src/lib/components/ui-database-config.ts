// Configuration UI centralisée pour bases de données, schémas et tables
// Utilisé par import, export et tous les composants

import {
	Rocket as RocketIcon,
	Settings as SettingsIcon,
	LockOpen as LockOpenIcon,
	Package as PackageIcon,
	Eye as EyeIcon,
	Table as TableIconComponent
} from 'lucide-svelte';

// Re-export des icônes pour utilisation directe
export {
	RocketIcon as Rocket,
	SettingsIcon as Settings,
	LockOpenIcon as LockOpen,
	PackageIcon as Package,
	EyeIcon as Eye,
	TableIconComponent as TableIcon
};

// ========== TYPES ==========
export type DatabaseName = 'cenov' | 'cenov_dev';
export type SchemaName = 'produit' | 'public';
export type BadgeVariant = 'bleu' | 'orange' | 'vert' | 'noir' | 'purple' | 'cyan';

// ========== CONFIGURATION ==========
export const DATABASE_CONFIG = {
	cenov: {
		icon: RocketIcon,
		variant: 'bleu' as const,
		emoji: '🚀',
		label: 'CENOV'
	},
	cenov_dev: {
		icon: SettingsIcon,
		variant: 'orange' as const,
		emoji: '⚙️',
		label: 'CENOV_DEV'
	}
} as const;

export const SCHEMA_CONFIG = {
	produit: {
		icon: PackageIcon,
		label: 'Produit',
		variant: 'purple' as const
	},
	public: {
		icon: LockOpenIcon,
		label: 'Public',
		variant: 'cyan' as const
	}
} as const;

// ========== FONCTIONS UTILITAIRES ==========

// Obtenir infos badge database
export function getDatabaseBadgeInfo(database: string) {
	const config = database.includes('dev') ? DATABASE_CONFIG.cenov_dev : DATABASE_CONFIG.cenov;
	return {
		variant: config.variant,
		label: `${config.emoji} ${config.label}`,
		icon: config.icon
	};
}

// Obtenir icône database
export function getDatabaseIcon(database: string) {
	return database.includes('dev') ? SettingsIcon : RocketIcon;
}

// Obtenir icône schéma
export function getSchemaIcon(schema: string) {
	return SCHEMA_CONFIG[schema as SchemaName]?.icon || LockOpenIcon;
}

// Obtenir icône table/vue
export function getTableIcon(category?: string) {
	return category === 'view' || category === 'views' ? EyeIcon : TableIconComponent;
}

// Obtenir variant badge table/vue
export function getBadgeVariant(category?: string): 'vert' | 'noir' {
	return category === 'view' ? 'vert' : 'noir';
}

// Parser "database-tableName" (export)
export function parseTableName(tableName: string): string {
	if (tableName.includes('-')) {
		return tableName.split('-').slice(1).join('-');
	}
	return tableName;
}
