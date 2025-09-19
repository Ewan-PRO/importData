<!-- TableSelector.svelte - Composant réutilisable pour sélection de tables -->
<script lang="ts">
	import { Card } from 'flowbite-svelte';
	import { Button } from '$lib/components/ui/button';
	import { Badge } from '$lib/components/ui/badge';
	import { Input } from '$lib/components/ui/input';
	import * as Table from '$lib/components/ui/table';
	import { toast } from 'svelte-sonner';
	import {
		Database,
		Package,
		LockOpen,
		FileType,
		TableIcon,
		Eye,
		Search,
		RefreshCcw,
		CheckCircle,
		Settings,
		Rocket
	} from 'lucide-svelte';

	// Props
	export let availableTables: { value: string; name: string; displayName?: string; category: string; tableType?: string; database?: string; rowCount?: number; columns?: any[] }[] = [];
	export let selectedTables: string[] = [];
	export const mode: 'export' | 'import' = 'import';
	export let title: string = 'Sélection des tables';
	// Props exportés pour les statistiques
	export let totalTables: number = 0;
	export let totalRows: number = 0;
	export let filteredCount: number = 0;

	// Events
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

	// États internes
	let searchTerm = '';
	let selectedType: 'all' | 'tables' | 'views' = 'all';
	let selectedDatabase: 'all' | 'cenov' | 'cenov_dev' = 'all';
	let selectedSchema: 'all' | 'produit' | 'public' = 'all';

	// Configuration des couleurs et icônes
	const SCHEMA_CONFIG = {
		produit: { icon: Package, label: 'Produit', variant: 'purple' as const },
		public: { icon: LockOpen, label: 'Public', variant: 'cyan' as const }
	} as const;

	const DATABASE_CONFIG = {
		cenov: { icon: Rocket, variant: 'bleu' as const, emoji: '🚀' },
		cenov_dev: { icon: Settings, variant: 'orange' as const, emoji: '⚙️' }
	} as const;

	// Calculs réactifs
	$: databases = ['cenov', 'cenov_dev'];
	$: uniqueSchemas = [...new Set(availableTables.map(t => t.category))];

	// Tables filtrées
	$: filteredTables = availableTables.filter((table) => {
		const matchesType =
			selectedType === 'all' ||
			(selectedType === 'tables' && (table.tableType === 'table' || !table.tableType)) ||
			(selectedType === 'views' && table.tableType === 'view');

		const tableDatabase = table.database || (table.value.includes('cenov_dev:') ? 'cenov_dev' : 'cenov');
		const matchesDB = selectedDatabase === 'all' || tableDatabase === selectedDatabase;

		const matchesSchema = selectedSchema === 'all' || table.category === selectedSchema;

		const matchesSearch =
			searchTerm === '' ||
			(table.displayName || table.name).toLowerCase().includes(searchTerm.toLowerCase()) ||
			table.value.toLowerCase().includes(searchTerm.toLowerCase());

		return matchesType && matchesDB && matchesSchema && matchesSearch;
	});

	// Statistiques - assignation automatique aux props exportés
	$: totalTables = availableTables.length;
	$: totalRows = availableTables.reduce((sum, table) => {
		// Si rowCount n'existe pas, essayer de calculer à partir des données disponibles
		const count = table.rowCount || 0;
		return sum + count;
	}, 0);
	$: filteredCount = filteredTables.length;

	// Fonctions de gestion
	function handleTypeChange(type: 'all' | 'tables' | 'views') {
		selectedType = type;
	}

	function handleDatabaseChange(database: 'all' | 'cenov' | 'cenov_dev') {
		selectedDatabase = database as 'all' | 'cenov' | 'cenov_dev';
	}

	function handleSchemaChange(schema: 'all' | 'produit' | 'public') {
		selectedSchema = schema as 'all' | 'produit' | 'public';
	}

	function toggleAllTables() {
		const filteredTableIds = filteredTables.map(t => t.value);
		const selectedFilteredCount = filteredTableIds.filter(id => selectedTables.includes(id)).length;

		if (selectedFilteredCount === filteredTables.length) {
			selectedTables = selectedTables.filter(id => !filteredTableIds.includes(id));
		} else {
			const newSelection = [...new Set([...selectedTables, ...filteredTableIds])];
			selectedTables = newSelection;
		}
		dispatch('selectionChange');
	}

	function resetFilters() {
		selectedType = 'all';
		selectedDatabase = 'all';
		selectedSchema = 'all';
		searchTerm = '';
	}

	function resetSelection() {
		selectedTables = [];
		dispatch('selectionChange');
	}

	function getTableIcon(table: any) {
		return table.tableType === 'view' ? Eye : TableIcon;
	}

	function getBadgeVariant(table: any) {
		return table.tableType === 'view' ? 'vert' : 'noir';
	}

	function getDatabaseBadgeInfo(database: string) {
		const config = database.includes('dev') ? DATABASE_CONFIG.cenov_dev : DATABASE_CONFIG.cenov;
		return {
			variant: config.variant,
			label: `${config.emoji} ${database.toUpperCase()}`
		};
	}

	function formatNumber(num: number): string {
		return new Intl.NumberFormat('fr-FR').format(num);
	}

	function renderBadges(table: any, dbInfo: any, schemaConfig: any) {
		return {
			tableBadge: {
				variant: getBadgeVariant(table) as 'vert' | 'noir',
				icon: table.tableType === 'view' ? Eye : TableIcon,
				label: table.tableType === 'view' ? 'Vue' : 'Table'
			},
			dbBadge: {
				variant: dbInfo.variant as 'bleu' | 'orange',
				icon: table.database?.includes('dev') ? Settings : Rocket,
				label: table.database?.toUpperCase()
			},
			schemaBadge: schemaConfig ? {
				variant: schemaConfig.variant as 'purple' | 'cyan',
				icon: schemaConfig.icon,
				label: schemaConfig.label
			} : null
		};
	}

