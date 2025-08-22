<!-- src/routes/export/+page.svelte -->
<script lang="ts">
	// import { enhance } from '$app/forms'; // Non utilisé
	import { fade, slide } from 'svelte/transition';
	import { superForm } from 'sveltekit-superforms/client';
	import { Card, Spinner } from 'flowbite-svelte';
	import * as Alert from '$lib/components/ui/alert';
	import { Button } from '$lib/components/ui/button';
	import * as Select from '$lib/components/ui/select';
	import * as Table from '$lib/components/ui/table';
	import { Badge } from '$lib/components/ui/badge';
	// import { Separator } from '$lib/components/ui/separator'; // Non utilisé
	import {
		// Download, // Non utilisé
		Database,
		FileSpreadsheet,
		FileText,
		FileImage,
		Settings,
		Eye,
		// AlertCircle, // Non utilisé
		CheckCircle,
		Filter,
		// Calendar, // Non utilisé
		// Hash, // Non utilisé
		BarChart3,
		FileDown,
		Play,
		RotateCcw
		// X, // Non utilisé
		// Check // Non utilisé
	} from 'lucide-svelte';
	import type { TableInfo, ExportResult } from './+page.server.js';

	export let data;

	// Initialisation du formulaire SuperForm
	const {
		form,
		enhance: superEnhance,
		submitting,
		// errors, // Non utilisé
		reset
	} = superForm(data.form, {
		dataType: 'json',
		onUpdated: ({ form }) => {
			if (form && form.data) {
				if ('result' in form.data) {
					const result = form.data.result as ExportResult;
					handleExportResult(result);
				}
				if ('preview' in form.data) {
					previewData = form.data.preview as Record<string, unknown[]>;
					step = 3; // Étape d'aperçu
				}
			}
		},
		onError: (event) => {
			console.error('Erreur de soumission:', event);
			Alert.alertActions.error("Une erreur est survenue lors de l'export");
		}
	});

	// État de l'interface
	let step = 1; // 1: Configuration, 2: Paramètres, 3: Aperçu, 4: Export
	let selectedCategory = 'all';
	let searchTerm = '';
	let previewData: Record<string, unknown[]> = {};
	let exportResult: ExportResult | null = null;
	let showAdvancedOptions = false;
	let dateFrom = '';
	let dateTo = '';

	// Synchroniser les dates avec le formulaire
	$: if (dateFrom || dateTo) {
		$form.dateRange = { from: dateFrom, to: dateTo };
	}

	// Catégories de tables
	const categories = [
		{ value: 'all', label: 'Toutes les tables', icon: Database },
		{ value: 'tables', label: 'Tables principales', icon: Database },
		{ value: 'views', label: 'Vues', icon: Eye },
		{ value: 'dev_tables', label: 'Tables de dev', icon: Settings },
		{ value: 'dev_views', label: 'Vues de dev', icon: Settings }
	];

	// Formats d'export
	const exportFormats = [
		{
			value: 'xlsx',
			label: 'Excel (.xlsx)',
			icon: FileSpreadsheet,
			description: 'Classeur Excel avec plusieurs feuilles',
			recommended: true
		},
		{
			value: 'csv',
			label: 'CSV (.csv)',
			icon: FileText,
			description: 'Fichier texte séparé par des virgules'
		},
		{
			value: 'pdf',
			label: 'PDF (.pdf)',
			icon: FileImage,
			description: 'Rapport PDF formaté (aperçu limité)'
		},
		{
			value: 'xml',
			label: 'XML (.xml)',
			icon: FileText,
			description: 'Données structurées en XML'
		}
	];

	// Tables filtrées selon la catégorie et la recherche
	$: filteredTables = data.tables.filter((table: TableInfo) => {
		const matchesCategory = selectedCategory === 'all' || table.category === selectedCategory;
		const matchesSearch =
			searchTerm === '' ||
			table.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
			table.displayName.toLowerCase().includes(searchTerm.toLowerCase());
		return matchesCategory && matchesSearch;
	});

	// Nombre de tables par catégorie
	$: tableCounts = {
		all: data.tables.length,
		tables: data.tables.filter((t: TableInfo) => t.category === 'tables').length,
		views: data.tables.filter((t: TableInfo) => t.category === 'views').length,
		dev_tables: data.tables.filter((t: TableInfo) => t.category === 'dev_tables').length,
		dev_views: data.tables.filter((t: TableInfo) => t.category === 'dev_views').length
	};

	// Icones pour les types de tables
	function getTableIcon(category: string) {
		switch (category) {
			case 'views':
			case 'dev_views':
				return Eye;
			case 'dev_tables':
				return Settings;
			default:
				return Database;
		}
	}

	// Couleur des badges selon la catégorie
	function getBadgeVariant(category: string) {
		switch (category) {
			case 'tables':
				return 'default';
			case 'views':
				return 'bleu';
			case 'dev_tables':
				return 'blanc';
			case 'dev_views':
				return 'blanc';
			default:
				return 'default';
		}
	}

	// Gestion des résultats d'export
	function handleExportResult(result: ExportResult) {
		exportResult = result;
		if (result.success) {
			Alert.alertActions.success(result.message);
			step = 4; // Étape finale
		} else {
			Alert.alertActions.error(result.message);
		}
	}

	// Sélection/désélection de toutes les tables visibles
	function toggleAllTables() {
		if ($form.selectedTables.length === filteredTables.length) {
			// Désélectionner toutes
			$form.selectedTables = [];
		} else {
			// Sélectionner toutes les tables visibles
			$form.selectedTables = filteredTables.map((t: TableInfo) => t.name);
		}
	}

	// Sélection rapide par catégorie
	function selectByCategory(category: string) {
		const tablesInCategory = data.tables
			.filter((t: TableInfo) => category === 'all' || t.category === category)
			.map((t: TableInfo) => t.name);
		$form.selectedTables = tablesInCategory;
	}

	// Formatage des nombres
	function formatNumber(num: number): string {
		return new Intl.NumberFormat('fr-FR').format(num);
	}

	// Formatage de la taille de fichier
	function formatFileSize(bytes: number): string {
		const units = ['B', 'KB', 'MB', 'GB'];
		let size = bytes;
		let unitIndex = 0;
		while (size >= 1024 && unitIndex < units.length - 1) {
			size /= 1024;
			unitIndex++;
		}
		return `${size.toFixed(1)} ${units[unitIndex]}`;
	}

	// Réinitialiser l'export
	function resetExport() {
		step = 1;
		previewData = {};
		exportResult = null;
		showAdvancedOptions = false;
		reset();
	}

	// Navigation entre les étapes
	function goToStep(newStep: number) {
		step = newStep;
	}

	// Validation des données avant de passer à l'étape suivante
	function validateAndNext() {
		if ($form.selectedTables.length === 0) {
			Alert.alertActions.error('Veuillez sélectionner au moins une table');
			return;
		}
		if (!$form.format) {
			Alert.alertActions.error("Veuillez sélectionner un format d'export");
			return;
		}
		step = 2;
	}
