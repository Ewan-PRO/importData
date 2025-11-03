// Configuration UI centralisée pour bases de données, schémas et tables
// Utilisé par import, export et tous les composants

// Imports pour utilisation locale dans ce fichier
import {
	Rocket as RocketIcon,
	Settings as SettingsIcon,
	LockOpen as LockOpenIcon,
	Package as PackageIcon,
	Eye as EyeIcon,
	Table as TableIconComponent
} from 'lucide-svelte';

// Re-export des icônes pour utilisation externe
export { Rocket as RocketIcon } from 'lucide-svelte';
export { Settings as SettingsIcon } from 'lucide-svelte';
export { LockOpen as LockOpenIcon } from 'lucide-svelte';
export { Package as PackageIcon } from 'lucide-svelte';
export { Eye as EyeIcon } from 'lucide-svelte';
export { Table as TableIcon } from 'lucide-svelte';

// ========== TYPES ==========
export type DatabaseName = 'cenov' | 'cenov_dev' | 'cenov_preprod';
export type SchemaName = 'produit' | 'public';
export type BadgeVariant = 'bleu' | 'orange' | 'vert' | 'noir' | 'purple' | 'cyan' | 'jaune';

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
	},
	cenov_preprod: {
		icon: RocketIcon,
		variant: 'jaune' as const,
		emoji: '🧪',
		label: 'CENOV_PREPROD'
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
	let config;
	if (database.includes('preprod')) {
		config = DATABASE_CONFIG.cenov_preprod;
	} else if (database.includes('dev')) {
		config = DATABASE_CONFIG.cenov_dev;
	} else {
		config = DATABASE_CONFIG.cenov;
	}
	return {
		variant: config.variant,
		label: `${config.emoji} ${config.label}`,
		icon: config.icon
	};
}

// Obtenir icône database
export function getDatabaseIcon(database: string) {
	if (database.includes('preprod')) return RocketIcon;
	if (database.includes('dev')) return SettingsIcon;
	return RocketIcon;
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
