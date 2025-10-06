// src/routes/export/export-client-utils.ts
// Utilitaires client pour la page d'export

import {
	Rocket as RocketIcon,
	Settings as SettingsIcon,
	LockOpen as LockOpenIcon,
	Package as PackageIcon
} from 'lucide-svelte';
import type { ComponentType } from 'svelte';

export {
	RocketIcon as Rocket,
	SettingsIcon as Settings,
	LockOpenIcon as LockOpen,
	PackageIcon as Package
};

export const DATABASE_CONFIG = {
	cenov: { icon: RocketIcon, variant: 'bleu' as const, emoji: '🚀' },
	cenov_dev: { icon: SettingsIcon, variant: 'orange' as const, emoji: '⚙️' }
} as const;

export const SCHEMA_CONFIG = {
	produit: { icon: PackageIcon, label: 'Produit', variant: 'purple' as const },
	public: { icon: LockOpenIcon, label: 'Public', variant: 'cyan' as const }
} as const;

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