</script>

<div class="w-full">
	<div class="mb-6">
		<h2 class="mb-4 text-xl font-bold text-black">{title}</h2>

		<!-- Cards de filtres -->
		<div class="mb-6 space-y-4">
			<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
				<!-- Card Type -->
				<Card class="h-36 border-blue-200 bg-blue-50 p-4 shadow-none">
					<div class="mb-2 flex items-center gap-2">
						<FileType class="h-5 w-5 text-blue-600" />
						<h3 class="text-lg font-semibold text-blue-700">Type de données :</h3>
					</div>
					<div class="space-y-2">
						<label class="flex cursor-pointer items-center space-x-2">
							<input
								type="radio"
								name="type"
								value="all"
								bind:group={selectedType}
								on:change={() => handleTypeChange('all')}
								class="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
							/>
							<span class="text-sm text-gray-900">
								<FileType class="mr-1 inline h-4 w-4" />
								Tous les types ({filteredCount})
							</span>
						</label>
						<label class="flex cursor-pointer items-center space-x-2">
							<input
								type="radio"
								name="type"
								value="tables"
								bind:group={selectedType}
								on:change={() => handleTypeChange('tables')}
								class="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
							/>
							<span class="text-sm text-gray-900">
								<TableIcon class="mr-1 inline h-4 w-4" />
								Tables ({filteredTables.filter(t => t.tableType === 'table' || !t.tableType).length})
							</span>
						</label>
						<label class="flex cursor-pointer items-center space-x-2">
							<input
								type="radio"
								name="type"
								value="views"
								bind:group={selectedType}
								on:change={() => handleTypeChange('views')}
								class="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
							/>
							<span class="text-sm text-gray-900">
								<Eye class="mr-1 inline h-4 w-4" />
								Vues ({filteredTables.filter(t => t.tableType === 'view').length})
							</span>
						</label>
					</div>
				</Card>

				<!-- Card Base de données -->
				<Card class="h-36 border-emerald-200 bg-emerald-50 p-4 shadow-none">
					<div class="mb-2 flex items-center gap-2">
						<Database class="h-5 w-5 text-emerald-600" />
						<h3 class="text-lg font-semibold text-emerald-700">Base de données :</h3>
					</div>
					<div class="space-y-2">
						<label class="flex cursor-pointer items-center space-x-2">
							<input
								type="radio"
								name="database"
								value="all"
								bind:group={selectedDatabase}
								on:change={() => handleDatabaseChange('all')}
								class="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
							/>
							<span class="text-sm text-gray-900">
								<Database class="mr-1 inline h-4 w-4" />
								Toutes les bases ({filteredCount})
							</span>
						</label>
						{#each databases as database}
							{@const dbInfo = getDatabaseBadgeInfo(database)}
							<label class="flex cursor-pointer items-center space-x-2">
								<input
									type="radio"
									name="database"
									value={database}
									bind:group={selectedDatabase}
									on:change={() => handleDatabaseChange(database as 'all' | 'cenov' | 'cenov_dev')}
									class="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
								/>
								<span class="text-sm text-gray-900">
									{#if database.includes('dev')}
										<Settings class="mr-0.5 inline h-4 w-4" />
									{:else}
										<Rocket class="mr-0.5 inline h-4 w-4" />
									{/if}
									{dbInfo.label.split(' ')[1]} ({filteredTables.filter(t => {
										const tableDb = t.database || (t.value.includes('cenov_dev:') ? 'cenov_dev' : 'cenov');
										return tableDb === database;
									}).length})
								</span>
							</label>
						{/each}
					</div>
				</Card>

				<!-- Card Schéma -->
				<Card class="h-36 border-purple-200 bg-purple-50 p-4 shadow-none">
					<div class="mb-2 flex items-center gap-2">
						<Package class="h-5 w-5 text-purple-600" />
						<h3 class="text-lg font-semibold text-purple-700">Schéma :</h3>
					</div>
					<div class="space-y-2">
						<label class="flex cursor-pointer items-center space-x-2">
							<input
								type="radio"
								name="schema"
								value="all"
								bind:group={selectedSchema}
								on:change={() => handleSchemaChange('all')}
								class="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
							/>
							<span class="text-sm text-gray-900">
								<Package class="mr-1 inline h-4 w-4" />
								Tous les schémas ({filteredCount})
							</span>
						</label>
						{#each uniqueSchemas as schema}
							<label class="flex cursor-pointer items-center space-x-2">
								<input
									type="radio"
									name="schema"
									value={schema}
									bind:group={selectedSchema}
									on:change={() => handleSchemaChange(schema as 'all' | 'produit' | 'public')}
									class="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
								/>
								<span class="text-sm text-gray-900">
									{#if schema === 'produit'}
										<Package class="mr-0.5 inline h-4 w-4" />
									{:else}
										<LockOpen class="mr-0.5 inline h-4 w-4" />
									{/if}
									{SCHEMA_CONFIG[schema as keyof typeof SCHEMA_CONFIG]?.label || schema}
									({filteredTables.filter(t => t.category === schema).length})
								</span>
							</label>
						{/each}
					</div>
				</Card>
			</div>

			<!-- Actions et recherche -->
			<div class="grid grid-cols-1 items-center gap-6 sm:grid-cols-2 lg:grid-cols-3">
				<!-- Actions -->
				<div class="flex items-center justify-center gap-4">
					<label class="flex min-h-[42px] cursor-pointer items-center space-x-2">
						<input
							type="checkbox"
							checked={filteredTables.length > 0 && filteredTables.every(table => selectedTables.includes(table.value))}
							on:change={toggleAllTables}
							class="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
						/>
						<span class="text-sm">Sélectionner tout ({filteredCount})</span>
					</label>

					<Button variant="noir" onclick={resetFilters}>
						<RefreshCcw class="mr-2 h-4 w-4" />
						Réinitialiser
					</Button>
				</div>

				<!-- Recherche -->
				<div class="relative">
					<Search class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
					<Input
						type="text"
						bind:value={searchTerm}
						placeholder="Rechercher une table, une vue..."
						class="min-h-[42px] pl-9"
					/>
				</div>

				<!-- Résumé sélection -->
				<div class="flex min-h-[42px] items-center justify-center rounded-lg border border-purple-200 bg-purple-50 px-6 py-3 text-center">
					<div class="flex items-center justify-center gap-1 text-sm text-purple-800">
						<CheckCircle class="h-4 w-4" />
						<span class="font-semibold">{selectedTables.length}</span> sélectionnées
					</div>
				</div>
			</div>
		</div>

		<!-- Liste des tables filtrées -->
		<div class="max-h-96 overflow-y-auto">
			<div class="grid gap-3">
				{#each filteredTables as table (table.value)}
					{@const tableDatabase = table.database || (table.value.includes('cenov_dev:') ? 'cenov_dev' : 'cenov')}
					{@const dbInfo = getDatabaseBadgeInfo(tableDatabase)}
					{@const schemaConfig = SCHEMA_CONFIG[table.category as keyof typeof SCHEMA_CONFIG]}
					{@const badges = renderBadges(table, dbInfo, schemaConfig)}
					<label class="flex max-w-xs cursor-pointer items-center space-x-3 rounded-lg border p-4 transition-colors hover:bg-blue-50 sm:max-w-none">
						<input
							type="checkbox"
							bind:group={selectedTables}
							value={table.value}
							on:change={() => {
								// Toast info quand on sélectionne/désélectionne une table
								const tableId = table.value;
								const isSelected = selectedTables.includes(tableId);
								const tableType = table.tableType === 'view' ? 'vue' : 'table';

								if (isSelected) {
									toast.info(
										`${tableType.charAt(0).toUpperCase() + tableType.slice(1)} sélectionnée`,
										{
											description: `${table.displayName || table.name} (${formatNumber(table.rowCount || 0)} lignes)`
										}
									);
								} else {
									toast.info(
										`${tableType.charAt(0).toUpperCase() + tableType.slice(1)} désélectionnée`,
										{
											description: table.displayName || table.name
										}
									);
								}
								dispatch('selectionChange');
							}}
							class="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
						/>

						<div class="flex-1">
							<div class="flex items-center gap-3">
								<svelte:component this={getTableIcon(table)} class="h-5 w-5 text-gray-500" />
								<div class="min-w-0 flex-1">
									<!-- Desktop layout -->
									<div class="hidden sm:block">
										<div class="flex items-center gap-2">
											<span class="font-medium">{table.displayName || table.name}</span>
											<Badge variant={badges.tableBadge.variant}>
												<svelte:component this={badges.tableBadge.icon} />
												{badges.tableBadge.label}
											</Badge>
											<Badge variant={badges.dbBadge.variant}>
												<svelte:component this={badges.dbBadge.icon} />
												{badges.dbBadge.label}
											</Badge>
											{#if badges.schemaBadge}
												<Badge variant={badges.schemaBadge.variant}>
													<svelte:component this={badges.schemaBadge.icon} />
													{badges.schemaBadge.label}
												</Badge>
											{/if}
										</div>
										<div class="text-sm text-gray-500">
											{table.displayName || table.name} • {formatNumber(table.rowCount || 0)} lignes
										</div>
									</div>

									<!-- Mobile layout -->
									<div class="sm:hidden">
										<div class="font-medium">{table.displayName || table.name}</div>
										<div class="mt-1 text-sm text-gray-500">
											{formatNumber(table.rowCount || 0)} lignes • {table.columns?.length || 0} colonnes
										</div>
										<div class="mt-2 flex flex-wrap gap-1">
											<Badge variant={badges.tableBadge.variant}>
												<svelte:component this={badges.tableBadge.icon} />
												{badges.tableBadge.label}
											</Badge>
											<Badge variant={badges.dbBadge.variant}>
												<svelte:component this={badges.dbBadge.icon} />
												{badges.dbBadge.label}
											</Badge>
											{#if badges.schemaBadge}
												<Badge variant={badges.schemaBadge.variant}>
													<svelte:component this={badges.schemaBadge.icon} />
													{badges.schemaBadge.label}
												</Badge>
											{/if}
										</div>
									</div>
								</div>
							</div>
						</div>

						<!-- Desktop: infos colonnes -->
						<div class="hidden text-right text-sm text-gray-500 sm:block">
							<div>{table.columns?.length || 0} colonnes</div>
						</div>
					</label>
				{/each}
			</div>
		</div>
	</div>
</div>