<!-- TableSelector.svelte - Composant réutilisable pour sélection de tables -->
<script lang="ts">
	import { Card } from 'flowbite-svelte';
	import { Button } from '$lib/components/ui/button';
	import { Badge } from '$lib/components/ui/badge';
	import { Input } from '$lib/components/ui/input';
	import { toast } from 'svelte-sonner';
	import { type ComponentType } from 'svelte';
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
		Rocket,
		CircleCheck,
		CircleX,
		Download,
		type Icon
	} from 'lucide-svelte';
	import {
		SCHEMA_CONFIG,
		getDatabaseBadgeInfo,
		getTableIcon,
		getBadgeVariant,
		type DatabaseName
	} from '$lib/components/ui-database-config';

	// Props avec runes Svelte 5
	let {
		availableTables = $bindable([]),
		selectedTables = $bindable([]),
		databases = [],
		title = 'Sélection des tables',
		totalTables = $bindable(0),
		totalRows = $bindable(0),
		filteredCount = $bindable(0),
		tableRequiredFields = {},
		fileHeaders = []
	}: {
		availableTables: {
			value: string;
			name: string;
			displayName?: string;
			category: string;
			tableType?: string;
			database?: string;
			rowCount?: number;
			columns?: Array<Record<string, unknown>>;
		}[];
		selectedTables: string[];
		databases: DatabaseName[];
		title?: string;
		totalTables: number;
		totalRows: number;
		filteredCount: number;
		tableRequiredFields: Record<string, string[]>;
		fileHeaders: string[];
	} = $props();

	// Events
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

	// États internes avec runes
	let searchTerm = $state('');
	let selectedType = $state<'all' | 'tables' | 'views' | 'compatible'>('all');
	let selectedDatabase = $state<'all' | 'cenov' | 'cenov_dev'>('all');
	let selectedSchema = $state<'all' | 'produit' | 'public'>('all');

	// Calculs réactifs avec runes
	let uniqueSchemas = $derived([...new Set(availableTables.map((t) => t.category))]);

	// Tables filtrées
	let filteredTables = $derived(
		availableTables.filter((table) => {
			let matchesType = false;

			if (selectedType === 'all') {
				matchesType = true;
			} else if (selectedType === 'tables') {
				matchesType = table.tableType === 'table' || !table.tableType;
			} else if (selectedType === 'views') {
				matchesType = table.tableType === 'view';
			} else if (selectedType === 'compatible') {
				const requiredStatus = getRequiredFieldsStatus(table.value);
				matchesType = requiredStatus?.allMapped === true;
			}

			const tableDatabase =
				table.database || (table.value.includes('cenov_dev:') ? 'cenov_dev' : 'cenov');
			const matchesDB = selectedDatabase === 'all' || tableDatabase === selectedDatabase;

			const matchesSchema = selectedSchema === 'all' || table.category === selectedSchema;

			const matchesSearch =
				searchTerm === '' ||
				(table.displayName || table.name).toLowerCase().includes(searchTerm.toLowerCase()) ||
				table.value.toLowerCase().includes(searchTerm.toLowerCase());

			return matchesType && matchesDB && matchesSchema && matchesSearch;
		})
	);

	// Statistiques avec effet
	$effect(() => {
		totalTables = availableTables.length;
		totalRows = availableTables.reduce((sum, table) => {
			const count = table.rowCount || 0;
			return sum + count;
		}, 0);
		filteredCount = filteredTables.length;
	});

	// Fonctions de gestion
	function handleTypeChange(type: 'all' | 'tables' | 'views' | 'compatible') {
		selectedType = type;
	}

	function handleDatabaseChange(database: 'all' | 'cenov' | 'cenov_dev') {
		selectedDatabase = database as 'all' | 'cenov' | 'cenov_dev';
	}

	function handleSchemaChange(schema: 'all' | 'produit' | 'public') {
		selectedSchema = schema as 'all' | 'produit' | 'public';
	}

	function toggleAllTables() {
		const filteredTableIds = filteredTables.map((t) => t.value);
		const selectedFilteredCount = filteredTableIds.filter((id) =>
			selectedTables.includes(id)
		).length;

		if (selectedFilteredCount === filteredTables.length) {
			selectedTables = selectedTables.filter((id) => !filteredTableIds.includes(id));
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

	// Calculer le nombre de tables compatibles
	let compatibleCount = $derived(
		availableTables.filter((table) => {
			const requiredStatus = getRequiredFieldsStatus(table.value);
			return requiredStatus?.allMapped === true;
		}).length
	);

	// Utiliser les fonctions importées depuis ui-database-config
	// getTableIcon, getBadgeVariant, getDatabaseBadgeInfo sont déjà importés

	function formatNumber(num: number): string {
		return new Intl.NumberFormat('fr-FR').format(num);
	}

	function renderBadges(
		table: { tableType?: string; database?: string },
		dbInfo: { variant: string },
		schemaConfig: { variant: string; icon: ComponentType<Icon>; label: string } | undefined
	) {
		return {
			tableBadge: {
				variant: getBadgeVariant(table.tableType || 'table') as 'vert' | 'noir',
				icon: table.tableType === 'view' ? Eye : TableIcon,
				label: table.tableType === 'view' ? 'Vue' : 'Table'
			},
			dbBadge: {
				variant: dbInfo.variant as 'bleu' | 'orange',
				icon: table.database?.includes('dev') ? Settings : Rocket,
				label: table.database?.toUpperCase()
			},
			schemaBadge: schemaConfig
				? {
						variant: schemaConfig.variant as 'purple' | 'cyan',
						icon: schemaConfig.icon,
						label: schemaConfig.label
					}
				: null
		};
	}

	function getRequiredFieldsStatus(tableIdentifier: string) {
		const requiredFields = tableRequiredFields[tableIdentifier] || [];
		const totalCount = requiredFields.length;

		if (totalCount === 0) return null;

		// Normalisation des en-têtes du fichier pour comparaison
		const normalizedFileHeaders = fileHeaders.map((header) =>
			String(header)
				.toLowerCase()
				.replace(/[^a-z0-9]/g, '')
		);

		// Vérification si chaque champ requis est présent dans les en-têtes du fichier
		const foundCount = requiredFields.filter((field) => {
			const normalizedField = field.toLowerCase().replace(/[^a-z0-9]/g, '');
			return normalizedFileHeaders.some(
				(header) => header.includes(normalizedField) || normalizedField.includes(header)
			);
		}).length;

		const allFound = foundCount === totalCount;
		return {
			allMapped: allFound,
			mappedCount: foundCount,
			totalCount,
			variant: (allFound ? 'vert' : 'rouge') as 'vert' | 'rouge',
			icon: allFound ? CircleCheck : CircleX,
			label: `${foundCount}/${totalCount} requis`
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
				<Card class="h-44 border-blue-200 bg-blue-50 p-4 shadow-none">
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
								onchange={() => handleTypeChange('all')}
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
								onchange={() => handleTypeChange('tables')}
								class="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
							/>
							<span class="text-sm text-gray-900">
								<TableIcon class="mr-1 inline h-4 w-4" />
								Tables ({filteredTables.filter((t) => t.tableType === 'table' || !t.tableType)
									.length})
							</span>
						</label>
						<label class="flex cursor-pointer items-center space-x-2">
							<input
								type="radio"
								name="type"
								value="views"
								bind:group={selectedType}
								onchange={() => handleTypeChange('views')}
								class="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
							/>
							<span class="text-sm text-gray-900">
								<Eye class="mr-1 inline h-4 w-4" />
								Vues ({filteredTables.filter((t) => t.tableType === 'view').length})
							</span>
						</label>
						<label class="flex cursor-pointer items-center space-x-2">
							<input
								type="radio"
								name="type"
								value="compatible"
								bind:group={selectedType}
								onchange={() => handleTypeChange('compatible')}
								class="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
							/>
							<span class="text-sm text-gray-900">
								<Download class="mr-1 inline h-4 w-4" />
								Sources prêtes pour l'importation ({compatibleCount})
							</span>
						</label>
					</div>
				</Card>

				<!-- Card Base de données -->
				<Card class="h-44 border-emerald-200 bg-emerald-50 p-4 shadow-none">
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
								onchange={() => handleDatabaseChange('all')}
								class="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
							/>
							<span class="text-sm text-gray-900">
								<Database class="mr-1 inline h-4 w-4" />
								Toutes les bases ({filteredCount})
							</span>
						</label>
						{#each databases as database (database)}
							{@const dbInfo = getDatabaseBadgeInfo(database)}
							<label class="flex cursor-pointer items-center space-x-2">
								<input
									type="radio"
									name="database"
									value={database}
									bind:group={selectedDatabase}
									onchange={() => handleDatabaseChange(database as 'all' | 'cenov' | 'cenov_dev')}
									class="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
								/>
								<span class="text-sm text-gray-900">
									{#if database.includes('dev')}
										<Settings class="mr-0.5 inline h-4 w-4" />
									{:else}
										<Rocket class="mr-0.5 inline h-4 w-4" />
									{/if}
									{dbInfo.label.split(' ')[1]} ({filteredTables.filter((t) => {
										const tableDb =
											t.database || (t.value.includes('cenov_dev:') ? 'cenov_dev' : 'cenov');
										return tableDb === database;
									}).length})
								</span>
							</label>
						{/each}
					</div>
				</Card>

				<!-- Card Schéma -->
				<Card class="h-44 border-purple-200 bg-purple-50 p-4 shadow-none">
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
								onchange={() => handleSchemaChange('all')}
								class="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
							/>
							<span class="text-sm text-gray-900">
								<Package class="mr-1 inline h-4 w-4" />
								Tous les schémas ({filteredCount})
							</span>
						</label>
						{#each uniqueSchemas as schema (schema)}
							<label class="flex cursor-pointer items-center space-x-2">
								<input
									type="radio"
									name="schema"
									value={schema}
									bind:group={selectedSchema}
									onchange={() => handleSchemaChange(schema as 'all' | 'produit' | 'public')}
									class="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
								/>
								<span class="text-sm text-gray-900">
									{#if schema === 'produit'}
										<Package class="mr-0.5 inline h-4 w-4" />
									{:else}
										<LockOpen class="mr-0.5 inline h-4 w-4" />
									{/if}
									{SCHEMA_CONFIG[schema as keyof typeof SCHEMA_CONFIG]?.label || schema}
									({filteredTables.filter((t) => t.category === schema).length})
								</span>
							</label>
						{/each}
					</div>
				</Card>
			</div>

			<!-- Actions et recherche -->
			<div class="grid grid-cols-1 items-center gap-4 sm:grid-cols-2 lg:grid-cols-3">
				<!-- Actions -->
				<div class="flex items-center justify-center gap-4">
					<label class="flex min-h-[42px] cursor-pointer items-center space-x-2">
						<input
							type="checkbox"
							checked={filteredTables.length > 0 &&
								filteredTables.every((table) => selectedTables.includes(table.value))}
							onchange={toggleAllTables}
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
					<Search class="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
					<Input
						type="text"
						bind:value={searchTerm}
						placeholder="Rechercher une table, une vue..."
						class="min-h-[42px] pl-9"
					/>
				</div>

				<!-- Résumé sélection -->
				<div
					class="flex min-h-[42px] items-center justify-center rounded-lg border border-purple-200 bg-purple-50 px-6 py-3 text-center"
				>
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
					{@const tableDatabase =
						table.database || (table.value.includes('cenov_dev:') ? 'cenov_dev' : 'cenov')}
					{@const dbInfo = getDatabaseBadgeInfo(tableDatabase)}
					{@const schemaConfig = SCHEMA_CONFIG[table.category as keyof typeof SCHEMA_CONFIG]}
					{@const badges = renderBadges(table, dbInfo, schemaConfig)}
					{@const requiredStatus = getRequiredFieldsStatus(table.value)}
					<label
						class="flex max-w-xs cursor-pointer items-center space-x-3 rounded-lg border p-4 transition-colors hover:bg-blue-50 sm:max-w-none"
					>
						<input
							type="checkbox"
							bind:group={selectedTables}
							value={table.value}
							onchange={() => {
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
								{#if true}
									{@const IconComponent = getTableIcon(table.tableType)}
									<IconComponent class="h-5 w-5 text-gray-500" />
								{/if}

								<div class="min-w-0 flex-1">
									<!-- Desktop layout -->
									<div class="hidden sm:block">
										<div class="flex items-center gap-2">
											<span class="font-medium">{table.displayName || table.name}</span>
											{#if badges.tableBadge}
												<Badge variant={badges.tableBadge.variant}>
													{@const TableBadgeIcon = badges.tableBadge.icon}
													<TableBadgeIcon />
													{badges.tableBadge.label}
												</Badge>
											{/if}
											{#if badges.dbBadge}
												<Badge variant={badges.dbBadge.variant}>
													{@const DbBadgeIcon = badges.dbBadge.icon}
													<DbBadgeIcon />
													{badges.dbBadge.label}
												</Badge>
											{/if}
											{#if badges.schemaBadge}
												<Badge variant={badges.schemaBadge.variant}>
													{@const SchemaBadgeIcon = badges.schemaBadge.icon}
													<SchemaBadgeIcon />
													{badges.schemaBadge.label}
												</Badge>
											{/if}
											{#if requiredStatus}
												<Badge variant={requiredStatus.variant}>
													{@const RequiredIcon = requiredStatus.icon}
													<RequiredIcon />
													{requiredStatus.label}
												</Badge>
											{/if}
										</div>
										<div class="text-sm text-gray-500">
											{table.displayName || table.name} • {formatNumber(table.rowCount || 0)} lignes
											BDD
										</div>
									</div>

									<!-- Mobile layout -->
									<div class="sm:hidden">
										<div class="font-medium">{table.displayName || table.name}</div>
										<div class="mt-1 text-sm text-gray-500">
											{formatNumber(table.rowCount || 0)} lignes BDD • {table.columns?.length || 0} colonnes
										</div>
										<div class="mt-2 flex flex-wrap gap-1">
											{#if badges.tableBadge}
												<Badge variant={badges.tableBadge.variant}>
													{@const TableBadgeIcon = badges.tableBadge.icon}
													<TableBadgeIcon />
													{badges.tableBadge.label}
												</Badge>
											{/if}
											{#if badges.dbBadge}
												<Badge variant={badges.dbBadge.variant}>
													{@const DbBadgeIcon = badges.dbBadge.icon}
													<DbBadgeIcon />
													{badges.dbBadge.label}
												</Badge>
											{/if}
											{#if badges.schemaBadge}
												<Badge variant={badges.schemaBadge.variant}>
													{@const SchemaBadgeIcon = badges.schemaBadge.icon}
													<SchemaBadgeIcon />
													{badges.schemaBadge.label}
												</Badge>
											{/if}
											{#if requiredStatus}
												<Badge variant={requiredStatus.variant}>
													{@const RequiredIcon = requiredStatus.icon}
													<RequiredIcon />
													{requiredStatus.label}
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
