<script lang="ts">
	import { read, utils } from 'xlsx';
	import { fade } from 'svelte/transition';
	import { superForm } from 'sveltekit-superforms/client';
	import { Card, Spinner } from 'flowbite-svelte';
	import * as Alert from '$lib/components/ui/alert';
	import { Button } from '$lib/components/ui/button';
	import * as Select from '$lib/components/ui/select';
	import * as Table from '$lib/components/ui/table';
	import { Badge } from '$lib/components/ui/badge';
	import TableSelector from '$lib/components/TableSelector.svelte';
	import { toast } from 'svelte-sonner';
	import {
		Upload,
		FileCheck,
		AlertCircle,
		ArrowRight,
		CornerDownRight,
		Check,
		X,
		CircleArrowLeft,
		CircleCheck,
		CirclePlus,
		Database,
		CheckCircle,
		CircleX,
		Settings,
		Rocket
	} from 'lucide-svelte';
	import type { UserInfoResponse } from '@logto/node';
	import type { SuperValidated } from 'sveltekit-superforms';
	// Types intégrés directement - plus besoin d'importer depuis shared.ts
	interface ValidationResult {
		totalRows: number;
		validRows: number;
		duplicates: number;
		invalidData: Array<{
			row: number;
			field: string;
			value: string;
			error: string;
		}>;
		processed: boolean;
		inserted?: number;
		updated?: number;
		errors?: string[];
		resultsByTable?: Record<
			string,
			{
				validRows: number;
				inserted: number;
				updated: number;
			}
		>;
	}

	export let data: {
		user: UserInfoResponse | undefined;
		form: SuperValidated<
			{ data: unknown[][]; mappedFields: Record<string, string>; selectedTables: string[] },
			any,
			{ data: unknown[][]; mappedFields: Record<string, string>; selectedTables: string[] }
		>;
		availableTables: {
			value: string;
			name: string;
			displayName?: string;
			category: string;
			tableType?: string;
			database?: string;
			rowCount?: number;
			columns?: any[];
		}[];
		tableFields: Record<string, string[]>;
		tableRequiredFields: Record<string, string[]>;
	};


	// Type pour le formulaire multi-tables
	type MultiTableFormData = {
		data: unknown[][];
		mappedFields: Record<string, string>;
		selectedTables: string[];
	};

	// Initialisation du formulaire avec SuperForms
	const {
		form,
		enhance: superEnhance,
		submitting,
		errors,
		reset
	} = superForm(data.form, {
		dataType: 'json',
		onUpdated: ({ form }) => {

			if (form && form.data && 'result' in form.data) {
				const result = form.data.result as ValidationResult;
				updateFormWithResult(result);

				if (result.processed) {
					step = 3; // Importation terminée

					// Afficher toast de succès avec résumé de l'import
					const totalOperations = (result.inserted || 0) + (result.updated || 0);
					const operations = [];
					if (result.inserted && result.inserted > 0) {
						operations.push(`${result.inserted} ajouté${result.inserted > 1 ? 's' : ''}`);
					}
					if (result.updated && result.updated > 0) {
						operations.push(`${result.updated} modifié${result.updated > 1 ? 's' : ''}`);
					}

					const message = totalOperations > 0
						? `Import réussi : ${operations.join(', ')}`
						: 'Import terminé';

					toast.success(message);

					// Reset l'interface après un délai court pour permettre de voir le résultat
					setTimeout(() => {
						step = 1;
						csvData = [];
						fileName = '';
						validationResult = null;
						file = null;
					}, 2000);
				} else if (step === 2) {
					step = 3; // Validation terminée, prêt pour l'importation
				}
			}
		},
		onError: (event) => {
			console.error('Erreur de soumission:', event);
			// Gestion des erreurs avec conversion de type appropriée
			const errorResult = event.result as unknown as {
				error?: string | { message: string } | Error;
			};

			// Extraction du message d'erreur selon le type
			let errorMsg = 'Une erreur est survenue';

			if (errorResult?.error) {
				if (typeof errorResult.error === 'string') {
					errorMsg = errorResult.error;
				} else if (typeof errorResult.error === 'object' && 'message' in errorResult.error) {
					errorMsg = errorResult.error.message;
				}
			}

			Alert.alertActions.error(errorMsg);
		}
	});

	let dragActive = false;
	let isProcessing = false;
	let step = 1;
	let file: File | null = null;
	let fileName = '';
	let rawData: unknown[][] = [];
	let headers: string[] = [];
	let previewData: unknown[][] = [];
	let selectedTables: string[] = []; // Tables sélectionnées (par défaut vide, sera rempli dynamiquement)
	let mappedFields: Record<string, string> = {};
	let hasHeaders = true; // Détection automatique
	let showNoHeaderAlert = false; // Nouvelle variable pour l'alerte

	// Variables pour récupérer les statistiques depuis TableSelector
	let totalTables = 0;
	let totalRows = 0;
	let filteredCount = 0;

	// Données provenant du serveur via DMMF (remplace le hardcodage)
	$: availableTables = data.availableTables || [];
	$: tableFields = data.tableFields || {};
	$: tableRequiredFields = data.tableRequiredFields || {};

	// Pas de sélection automatique - l'utilisateur doit choisir manuellement

	// Utilisons le type défini précédemment
	let validationResults: ValidationResult = {
		totalRows: 0,
		validRows: 0,
		duplicates: 0,
		invalidData: [],
		processed: false
	};

	// Gestion du drag and drop
	function handleDragEnter(e: DragEvent) {
		e.preventDefault();
		dragActive = true;
	}

	function handleDragLeave(e: DragEvent) {
		e.preventDefault();
		dragActive = false;
	}

	function handleDragOver(e: DragEvent) {
		e.preventDefault();
		dragActive = true;
	}

	function handleDrop(e: DragEvent) {
		e.preventDefault();
		dragActive = false;

		if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files.length > 0) {
			handleFiles(e.dataTransfer.files);
		}
	}

	function handleFileInput(e: Event) {
		const input = e.target as HTMLInputElement;
		if (input.files && input.files.length > 0) {
			handleFiles(input.files);
		}
	}

	function handleFiles(files: FileList) {
		file = files[0];
		fileName = file.name;

		// Vérification du type de fichier
		if (!fileName.endsWith('.csv') && !fileName.endsWith('.xlsx') && !fileName.endsWith('.xls')) {
			Alert.alertActions.error(
				'Format de fichier non supporté. Veuillez utiliser un fichier CSV ou Excel.'
			);
			file = null;
			return;
		}
		readFile();
	}

	function readFile() {
		if (!file) return;

		isProcessing = true;
		const reader = new FileReader();

		reader.onload = (e) => {
			try {
				const result = e.target?.result;
				if (!result) throw new Error('Échec de lecture du fichier');

				const workbook = read(result, { type: 'array' });
				const firstSheetName = workbook.SheetNames[0];
				const worksheet = workbook.Sheets[firstSheetName];
				rawData = utils.sheet_to_json(worksheet, { header: 1 });

				if (rawData.length < 1) {
					throw new Error('Le fichier ne contient pas de données');
				}

				// Détection automatique des en-têtes
				hasHeaders = detectHeaders(rawData);
				showNoHeaderAlert = !hasHeaders;

				if (hasHeaders) {
					// Mode avec en-têtes (comportement normal)
					if (rawData.length < 2) {
						throw new Error(
							'Le fichier ne contient pas assez de données (en-têtes + au moins 1 ligne)'
						);
					}
					headers = rawData[0] as string[];
					previewData = rawData.slice(1, Math.min(rawData.length, 6)) as any[];
				} else {
					// Mode sans en-têtes - générer des en-têtes génériques
					const firstRow = rawData[0] as any[];
					headers = firstRow.map((_, index) => `Colonne ${index + 1}`);
					previewData = rawData.slice(0, Math.min(rawData.length, 5)) as any[];
				}

				// Mise à jour du formulaire SuperForms (le mapping se fait automatiquement via variable réactive)
				const formData: MultiTableFormData = {
					data: hasHeaders ? rawData.slice(1) : rawData, // Exclure les en-têtes seulement si présents
					mappedFields,
					selectedTables
				};
				$form = formData as any;

				step = 2;
			} catch (err) {
				Alert.alertActions.error(
					`Erreur lors de la lecture du fichier: ${err instanceof Error ? err.message : 'Erreur inconnue'}`
				);
			} finally {
				isProcessing = false;
			}
		};

		reader.onerror = () => {
			Alert.alertActions.error('Échec de lecture du fichier');
			isProcessing = false;
		};

		reader.readAsArrayBuffer(file);
	}

	// Nouvelle fonction pour détecter automatiquement les en-têtes
	function detectHeaders(data: any[][]): boolean {
		if (data.length < 2) return false;

		const firstRow = data[0];
		const secondRow = data[1];

		// Vérifier si la première ligne contient des chaînes qui ressemblent à des noms de champs
		const hasStringHeaders = firstRow.every((cell, index) => {
			if (typeof cell !== 'string') return false;

			// Vérifier si c'est un nom de champ connu dans toutes les tables
			const allKnownFields = Object.values(tableFields).flat();
			const normalizedCell = String(cell)
				.toLowerCase()
				.replace(/[^a-z0-9]/g, '');

			return allKnownFields.some((field: string) => {
				const normalizedField = field.toLowerCase().replace(/[^a-z0-9]/g, '');
				return normalizedCell.includes(normalizedField) || normalizedField.includes(normalizedCell);
			});
		});

		// Si pas de correspondance avec des champs connus, vérifier si la première ligne a un type différent de la seconde
		if (!hasStringHeaders && secondRow) {
			const firstRowTypes = firstRow.map((cell) => typeof cell);
			const secondRowTypes = secondRow.map((cell) => typeof cell);

			// Si les types sont différents, probablement des en-têtes
			const typesDifferent = firstRowTypes.some((type, index) => type !== secondRowTypes[index]);
			return typesDifferent;
		}

		return hasStringHeaders;
	}

	function guessFieldMapping() {
		// Réinitialiser seulement les mappings
		const newMappedFields: Record<string, string> = {};

		// Obtenir tous les champs possibles des tables sélectionnées
		const allFields = selectedTables.reduce((acc, table) => {
			const fields = tableFields[table] || [];
			fields.forEach((field: string) => {
				if (!acc.includes(field)) {
					acc.push(field);
				}
			});
			return acc;
		}, [] as string[]);

		if (hasHeaders && headers.length > 0) {
			// Mappage automatique basé sur les en-têtes
			headers.forEach((header, index) => {
				// Normalisation pour la comparaison
				const normalizedHeader = String(header)
					.toLowerCase()
					.replace(/[^a-z0-9]/g, '');

				// Recherche du meilleur match
				let bestMatch = '';
				let bestScore = 0;

				allFields.forEach((field: string) => {
					const normalizedField = field.toLowerCase().replace(/[^a-z0-9]/g, '');

					if (
						normalizedHeader.includes(normalizedField) ||
						normalizedField.includes(normalizedHeader)
					) {
						const score =
							Math.min(normalizedHeader.length, normalizedField.length) /
							Math.max(normalizedHeader.length, normalizedField.length);

						if (score > bestScore) {
							bestScore = score;
							bestMatch = field;
						}
					}
				});

				if (bestScore > 0.5) {
					newMappedFields[index.toString()] = bestMatch;
				}
			});
		}

		mappedFields = newMappedFields;
	}

	function handleTableChange() {
		// Mise à jour du formulaire (le mapping se fait automatiquement via la variable réactive)
		$form = {
			...$form,
			selectedTables,
			mappedFields
		} as any;

	}

	function formatNumber(num: number): string {
		return new Intl.NumberFormat('fr-FR').format(num);
	}

	// Fonction utilitaire pour parser le format "database:tableName" côté client
	function parseTableIdentifierClient(tableIdentifier: string): {
		database: string;
		tableName: string;
	} {
		const [database, tableName] = tableIdentifier.split(':');
		return { database, tableName };
	}

	// Fonction pour calculer les champs requis basée sur les données DMMF du serveur
	function getRequiredFieldsForTables(tables: string[]): string[] {
		let result: string[] = [];

		tables.forEach((tableIdentifier) => {
			const requiredFields = tableRequiredFields[tableIdentifier] || [];
			requiredFields.forEach((field: string) => {
				if (!result.includes(field)) {
					result.push(field);
				}
			});
		});

		return result;
	}

	// Variable réactive pour refaire le mapping automatiquement quand les tables changent
	$: {
		if (selectedTables.length > 0 && headers.length > 0) {
			guessFieldMapping();
		}
	}



	// Variable réactive pour les champs requis (union de tous les champs requis des tables sélectionnées)
	$: requiredFields = getRequiredFieldsForTables(selectedTables);

	// Variable réactive pour l'état du bouton de validation (dépend explicitement de mappedFields)
	$: buttonDisabled = (() => {
		// Forcer la dépendance à mappedFields
		const _ = mappedFields;

		const noTablesSelected = selectedTables.length === 0;
		const someRequiredFieldsNotMapped = requiredFields.some((field) => !isFieldMapped(field));
		const isSubmitting = $submitting;

		return noTablesSelected || someRequiredFieldsNotMapped || isSubmitting;
	})();

	function isFieldMapped(fieldName: string): boolean {
		return Object.values(mappedFields).includes(fieldName);
	}

	function resetImport() {
		file = null;
		fileName = '';
		rawData = [];
		headers = [];
		previewData = [];
		mappedFields = {};
		hasHeaders = true;
		showNoHeaderAlert = false;
		validationResults = {
			totalRows: 0,
			validRows: 0,
			duplicates: 0,
			invalidData: [],
			processed: false
		};
		step = 1;

		// Réinitialiser le formulaire SuperForms
		reset();
	}

	function updateFormWithResult(result: ValidationResult) {
		validationResults = result;
		$form = {
			data: hasHeaders ? rawData.slice(1) : rawData,
			mappedFields,
			selectedTables
		} as any;
	}
