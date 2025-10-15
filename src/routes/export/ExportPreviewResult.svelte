<!-- src/routes/export/ExportPreviewResult.svelte -->
<script lang="ts">
	import { Spinner } from 'flowbite-svelte';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import * as Table from '$lib/components/ui/table';
	import { Badge } from '$lib/components/ui/badge';
	import {
		Eye,
		CheckCircle,
		CircleArrowLeft,
		FileDown,
		CirclePlus,
		LockOpen,
		Table as TableIcon,
		AlertCircle
	} from 'lucide-svelte';
	import type { ExportTableInfo, ExportResult } from './+page.server.js';
	import {
		SCHEMA_CONFIG,
		Rocket,
		Settings,
		getDatabaseBadgeInfo,
		getTableIcon,
		getBadgeVariant,
		parseTableName
	} from '$lib/components/ui-database-config';
	import type { Writable } from 'svelte/store';
	import type { Action } from 'svelte/action';

	interface ExportFormData {
		selectedSources: string[];
		format: string;
		includeHeaders: boolean;
		rowLimit?: number;
		filters: Record<string, unknown>;
	}

	// Props avec $props() - Mode Runes Svelte 5
	let {
		step,
		previewData,
		previewConfig,
		exportResult,
		formStore,
		submitting,
		superEnhance,
		exportFormats,
		tables,
		goToStep,
		resetExport,
		formatPreviewValue,
		formatNumber,
		formatFileSize
	}: {
		step: number;
		previewData: Record<string, unknown[]>;
		previewConfig: { includeHeaders: boolean } | null;
		exportResult: ExportResult | null;
		formStore: Writable<ExportFormData>;
		submitting: boolean;
		superEnhance: Action<HTMLFormElement>;
		exportFormats: Array<{
			value: string;
			label: string;
			description: string;
			recommended?: boolean;
		}>;
		tables: ExportTableInfo[];
		goToStep: (step: number) => void;
		resetExport: () => void;
		formatPreviewValue: (value: unknown) => string;
		formatNumber: (num: number) => string;
		formatFileSize: (bytes: number) => string;
	} = $props();

	// Raccourci local pour accéder au store (mode runes)
	let form = $derived($formStore);

	// ✅ Variables réactives EXPLICITES avec $derived (Svelte 5)
	// Remplace les console.log réactifs par une approche propre
	let selectedSourcesData = $derived($formStore.selectedSources || []);
	let formatData = $derived($formStore.format || 'csv');
	let includeHeadersData = $derived($formStore.includeHeaders);
	let rowLimitData = $derived($formStore.rowLimit || '');
	let filtersData = $derived($formStore.filters || {});

	// Handler pour la soumission - utilise les variables dérivées
	function handleExportSubmit() {
		console.log('📤 [SUBMIT] Export:', selectedSourcesData.length, 'sources - Format:', formatData);

		// Laisser SuperForm gérer la soumission
		// Le use:superEnhance s'en occupe
	}
</script>

