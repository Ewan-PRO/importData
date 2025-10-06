<!-- src/routes/export/+page.svelte -->
<script lang="ts">
	import { fade } from 'svelte/transition';
	import { superForm } from 'sveltekit-superforms/client';
	import { Card, Spinner } from 'flowbite-svelte';
	import * as Alert from '$lib/components/ui/alert';
	import { Button } from '$lib/components/ui/button';
	import { Badge } from '$lib/components/ui/badge';
	import { Input } from '$lib/components/ui/input';
	import { toast } from 'svelte-sonner';
	import {
		Database,
		FileSpreadsheet,
		FileText,
		Eye,
		CheckCircle,
		Funnel,
		ChartColumn,
		RefreshCcw,
		CircleArrowRight,
		Rocket,
		Settings,
		LockOpen,
		Package,
		FileType,
		Sheet,
		Table as TableIcon,
		Search
	} from 'lucide-svelte';
	import type { ExportTableInfo, ExportResult } from './+page.server.js';
	import type { DatabaseName } from '$lib/prisma-meta.js';
	import ExportPreviewResult from './ExportPreviewResult.svelte';

	// Fonctions utilitaires locales
	function formatNumber(num: number): string {
		return new Intl.NumberFormat('fr-FR').format(num);
	}

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

	function formatPreviewValue(value: unknown): string {
		if (value === null || value === undefined) return '';

		const str = String(value);

		// Si c'est de l'hex (détection pour données binaires converties côté serveur)
		if (/^[0-9A-F]+$/i.test(str) && str.length > 10) {
			return '0x' + str.toUpperCase();
		}

		// Autres données - troncature à 50 caractères max
		return str.length > 50 ? str.substring(0, 47) + '...' : str;
	}

	export let data;

	if (!data?.tables?.length) {
		console.warn('⚠️ [CLIENT] Aucune table trouvée');
	}

	// Initialisation du formulaire SuperForm
	const { form, enhance: superEnhance, submitting, reset } = superForm(data.form, {
		dataType: 'json',
		onUpdated: ({ form }) => {
			console.log('🔄 [CLIENT] onUpdated appelé');
			console.log('📋 [CLIENT] Form data:', form?.data);

			if (form && form.data) {
				if ('result' in form.data) {
					console.log('📦 [CLIENT] Résultat d\'export trouvé dans onUpdated');
					const result = form.data.result as ExportResult;
					const fileData = (form.data as any).fileData;
					handleExportResult(result, fileData);
				}
				if ('preview' in form.data) {
					console.log('👀 [CLIENT] Données d\'aperçu trouvées dans onUpdated');
					previewData = form.data.preview as Record<string, unknown[]>;
					previewConfig = (form.data as any).previewConfig as { includeHeaders: boolean } | null;
					step = 3;
				}
			}
		},
		onResult: ({ result }) => {
			console.log('🎯 [CLIENT] onResult appelé');
			console.log('📊 [CLIENT] Result type:', result.type);
			console.log('📦 [CLIENT] Result data:', result.type === 'success' ? result.data : result);

			if (result.type === 'success' && result.data) {
				if ('result' in result.data) {
					console.log('📦 [CLIENT] Résultat d\'export trouvé dans onResult');
					const exportResult = result.data.result as ExportResult;
					const fileData = (result.data as any).fileData;
					handleExportResult(exportResult, fileData);
				}
				if ('preview' in result.data) {
					console.log('👀 [CLIENT] Données d\'aperçu trouvées dans onResult');
					previewData = result.data.preview as Record<string, unknown[]>;
					previewConfig = (result.data as any).previewConfig as { includeHeaders: boolean } | null;
					step = 3;
				}
			} else {
				console.warn('⚠️ [CLIENT] Result type non-success:', result.type);
			}
		},
		onError: (event) => {
			console.error('❌ [CLIENT] Erreur de soumission SuperForm:', event);
			Alert.alertActions.error("Une erreur est survenue lors de l'export");
		}
	});

	// État de l'interface
	let step = 1;
	let searchTerm = '';
	let previewData: Record<string, unknown[]> = {};
	let previewConfig: { includeHeaders: boolean } | null = null;
	let exportResult: ExportResult | null = null;

	// États pour les filtres
	let selectedType: 'all' | 'tables' | 'views' = 'all';
	let selectedDatabase: 'all' | DatabaseName = 'all';
	let selectedSchema: 'all' | string = 'all';

	// Configuration d'export sauvegardée
	let savedExportConfig: any = null;

	// Sauvegarder config quand on arrive à l'étape 3
	$: if (step === 3 && Object.keys(previewData).length > 0 && !savedExportConfig) {
		savedExportConfig = { ...$form };
		console.log('💾 [SYNC] Configuration sauvegardée:', savedExportConfig);
	}

	// Synchroniser les données du formulaire avec la config sauvegardée À CHAQUE RENDU
	$: if (step === 3 && savedExportConfig) {
		console.log('🔄 [SYNC] AVANT - $form.selectedSources:', $form.selectedSources?.length, 'format:', $form.format);
		console.log('🔄 [SYNC] savedExportConfig.selectedSources:', savedExportConfig.selectedSources?.length, 'format:', savedExportConfig.format);

		// Forcer la synchronisation
		$form.selectedSources = savedExportConfig.selectedSources;
		$form.format = savedExportConfig.format;
		$form.includeHeaders = savedExportConfig.includeHeaders;
		$form.rowLimit = savedExportConfig.rowLimit;
		$form.filters = savedExportConfig.filters;

		console.log('🔄 [SYNC] APRÈS - $form.selectedSources:', $form.selectedSources?.length, 'format:', $form.format);
	}

	// Récupération statique des bases de données
	const databases: DatabaseName[] = ['cenov', 'cenov_dev'];

	// Configuration des bases de données
	const DATABASE_CONFIG = {
		cenov: { icon: Rocket, variant: 'bleu' as const, emoji: '🚀' },
		cenov_dev: { icon: Settings, variant: 'orange' as const, emoji: '⚙️' }
	} as const;

	// Configuration des schémas
	const SCHEMA_CONFIG = {
		produit: { icon: Package, label: 'Produit', variant: 'purple' as const },
		public: { icon: LockOpen, label: 'Public', variant: 'cyan' as const }
	} as const;

	// Obtenir les schémas uniques
	$: uniqueSchemas = [...new Set((data?.tables || []).map((t: ExportTableInfo) => t.schema))];

	// Formats d'export
	const exportFormats = data.exportFormats.map((format) => ({
		...format,
		icon: format.value === 'xlsx' ? FileSpreadsheet : FileText
	}));

	// Fonction pour obtenir l'icône d'une BDD
	function getDatabaseIcon(database: string) {
		return database.includes('dev') ? DATABASE_CONFIG.cenov_dev.icon : DATABASE_CONFIG.cenov.icon;
	}

	// Fonction pour obtenir l'icône d'un schéma
	function getSchemaIcon(schema: string) {
		return SCHEMA_CONFIG[schema as keyof typeof SCHEMA_CONFIG]?.icon || LockOpen;
	}

	// Icones pour les types de tables
	function getTableIcon(category: string) {
		return category === 'views' ? Eye : Database;
	}

	// Couleur des badges
	function getBadgeVariant(category: string) {
		return category === 'view' ? 'vert' : 'noir';
	}

	// Couleur et contenu des badges selon la BDD
	function getDatabaseBadgeInfo(database: string): {
		variant: 'bleu' | 'noir' | 'orange';
		label: string;
	} {
		const config = database.includes('dev') ? DATABASE_CONFIG.cenov_dev : DATABASE_CONFIG.cenov;
		return {
			variant: config.variant,
			label: `${config.emoji} ${database.toUpperCase()}`
		};
	}

	// Gestion des résultats d'export
	function handleExportResult(result: ExportResult, fileData?: any) {
		console.log('🎯 [CLIENT] handleExportResult appelé');
		console.log('📦 [CLIENT] Result:', result);
		console.log('📁 [CLIENT] FileData:', fileData);

		exportResult = result;
		if (result.success) {
			console.log('✅ [CLIENT] Export réussi');
			if (fileData) {
				console.log('📥 [CLIENT] Déclenchement du téléchargement...');
				triggerDirectDownload(fileData);
			} else {
				console.warn('⚠️ [CLIENT] Aucune donnée de fichier reçue');
			}
			Alert.alertActions.success(result.message);
			step = 4;
		} else {
			console.error('❌ [CLIENT] Échec de l\'export:', result.message);
			Alert.alertActions.error(result.message);
		}
	}

	// Téléchargement direct depuis base64
	function triggerDirectDownload(fileData: any) {
		try {
			console.log('📥 [CLIENT] Début du téléchargement direct');
			console.log('📄 [CLIENT] Nom du fichier:', fileData.fileName);
			console.log('📦 [CLIENT] Type MIME:', fileData.mimeType);
			console.log('📊 [CLIENT] Taille (encodée):', fileData.content?.length || 0, 'caractères');

			if (!fileData.content) {
				throw new Error('Aucun contenu de fichier fourni');
			}

			console.log('🔄 [CLIENT] Décodage base64...');
			const binaryString = atob(fileData.content);
			console.log('✅ [CLIENT] Base64 décodé, taille:', binaryString.length, 'octets');

			const bytes = new Uint8Array(binaryString.length);
			for (let i = 0; i < binaryString.length; i++) {
				bytes[i] = binaryString.charCodeAt(i);
			}
			console.log('✅ [CLIENT] Conversion en Uint8Array terminée');

			const blob = new Blob([bytes], { type: fileData.mimeType });
			console.log('✅ [CLIENT] Blob créé, taille:', blob.size, 'octets');

			const url = window.URL.createObjectURL(blob);
			console.log('✅ [CLIENT] URL Blob créée:', url);

			const link = document.createElement('a');
			link.href = url;
			link.download = fileData.fileName;
			document.body.appendChild(link);

			console.log('⬇️ [CLIENT] Déclenchement du téléchargement:', fileData.fileName);
			link.click();

			// Nettoyage
			document.body.removeChild(link);
			window.URL.revokeObjectURL(url);

			console.log('✅ [CLIENT] Téléchargement direct terminé avec succès');
		} catch (err) {
			console.error('❌ [CLIENT] Erreur téléchargement direct:', err);
			console.error('❌ [CLIENT] Stack:', err instanceof Error ? err.stack : 'N/A');
			Alert.alertActions.error('Erreur lors du téléchargement du fichier');
		}
	}

	// Tables filtrées
	$: filteredTables = (data?.tables || []).filter((table: ExportTableInfo) => {
		const matchesType =
			selectedType === 'all' ||
			(selectedType === 'tables' && table.category === 'table') ||
			(selectedType === 'views' && table.category === 'view');
		const matchesDB = selectedDatabase === 'all' || table.database === selectedDatabase;
		const matchesSchema = selectedSchema === 'all' || table.schema === selectedSchema;
		const matchesSearch =
			searchTerm === '' ||
			table.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
			table.displayName.toLowerCase().includes(searchTerm.toLowerCase());
		return matchesType && matchesDB && matchesSchema && matchesSearch;
	});

	// Compter sources filtrées sélectionnées
	$: selectedFilteredCount = filteredTables.filter((table: ExportTableInfo) =>
		$form.selectedSources.includes(`${table.database}-${table.name}`)
	).length;

	// Réinitialiser l'export
	function resetExport() {
		step = 1;
		previewData = {};
		previewConfig = null;
		exportResult = null;
		savedExportConfig = null;
		reset();
	}

	// Navigation entre étapes
	function goToStep(newStep: number) {
		step = newStep;
	}

	// Validation avant étape suivante
	function validateAndNext() {
		if (!$form.format) {
			toast.error('Format non sélectionné', {
				description: "Veuillez sélectionner un format d'export."
			});
			return;
		}
		step = 2;
	}