</script>

<div class="mx-auto my-8 max-w-6xl">
	<h1 class="mb-6 text-2xl font-bold">Importation de données</h1>

	<Alert.GlobalAlert />

	<!-- Indicateur d'étapes -->
	<Card class="mb-8 w-full max-w-none">
		<div class="steps flex justify-between">
			<div class={`step-item ${step >= 1 ? 'text-blue-700' : ''} flex-1`}>
				<div class="flex items-center">
					<div
						class={`mr-2 flex h-8 w-8 items-center justify-center rounded-full ${step >= 1 ? 'bg-blue-100 text-blue-700' : 'bg-gray-200'}`}
					>
						1
					</div>
					<span class="hidden sm:inline">Sélection du fichier</span>
					<span class="sm:hidden">Fichier</span>
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
					<span class="hidden sm:inline">Mappage colonnes</span>
					<span class="sm:hidden">Config</span>
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
					<span class="hidden sm:inline">Validation & Import</span>
					<span class="sm:hidden">Import</span>
				</div>
			</div>
		</div>
	</Card>

	<!-- Card Statistiques -->
	<Card class="mb-6 w-full max-w-none">
		<div class="grid grid-cols-1 gap-4 md:grid-cols-3">
			<div class="rounded-lg border border-blue-200 bg-blue-50 p-4">
				<div class="flex items-center justify-between">
					<div>
						<div class="text-2xl font-bold text-blue-600">{totalTables}</div>
						<div class="text-sm text-blue-800">Sources disponibles</div>
					</div>
					<Database class="h-8 w-8 text-blue-500" />
				</div>
			</div>
			<div class="rounded-lg border border-green-200 bg-green-50 p-4">
				<div class="flex items-center justify-between">
					<div>
						<div class="text-2xl font-bold text-green-600">{totalRows}</div>
						<div class="text-sm text-green-800">Lignes totales</div>
					</div>
					<CheckCircle class="h-8 w-8 text-green-500" />
				</div>
			</div>
			<div class="rounded-lg border border-purple-200 bg-purple-50 p-4">
				<div class="flex items-center justify-between">
					<div>
						<div class="text-2xl font-bold text-purple-600">{filteredCount}</div>
						<div class="text-sm text-purple-800">Sources filtrées</div>
					</div>
					<CheckCircle class="h-8 w-8 text-purple-500" />
				</div>
			</div>
		</div>
	</Card>

	<Card class="mx-auto w-full max-w-6xl">
		{#if step === 1}
			<div class="mb-6">
				<h2 class="mb-2 text-xl font-semibold">Sélection du fichier</h2>
				<p class="mb-4 text-gray-600">
					Sélectionnez un fichier CSV ou Excel contenant les données à importer.
				</p>

				<!-- Zone de drop -->
				<div
					role="button"
					tabindex="0"
					class={`mb-4 rounded-lg border-2 border-dashed p-8 text-center transition-colors hover:border-blue-400 hover:bg-blue-50 cursor-pointer ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}
					on:dragenter|preventDefault={handleDragEnter}
					on:dragleave|preventDefault={handleDragLeave}
					on:dragover|preventDefault={handleDragOver}
					on:drop|preventDefault={handleDrop}
					on:click={() => {
						document.getElementById('fileInput')?.click();
					}}
					on:keydown={(e) => {
						if (e.key === 'Enter' || e.key === ' ') {
							e.preventDefault();
							document.getElementById('fileInput')?.click();
						}
					}}
				>
					<div class="flex flex-col items-center">
						<Upload class="mx-auto mb-2 h-12 w-12 text-gray-400" />
						<p class="mb-2 text-lg">Glissez-déposez votre fichier ici</p>
						<p class="mb-4 text-sm text-gray-500">ou</p>
						<div class="flex flex-col items-center">
							<input
								type="file"
								id="fileInput"
								class="hidden"
								accept=".csv,.xlsx,.xls"
								on:change={handleFileInput}
							/>
							<Button
								variant="bleu"
								onclick={(e) => {
									e.stopPropagation();
									document.getElementById('fileInput')?.click();
								}}
							>
								<Upload class="mr-2 h-5 w-5" />
								Parcourir les fichiers
							</Button>
						</div>
					</div>
				</div>

			</div>
		{:else if step === 2}
			<form method="POST" action="?/validate" use:superEnhance>
				<div class="mb-6">
					{#if showNoHeaderAlert}
						<div class="mb-4 rounded-lg border border-red-200 bg-red-50 p-4">
							<div class="flex items-center">
								<AlertCircle class="mr-2 h-4 w-4 text-red-500" />
								<div>
									<strong class="text-red-800">Attention :</strong>
									<span class="text-red-700"
										>Les données importées n'ont pas d'en-têtes. Les colonnes ont été nommées
										automatiquement.</span
									>
								</div>
							</div>
						</div>
					{/if}

					<!-- Nouveau composant TableSelector -->
					<TableSelector
						bind:availableTables
						bind:selectedTables
						bind:totalTables
						bind:totalRows
						bind:filteredCount
						tableRequiredFields={tableRequiredFields}
						fileHeaders={headers}
						title="Tables de destination :"
						on:selectionChange={handleTableChange}
					/>

					<!-- Champs requis -->
					<div class="mb-6">
						<h3 class="mb-2 font-medium text-black">Champs requis :</h3>
						<div class="flex flex-wrap gap-2">
							{#each requiredFields as field}
								{@const fieldMapped = isFieldMapped(field)}
								<Badge variant={fieldMapped ? 'vert' : 'rouge'}>
									{#if fieldMapped}
										<CircleCheck />
									{:else}
										<CircleX />
									{/if}
									{field}
								</Badge>
							{/each}
						</div>
					</div>

					<h3 class="mb-2 font-medium text-black">
						Aperçu des données importées du fichier {fileName} :
					</h3>
					<div class="mb-6 overflow-x-auto">
						<Table.Root variant="striped">
							<Table.Header>
								<Table.Row variant="striped">
									{#each headers as header, i}
										<Table.Head variant="striped">
											<div class="mb-2">{header}</div>
											<Select.Select
												type="single"
												value={mappedFields[i.toString()] || ''}
												onValueChange={(value) => {
													mappedFields[i.toString()] = value || '';
													$form.mappedFields = mappedFields;
												}}
											>
												<Select.SelectTrigger
													class="min-w-[12rem] text-sm"
													hasValue={!!(
														mappedFields[i.toString()] && mappedFields[i.toString()] !== ''
													)}
												>
													{mappedFields[i.toString()] || 'Ne pas importer'}
												</Select.SelectTrigger>
												<Select.SelectContent>
													<Select.SelectItem value="">Ne pas importer</Select.SelectItem>
													{#each selectedTables.reduce((acc, table) => {
														const fields = tableFields[table] || [];
														fields.forEach((field) => {
															if (!acc.includes(field)) acc.push(field);
														});
														return acc;
													}, [] as string[]) as field}
														<Select.SelectItem value={field}>{field}</Select.SelectItem>
													{/each}
												</Select.SelectContent>
											</Select.Select>
										</Table.Head>
									{/each}
								</Table.Row>
							</Table.Header>
							<Table.Body>
								{#each previewData as row, rowIndex}
									<Table.Row variant="striped">
										{#each headers as _, i}
											<Table.Cell variant="striped" {rowIndex}>
												{row[i] !== undefined ? row[i] : ''}
											</Table.Cell>
										{/each}
									</Table.Row>
								{/each}
							</Table.Body>
						</Table.Root>
					</div>

					<!-- Champs cachés pour le formulaire -->
					<input type="hidden" name="data" value={JSON.stringify($form.data)} />
					<input type="hidden" name="mappedFields" value={JSON.stringify(mappedFields)} />
					<input type="hidden" name="selectedTables" value={JSON.stringify(selectedTables)} />

					<div class="flex justify-between">
						<Button variant="noir" onclick={resetImport}>
							<CircleArrowLeft class="mr-2 h-4 w-4" />
							Retour
						</Button>
						<Button type="submit" variant="vert" disabled={buttonDisabled}>
							{#if $submitting}
								<Spinner class="mr-2 h-4 w-4" />
								Validation en cours...
							{:else}
								<CircleCheck class="mr-2 h-4 w-4" />
								Valider les données
							{/if}
						</Button>
					</div>
				</div>
			</form>
		{:else if step === 3}
			<div class="mb-6">
				<h2 class="mb-4 text-xl font-semibold">Validation et importation</h2>

				{#if !validationResults.processed}
					<!-- Résumé avec cartes colorées -->
					<div class="mb-6 grid grid-cols-1 gap-4 md:grid-cols-4">
						<div class="rounded-lg border border-blue-200 bg-blue-50 p-4 text-center">
							<div class="text-2xl font-bold text-blue-600">{validationResults.totalRows}</div>
							<div class="text-sm text-blue-800">Lignes totales</div>
						</div>
						<div class="rounded-lg border border-green-200 bg-green-50 p-4 text-center">
							<div class="text-2xl font-bold text-green-600">{validationResults.validRows}</div>
							<div class="text-sm text-green-800">Lignes valides (par table)</div>
						</div>
						<div class="rounded-lg border border-amber-200 bg-amber-50 p-4 text-center">
							<div class="text-2xl font-bold text-amber-600">{validationResults.duplicates}</div>
							<div class="text-sm text-amber-800">Doublons</div>
						</div>
						<div class="rounded-lg border border-red-200 bg-red-50 p-4 text-center">
							<div class="text-2xl font-bold text-red-600">
								{validationResults.invalidData.length}
							</div>
							<div class="text-sm text-red-800">Erreurs</div>
						</div>
					</div>

					<!-- Détail par table si plusieurs tables sélectionnées -->
					{#if selectedTables.length > 1 && validationResults.resultsByTable}
						<div class="mb-6">
							<h3 class="mb-3 font-medium">Détail par table de destination</h3>
							<div class="space-y-2">
								{#each selectedTables as table}
									{@const tableResult = validationResults.resultsByTable[table]}
									{@const tableName =
										availableTables.find(
											(t: { value: string; name: string; category: string }) => t.value === table
										)?.name || table}
									{@const tableDatabase = table.includes('cenov_dev:') ? 'cenov_dev' : 'cenov'}
									{#if tableResult}
										<div class="flex items-center justify-between rounded-lg bg-gray-50 p-3">
											<div class="flex items-center gap-2">
												<span class="font-medium">{tableName}</span>
												<Badge variant={tableDatabase === 'cenov_dev' ? 'orange' : 'bleu'}>
													{#if tableDatabase === 'cenov_dev'}
														<Settings />
														CENOV_DEV
													{:else}
														<Rocket />
														CENOV
													{/if}
												</Badge>
											</div>
											<span class="text-green-600">{tableResult.validRows} ligne(s) valide(s)</span>
										</div>
									{/if}
								{/each}
							</div>
						</div>
					{/if}

					<!-- Tableau des erreurs avec le nouveau composant -->
					{#if validationResults.invalidData.length > 0}
						<Table.Error
							title="Erreurs de validation"
							headers={[
								{ key: 'row', label: 'Ligne' },
								{ key: 'field', label: 'Champ' },
								{ key: 'value', label: 'Valeur' },
								{ key: 'error', label: 'Erreur' }
							]}
							data={validationResults.invalidData.map((error: { row: number; field: string; value: string; error: string }) => ({
								row: error.row + 1,
								field: error.field,
								value: error.value || '',
								error: error.error
							}))}
						/>
					{/if}

					<!-- Affichage des lignes valides si nécessaire -->
					{#if validationResults.validRows > 0}
						{@const validData = (hasHeaders ? rawData.slice(1) : rawData)
							.map((row, index) => {
								// Vérifier si cette ligne a des erreurs
								const hasError = validationResults.invalidData.some((error: { row: number; field: string; value: string; error: string }) => error.row === index);
								if (hasError) return null;

								// Créer un objet avec les champs mappés
								const mappedRow: Record<string, any> = {};
								Object.entries(mappedFields).forEach(([colIndex, fieldName]) => {
									if (fieldName) {
										mappedRow[fieldName] = row[parseInt(colIndex)] || '';
									}
								});
								return mappedRow;
							})
							.filter((row) => row !== null)}

						<Table.Success
							title="Lignes valides prêtes à être importées"
							headers={Object.values(mappedFields)
								.filter((field) => field)
								.map((field) => ({
									key: field,
									label: field
								}))}
							data={validData}
						/>
					{/if}

					<form method="POST" action="?/process" use:superEnhance>
						<!-- Champs cachés pour le formulaire -->
						<input type="hidden" name="data" value={JSON.stringify($form.data)} />
						<input type="hidden" name="mappedFields" value={JSON.stringify(mappedFields)} />
						<input type="hidden" name="selectedTables" value={JSON.stringify(selectedTables)} />

						<div class="flex justify-between">
							<Button variant="noir" onclick={() => (step = 2)}>
								<CircleArrowLeft class="mr-2 h-4 w-4" />
								Retour
							</Button>
							<Button
								type="submit"
								variant={validationResults.validRows > 0 ? 'vert' : 'noir'}
								disabled={validationResults.validRows === 0 || $submitting}
							>
								{#if $submitting}
									<Spinner class="mr-2 h-4 w-4" />
									Importation en cours...
								{:else}
									<CircleCheck class="mr-2 h-4 w-4" />
									Importer {validationResults.validRows} lignes
								{/if}
							</Button>
						</div>
					</form>
				{:else}
					<div class="rounded-md border border-green-200 bg-green-50 p-6">
						<div class="mb-4 text-center">
							<Check class="mx-auto mb-2 h-12 w-12 text-green-500" />
							<h3 class="mb-2 text-xl font-medium text-green-800">
								Importation terminée avec succès
							</h3>
						</div>

						<!-- Détail par table -->
						{#if validationResults.resultsByTable && selectedTables.length > 1}
							<div class="mb-4 space-y-3">
								{#each selectedTables as table}
									{@const tableResult = validationResults.resultsByTable[table]}
									{@const tableName =
										availableTables.find(
											(t: { value: string; name: string; category: string }) => t.value === table
										)?.name || table}
									{#if tableResult && tableResult.inserted > 0}
										<div
											class="flex items-center justify-between rounded-lg border border-green-200 bg-white p-3"
										>
											<span class="font-medium text-gray-700"
												>{tableResult.inserted} ligne(s) ont été importées dans la table :</span
											>
											<span class="font-semibold text-green-700">{tableName}</span>
										</div>
									{/if}
								{/each}
							</div>
						{:else}
							<!-- Affichage simple pour une seule table -->
							<p class="mb-4 text-center">
								{validationResults.inserted || validationResults.validRows} lignes ont été importées
								dans la table : {selectedTables
									.map(
										(t: string) =>
											availableTables.find(
												(at: { value: string; name: string; category: string }) => at.value === t
											)?.name
									)
									.join(', ')}.
								{#if validationResults.inserted && validationResults.updated}
									({validationResults.inserted} insertions et {validationResults.updated} mises à jour)
								{/if}
							</p>
						{/if}

						<div class="text-center">
							<Button variant="bleu" onclick={resetImport}>
								<CirclePlus class="mr-2 h-4 w-4" />
								Nouvelle importation
							</Button>
						</div>
					</div>
				{/if}
			</div>
		{/if}
	</Card>

	{#if isProcessing || ($submitting && !isProcessing)}
		<div
			transition:fade
			class="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black"
		>
			<div class="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
				<Spinner class="mx-auto mb-4" size="xl" />
				<p class="text-center font-medium">Traitement en cours...</p>
			</div>
		</div>
	{/if}
</div>