{#if step === 2}
	<!-- Étape 2: Configuration des paramètres -->
	<div class="mb-6">
		<h2 class="mb-4 text-xl font-semibold text-black">Configuration de l'export :</h2>

		<form method="POST" action="?/preview" use:superEnhance>
			<!-- Configuration de base -->
			<div class="mb-6 space-y-4">
				<div class="flex items-center space-x-4">
					<label class="flex cursor-pointer items-center space-x-2">
						<input
							type="checkbox"
							bind:checked={$formStore.includeHeaders}
							class="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
						/>
						<span>
							{#if $formStore.includeHeaders}
								<span class="hidden sm:inline">Inclure les en-têtes de colonnes</span>
								<span class="sm:hidden">Avec en-têtes</span>
							{:else}
								<span class="hidden sm:inline">Données uniquement (sans en-têtes)</span>
								<span class="sm:hidden">Données seules</span>
							{/if}
						</span>
					</label>
				</div>

				<!-- Limite de lignes -->
				<div class="flex items-center space-x-4">
					<label for="rowLimit" class="text-sm font-medium">Limite de lignes (optionnel) :</label>
					<Input
						id="rowLimit"
						type="number"
						bind:value={$formStore.rowLimit}
						placeholder="Pas de limite"
						min="1"
						max="1000000"
						class="w-48"
					/>
				</div>
			</div>

			<!-- Champs cachés -->
			<input
				type="hidden"
				name="selectedSources"
				value={JSON.stringify($formStore.selectedSources)}
			/>
			<input type="hidden" name="format" value={$formStore.format} />
			<input type="hidden" name="includeHeaders" value={$formStore.includeHeaders} />
			<input type="hidden" name="rowLimit" value={$formStore.rowLimit} />
			<input type="hidden" name="filters" value={JSON.stringify($formStore.filters)} />

			<div class="flex justify-center gap-4">
				<Button variant="noir" onclick={() => goToStep(1)}>
					<CircleArrowLeft class="mr-2 h-4 w-4" />
					Retour
				</Button>
				<Button type="submit" variant="bleu">
					{#if submitting}
						<Spinner class="mr-2 h-4 w-4" />
						Génération de l'aperçu...
					{:else}
						<Eye class="mr-2 h-4 w-4" />
						Aperçu
					{/if}
				</Button>
			</div>
		</form>
	</div>
{:else if step === 3}
	<!-- Étape 3: Aperçu et export -->
	<div class="mb-6">
		<div class="mb-4 flex items-center justify-between">
			<h2 class="text-xl font-semibold text-black">Aperçu des données :</h2>
			<Badge variant="bleu">
				Format: {exportFormats.find((f) => f.value === form.format)?.label || form.format}
			</Badge>
		</div>

		{#if Object.keys(previewData).length > 0}
			<!-- Aperçu des données -->
			<div class="mb-6 space-y-6">
				{#each Object.entries(previewData) as [tableName, rows] (tableName)}
					{@const matchingTableInfo = (() => {
						// tableName est maintenant au format "database-tablename"
						if (tableName.includes('-')) {
							const [database, ...tableNameParts] = tableName.split('-');
							const realTableName = tableNameParts.join('-');
							return tables.find((t) => t.name === realTableName && t.database === database);
						}
						// Fallback pour compatibilité
						return tables.find((t) => t.name === tableName);
					})()}
					{@const dbInfo = matchingTableInfo
						? getDatabaseBadgeInfo(matchingTableInfo.database)
						: { variant: 'noir' as const, label: 'Inconnue' }}
					{@const schemaVariant = matchingTableInfo?.schema
						? SCHEMA_CONFIG[matchingTableInfo.schema as keyof typeof SCHEMA_CONFIG]?.variant ||
							'cyan'
						: 'cyan'}
					{@const schemaLabel = matchingTableInfo?.schema
						? SCHEMA_CONFIG[matchingTableInfo.schema as keyof typeof SCHEMA_CONFIG]?.label ||
							matchingTableInfo.schema
						: 'Inconnu'}
					{@const TableIconComponent = getTableIcon(matchingTableInfo?.category || 'tables')}
					{@const SchemaIconComponent = matchingTableInfo?.schema
						? SCHEMA_CONFIG[matchingTableInfo.schema as keyof typeof SCHEMA_CONFIG]?.icon
						: LockOpen}
					<div>
						<div class="mb-3">
							<!-- Desktop: layout horizontal -->
							<div class="hidden items-center justify-between sm:flex">
								<div class="flex items-center gap-3">
									<h3 class="flex items-center gap-2 font-medium">
										<TableIconComponent class="h-5 w-5" />
										{matchingTableInfo?.displayName || parseTableName(tableName)}
									</h3>
									{#if matchingTableInfo}
										<Badge variant={getBadgeVariant(matchingTableInfo.category)}>
											{#if matchingTableInfo.category === 'view'}
												<Eye />
											{:else}
												<TableIcon />
											{/if}
											{matchingTableInfo.category.replace('_', ' ')}
										</Badge>
										<Badge variant={dbInfo.variant}>
											{#if matchingTableInfo?.database.includes('dev')}
												<Settings />
											{:else}
												<Rocket />
											{/if}
											{matchingTableInfo?.database.toUpperCase()}
										</Badge>
										<Badge variant={schemaVariant}>
											<SchemaIconComponent />
											{schemaLabel}
										</Badge>
									{/if}
								</div>
								<Badge variant="blanc">{rows.length} lignes (aperçu)</Badge>
							</div>

							<!-- Mobile: layout vertical compact -->
							<div class="sm:hidden">
								<div class="mb-2 flex items-center justify-between">
									<h3 class="flex items-center gap-2 font-medium">
										<TableIconComponent class="h-5 w-5" />
										{matchingTableInfo?.displayName || parseTableName(tableName)}
									</h3>
									<Badge variant="blanc">{rows.length} lignes</Badge>
								</div>
								{#if matchingTableInfo}
									<div class="flex flex-wrap gap-1">
										<Badge variant={getBadgeVariant(matchingTableInfo.category)}>
											{#if matchingTableInfo.category === 'view'}
												<Eye />
												Vue
											{:else}
												<TableIcon />
												Table
											{/if}
										</Badge>
										<Badge variant={dbInfo.variant}>
											{#if matchingTableInfo?.database.includes('dev')}
												<Settings />
												{matchingTableInfo.database.toUpperCase()}
											{:else}
												<Rocket />
												{matchingTableInfo.database.toUpperCase()}
											{/if}
										</Badge>
										<Badge variant={schemaVariant}>
											<SchemaIconComponent />
											{schemaLabel}
										</Badge>
									</div>
								{/if}
							</div>
						</div>

						<!-- Afficher colonnes même si pas de données -->
						{#if matchingTableInfo?.columns && matchingTableInfo.columns.length > 0}
							<div class="overflow-x-auto">
								<Table.Root variant="striped">
									{#if previewConfig?.includeHeaders ?? form.includeHeaders}
										<Table.Header>
											<Table.Row variant="striped">
												{#each matchingTableInfo.columns as column (column.name)}
													<Table.Head variant="striped">{column.name}</Table.Head>
												{/each}
											</Table.Row>
										</Table.Header>
									{/if}
									<Table.Body>
										{#if rows.length > 0}
											{#each rows as row, rowIndex (rowIndex)}
												<Table.Row variant="striped">
													{#each matchingTableInfo.columns as column (column.name)}
														<Table.Cell variant="striped" {rowIndex}>
															{@const typedRow = row as Record<string, unknown>}
															{formatPreviewValue(typedRow[column.name])}
														</Table.Cell>
													{/each}
												</Table.Row>
											{/each}
										{:else}
											<!-- Table vide : afficher une ligne d'exemple vide -->
											<Table.Row variant="striped">
												{#each matchingTableInfo.columns as column (column.name)}
													<Table.Cell variant="striped" class="text-gray-400 italic">
														(aucune donnée)
													</Table.Cell>
												{/each}
											</Table.Row>
										{/if}
									</Table.Body>
								</Table.Root>
							</div>
						{:else}
							<!-- Erreur de lecture des métadonnées -->
							<div class="py-8 text-center">
								<div class="mb-2 text-red-400">
									<AlertCircle class="mx-auto h-12 w-12" />
								</div>
								<p class="font-medium text-red-600">Erreur de lecture des métadonnées</p>
								<p class="text-sm text-gray-500">
									Impossible d'accéder aux informations de cette table
								</p>
							</div>
						{/if}
					</div>
				{/each}
			</div>
		{/if}

		<!-- Export final -->
		<form method="POST" action="?/export" use:superEnhance onsubmit={handleExportSubmit}>
			<!-- Champs cachés avec variables dérivées réactives -->
			<!-- ✅ Utilise les variables $derived au lieu de console.log réactifs -->
			<input type="hidden" name="selectedSources" value={JSON.stringify(selectedSourcesData)} />
			<input type="hidden" name="format" value={formatData} />
			<input type="hidden" name="includeHeaders" value={String(includeHeadersData !== false)} />
			<input type="hidden" name="rowLimit" value={rowLimitData} />
			<input type="hidden" name="filters" value={JSON.stringify(filtersData)} />

			<div class="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
				<Button variant="noir" onclick={() => goToStep(2)}>
					<CircleArrowLeft class="mr-2 h-4 w-4" />
					Configuration
				</Button>
				<Button type="submit" variant="vert" size="lg">
					{#if submitting}
						<Spinner class="mr-2 h-4 w-4" />
						Export en cours...
					{:else}
						<FileDown class="mr-2 h-4 w-4" />
						Télécharger l'export
					{/if}
				</Button>
			</div>
		</form>
	</div>
{:else if step === 4}
	<!-- Étape 4: Résultat de l'export -->
	<div class="mb-6">
		<h2 class="mb-4 text-xl font-semibold text-black">Export terminé :</h2>

		{#if exportResult}
			<div class="rounded-lg border border-green-200 bg-green-50 p-6">
				<div class="mb-4 flex items-center justify-center gap-2">
					<CheckCircle class="h-6 w-6 text-green-500" />
					<h3 class="text-lg font-medium text-green-800">Export réussi</h3>
				</div>

				<div class="mb-4 space-y-2 text-center text-sm text-black">
					<div><strong>Fichier:</strong> {exportResult.fileName}</div>
					<div>
						<strong>Taille:</strong>
						{exportResult.fileSize ? formatFileSize(exportResult.fileSize) : 'N/A'}
					</div>
					<div>
						<strong>Lignes exportées:</strong>
						{formatNumber(exportResult.exportedRows)}
					</div>
				</div>

				{#if exportResult.warnings.length > 0}
					<div class="mb-4 text-center">
						<h4 class="mb-2 font-medium text-red-800">Avertissements:</h4>
						<ul class="space-y-1 text-sm text-red-700">
							{#each exportResult.warnings as warning, i (i)}
								<li>• {warning}</li>
							{/each}
						</ul>
					</div>
				{/if}

				{#if exportResult.errors.length > 0}
					<div class="mb-4 text-center">
						<h4 class="mb-2 font-medium text-red-800">Erreurs:</h4>
						<ul class="space-y-1 text-sm text-red-700">
							{#each exportResult.errors as error, i (i)}
								<li>• {error}</li>
							{/each}
						</ul>
					</div>
				{/if}

				<div class="flex justify-center">
					<Button variant="vert" onclick={resetExport}>
						<CirclePlus class="mr-2 h-4 w-4" />
						Nouvel export
					</Button>
				</div>
			</div>
		{/if}
	</div>
{/if}