</script>

<div class="mx-auto my-8 max-w-7xl">
	<div class="mb-6">
		<h1 class="text-2xl font-bold">Export de données :</h1>
		<p class="text-gray-600">
			Exportez vos données dans différents formats avec des options avancées
		</p>
	</div>

	<Alert.GlobalAlert />

	<!-- Indicateur d'étapes -->
	<Card class="mb-8 w-full max-w-none">
		<div class="steps flex justify-between">
			<div class={`step-item ${step >= 1 ? 'text-blue-700' : ''} flex-1`}>
				<div class="flex items-center">
					<div
						class={`mr-1 flex h-8 w-8 items-center justify-center rounded-full sm:mr-2 ${step >= 1 ? 'bg-blue-100 text-blue-700' : 'bg-gray-200'}`}
					>
						1
					</div>
					<span class="hidden sm:inline">Sélection des sources</span>
					<span class="sm:hidden">Sources</span>
				</div>
			</div>
			<div class="step-separator mx-4 h-px flex-1 self-center bg-gray-300"></div>
			<div class={`step-item ${step >= 2 ? 'text-blue-700' : ''} flex-1`}>
				<div class="flex items-center">
					<div
						class={`mr-1 flex h-8 w-8 items-center justify-center rounded-full sm:mr-2 ${step >= 2 ? 'bg-blue-100 text-blue-700' : 'bg-gray-200'}`}
					>
						2
					</div>
					<span class="hidden sm:inline">Configuration</span>
					<span class="sm:hidden">Config</span>
				</div>
			</div>
			<div class="step-separator mx-4 h-px flex-1 self-center bg-gray-300"></div>
			<div class={`step-item ${step >= 3 ? 'text-blue-700' : ''} flex-1`}>
				<div class="flex items-center">
					<div
						class={`mr-1 flex h-8 w-8 items-center justify-center rounded-full sm:mr-2 ${step >= 3 ? 'bg-blue-100 text-blue-700' : 'bg-gray-200'}`}
					>
						3
					</div>
					<span class="hidden sm:inline">Aperçu & Export</span>
					<span class="sm:hidden">Export</span>
				</div>
			</div>
		</div>
	</Card>

	<!-- Résumé des données -->
	<Card class="mb-6 w-full max-w-none">
		<div class="grid grid-cols-1 gap-4 md:grid-cols-3">
			<div class="rounded-lg border border-blue-200 bg-blue-50 p-4">
				<div class="flex items-center justify-between">
					<div>
						<div class="text-2xl font-bold text-blue-600">{data.totalTables}</div>
						<div class="text-sm text-blue-800">Sources disponibles</div>
					</div>
					<Database class="h-8 w-8 text-blue-500" />
				</div>
			</div>
			<div class="rounded-lg border border-green-200 bg-green-50 p-4">
				<div class="flex items-center justify-between">
					<div>
						<div class="text-2xl font-bold text-green-600">{data.formattedTotalRows}</div>
						<div class="text-sm text-green-800">Lignes totales</div>
					</div>
					<ChartColumn class="h-8 w-8 text-green-500" />
				</div>
			</div>
			<div class="rounded-lg border border-purple-200 bg-purple-50 p-4">
				<div class="flex items-center justify-between">
					<div>
						<div class="text-2xl font-bold text-purple-600">{filteredTables.length}</div>
						<div class="text-sm text-purple-800">Sources filtrées</div>
					</div>
					<CheckCircle class="h-8 w-8 text-purple-500" />
				</div>
			</div>
		</div>
	</Card>

	<Card class="w-full max-w-none">
		{#if step === 1}
			<!-- Étape 1: Sélection des tables -->
			<div class="mb-6">
				<h2 class="mb-4 text-xl font-bold text-black">Sélection des sources à exporter :</h2>

				<!-- Filtres avec Cards -->
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
										class="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
									/>
									<span class="text-sm text-gray-900"
										><FileType class="mr-1 inline h-4 w-4" />Tous ({filteredTables.length})</span
									>
								</label>
								<label class="flex cursor-pointer items-center space-x-2">
									<input
										type="radio"
										name="type"
										value="tables"
										bind:group={selectedType}
										class="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
									/>
									<span class="text-sm text-gray-900"
										><TableIcon class="mr-1 inline h-4 w-4" />Tables ({filteredTables.filter(
											(t) => t.category === 'table'
										).length})</span
									>
								</label>
								<label class="flex cursor-pointer items-center space-x-2">
									<input
										type="radio"
										name="type"
										value="views"
										bind:group={selectedType}
										class="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
									/>
									<span class="text-sm text-gray-900"
										><Eye class="mr-1 inline h-4 w-4" />Vues ({filteredTables.filter(
											(t) => t.category === 'view'
										).length})</span
									>
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
										class="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
									/>
									<span class="text-sm text-gray-900"
										><Database class="mr-1 inline h-4 w-4" />Toutes ({filteredTables.length})</span
									>
								</label>
								{#each databases as database}
									{@const dbInfo = getDatabaseBadgeInfo(database)}
									<label class="flex cursor-pointer items-center space-x-2">
										<input
											type="radio"
											name="database"
											value={database}
											bind:group={selectedDatabase}
											class="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
										/>
										<span class="text-sm text-gray-900">
											{#if database.includes('dev')}
												<Settings class="mr-0.5 inline h-4 w-4" />
											{:else}
												<Rocket class="mr-0.5 inline h-4 w-4" />
											{/if}
											{dbInfo.label.split(' ')[1]} ({filteredTables.filter(
												(t) => t.database === database
											).length})</span
										>
									</label>
								{/each}
							</div>
						</Card>

						<!-- Card Schéma -->
						<Card class="h-36 border-purple-200 bg-purple-50 p-4 shadow-none">
							<div class="mb-2 flex items-center gap-2">
								<Sheet class="h-5 w-5 text-purple-600" />
								<h3 class="text-lg font-semibold text-purple-700">Schéma :</h3>
							</div>
							<div class="space-y-2">
								<label class="flex cursor-pointer items-center space-x-2">
									<input
										type="radio"
										name="schema"
										value="all"
										bind:group={selectedSchema}
										class="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
									/>
									<span class="text-sm text-gray-900"
										><Sheet class="mr-1 inline h-4 w-4" />Tous ({filteredTables.length})</span
									>
								</label>
								{#each uniqueSchemas as schema}
									<label class="flex cursor-pointer items-center space-x-2">
										<input
											type="radio"
											name="schema"
											value={schema}
											bind:group={selectedSchema}
											class="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
										/>
										<span class="text-sm text-gray-900">
											{#if schema === 'produit'}
												<Package class="mr-0.5 inline h-4 w-4" />
											{:else}
												<LockOpen class="mr-0.5 inline h-4 w-4" />
											{/if}
											{SCHEMA_CONFIG[schema as keyof typeof SCHEMA_CONFIG]?.label || schema} ({filteredTables.filter(
												(t) => t.schema === schema
											).length})
										</span>
									</label>
								{/each}
							</div>
						</Card>
					</div>

					<!-- Recherche et actions -->
					<div class="grid grid-cols-1 items-center gap-6 sm:grid-cols-2 lg:grid-cols-3">
						<div class="flex items-center justify-center gap-4">
							<label class="flex min-h-[42px] cursor-pointer items-center space-x-2">
								<input
									type="checkbox"
									checked={filteredTables.length > 0 &&
										filteredTables.every((table: ExportTableInfo) =>
											$form.selectedSources.includes(`${table.database}-${table.name}`)
										)}
									onchange={() => {
										const filteredTableIds = filteredTables.map(
											(t: ExportTableInfo) => `${t.database}-${t.name}`
										);
										const selectedFilteredCount = filteredTableIds.filter((id) =>
											$form.selectedSources.includes(id)
										).length;

										if (selectedFilteredCount === filteredTables.length) {
											$form.selectedSources = $form.selectedSources.filter(
												(id) => !filteredTableIds.includes(id)
											);
										} else {
											const newSelection = [
												...new Set([...$form.selectedSources, ...filteredTableIds])
											];
											$form.selectedSources = newSelection;
										}
									}}
									class="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
								/>
								<span class="text-sm">Sélectionner tout ({filteredTables.length})</span>
							</label>

							<Button
								variant="noir"
								onclick={() => {
									selectedType = 'all';
									selectedDatabase = 'all';
									selectedSchema = 'all';
									searchTerm = '';
								}}
							>
								<RefreshCcw class="mr-2 h-4 w-4" />
								Réinitialiser
							</Button>
						</div>

						<div class="relative">
							<Search class="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
							<Input
								type="text"
								bind:value={searchTerm}
								placeholder="Rechercher..."
								class="min-h-[42px] pl-9"
							/>
						</div>

						<div
							class="flex min-h-[42px] items-center justify-center rounded-lg border border-purple-200 bg-purple-50 px-6 py-3"
						>
							<div class="flex items-center gap-1 text-sm text-purple-800">
								<CheckCircle class="h-4 w-4" />
								<span class="font-semibold">{selectedFilteredCount}</span> sélectionnées
							</div>
						</div>
					</div>
				</div>

				<!-- Liste des tables (simplifié pour ~450 lignes total) -->
				<div class="mb-6 max-h-96 overflow-y-auto">
					<div class="grid gap-3">
						{#each filteredTables as table (`${table.database}-${table.name}`)}
							{@const dbInfo = getDatabaseBadgeInfo(table.database)}
							{@const schemaVariant =
								SCHEMA_CONFIG[table.schema as keyof typeof SCHEMA_CONFIG]?.variant || 'cyan'}
							{@const schemaLabel =
								SCHEMA_CONFIG[table.schema as keyof typeof SCHEMA_CONFIG]?.label || table.schema}
							<label class="flex max-w-xs cursor-pointer items-center space-x-3 rounded-lg border p-4 transition-colors hover:bg-red-100 sm:max-w-none">
								<input
									type="checkbox"
									bind:group={$form.selectedSources}
									value={`${table.database}-${table.name}`}
									onchange={() => {
										const tableId = `${table.database}-${table.name}`;
										const isSelected = $form.selectedSources.includes(tableId);
										const tableType = table.category === 'view' ? 'vue' : 'table';

										if (isSelected) {
											toast.info(
												`${tableType.charAt(0).toUpperCase() + tableType.slice(1)} sélectionnée`,
												{
													description: `${table.displayName} (${table.formattedRowCount || formatNumber(table.rowCount || 0)} lignes)`
												}
											);
										} else {
											toast.info(
												`${tableType.charAt(0).toUpperCase() + tableType.slice(1)} désélectionnée`,
												{
													description: table.displayName
												}
											);
										}
									}}
									class="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
								/>

								<div class="flex-1">
									<div class="flex items-center gap-3">
										<svelte:component
											this={getTableIcon(table.category)}
											class="h-5 w-5 text-gray-500"
										/>
										<div class="min-w-0 flex-1">
											<div class="hidden sm:block">
												<div class="flex items-center gap-2">
													<span class="font-medium">{table.displayName}</span>
													<Badge variant={getBadgeVariant(table.category)}>
														{#if table.category === 'view'}
															<Eye />
														{:else}
															<TableIcon />
														{/if}
														{table.category}
													</Badge>
													<Badge variant={dbInfo.variant}>
														{#if table.database.includes('dev')}
															<Settings />
														{:else}
															<Rocket />
														{/if}
														{table.database.toUpperCase()}
													</Badge>
													<Badge variant={schemaVariant}>
														<svelte:component this={getSchemaIcon(table.schema)} />
														{schemaLabel}
													</Badge>
												</div>
												<div class="text-sm text-gray-500">
													{table.displayName} • {table.formattedRowCount ||
														formatNumber(table.rowCount || 0)} lignes
												</div>
											</div>

											<div class="sm:hidden">
												<div class="font-medium">{table.displayName}</div>
												<div class="mt-1 text-sm text-gray-500">
													{table.formattedRowCount || formatNumber(table.rowCount || 0)} lignes
												</div>
												<div class="mt-2 flex flex-wrap gap-1">
													<Badge variant={getBadgeVariant(table.category)}>
														{#if table.category === 'view'}
															<Eye />Vue
														{:else}
															<TableIcon />Table
														{/if}
													</Badge>
													<Badge variant={dbInfo.variant}>
														{#if table.database.includes('dev')}
															<Settings />{table.database.toUpperCase()}
														{:else}
															<Rocket />{table.database.toUpperCase()}
														{/if}
													</Badge>
													<Badge variant={schemaVariant}>
														<svelte:component this={getSchemaIcon(table.schema)} />
														{schemaLabel}
													</Badge>
												</div>
											</div>
										</div>
									</div>
								</div>

								<div class="hidden text-right text-sm text-gray-500 sm:block">
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
					<h3 class="mb-3 font-medium text-gray-900">Format d'export :</h3>
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
										<svelte:component this={format.icon} class="h-5 w-5 text-gray-900" />
										<span class="font-medium whitespace-nowrap text-gray-900">{format.label}</span>
										{#if format.recommended}
											<Badge variant="noir">Recommandé</Badge>
										{/if}
									</div>
									<div class="text-sm text-gray-900">{format.description}</div>
								</div>
							</label>
						{/each}
					</div>
				</div>

				<div class="flex justify-center gap-4">
					<Button
						variant="bleu"
						onclick={validateAndNext}
						disabled={$form.selectedSources.length === 0 || !$form.format}
					>
						Continuer
						<CircleArrowRight class="ml-2 h-4 w-4" />
					</Button>
				</div>
			</div>
		{/if}

		<!-- Étapes 2, 3 et 4: Configuration, Aperçu et Résultat -->
		<ExportPreviewResult
			{step}
			{previewData}
			{previewConfig}
			{exportResult}
			formStore={form}
			{superEnhance}
			{exportFormats}
			tables={data.tables}
			{goToStep}
			{resetExport}
			{formatPreviewValue}
			{formatNumber}
			{formatFileSize}
			submitting={$submitting}
		/>
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
