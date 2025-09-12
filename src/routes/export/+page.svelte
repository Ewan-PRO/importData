<!-- src/routes/export/+page.svelte -->
<script lang="ts">
	import { fade } from 'svelte/transition';
	import { superForm } from 'sveltekit-superforms/client';
	import { Card, Spinner } from 'flowbite-svelte';
	import * as Alert from '$lib/components/ui/alert';
	import { Button } from '$lib/components/ui/button';
	import * as Select from '$lib/components/ui/select';
	import * as Table from '$lib/components/ui/table';
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
		FileDown,
		RefreshCcw,
		CircleArrowRight,
		CircleArrowLeft,
		CirclePlus,
		Rocket,
		Settings,
		LockOpen,
		Package
	} from 'lucide-svelte';
	import type { ExportTableInfo, ExportResult } from './+page.server.js';
	import { getAllDatabaseNames, getSchemaInfo, type DatabaseName } from '$lib/prisma-meta.js';

	export let data;

	if (!data?.tables?.length) {
		console.warn('⚠️ [CLIENT] Aucune table trouvée');
	}

	// Initialisation du formulaire SuperForm
	const {
		form,
		enhance: superEnhance,
		submitting,
		reset
	} = superForm(data.form, {
		dataType: 'json',
		onUpdated: ({ form }) => {
			console.log('🔄 [CLIENT] onUpdated appelé, form.data:', form?.data);
			if (form && form.data) {
				if ('result' in form.data) {
					console.log("📦 [CLIENT] Résultat d'export reçu:", form.data.result);
					const result = form.data.result as ExportResult;
					handleExportResult(result);
				}
				if ('preview' in form.data) {
					console.log("👀 [CLIENT] Données d'aperçu reçues");
					previewData = form.data.preview as Record<string, unknown[]>;
					step = 3; // Étape d'aperçu
				}
			}
		},
		onResult: ({ result }) => {
			console.log('🎯 [CLIENT] onResult appelé:', result);
			if (result.type === 'success' && result.data) {
				console.log('📊 [CLIENT] Données de résultat:', result.data);
				if ('result' in result.data) {
					console.log("📦 [CLIENT] Résultat d'export dans onResult:", result.data.result);
					const exportResult = result.data.result as ExportResult;
					handleExportResult(exportResult);
				}
				if ('preview' in result.data) {
					console.log('👀 [CLIENT] Aperçu dans onResult');
					previewData = result.data.preview as Record<string, unknown[]>;
					step = 3;
				}
			}
		},
		onError: (event) => {
			console.error('❌ [CLIENT] Erreur de soumission SuperForm:', event);
			Alert.alertActions.error("Une erreur est survenue lors de l'export");
		}
	});

	// État de l'interface
	let step = 1; // 1: Configuration, 2: Paramètres, 3: Aperçu, 4: Export
	let selectedCategory = 'all';
	let searchTerm = '';
	let previewData: Record<string, unknown[]> = {};
	let exportResult: ExportResult | null = null;

	// Nouveaux états pour groupes exclusifs
	let selectedType: 'all' | 'tables' | 'views' = 'all';
	let selectedDatabases: DatabaseName[] = [];
	let selectedSchemas: string[] = [];

	// Configuration d'export sauvegardée pour persistance entre aperçu et export
	let savedExportConfig: any = null;

	// Sauvegarder et synchroniser la configuration quand on arrive à l'étape 3 avec des données d'aperçu
	$: if (step === 3 && Object.keys(previewData).length > 0 && !savedExportConfig) {
		savedExportConfig = { ...$form };
		console.log('💾 [CLIENT] Configuration sauvegardée automatiquement:', savedExportConfig);
	}

	// Synchroniser les données du formulaire avec la config sauvegardée quand on est à l'étape 3
	$: if (step === 3 && savedExportConfig) {
		console.log('🔄 [CLIENT] Synchronisation automatique des données du formulaire');
		console.log('📋 [CLIENT] Config sauvegardée:', savedExportConfig);
		console.log('📋 [CLIENT] Formulaire avant sync:', { ...$form });

		$form.selectedTables = savedExportConfig.selectedTables;
		$form.format = savedExportConfig.format;
		$form.includeHeaders = savedExportConfig.includeHeaders;
		$form.rowLimit = savedExportConfig.rowLimit;
		$form.filters = savedExportConfig.filters;

		console.log('📋 [CLIENT] Formulaire après sync:', { ...$form });
	}

	// Récupération statique des bases de données (côté client)
	const databases: DatabaseName[] = ['cenov', 'cenov_dev_ewan'];

	// Fonction pour obtenir l'icône d'une BDD
	function getDatabaseIcon(database: string) {
		return database.includes('dev') ? Settings : Rocket;
	}

	// Obtenir les schémas uniques
	$: uniqueSchemas = [...new Set((data?.tables || []).map((t: ExportTableInfo) => t.schema))];

	// Logique dynamique pour validation des schémas (sans hardcoding)
	$: availableSchemas = uniqueSchemas.filter((schema) => {
		// Si aucune base sélectionnée, tous les schémas sont disponibles
		if (selectedDatabases.length === 0) return true;

		// Un schéma est disponible si au moins une base sélectionnée le contient
		return selectedDatabases.some((db) =>
			(data?.tables || []).some((t) => t.database === db && t.schema === schema)
		);
	});

	// Auto-nettoyage des schémas non disponibles
	$: if (selectedSchemas.length > 0) {
		const validSchemas = selectedSchemas.filter((schema) => availableSchemas.includes(schema));
		if (validSchemas.length !== selectedSchemas.length) {
			selectedSchemas = validSchemas;
		}
	}

	// Compteurs pour les nouveaux groupes
	$: newGroupCounts = {
		// Type counts
		all: (data?.tables || []).filter((t) => {
			const matchesDB = selectedDatabases.length === 0 || selectedDatabases.includes(t.database);
			const matchesSchema = selectedSchemas.length === 0 || selectedSchemas.includes(t.schema);
			return matchesDB && matchesSchema;
		}).length,
		tables: (data?.tables || []).filter((t) => {
			const matchesDB = selectedDatabases.length === 0 || selectedDatabases.includes(t.database);
			const matchesSchema = selectedSchemas.length === 0 || selectedSchemas.includes(t.schema);
			return t.category === 'table' && matchesDB && matchesSchema;
		}).length,
		views: (data?.tables || []).filter((t) => {
			const matchesDB = selectedDatabases.length === 0 || selectedDatabases.includes(t.database);
			const matchesSchema = selectedSchemas.length === 0 || selectedSchemas.includes(t.schema);
			return t.category === 'view' && matchesDB && matchesSchema;
		}).length,
		// Database counts
		...Object.fromEntries(
			databases.map((db: DatabaseName) => [
				db,
				(data?.tables || []).filter((t) => {
					const matchesType =
						selectedType === 'all' ||
						(selectedType === 'tables' && t.category === 'table') ||
						(selectedType === 'views' && t.category === 'view');
					const matchesSchema = selectedSchemas.length === 0 || selectedSchemas.includes(t.schema);
					return t.database === db && matchesType && matchesSchema;
				}).length
			])
		),
		// Schema counts
		...Object.fromEntries(
			uniqueSchemas.map((schema: string) => [
				`schema_${schema}`,
				(data?.tables || []).filter((t) => {
					const matchesType =
						selectedType === 'all' ||
						(selectedType === 'tables' && t.category === 'table') ||
						(selectedType === 'views' && t.category === 'view');
					const matchesDB =
						selectedDatabases.length === 0 || selectedDatabases.includes(t.database);
					return t.schema === schema && matchesType && matchesDB;
				}).length
			])
		)
	} as Record<string, number>;

	// Fonction pour obtenir l'icône d'un schéma
	function getSchemaIcon(schema: string) {
		return schema === 'produit' ? Package : LockOpen;
	}

	// Génération dynamique des catégories avec schémas
	$: categories = [
		{ value: 'all', label: 'Toutes les sources', icon: Funnel },
		{ value: 'tables', label: 'Tables', icon: Database },
		{ value: 'views', label: 'Vues', icon: Eye },
		...databases.map((db: DatabaseName) => ({
			value: db,
			label: db.replace('_', ' '),
			icon: getDatabaseIcon(db)
		})),
		...uniqueSchemas.map((schema: string) => ({
			value: `schema_${schema}`,
			label: getSchemaInfo(schema).label,
			icon: getSchemaIcon(schema)
		}))
	];

	// Formats d'export
	const exportFormats = [
		{
			value: 'csv',
			label: 'CSV (.csv)',
			icon: FileText,
			description: 'Fichier texte séparé par des virgules',
			recommended: true
		},
		{
			value: 'xlsx',
			label: 'Excel (.xlsx)',
			icon: FileSpreadsheet,
			description: 'Classeur Excel avec plusieurs feuilles'
		},
		{
			value: 'json',
			label: 'JSON (.json)',
			icon: FileText,
			description: 'Structure de données avec métadonnées'
		},
		{
			value: 'xml',
			label: 'XML (.xml)',
			icon: FileText,
			description: 'Données structurées en XML'
		}
	];

	// Tables filtrées selon la catégorie et la recherche - DYNAMIQUE
	$: filteredTables = (data?.tables || []).filter((table: ExportTableInfo) => {
		// Logique dynamique pour les catégories, bases de données et schémas
		let matchesCategory = false;
		if (selectedCategory === 'all') {
			matchesCategory = true;
		} else if (selectedCategory === 'tables' && table.category === 'table') {
			matchesCategory = true;
		} else if (selectedCategory === 'views' && table.category === 'view') {
			matchesCategory = true;
		} else if (
			databases.includes(selectedCategory as DatabaseName) &&
			table.database === selectedCategory
		) {
			matchesCategory = true;
		} else if (selectedCategory.startsWith('schema_')) {
			const schema = selectedCategory.replace('schema_', '');
			matchesCategory = table.schema === schema;
		}

		const matchesSearch =
			searchTerm === '' ||
			table.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
			table.displayName.toLowerCase().includes(searchTerm.toLowerCase());
		return matchesCategory && matchesSearch;
	});

	// Nombre de tables par catégorie - DYNAMIQUE avec compteurs croisés
	$: tableCounts = {
		all: (data?.tables || []).length,
		tables: (data?.tables || []).filter((t: ExportTableInfo) => t.category === 'table').length,
		views: (data?.tables || []).filter((t: ExportTableInfo) => t.category === 'view').length,
		// Compteurs par BDD (dynamique)
		...Object.fromEntries(
			databases.map((db: DatabaseName) => [
				db,
				(data?.tables || []).filter((t: ExportTableInfo) => t.database === db).length
			])
		),
		// Compteurs par schéma (dynamique)
		...Object.fromEntries(
			uniqueSchemas.map((schema: string) => [
				`schema_${schema}`,
				(data?.tables || []).filter((t: ExportTableInfo) => t.schema === schema).length
			])
		),
		// Compteurs croisés (dynamique)
		...Object.fromEntries(
			databases.flatMap((db: DatabaseName) => [
				[
					`tables_${db}`,
					(data?.tables || []).filter(
						(t: ExportTableInfo) => t.category === 'table' && t.database === db
					).length
				],
				[
					`views_${db}`,
					(data?.tables || []).filter(
						(t: ExportTableInfo) => t.category === 'view' && t.database === db
					).length
				]
			])
		),
		// Compteurs croisés schéma-catégorie
		...Object.fromEntries(
			uniqueSchemas.flatMap((schema: string) => [
				[
					`schema_${schema}_tables`,
					(data?.tables || []).filter(
						(t: ExportTableInfo) => t.schema === schema && t.category === 'table'
					).length
				],
				[
					`schema_${schema}_views`,
					(data?.tables || []).filter(
						(t: ExportTableInfo) => t.schema === schema && t.category === 'view'
					).length
				]
			])
		),
		// Compteurs croisés schéma-base
		...Object.fromEntries(
			uniqueSchemas.flatMap((schema: string) =>
				databases.map((db: DatabaseName) => [
					`schema_${schema}_${db}`,
					(data?.tables || []).filter(
						(t: ExportTableInfo) => t.schema === schema && t.database === db
					).length
				])
			)
		)
	} as Record<string, number>;

	// Variable pour tracking le changement de catégorie et éviter le toast au chargement initial
	let previousSelectedCategory = selectedCategory;

	// Toast de succès lors du changement de catégorie - DYNAMIQUE
	$: if (selectedCategory !== previousSelectedCategory && previousSelectedCategory !== undefined) {
		const categoryInfo = categories.find((c) => c.value === selectedCategory);
		// Mapping dynamique pour les compteurs
		const count = tableCounts[selectedCategory] || 0;

		if (categoryInfo) {
			toast.success(`Filtre appliqué : ${categoryInfo.label}`, {
				description: `${count} source${count > 1 ? 's' : ''} disponible${count > 1 ? 's' : ''}`
			});
		}

		previousSelectedCategory = selectedCategory;
	}

	// Icones pour les types de tables
	function getTableIcon(category: string) {
		switch (category) {
			case 'views':
				return Eye;
			default:
				return Database;
		}
	}

	// Couleur des badges selon la catégorie
	function getBadgeVariant(category: string) {
		switch (category) {
			case 'table':
				return 'noir';
			case 'view':
				return 'vert';
			default:
				return 'noir';
		}
	}

	// Couleur et contenu des badges selon la base de données - DYNAMIQUE
	function getDatabaseBadgeInfo(database: string): {
		variant: 'bleu' | 'noir' | 'orange';
		label: string;
	} {
		const isDev = database.includes('dev');
		const emoji = isDev ? '⚙️' : '🚀';
		const variant = isDev ? ('orange' as const) : ('bleu' as const);
		const label = `${emoji} ${database.toUpperCase()}`;

		return { variant, label };
	}

	// Gestion des résultats d'export
	function handleExportResult(result: ExportResult) {
		console.log('🎯 [CLIENT] handleExportResult appelé avec:', result);
		exportResult = result;
		if (result.success) {
			console.log('✅ [CLIENT] Export réussi, affichage du message de succès');

			// Si un téléchargement client est nécessaire
			if (result.needsClientDownload && result.downloadUrl) {
				console.log('📁 [CLIENT] Déclenchement du téléchargement client:', result.downloadUrl);
				triggerClientDownload(result);
			}

			Alert.alertActions.success(result.message);
			step = 4; // Étape finale
		} else {
			console.error("❌ [CLIENT] Échec de l'export:", result.message);
			Alert.alertActions.error(result.message);
		}
	}

	// Fonction pour déclencher le téléchargement côté client
	async function triggerClientDownload(result: ExportResult) {
		try {
			console.log('🌐 [CLIENT] Lancement requête de téléchargement');
			console.log('📋 [CLIENT] Configuration actuelle du formulaire:', $form);

			const exportData = {
				...$form
			};

			const response = await fetch('/export/api', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(exportData)
			});

			if (!response.ok) {
				console.error('❌ [CLIENT] Erreur de téléchargement:', response.status);
				Alert.alertActions.error('Erreur lors du téléchargement du fichier');
				return;
			}

			console.log('📄 [CLIENT] Réponse téléchargement reçue, création du blob');

			// Créer un blob et déclencher le téléchargement
			const blob = await response.blob();
			const url = window.URL.createObjectURL(blob);
			const link = document.createElement('a');
			link.href = url;
			link.download = result.fileName || 'export.xlsx';
			document.body.appendChild(link);

			console.log('⬇️ [CLIENT] Déclenchement du téléchargement:', result.fileName);
			link.click();

			document.body.removeChild(link);
			window.URL.revokeObjectURL(url);

			console.log('✅ [CLIENT] Téléchargement terminé avec succès');
		} catch (err) {
			console.error('❌ [CLIENT] Erreur téléchargement client:', err);
			Alert.alertActions.error('Erreur lors du téléchargement du fichier');
		}
	}

	// Sélection/désélection de toutes les tables visibles
	function toggleAllTables() {
		const filteredTableIds = filteredTables.map((t: ExportTableInfo) => `${t.database}-${t.name}`);
		const selectedFilteredCount = filteredTableIds.filter((id) =>
			$form.selectedTables.includes(id)
		).length;

		if (selectedFilteredCount === filteredTables.length) {
			// Désélectionner toutes les tables filtrées
			$form.selectedTables = $form.selectedTables.filter((id) => !filteredTableIds.includes(id));
		} else {
			// Sélectionner toutes les tables visibles
			const newSelection = [...new Set([...$form.selectedTables, ...filteredTableIds])];
			$form.selectedTables = newSelection;
		}
	}

	// Sélection rapide par catégorie
	function selectByCategory(category: string) {
		const tablesInCategory = data.tables
			.filter((t: ExportTableInfo) => category === 'all' || t.category === category)
			.map((t: ExportTableInfo) => `${t.database}-${t.name}`);
		$form.selectedTables = tablesInCategory;
	}

	// Fonction pour basculer la sélection d'une catégorie (avec filtre BDD optionnel)
	function toggleCategorySelection(category: 'table' | 'view', restrictToDatabase?: DatabaseName) {
		let tablesInCategory = data.tables.filter((t: ExportTableInfo) => t.category === category);

		// Si on est sur un filtre BDD spécifique, restreindre à cette BDD
		if (restrictToDatabase) {
			tablesInCategory = tablesInCategory.filter(
				(t: ExportTableInfo) => t.database === restrictToDatabase
			);
		}

		const tableIds = tablesInCategory.map((t: ExportTableInfo) => `${t.database}-${t.name}`);

		const isAllSelected = tableIds.every((tableId) => $form.selectedTables.includes(tableId));

		if (isAllSelected) {
			// Désélectionner toutes les tables de cette catégorie
			$form.selectedTables = $form.selectedTables.filter((id) => !tableIds.includes(id));
		} else {
			// Sélectionner toutes les tables de cette catégorie
			const newSelection = [...new Set([...$form.selectedTables, ...tableIds])];
			$form.selectedTables = newSelection;
		}
	}

	// Fonction pour basculer la sélection d'une base de données (avec filtre catégorie optionnel)
	function toggleDatabaseSelection(database: DatabaseName, restrictToCategory?: 'table' | 'view') {
		let tablesInDatabase = data.tables.filter((t: ExportTableInfo) => t.database === database);

		// Si on est sur un filtre catégorie spécifique, restreindre à cette catégorie
		if (restrictToCategory) {
			tablesInDatabase = tablesInDatabase.filter(
				(t: ExportTableInfo) => t.category === restrictToCategory
			);
		}

		const tableIds = tablesInDatabase.map((t: ExportTableInfo) => `${t.database}-${t.name}`);

		const isAllSelected = tableIds.every((tableId) => $form.selectedTables.includes(tableId));

		if (isAllSelected) {
			// Désélectionner toutes les tables de cette base
			$form.selectedTables = $form.selectedTables.filter((id) => !tableIds.includes(id));
		} else {
			// Sélectionner toutes les tables de cette base
			const newSelection = [...new Set([...$form.selectedTables, ...tableIds])];
			$form.selectedTables = newSelection;
		}
	}

	// Fonction pour basculer la sélection d'un schéma
	function toggleSchemaSelection(schema: string) {
		const tablesInSchema = data.tables.filter((t: ExportTableInfo) => t.schema === schema);
		const tableIds = tablesInSchema.map((t: ExportTableInfo) => `${t.database}-${t.name}`);

		const isAllSelected = tableIds.every((tableId) => $form.selectedTables.includes(tableId));

		if (isAllSelected) {
			// Désélectionner toutes les tables de ce schéma
			$form.selectedTables = $form.selectedTables.filter((id) => !tableIds.includes(id));
		} else {
			// Sélectionner toutes les tables de ce schéma
			const newSelection = [...new Set([...$form.selectedTables, ...tableIds])];
			$form.selectedTables = newSelection;
		}
	}

	// Fonction pour basculer la sélection d'un schéma avec restriction de catégorie
	function toggleSchemaSelectionWithCategory(schema: string, restrictToCategory: 'table' | 'view') {
		let tablesInSchema = data.tables.filter(
			(t: ExportTableInfo) => t.schema === schema && t.category === restrictToCategory
		);
		const tableIds = tablesInSchema.map((t: ExportTableInfo) => `${t.database}-${t.name}`);

		const isAllSelected = tableIds.every((tableId) => $form.selectedTables.includes(tableId));

		if (isAllSelected) {
			$form.selectedTables = $form.selectedTables.filter((id) => !tableIds.includes(id));
		} else {
			const newSelection = [...new Set([...$form.selectedTables, ...tableIds])];
			$form.selectedTables = newSelection;
		}
	}

	// Fonction pour basculer la sélection d'un schéma avec restriction de base de données
	function toggleSchemaSelectionWithDatabase(schema: string, restrictToDatabase: DatabaseName) {
		let tablesInSchema = data.tables.filter(
			(t: ExportTableInfo) => t.schema === schema && t.database === restrictToDatabase
		);
		const tableIds = tablesInSchema.map((t: ExportTableInfo) => `${t.database}-${t.name}`);

		const isAllSelected = tableIds.every((tableId) => $form.selectedTables.includes(tableId));

		if (isAllSelected) {
			$form.selectedTables = $form.selectedTables.filter((id) => !tableIds.includes(id));
		} else {
			const newSelection = [...new Set([...$form.selectedTables, ...tableIds])];
			$form.selectedTables = newSelection;
		}
	}

	// Nouvelles fonctions pour les groupes
	function handleTypeChange(type: 'all' | 'tables' | 'views') {
		selectedType = type;
	}

	function handleDatabaseToggle(database: DatabaseName) {
		if (selectedDatabases.includes(database)) {
			selectedDatabases = selectedDatabases.filter((db) => db !== database);
		} else {
			selectedDatabases = [...selectedDatabases, database];
		}
	}

	function handleSchemaToggle(schema: string) {
		if (selectedSchemas.includes(schema)) {
			selectedSchemas = selectedSchemas.filter((s) => s !== schema);
		} else {
			selectedSchemas = [...selectedSchemas, schema];
		}
	}

	// Fonction pour obtenir les tables filtrées selon les nouveaux groupes
	$: newFilteredTables = (data?.tables || []).filter((table: ExportTableInfo) => {
		const matchesType =
			selectedType === 'all' ||
			(selectedType === 'tables' && table.category === 'table') ||
			(selectedType === 'views' && table.category === 'view');
		const matchesDB = selectedDatabases.length === 0 || selectedDatabases.includes(table.database);
		const matchesSchema = selectedSchemas.length === 0 || selectedSchemas.includes(table.schema);
		const matchesSearch =
			searchTerm === '' ||
			table.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
			table.displayName.toLowerCase().includes(searchTerm.toLowerCase());
		return matchesType && matchesDB && matchesSchema && matchesSearch;
	});

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

	function formatPreviewValue(value: unknown): string {
		return value === null || value === undefined ? '' : String(value);
	}

	// Réinitialiser l'export
	function resetExport() {
		step = 1;
		previewData = {};
		exportResult = null;
		savedExportConfig = null;
		reset();
	}

	// Navigation entre les étapes
	function goToStep(newStep: number) {
		step = newStep;
	}

	// Validation des données avant de passer à l'étape suivante
	function validateAndNext() {
		if ($form.selectedTables.length === 0) {
			toast.error('Aucune table sélectionnée', {
				description: 'Veuillez sélectionner au moins une table à exporter.'
			});
			return;
		}
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
						<div class="text-2xl font-bold text-green-600">{formatNumber(data.totalRows)}</div>
						<div class="text-sm text-green-800">Lignes totales</div>
					</div>
					<ChartColumn class="h-8 w-8 text-green-500" />
				</div>
			</div>
			<div class="rounded-lg border border-purple-200 bg-purple-50 p-4">
				<div class="flex items-center justify-between">
					<div>
						<div class="text-2xl font-bold text-purple-600">
							{newFilteredTables.filter((table) =>
								$form.selectedTables.includes(`${table.database}-${table.name}`)
							).length}
						</div>
						<div class="text-sm text-purple-800">Sources sélectionnées</div>
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

				<!-- Filtres avec Cards Flowbite -->
				<div class="mb-6 space-y-4">
					<!-- Cards de filtres horizontales -->
					<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
						<!-- Card Type -->
						<Card class="h-36 p-4">
							<div class="mb-2 flex items-center gap-2">
								<span class="text-lg">🎯</span>
								<h3 class="font-semibold text-gray-900">Type</h3>
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
									<span class="text-sm">Tout ({newGroupCounts.all})</span>
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
									<span class="text-sm">Tables ({newGroupCounts.tables})</span>
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
									<span class="text-sm">Vues ({newGroupCounts.views})</span>
								</label>
							</div>
						</Card>

						<!-- Card Base de données -->
						<Card class="h-36 p-4">
							<div class="mb-2 flex items-center gap-2">
								<span class="text-lg">🏢</span>
								<h3 class="font-semibold text-gray-900">Base de données</h3>
							</div>
							<div class="space-y-2">
								{#each databases as database}
									{@const dbInfo = getDatabaseBadgeInfo(database)}
									<label class="flex cursor-pointer items-center space-x-2">
										<input
											type="checkbox"
											checked={selectedDatabases.includes(database)}
											onchange={() => handleDatabaseToggle(database)}
											class="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
										/>
										<span class="text-sm"
											>{dbInfo.label.split(' ')[1]} ({newGroupCounts[database]})</span
										>
									</label>
								{/each}
							</div>
						</Card>

						<!-- Card Schéma -->
						<Card class="h-36 p-4">
							<div class="mb-2 flex items-center gap-2">
								<span class="text-lg">🔗</span>
								<h3 class="font-semibold text-gray-900">Schéma</h3>
							</div>
							<div class="space-y-2">
								{#each uniqueSchemas as schema}
									{@const schemaInfo = getSchemaInfo(schema)}
									{@const isAvailable = availableSchemas.includes(schema)}
									<label class="flex cursor-pointer items-center space-x-2">
										<input
											type="checkbox"
											checked={selectedSchemas.includes(schema)}
											disabled={!isAvailable}
											onchange={() => handleSchemaToggle(schema)}
											class="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 disabled:opacity-50"
										/>
										<span class="text-sm {!isAvailable ? 'text-gray-400' : ''}">
											{schemaInfo.emoji}
											{schemaInfo.label} ({newGroupCounts[`schema_${schema}`]})
										</span>
									</label>
								{/each}
							</div>
						</Card>
					</div>

					<!-- Recherche et actions -->
					<div class="grid grid-cols-1 items-center gap-6 sm:grid-cols-2 lg:grid-cols-3">
						<!-- Résumé de sélection -->
						<div
							class="flex min-h-[42px] items-center justify-center rounded-lg bg-blue-50 px-6 py-3 text-center"
						>
							<div class="text-sm text-blue-800">
								📊 <span class="font-semibold">{newFilteredTables.length}</span> sources sélectionnées
							</div>
						</div>

						<!-- Barre de recherche (alignée sous card du milieu) -->
						<div>
							<Input
								type="text"
								bind:value={searchTerm}
								placeholder="Rechercher une table, une vue..."
							/>
						</div>

						<!-- Actions -->
						<div class="flex items-center justify-center gap-4">
							<label class="flex min-h-[42px] cursor-pointer items-center space-x-2">
								<input
									type="checkbox"
									checked={newFilteredTables.length > 0 &&
										newFilteredTables.every((table: ExportTableInfo) =>
											$form.selectedTables.includes(`${table.database}-${table.name}`)
										)}
									onchange={() => {
										const filteredTableIds = newFilteredTables.map(
											(t: ExportTableInfo) => `${t.database}-${t.name}`
										);
										const selectedFilteredCount = filteredTableIds.filter((id) =>
											$form.selectedTables.includes(id)
										).length;

										if (selectedFilteredCount === newFilteredTables.length) {
											// Désélectionner toutes les tables filtrées
											$form.selectedTables = $form.selectedTables.filter(
												(id) => !filteredTableIds.includes(id)
											);
										} else {
											// Sélectionner toutes les tables visibles
											const newSelection = [
												...new Set([...$form.selectedTables, ...filteredTableIds])
											];
											$form.selectedTables = newSelection;
										}
									}}
									class="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
								/>
								<span class="text-sm">Sélectionner tout ({newFilteredTables.length})</span>
							</label>

							<Button
								variant="noir"
								onclick={() => {
									selectedType = 'all';
									selectedDatabases = [];
									selectedSchemas = [];
								}}
							>
								<RefreshCcw class="mr-2 h-4 w-4" />
								Réinitialiser
							</Button>
						</div>
					</div>
				</div>

				<!-- Liste des tables -->
				<div class="mb-6 max-h-96 overflow-y-auto">
					<div class="grid gap-3">
						{#each newFilteredTables as table (`${table.database}-${table.name}`)}
							{@const dbInfo = getDatabaseBadgeInfo(table.database)}
							{@const schemaInfo = getSchemaInfo(table.schema)}
							<label
								class="flex cursor-pointer items-center space-x-3 rounded-lg border p-4 transition-colors hover:bg-red-100"
							>
								<input
									type="checkbox"
									bind:group={$form.selectedTables}
									value={`${table.database}-${table.name}`}
									onchange={() => {
										// Toast info quand on sélectionne/désélectionne une table
										const tableId = `${table.database}-${table.name}`;
										const isSelected = $form.selectedTables.includes(tableId);
										const tableType = table.category === 'view' ? 'vue' : 'table';

										if (isSelected) {
											toast.info(
												`${tableType.charAt(0).toUpperCase() + tableType.slice(1)} sélectionnée`,
												{
													description: `${table.displayName} (${formatNumber(table.rowCount || 0)} lignes)`
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
										<div>
											<div class="flex items-center gap-2">
												<span class="font-medium">{table.displayName}</span>
												<Badge variant={getBadgeVariant(table.category)}>
													{table.category.replace('_', ' ')}
												</Badge>
												<Badge variant={dbInfo.variant}>
													{dbInfo.label}
												</Badge>
												<Badge variant={schemaInfo.variant}>
													{schemaInfo.emoji}
													{schemaInfo.label}
												</Badge>
											</div>
											<div class="text-sm text-gray-500">
												{table.name} • {formatNumber(table.rowCount || 0)} lignes
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
					<Button variant="bleu" onclick={validateAndNext}>
						Continuer
						<CircleArrowRight class="ml-2 h-4 w-4" />
					</Button>
				</div>
			</div>
		{:else if step === 2}
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
									bind:checked={$form.includeHeaders}
									class="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
								/>
								<span>
									{#if $form.includeHeaders}
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
							<label for="rowLimit" class="text-sm font-medium"
								>Limite de lignes (optionnel) :</label
							>
							<Input
								id="rowLimit"
								type="number"
								bind:value={$form.rowLimit}
								placeholder="Pas de limite"
								min="1"
								max="1000000"
								class="w-48"
							/>
						</div>
					</div>

					<!-- Champs cachés -->
					<input type="hidden" name="selectedTables" value={JSON.stringify($form.selectedTables)} />
					<input type="hidden" name="format" value={$form.format} />
					<input type="hidden" name="includeHeaders" value={$form.includeHeaders} />
					<input type="hidden" name="rowLimit" value={$form.rowLimit} />
					<input type="hidden" name="filters" value={JSON.stringify($form.filters)} />

					<div class="flex justify-center gap-4">
						<Button variant="noir" onclick={() => goToStep(1)}>
							<CircleArrowLeft class="mr-2 h-4 w-4" />
							Retour
						</Button>
						<Button type="submit" variant="bleu">
							{#if $submitting}
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
						Format: {exportFormats.find((f) => f.value === $form.format)?.label || $form.format}
					</Badge>
				</div>

				{#if Object.keys(previewData).length > 0}
					<!-- Aperçu des données -->
					<div class="mb-6 space-y-6">
						{#each Object.entries(previewData) as [tableName, rows]}
							{@const matchingTableInfo = (() => {
								// tableName est maintenant au format "database-tablename"
								if (tableName.includes('-')) {
									const [database, ...tableNameParts] = tableName.split('-');
									const realTableName = tableNameParts.join('-');
									return data.tables.find(
										(t) => t.name === realTableName && t.database === database
									);
								}
								// Fallback pour compatibilité
								return data.tables.find((t) => t.name === tableName);
							})()}
							{@const dbInfo = matchingTableInfo
								? getDatabaseBadgeInfo(matchingTableInfo.database)
								: { variant: 'noir' as const, label: 'Inconnue' }}
							{@const schemaInfo = matchingTableInfo
								? getSchemaInfo(matchingTableInfo.schema)
								: { variant: 'cyan' as const, emoji: '🔓', label: 'Public' }}
							<div>
								<div class="mb-3 flex items-center justify-between">
									<div class="flex items-center gap-3">
										<h3 class="flex items-center gap-2 font-medium">
											<svelte:component
												this={getTableIcon(matchingTableInfo?.category || 'tables')}
												class="h-5 w-5"
											/>
											{matchingTableInfo?.displayName ||
												(tableName.includes('-')
													? tableName.split('-').slice(1).join('-')
													: tableName)}
										</h3>
										{#if matchingTableInfo}
											<Badge variant={getBadgeVariant(matchingTableInfo.category)}>
												{matchingTableInfo.category.replace('_', ' ')}
											</Badge>
											<Badge variant={dbInfo.variant}>
												{dbInfo.label}
											</Badge>
											<Badge variant={schemaInfo.variant}>
												{schemaInfo.emoji}
												{schemaInfo.label}
											</Badge>
										{/if}
									</div>
									<Badge variant="blanc">{rows.length} lignes (aperçu)</Badge>
								</div>

								{#if rows.length > 0}
									<div class="overflow-x-auto">
										<Table.Root variant="striped">
											{#if $form.includeHeaders}
												<Table.Header>
													<Table.Row variant="striped">
														{#each Object.keys(rows[0] as Record<string, unknown>) as column}
															<Table.Head variant="striped">{column}</Table.Head>
														{/each}
													</Table.Row>
												</Table.Header>
											{/if}
											<Table.Body>
												{#each rows as row, rowIndex}
													<Table.Row variant="striped">
														{#each Object.keys(rows[0] as Record<string, unknown>) as column}
															<Table.Cell variant="striped" {rowIndex}>
																{@const typedRow = row as Record<string, unknown>}
																{formatPreviewValue(typedRow[column])}
															</Table.Cell>
														{/each}
													</Table.Row>
												{/each}
											</Table.Body>
										</Table.Root>
									</div>
								{:else}
									<p class="text-gray-500">Aucune donnée disponible</p>
								{/if}
							</div>
						{/each}
					</div>
				{/if}

				<!-- Export final -->
				<form method="POST" action="?/export" use:superEnhance>
					<div class="flex justify-center gap-4">
						<Button variant="noir" onclick={() => goToStep(2)}>
							<CircleArrowLeft class="mr-2 h-4 w-4" />
							Configuration
						</Button>
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
									{#each exportResult.warnings as warning}
										<li>• {warning}</li>
									{/each}
								</ul>
							</div>
						{/if}

						{#if exportResult.errors.length > 0}
							<div class="mb-4 text-center">
								<h4 class="mb-2 font-medium text-red-800">Erreurs:</h4>
								<ul class="space-y-1 text-sm text-red-700">
									{#each exportResult.errors as error}
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
