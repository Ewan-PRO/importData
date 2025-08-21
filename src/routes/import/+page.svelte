<script lang="ts">
	import { read, utils } from 'xlsx';
	import { fade } from 'svelte/transition';
	import { superForm } from 'sveltekit-superforms/client';
	import { Card, Spinner } from 'flowbite-svelte';
	import * as Alert from '$lib/components/ui/alert';
	import { Button } from '$lib/components/ui/button';
	import * as Select from '$lib/components/ui/select';
	import * as Table from '$lib/components/ui/table';
	import {
		Upload,
		FileCheck,
		AlertCircle,
		ArrowRight,
		CornerDownRight,
		Check,
		X
	} from 'lucide-svelte';

	export let data;

	// Définition du type de résultat attendu
	type ValidationResult = {
		totalRows: number;
		validRows: number;
		duplicates: number;
		invalidData: { row: number; field: string; value: string; error: string }[];
		processed: boolean;
		inserted?: number;
		updated?: number;
		errors?: string[];
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
			console.log('Formulaire mis à jour:', form);

			if (form && form.data && 'result' in form.data) {
				const result = form.data.result as ValidationResult;
				console.log('Résultat traité correctement:', result);
				updateFormWithResult(result);

				if (result.processed) {
					step = 3; // Importation terminée
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
	let rawData: any[] = [];
	let headers: string[] = [];
	let previewData: any[] = [];
	let targetTable = 'attribute_dev'; // Par défaut
	
	// Debug: Observer les changements de targetTable
	$: {
		console.log('🔥 targetTable changed to:', targetTable);
	}
	let mappedFields: Record<string, string> = {};
	let hasHeaders = true; // Détection automatique
	let showNoHeaderAlert = false; // Nouvelle variable pour l'alerte
	let availableTables = [
		{ value: 'attribute', name: 'Attributs' },
		{ value: 'attribute_dev', name: 'Attributs (Dev)' },
		{ value: 'supplier_dev', name: 'Fournisseurs (Dev)' },
		{ value: 'v_categories_dev', name: 'Catégories (Dev)' }
	];

	let tableFields: Record<string, string[]> = {
		attribute: ['atr_nat', 'atr_val', 'atr_label'],
		attribute_dev: ['atr_nat', 'atr_val', 'atr_label'],
		supplier_dev: ['sup_code', 'sup_label'],
		v_categories_dev: [
			'atr_0_label',
			'atr_1_label',
			'atr_2_label',
			'atr_3_label',
			'atr_4_label',
			'atr_5_label',
			'atr_6_label',
			'atr_7_label'
		]
	};

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

				console.log('Type de fichier:', file?.type);
				console.log('Nom du fichier:', file?.name);

				const workbook = read(result, { type: 'array' });
				console.log('Workbook créé:', workbook);

				const firstSheetName = workbook.SheetNames[0];
				console.log('Nom de la première feuille:', firstSheetName);

				const worksheet = workbook.Sheets[firstSheetName];
				console.log('Worksheet:', worksheet);

				rawData = utils.sheet_to_json(worksheet, { header: 1 });
				console.log('Données brutes:', rawData);

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

				console.log('En-têtes:', headers);
				console.log('Mode avec en-têtes:', hasHeaders);

				// Mappage automatique des champs
				guessFieldMapping();

				// Mise à jour du formulaire SuperForms
				const formData = {
					data: hasHeaders ? rawData.slice(1) : rawData, // Exclure les en-têtes seulement si présents
					mappedFields,
					targetTable
				};
				console.log('Données du formulaire à envoyer:', formData);
				$form = formData;

				step = 2;
			} catch (err) {
				console.error('Erreur détaillée:', err);
				Alert.alertActions.error(
					`Erreur lors de la lecture du fichier: ${err instanceof Error ? err.message : 'Erreur inconnue'}`
				);
			} finally {
				isProcessing = false;
			}
		};

		reader.onerror = () => {
			console.error('Erreur de lecture du fichier');
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

			// Vérifier si c'est un nom de champ connu
			const knownFields = [
				...tableFields.attribute,
				...tableFields.supplier_dev,
				...tableFields.v_categories_dev
			];
			const normalizedCell = String(cell)
				.toLowerCase()
				.replace(/[^a-z0-9]/g, '');

			return knownFields.some((field) => {
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
		console.log('Début du mappage des champs');
		console.log('En-têtes à mapper:', headers);
		console.log('Champs disponibles:', tableFields[targetTable]);

		mappedFields = {};
		const fields = tableFields[targetTable];

		if (hasHeaders) {
			// Mappage automatique basé sur les en-têtes
			headers.forEach((header, index) => {
				// Normalisation pour la comparaison
				const normalizedHeader = String(header)
					.toLowerCase()
					.replace(/[^a-z0-9]/g, '');

				// Recherche du meilleur match
				let bestMatch = '';
				let bestScore = 0;

				fields.forEach((field) => {
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
					mappedFields[index.toString()] = bestMatch;
				}
			});
		}
		// Si pas d'en-têtes, le mappage sera fait manuellement par l'utilisateur

		console.log('Mappage final:', mappedFields);
	}

	function handleTableChange() {
		console.log('handleTableChange called with targetTable:', targetTable);
		// Réinitialiser le mappage lors du changement de table
		mappedFields = {};
		guessFieldMapping();

		// Mise à jour du formulaire
		$form.targetTable = targetTable;
		$form.mappedFields = mappedFields;
		
		// La variable réactive se met à jour automatiquement
	}

	// Variable réactive pour les champs requis
	$: requiredFields = (() => {
		console.log('🔎 Reactive requiredFields called with targetTable:', targetTable);
		console.log('🔎 Type of targetTable:', typeof targetTable);
		console.log('🔎 targetTable === "supplier_dev":', targetTable === 'supplier_dev');
		
		let result: string[] = [];
		if (targetTable === 'attribute' || targetTable === 'attribute_dev') {
			result = ['atr_nat', 'atr_val'];
			console.log('🔎 Returning for attribute tables:', result);
		} else if (targetTable === 'supplier_dev') {
			result = ['sup_code'];
			console.log('🔎 Returning for supplier_dev:', result);
		} else if (targetTable === 'v_categories_dev') {
			result = ['atr_0_label'];
			console.log('🔎 Returning for categories:', result);
		}
		
		console.log('🔎 Final requiredFields result:', result);
		return result;
	})();

	function getRequiredFields(): string[] {
		return requiredFields;
	}

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
			targetTable
		};
	}
</script>

<div class="mx-auto my-8 max-w-6xl">
	<h1 class="mb-6 text-2xl font-bold">Importation de données</h1>

	<Alert.GlobalAlert />

	<div class="steps mb-8 flex justify-between">
		<div class={`step-item ${step >= 1 ? 'text-blue-700' : ''} flex-1`}>
			<div class="flex items-center">
				<div
					class={`mr-2 flex h-8 w-8 items-center justify-center rounded-full ${step >= 1 ? 'bg-blue-100 text-blue-700' : 'bg-gray-200'}`}
				>
					1
				</div>
				<span>Sélection du fichier</span>
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
				<span>Mappage des colonnes</span>
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
				<span>Validation & Import</span>
			</div>
		</div>
	</div>

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
					class={`mb-4 rounded-lg border-2 border-dashed p-8 text-center transition-colors ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}
					on:dragenter|preventDefault={handleDragEnter}
					on:dragleave|preventDefault={handleDragLeave}
					on:dragover|preventDefault={handleDragOver}
					on:drop|preventDefault={handleDrop}
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
								onclick={() => {
									document.getElementById('fileInput')?.click();
								}}
							>
								<Upload class="mr-2 h-5 w-5" />
								Parcourir les fichiers
							</Button>
						</div>
					</div>
				</div>

				{#if file}
					<div class="mt-4 flex items-center justify-between rounded-lg bg-gray-50 p-4">
						<div class="flex items-center">
							<FileCheck class="mr-2 h-6 w-6 text-green-500" />
							<div>
								<p class="font-medium">{fileName}</p>
								<p class="text-sm text-gray-500">{(file.size / 1024).toFixed(2)} Ko</p>
							</div>
						</div>
						<Button variant="bleu" onclick={readFile}>
							Continuer <ArrowRight class="ml-2 h-4 w-4" />
						</Button>
					</div>
				{/if}
			</div>
		{:else if step === 2}
			<form method="POST" action="?/validate" use:superEnhance>
				<div class="mb-6">
					<h2 class="mb-4 text-xl font-semibold">Mappage des colonnes</h2>

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

					<div class="mb-6">
						<label for="targetTable" class="mb-2 block font-medium text-gray-700"
							>Table de destination</label
						>
						<Select.Select
							type="single"
							value={targetTable}
							onValueChange={(value) => {
								console.log('🎯 Select.onValueChange called with:', value);
								console.log('🎯 Value length:', value?.length);
								console.log('🎯 Value JSON:', JSON.stringify(value));
								console.log('🎯 Current targetTable before change:', targetTable);
								if (value) {
									// Nettoyer la valeur au cas où il y aurait des espaces
									const cleanValue = value.trim();
									targetTable = cleanValue;
									console.log('🎯 targetTable set to:', targetTable);
									console.log('🎯 targetTable JSON:', JSON.stringify(targetTable));
									handleTableChange();
								}
							}}
						>
							<Select.SelectTrigger class="w-full md:w-1/2" hasValue={!!targetTable}>
								{availableTables.find((t) => t.value === targetTable)?.name ||
									'Sélectionnez une table'}
							</Select.SelectTrigger>
							<Select.SelectContent>
								{#each availableTables as table}
									<Select.SelectItem value={table.value}>{table.name}</Select.SelectItem>
								{/each}
							</Select.SelectContent>
						</Select.Select>
					</div>

					<h3 class="mb-2 font-medium">Aperçu des données</h3>
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
													hasValue={!!(mappedFields[i.toString()] && mappedFields[i.toString()] !== '')}
												>
													{mappedFields[i.toString()] || 'Ne pas importer'}
												</Select.SelectTrigger>
												<Select.SelectContent>
													<Select.SelectItem value="">Ne pas importer</Select.SelectItem>
													{#each tableFields[targetTable] as field}
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

					<!-- Champs requis -->
					<div class="mb-6">
						<h3 class="mb-2 font-medium">Champs requis</h3>
						<!-- Debug info -->
						<div class="mb-2 text-xs text-gray-500">
							Debug: targetTable = "{targetTable}", requiredFields = {JSON.stringify(requiredFields)}
						</div>
						<div class="flex flex-wrap gap-2">
							{#each requiredFields as field}
								<div
									class={`rounded-full px-3 py-1 text-sm font-medium ${isFieldMapped(field) ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
								>
									{#if isFieldMapped(field)}
										<Check class="mr-1 inline h-4 w-4" />
									{:else}
										<X class="mr-1 inline h-4 w-4" />
									{/if}
									{field}
								</div>
							{/each}
						</div>
					</div>

					<!-- Champs cachés pour le formulaire -->
					<input type="hidden" name="data" value={JSON.stringify($form.data)} />
					<input type="hidden" name="mappedFields" value={JSON.stringify(mappedFields)} />
					<input type="hidden" name="targetTable" value={targetTable} />

					<div class="flex justify-between">
						<Button variant="noir" onclick={resetImport}>Retour</Button>
						<Button
							type="submit"
							variant="vert"
							disabled={requiredFields.some((field) => !isFieldMapped(field)) || $submitting}
						>
							{#if $submitting}
								<Spinner class="mr-2 h-4 w-4" />
								Validation en cours...
							{:else}
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
							<div class="text-sm text-green-800">Lignes valides</div>
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
							data={validationResults.invalidData.map((error) => ({
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
								const hasError = validationResults.invalidData.some((error) => error.row === index);
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
						<input type="hidden" name="targetTable" value={targetTable} />

						<div class="flex justify-between">
							<Button variant="noir" onclick={() => (step = 2)}>Retour</Button>
							<Button
								type="submit"
								variant={validationResults.validRows > 0 ? 'vert' : 'noir'}
								disabled={validationResults.validRows === 0 || $submitting}
							>
								{#if $submitting}
									<Spinner class="mr-2 h-4 w-4" />
									Importation en cours...
								{:else}
									Importer {validationResults.validRows} lignes
								{/if}
							</Button>
						</div>
					</form>
				{:else}
					<div class="rounded-md border border-green-200 bg-green-50 p-6 text-center">
						<Check class="mx-auto mb-2 h-12 w-12 text-green-500" />
						<h3 class="mb-2 text-xl font-medium text-green-800">
							Importation terminée avec succès
						</h3>
						<p class="mb-4">
							{validationResults.validRows} lignes ont été importées dans la table {targetTable}.
							{#if validationResults.inserted && validationResults.updated}
								({validationResults.inserted} insertions et {validationResults.updated} mises à jour)
							{/if}
						</p>
						<Button variant="bleu" onclick={resetImport}>Nouvelle importation</Button>
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