</script>

<div class="mx-auto my-8 max-w-7xl">
	<div class="mb-6">
		<h1 class="text-2xl font-bold">Export de données</h1>
		<p class="text-gray-600">
			Exportez vos données dans différents formats avec des options avancées
		</p>
	</div>

	<Alert.GlobalAlert />

	<!-- Indicateur d'étapes -->
	<div class="steps mb-8 flex justify-between">
		<div class={`step-item ${step >= 1 ? 'text-blue-700' : ''} flex-1`}>
			<div class="flex items-center">
				<div
					class={`mr-2 flex h-8 w-8 items-center justify-center rounded-full ${step >= 1 ? 'bg-blue-100 text-blue-700' : 'bg-gray-200'}`}
				>
					1
				</div>
				<span>Sélection des tables</span>
			</div>
		</div>
		<div class="step-separator mx-4 h-px flex-1 self-center bg-gray-300"></div>
		<div class={`step-item ${step >= 2 ? 'text-blue-700' : ''} flex-1`}>
			<div class="flex items-center">
				<div
					class={`mr-2 flex h-8 w-8 items-center justify-center rounded-full ${step >= 2 ? 'bg-blue-100 text-blue-700' : 'bg-gray-200'}`}
				>
					2
				</div>
				<span>Configuration</span>
			</div>
		</div>
		<div class="step-separator mx-4 h-px flex-1 self-center bg-gray-300"></div>
		<div class={`step-item ${step >= 3 ? 'text-blue-700' : ''} flex-1`}>
			<div class="flex items-center">
				<div
					class={`mr-2 flex h-8 w-8 items-center justify-center rounded-full ${step >= 3 ? 'bg-blue-100 text-blue-700' : 'bg-gray-200'}`}
				>
					3
				</div>
				<span>Aperçu & Export</span>
			</div>
		</div>
	</div>

	<!-- Résumé des données -->
	<div class="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
		<Card class="border-blue-200 bg-blue-50 p-4">
			<div class="flex items-center justify-between">
				<div>
					<div class="text-2xl font-bold text-blue-600">{data.totalTables}</div>
					<div class="text-sm text-blue-800">Tables disponibles</div>
				</div>
				<Database class="h-8 w-8 text-blue-500" />
			</div>
		</Card>
		<Card class="border-green-200 bg-green-50 p-4">
			<div class="flex items-center justify-between">
				<div>
					<div class="text-2xl font-bold text-green-600">{formatNumber(data.totalRows)}</div>
					<div class="text-sm text-green-800">Lignes totales</div>
				</div>
				<BarChart3 class="h-8 w-8 text-green-500" />
			</div>
		</Card>
		<Card class="border-purple-200 bg-purple-50 p-4">
			<div class="flex items-center justify-between">
				<div>
					<div class="text-2xl font-bold text-purple-600">{$form.selectedTables.length}</div>
					<div class="text-sm text-purple-800">Tables sélectionnées</div>
				</div>
				<CheckCircle class="h-8 w-8 text-purple-500" />
			</div>
		</Card>
	</div>

	<Card class="w-full">
		{#if step === 1}
			<!-- Étape 1: Sélection des tables -->
			<div class="mb-6">
				<h2 class="mb-4 text-xl font-semibold">Sélection des tables à exporter</h2>

				<!-- Filtres -->
				<div class="mb-6 space-y-4">
					<div class="flex flex-wrap gap-4">
						<!-- Recherche -->
						<div class="min-w-64 flex-1">
							<input
								type="text"
								bind:value={searchTerm}
								placeholder="Rechercher une table..."
								class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
							/>
						</div>

						<!-- Sélection par catégorie -->
						<Select.Select type="single" bind:value={selectedCategory}>
							<Select.SelectTrigger class="w-48">
								<span class="flex items-center gap-2">
									<Filter class="h-4 w-4" />
									{categories.find((c) => c.value === selectedCategory)?.label || 'Toutes'}
								</span>
							</Select.SelectTrigger>
							<Select.SelectContent>
								{#each categories as category (category.value)}
									<Select.SelectItem value={category.value}>
										<span class="flex items-center gap-2">
											<svelte:component this={category.icon} class="h-4 w-4" />
											{category.label} ({tableCounts[category.value as keyof typeof tableCounts]})
										</span>
									</Select.SelectItem>
								{/each}
							</Select.SelectContent>
						</Select.Select>
					</div>

					<!-- Actions rapides -->
					<div class="flex flex-wrap gap-2">
						<Button variant="blanc" size="sm" onclick={toggleAllTables}>
							{$form.selectedTables.length === filteredTables.length
								? 'Désélectionner'
								: 'Sélectionner'} tout
						</Button>
						<Button variant="blanc" size="sm" onclick={() => selectByCategory('tables')}>
							Tables principales ({tableCounts.tables})
						</Button>
						<Button variant="blanc" size="sm" onclick={() => selectByCategory('views')}>
							Vues ({tableCounts.views})
						</Button>
					</div>
				</div>

				<!-- Liste des tables -->
				<div class="mb-6 max-h-96 overflow-y-auto">
					<div class="grid gap-3">
						{#each filteredTables as table (table.name)}
							<label
								class="flex cursor-pointer items-center space-x-3 rounded-lg border p-4 transition-colors hover:bg-gray-50"
							>
								<input
									type="checkbox"
									bind:group={$form.selectedTables}
									value={table.name}
									class="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
								/>

								<div class="flex-1">
									<div class="flex items-center gap-3">
										<svelte:component
											this={getTableIcon(table.category)}
											class="h-5 w-5 text-gray-500"
										/>
										<div>
											<div class="flex items-center gap-2">
												<span class="font-medium">{table.displayName}</span>
												<Badge variant={getBadgeVariant(table.category)}>
													{table.category.replace('_', ' ')}
												</Badge>
											</div>
											<div class="text-sm text-gray-500">
												{table.name} • {formatNumber(table.rowCount)} lignes
											</div>
										</div>
									</div>
								</div>

								<div class="text-right text-sm text-gray-500">
									<div>{table.columns.length} colonnes</div>
									{#if table.relations && table.relations.length > 0}
										<div class="text-xs">{table.relations.length} relation(s)</div>
									{/if}
								</div>
							</label>
						{/each}
					</div>
				</div>

				<!-- Format d'export -->
				<div class="mb-6">
					<h3 class="mb-3 font-medium">Format d'export</h3>
					<div class="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
						{#each exportFormats as format (format.value)}
							<label
								class="flex cursor-pointer items-center space-x-3 rounded-lg border p-4 transition-colors hover:bg-gray-50 {$form.format ===
								format.value
									? 'border-blue-500 bg-blue-50'
									: ''}"
							>
								<input
									type="radio"
									bind:group={$form.format}
									value={format.value}
									class="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
								/>

								<div class="flex-1">
									<div class="flex items-center gap-2">
										<svelte:component this={format.icon} class="h-5 w-5 text-gray-500" />
										<span class="font-medium">{format.label}</span>
										{#if format.recommended}
											<Badge variant="default">Recommandé</Badge>
										{/if}
									</div>
									<div class="text-sm text-gray-500">{format.description}</div>
								</div>
							</label>
						{/each}
					</div>
				</div>

				<div class="flex justify-between">
					<Button variant="noir" onclick={resetExport}>
						<RotateCcw class="mr-2 h-4 w-4" />
						Réinitialiser
					</Button>
					<Button variant="bleu" onclick={validateAndNext}>
						Continuer
						<span class="ml-2">→</span>
					</Button>
				</div>
			</div>
		{:else if step === 2}
			<!-- Étape 2: Configuration des paramètres -->
			<div class="mb-6">
				<h2 class="mb-4 text-xl font-semibold">Configuration de l'export</h2>

				<form method="POST" action="?/preview" use:superEnhance>
					<!-- Configuration de base -->
					<div class="mb-6 space-y-4">
						<div class="flex items-center space-x-4">
							<label class="flex cursor-pointer items-center space-x-2">
								<input
									type="checkbox"
									bind:checked={$form.includeHeaders}
									class="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
								/>
								<span>Inclure les en-têtes de colonnes</span>
							</label>
						</div>

						<div class="flex items-center space-x-4">
							<label class="flex cursor-pointer items-center space-x-2">
								<input
									type="checkbox"
									bind:checked={$form.includeRelations}
									class="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
								/>
								<span>Inclure les données relationnelles</span>
							</label>
						</div>

						<!-- Limite de lignes -->
						<div class="flex items-center space-x-4">
							<label for="rowLimit" class="text-sm font-medium">Limite de lignes (optionnel):</label
							>
							<input
								id="rowLimit"
								type="number"
								bind:value={$form.rowLimit}
								placeholder="Pas de limite"
								min="1"
								max="1000000"
								class="w-32 rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
							/>
						</div>
					</div>

					<!-- Options avancées -->
					<div class="mb-6">
						<button
							type="button"
							onclick={() => (showAdvancedOptions = !showAdvancedOptions)}
							class="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800"
						>
							<Settings class="h-4 w-4" />
							Options avancées
						</button>

						{#if showAdvancedOptions}
							<div transition:slide class="mt-4 space-y-4 rounded-lg border border-gray-200 p-4">
								<!-- Filtre par date -->
								<div>
									<h4 class="mb-2 font-medium">
										Filtre par date (pour les tables avec created_at/updated_at)
									</h4>
									<div class="flex gap-4">
										<div>
											<label for="dateFrom" class="block text-sm text-gray-600">Du:</label>
											<input
												id="dateFrom"
												type="date"
												bind:value={dateFrom}
												class="rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
											/>
										</div>
										<div>
											<label for="dateTo" class="block text-sm text-gray-600">Au:</label>
											<input
												id="dateTo"
												type="date"
												bind:value={dateTo}
												class="rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
											/>
										</div>
									</div>
								</div>
							</div>
						{/if}
					</div>

					<!-- Résumé de la sélection -->
					<div class="mb-6 rounded-lg bg-gray-50 p-4">
						<h4 class="mb-2 font-medium">Résumé de votre export</h4>
						<div class="grid gap-2 text-sm">
							<div><strong>Tables sélectionnées:</strong> {$form.selectedTables.length}</div>
							<div>
								<strong>Format:</strong>
								{exportFormats.find((f) => f.value === $form.format)?.label}
							</div>
							<div>
								<strong>Inclure relations:</strong>
								{$form.includeRelations ? 'Oui' : 'Non'}
							</div>
							{#if $form.rowLimit}
								<div><strong>Limite:</strong> {formatNumber($form.rowLimit)} lignes</div>
							{/if}
						</div>

						<!-- Liste des tables -->
						<details class="mt-2">
							<summary class="cursor-pointer text-sm text-blue-600">Tables sélectionnées</summary>
							<div class="mt-2 space-y-1">
								{#each $form.selectedTables as tableName}
									{@const tableInfo = data.tables.find((t) => t.name === tableName)}
									<div class="flex items-center justify-between text-xs">
										<span>{tableInfo?.displayName || tableName}</span>
										<span class="text-gray-500"
											>{formatNumber(tableInfo?.rowCount || 0)} lignes</span
										>
									</div>
								{/each}
							</div>
						</details>
					</div>

					<!-- Champs cachés -->
					<input type="hidden" name="selectedTables" value={JSON.stringify($form.selectedTables)} />
					<input type="hidden" name="format" value={$form.format} />
					<input type="hidden" name="includeRelations" value={$form.includeRelations} />
					<input type="hidden" name="includeHeaders" value={$form.includeHeaders} />
					<input type="hidden" name="rowLimit" value={$form.rowLimit} />
					<input type="hidden" name="filters" value={JSON.stringify($form.filters)} />
					<input type="hidden" name="dateRange" value={JSON.stringify($form.dateRange)} />

					<div class="flex justify-between">
						<Button variant="noir" onclick={() => goToStep(1)}>← Retour</Button>
						<div class="flex gap-2">
							<Button type="submit" variant="blanc">
								{#if $submitting}
									<Spinner class="mr-2 h-4 w-4" />
									Génération de l'aperçu...
								{:else}
									<Eye class="mr-2 h-4 w-4" />
									Aperçu
								{/if}
							</Button>
							<Button
								onclick={() => {
									step = 3;
									// Simuler l'aperçu pour accéder directement à l'export
								}}
								variant="vert"
							>
								<Play class="mr-2 h-4 w-4" />
								Exporter directement
							</Button>
						</div>
					</div>
				</form>
			</div>
		{:else if step === 3}
			<!-- Étape 3: Aperçu et export -->
			<div class="mb-6">
				<h2 class="mb-4 text-xl font-semibold">Aperçu des données</h2>

				{#if Object.keys(previewData).length > 0}
					<!-- Aperçu des données -->
					<div class="mb-6 space-y-6">
						{#each Object.entries(previewData) as [tableName, rows]}
							{@const tableInfo = data.tables.find((t) => t.name === tableName)}
							<div>
								<div class="mb-3 flex items-center justify-between">
									<h3 class="flex items-center gap-2 font-medium">
										<svelte:component
											this={getTableIcon(tableInfo?.category || 'tables')}
											class="h-5 w-5"
										/>
										{tableInfo?.displayName || tableName}
									</h3>
									<Badge variant="blanc">{rows.length} lignes (aperçu)</Badge>
								</div>

								{#if rows.length > 0}
									<div class="overflow-x-auto">
										<Table.Root variant="striped">
											<Table.Header>
												<Table.Row variant="striped">
													{#each Object.keys(rows[0] as Record<string, unknown>) as column}
														<Table.Head variant="striped">{column}</Table.Head>
													{/each}
												</Table.Row>
											</Table.Header>
											<Table.Body>
												{#each rows.slice(0, 5) as row, rowIndex}
													<Table.Row variant="striped">
														{#each Object.keys(rows[0] as Record<string, unknown>) as column}
															<Table.Cell variant="striped" {rowIndex}>
																{@const typedRow = row as Record<string, unknown>}
																{typedRow[column] !== null && typedRow[column] !== undefined
																	? String(typedRow[column])
																	: ''}
															</Table.Cell>
														{/each}
													</Table.Row>
												{/each}
											</Table.Body>
										</Table.Root>
									</div>
									{#if rows.length > 5}
										<p class="mt-2 text-sm text-gray-500">
											... et {rows.length - 5} ligne(s) supplémentaire(s)
										</p>
									{/if}
								{:else}
									<p class="text-gray-500">Aucune donnée disponible</p>
								{/if}
							</div>
						{/each}
					</div>
				{/if}

				<!-- Export final -->
				<form method="POST" action="?/export" use:superEnhance>
					<!-- Champs cachés avec toute la configuration -->
					<input type="hidden" name="selectedTables" value={JSON.stringify($form.selectedTables)} />
					<input type="hidden" name="format" value={$form.format} />
					<input type="hidden" name="includeRelations" value={$form.includeRelations} />
					<input type="hidden" name="includeHeaders" value={$form.includeHeaders} />
					<input type="hidden" name="rowLimit" value={$form.rowLimit} />
					<input type="hidden" name="filters" value={JSON.stringify($form.filters)} />
					<input type="hidden" name="dateRange" value={JSON.stringify($form.dateRange)} />

					<div class="flex justify-between">
						<Button variant="noir" onclick={() => goToStep(2)}>← Configuration</Button>
						<Button type="submit" variant="vert" size="lg">
							{#if $submitting}
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
				<h2 class="mb-4 text-xl font-semibold">Export terminé</h2>

				{#if exportResult}
					<div class="rounded-lg border border-green-200 bg-green-50 p-6">
						<div class="mb-4 flex items-center gap-2">
							<CheckCircle class="h-6 w-6 text-green-500" />
							<h3 class="text-lg font-medium text-green-800">Export réussi</h3>
						</div>

						<div class="mb-4 space-y-2 text-sm">
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
							<div class="mb-4">
								<h4 class="mb-2 font-medium text-amber-800">Avertissements:</h4>
								<ul class="space-y-1 text-sm text-amber-700">
									{#each exportResult.warnings as warning}
										<li>• {warning}</li>
									{/each}
								</ul>
							</div>
						{/if}

						{#if exportResult.errors.length > 0}
							<div class="mb-4">
								<h4 class="mb-2 font-medium text-red-800">Erreurs:</h4>
								<ul class="space-y-1 text-sm text-red-700">
									{#each exportResult.errors as error}
										<li>• {error}</li>
									{/each}
								</ul>
							</div>
						{/if}

						<div class="flex gap-2">
							<Button variant="bleu" onclick={resetExport}>Nouvel export</Button>
						</div>
					</div>
				{/if}
			</div>
		{/if}
	</Card>

	{#if $submitting}
		<div
			transition:fade
			class="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black"
		>
			<div class="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
				<Spinner class="mx-auto mb-4" size="xl" />
				<p class="text-center font-medium">
					{step === 3 ? "Génération de l'export en cours..." : 'Traitement en cours...'}
				</p>
			</div>
		</div>
	{/if}
</div>
