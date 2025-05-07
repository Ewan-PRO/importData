<script lang="ts">
	import { enhance } from '$app/forms';
	import { Button, Card, Label, Select, Progressbar, Alert } from 'flowbite-svelte';
	import { Upload, RefreshCw, CheckCircleIcon, XCircleIcon } from 'lucide-svelte';
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';
	import * as XLSX from 'xlsx';

	type ColumnMapping = {
		fileColumn: string;
		dbField: string;
		required: boolean;
		valid: boolean;
		errorMessage?: string;
	};

	type ImportTable = {
		name: string;
		label: string;
		fields: {
			name: string;
			label: string;
			required: boolean;
			type: string;
		}[];
	};

	type ValidationResult = {
		valid: boolean;
		errors: {
			row: number;
			column: string;
			message: string;
		}[];
		duplicates: {
			rows: number[];
			key: string;
		}[];
		totalRows: number;
		validRows: number;
	};

	let tables: ImportTable[] = [
		{
			name: 'attribute',
			label: 'Attributs',
			fields: [
				{ name: 'atr_nat', label: 'Nature', required: true, type: 'string' },
				{ name: 'atr_val', label: 'Valeur', required: true, type: 'string' },
				{ name: 'atr_label', label: 'Libellé', required: true, type: 'string' }
			]
		},
		{
			name: 'supplier',
			label: 'Fournisseurs',
			fields: [
				{ name: 'sup_code', label: 'Code', required: true, type: 'string' },
				{ name: 'sup_label', label: 'Nom', required: true, type: 'string' }
			]
		},
		{
			name: 'v_categories',
			label: 'Catégories',
			fields: [
				{ name: 'atr_0_label', label: 'Catégorie niveau 0', required: true, type: 'string' },
				{ name: 'atr_1_label', label: 'Catégorie niveau 1', required: false, type: 'string' },
				{ name: 'atr_2_label', label: 'Catégorie niveau 2', required: false, type: 'string' },
				{ name: 'atr_3_label', label: 'Catégorie niveau 3', required: false, type: 'string' },
				{ name: 'atr_4_label', label: 'Catégorie niveau 4', required: false, type: 'string' },
				{ name: 'atr_5_label', label: 'Catégorie niveau 5', required: false, type: 'string' },
				{ name: 'atr_6_label', label: 'Catégorie niveau 6', required: false, type: 'string' },
				{ name: 'atr_7_label', label: 'Catégorie niveau 7', required: false, type: 'string' }
			]
		}
	];

	let selectedTable: ImportTable = tables[0];
	let file: File | null = null;
	let fileData: any[] = [];
	let fileName: string = '';
	let fileColumns: string[] = [];
	let columnMappings: ColumnMapping[] = [];
	let validationResult: ValidationResult | null = null;
	let importStatus: 'idle' | 'mapping' | 'validating' | 'importing' | 'success' | 'error' = 'idle';
	let importError: string = '';
	let importResult: any = null;

	$: availableDbFields = selectedTable?.fields || [];

	onMount(() => {
		initializeDropZone();
	});

	function initializeDropZone() {
		if (!browser) return;

		const dropZone = document.getElementById('drop-zone');

		if (!dropZone) return;

		dropZone.addEventListener('dragover', (e) => {
			e.preventDefault();
			dropZone.classList.add('border-blue-500');
		});

		dropZone.addEventListener('dragleave', () => {
			dropZone.classList.remove('border-blue-500');
		});

		dropZone.addEventListener('drop', (e) => {
			e.preventDefault();
			dropZone.classList.remove('border-blue-500');

			if (e.dataTransfer?.files.length) {
				handleFileUpload(e.dataTransfer.files[0]);
			}
		});
	}

	function handleTableSelect(event: Event) {
		const select = event.target as HTMLSelectElement;
		selectedTable = tables.find((t) => t.name === select.value) || tables[0];

		if (fileColumns.length > 0) {
			generateColumnMappings();
		}
	}

	function handleFileInput(event: Event) {
		const input = event.target as HTMLInputElement;
		if (input.files && input.files.length > 0) {
			handleFileUpload(input.files[0]);
		}
	}

	function handleFileUpload(uploadedFile: File) {
		const validTypes = [
			'application/vnd.ms-excel',
			'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
			'text/csv',
			'application/csv'
		];

		if (
			!validTypes.includes(uploadedFile.type) &&
			!uploadedFile.name.endsWith('.csv') &&
			!uploadedFile.name.endsWith('.xlsx') &&
			!uploadedFile.name.endsWith('.xls')
		) {
			importError = 'Format de fichier non supporté. Utilisez CSV ou Excel.';
			importStatus = 'error';
			return;
		}

		file = uploadedFile;
		fileName = uploadedFile.name;
		importStatus = 'mapping';
		importError = '';

		const reader = new FileReader();

		reader.onload = (e) => {
			try {
				const data = new Uint8Array(e.target?.result as ArrayBuffer);
				const workbook = XLSX.read(data, { type: 'array' });

				const firstSheetName = workbook.SheetNames[0];
				const worksheet = workbook.Sheets[firstSheetName];

				fileData = XLSX.utils.sheet_to_json(worksheet, { header: 'A' });

				if (fileData.length === 0) {
					throw new Error('Le fichier ne contient aucune donnée');
				}

				const headerRow = fileData[0];
				fileColumns = Object.values(headerRow);

				fileData = fileData.slice(1);

				generateColumnMappings();
			} catch (error) {
				console.error('Erreur lors de la lecture du fichier:', error);
				importError = `Erreur lors de la lecture du fichier: ${error instanceof Error ? error.message : 'Format invalide'}`;
				importStatus = 'error';
			}
		};

		reader.onerror = () => {
			importError = 'Erreur lors de la lecture du fichier';
			importStatus = 'error';
		};

		reader.readAsArrayBuffer(file);
	}

	function generateColumnMappings() {
		columnMappings = [];

		availableDbFields.forEach((field) => {
			let matchIndex = fileColumns.findIndex(
				(col) =>
					col.toLowerCase() === field.name.toLowerCase() ||
					col.toLowerCase() === field.label.toLowerCase()
			);

			if (matchIndex === -1) {
				matchIndex = fileColumns.findIndex(
					(col) =>
						col.toLowerCase().includes(field.name.toLowerCase()) ||
						field.name.toLowerCase().includes(col.toLowerCase()) ||
						col.toLowerCase().includes(field.label.toLowerCase()) ||
						field.label.toLowerCase().includes(col.toLowerCase())
				);
			}

			columnMappings.push({
				fileColumn: matchIndex !== -1 ? fileColumns[matchIndex] : '',
				dbField: field.name,
				required: field.required,
				valid: !field.required || matchIndex !== -1
			});
		});
	}

	function updateMapping(index: number, newColumn: string) {
		columnMappings[index].fileColumn = newColumn;
		columnMappings[index].valid = !columnMappings[index].required || newColumn !== '';
		columnMappings = [...columnMappings];
	}

	function validateData() {
		importStatus = 'validating';

		const invalidMappings = columnMappings.filter(
			(m) => m.required && (!m.fileColumn || m.fileColumn === '')
		);

		if (invalidMappings.length > 0) {
			importError = `Certains champs obligatoires n'ont pas été mappés: ${invalidMappings.map((m) => availableDbFields.find((f) => f.name === m.dbField)?.label).join(', ')}`;
			importStatus = 'mapping';
			return;
		}

		const mappingByFileColumn: Record<
			string,
			{ dbField: string; required: boolean; type: string }
		> = {};
		columnMappings.forEach((m) => {
			if (m.fileColumn) {
				const fieldInfo = availableDbFields.find((f) => f.name === m.dbField);
				if (fieldInfo) {
					mappingByFileColumn[m.fileColumn] = {
						dbField: m.dbField,
						required: fieldInfo.required,
						type: fieldInfo.type
					};
				}
			}
		});

		const errors: { row: number; column: string; message: string }[] = [];
		const processedKeys = new Set<string>();
		const duplicates: { rows: number[]; key: string }[] = [];
		let validRows = 0;

		fileData.forEach((row: any, rowIndex: number) => {
			let rowValid = true;
			let uniqueKey = '';

			Object.entries(row).forEach(([col, val]) => {
				const colName = fileData[0][col];
				if (colName in mappingByFileColumn) {
					const fieldInfo = mappingByFileColumn[colName];

					if (fieldInfo.required && (val === undefined || val === null || val === '')) {
						errors.push({
							row: rowIndex + 2,
							column: colName,
							message: 'Valeur obligatoire manquante'
						});
						rowValid = false;
					}

					if (val !== undefined && val !== null && val !== '') {
						if (fieldInfo.type === 'number' && isNaN(Number(val))) {
							errors.push({
								row: rowIndex + 2,
								column: colName,
								message: 'Valeur numérique invalide'
							});
							rowValid = false;
						}
					}

					if (
						fieldInfo.dbField === 'atr_nat' ||
						fieldInfo.dbField === 'atr_val' ||
						fieldInfo.dbField === 'sup_code' ||
						fieldInfo.dbField === 'atr_0_label'
					) {
						uniqueKey += `${fieldInfo.dbField}:${val};`;
					}
				}
			});

			if (uniqueKey && processedKeys.has(uniqueKey)) {
				let duplicate = duplicates.find((d) => d.key === uniqueKey);
				if (!duplicate) {
					duplicate = { rows: [], key: uniqueKey };
					duplicates.push(duplicate);
				}
				duplicate.rows.push(rowIndex + 2);
			} else if (uniqueKey) {
				processedKeys.add(uniqueKey);
			}

			if (rowValid) validRows++;
		});

		fileData.forEach((row: any, rowIndex: number) => {
			let uniqueKey = '';
			Object.entries(row).forEach(([col, val]) => {
				const colName = fileData[0][col];
				if (colName in mappingByFileColumn) {
					const fieldInfo = mappingByFileColumn[colName];
					if (
						fieldInfo.dbField === 'atr_nat' ||
						fieldInfo.dbField === 'atr_val' ||
						fieldInfo.dbField === 'sup_code' ||
						fieldInfo.dbField === 'atr_0_label'
					) {
						uniqueKey += `${fieldInfo.dbField}:${val};`;
					}
				}
			});

			const duplicate = duplicates.find((d) => d.key === uniqueKey);
			if (duplicate && !duplicate.rows.includes(rowIndex + 2)) {
				duplicate.rows.push(rowIndex + 2);
			}
		});

		validationResult = {
			valid: errors.length === 0,
			errors,
			duplicates,
			totalRows: fileData.length,
			validRows
		};

		if (errors.length === 0 && duplicates.length === 0) {
			importStatus = 'mapping';
		} else {
			importStatus = 'mapping';
		}
	}

	async function startImport() {
		importStatus = 'importing';

		try {
			const formData = new FormData();
			formData.append('file', file as File);
			formData.append('tableName', selectedTable.name);
			formData.append('columnMappings', JSON.stringify(columnMappings));

			const response = await fetch('/api/import', {
				method: 'POST',
				body: formData
			});

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.message || "Erreur lors de l'importation");
			}

			importResult = await response.json();
			importStatus = 'success';
		} catch (error) {
			importError =
				error instanceof Error ? error.message : "Erreur inconnue lors de l'importation";
			importStatus = 'error';
		}
	}

	function resetImport() {
		file = null;
		fileName = '';
		fileData = [];
		fileColumns = [];
		columnMappings = [];
		validationResult = null;
		importStatus = 'idle';
		importError = '';
		importResult = null;
	}
</script>

<div class="container mx-auto px-4 py-8">
	<div class="mb-8">
		<h1 class="mb-2 text-2xl font-bold">Importation de données</h1>
		<p class="text-gray-600">Importez vos données depuis un fichier CSV ou Excel</p>
	</div>

	{#if importStatus === 'error'}
		<Alert color="red" class="mb-6">
			<XCircleIcon slot="icon" class="h-4 w-4" />
			<span class="font-medium">Erreur:</span>
			{importError}
		</Alert>
	{/if}

	{#if importStatus === 'success'}
		<Alert color="green" class="mb-6">
			<CheckCircleIcon slot="icon" class="h-4 w-4" />
			<span class="font-medium">Succès:</span> Importation réalisée avec succès!
		</Alert>

		<Card class="mb-6">
			<div class="p-4">
				<h2 class="mb-3 text-xl font-semibold">Rapport d'importation</h2>
				<div class="grid grid-cols-2 gap-4">
					<div>
						<p><span class="font-medium">Table:</span> {importResult.tableName}</p>
						<p><span class="font-medium">Lignes traitées:</span> {importResult.totalRows}</p>
						<p><span class="font-medium">Lignes importées:</span> {importResult.importedRows}</p>
						<p><span class="font-medium">Doublons détectés:</span> {importResult.duplicates}</p>
						<p><span class="font-medium">Erreurs:</span> {importResult.errors}</p>
					</div>
				</div>
			</div>
		</Card>

		<Button color="blue" on:click={resetImport}>Nouvelle importation</Button>
	{:else}
		<div class="grid grid-cols-1 gap-6 md:grid-cols-3">
			<!-- Étape 1: Sélection de la table et du fichier -->
			<Card class="col-span-1 h-full {importStatus !== 'idle' ? 'opacity-75' : ''}">
				<div class="p-4">
					<h2 class="mb-4 text-lg font-semibold">1. Sélection de la table</h2>

					<div class="mb-4">
						<Label for="table-select" class="mb-2">Table cible</Label>
						<Select
							id="table-select"
							class="w-full"
							on:change={handleTableSelect}
							disabled={importStatus !== 'idle'}
						>
							{#each tables as table}
								<option value={table.name}>{table.label}</option>
							{/each}
						</Select>
					</div>

					<div class="mb-4">
						<Label class="mb-2">Fichier à importer</Label>

						<div
							id="drop-zone"
							class="cursor-pointer rounded-md border-2 border-dashed border-gray-300 p-6 text-center transition-colors hover:border-blue-300"
							class:pointer-events-none={importStatus !== 'idle'}
						>
							{#if fileName}
								<p class="break-all text-blue-600">{fileName}</p>
							{:else}
								<Upload class="mx-auto mb-2 h-12 w-12 text-gray-400" />
								<p class="text-gray-600">Glissez votre fichier CSV/Excel ici</p>
								<p class="mb-3 text-sm text-gray-500">ou</p>
								<Button color="blue" size="sm" disabled={importStatus !== 'idle'}>
									Parcourir
									<input
										type="file"
										class="absolute inset-0 h-full w-full cursor-pointer opacity-0"
										accept=".csv,.xlsx,.xls"
										on:change={handleFileInput}
										disabled={importStatus !== 'idle'}
									/>
								</Button>
							{/if}
						</div>
					</div>
				</div>
			</Card>

			<!-- Étape 2: Mappage des colonnes -->
			<Card class="col-span-1 md:col-span-2 {importStatus === 'idle' ? 'opacity-75' : ''}">
				<div class="p-4">
					<h2 class="mb-4 text-lg font-semibold">2. Mappage des colonnes</h2>

					{#if fileColumns.length > 0}
						<div class="overflow-x-auto">
							<table class="w-full text-left text-sm">
								<thead class="bg-gray-100 text-xs text-gray-700 uppercase">
									<tr>
										<th class="px-4 py-2">Champ de la base de données</th>
										<th class="px-4 py-2">Obligatoire</th>
										<th class="px-4 py-2">Colonne du fichier</th>
									</tr>
								</thead>
								<tbody>
									{#each columnMappings as mapping, i}
										<tr class="border-b hover:bg-gray-50">
											<td class="px-4 py-3 font-medium">
												{availableDbFields.find((f) => f.name === mapping.dbField)?.label ||
													mapping.dbField}
											</td>
											<td class="px-4 py-3">
												{mapping.required ? 'Oui' : 'Non'}
											</td>
											<td class="px-4 py-3">
												<Select
													class="w-full {!mapping.valid ? 'border-red-500' : ''}"
													value={mapping.fileColumn}
													on:change={(e) => {
														const target = e.target as HTMLSelectElement;
														updateMapping(i, target.value);
													}}
												>
													<option value="">-- Sélectionner --</option>
													{#each fileColumns as column}
														<option value={column}>{column}</option>
													{/each}
												</Select>
												{#if !mapping.valid}
													<p class="mt-1 text-xs text-red-500">Ce champ est obligatoire</p>
												{/if}
											</td>
										</tr>
									{/each}
								</tbody>
							</table>
						</div>

						{#if validationResult}
							<div class="mt-6">
								<h3 class="text-md mb-3 font-semibold">Résultat de la validation</h3>

								<div class="mb-4 grid grid-cols-1 gap-4 md:grid-cols-3">
									<div class="rounded-md bg-gray-100 p-3">
										<p class="text-sm">
											Lignes totales: <span class="font-bold">{validationResult.totalRows}</span>
										</p>
									</div>
									<div class="rounded-md bg-green-100 p-3">
										<p class="text-sm">
											Lignes valides: <span class="font-bold">{validationResult.validRows}</span>
										</p>
									</div>
									<div class="rounded-md bg-red-100 p-3">
										<p class="text-sm">
											Erreurs: <span class="font-bold">{validationResult.errors.length}</span>
										</p>
									</div>
								</div>

								{#if validationResult.errors.length > 0}
									<div class="mb-4">
										<h4 class="mb-2 text-sm font-semibold">Erreurs détectées:</h4>
										<div class="max-h-32 overflow-y-auto rounded-md bg-red-50 p-3">
											{#each validationResult.errors.slice(0, 10) as error}
												<p class="mb-1 text-sm text-red-600">
													Ligne {error.row}: {error.column} - {error.message}
												</p>
											{/each}
											{#if validationResult.errors.length > 10}
												<p class="text-sm text-gray-600">
													... et {validationResult.errors.length - 10} autres erreurs
												</p>
											{/if}
										</div>
									</div>
								{/if}

								{#if validationResult.duplicates.length > 0}
									<div>
										<h4 class="mb-2 text-sm font-semibold">Doublons détectés:</h4>
										<div class="max-h-32 overflow-y-auto rounded-md bg-yellow-50 p-3">
											{#each validationResult.duplicates.slice(0, 5) as duplicate}
												<p class="mb-1 text-sm text-yellow-700">
													Lignes {duplicate.rows.join(', ')} ont la même clé
												</p>
											{/each}
											{#if validationResult.duplicates.length > 5}
												<p class="text-sm text-gray-600">
													... et {validationResult.duplicates.length - 5} autres doublons
												</p>
											{/if}
										</div>
									</div>
								{/if}
							</div>
						{/if}

						<div class="mt-6 flex gap-2">
							<Button color="blue" on:click={validateData} disabled={importStatus === 'importing'}>
								Valider les données
							</Button>

							<Button
								color="green"
								on:click={startImport}
								disabled={importStatus === 'importing' ||
									!validationResult ||
									validationResult.errors.length > 0}
							>
								{#if importStatus === 'importing'}
									<RefreshCw class="mr-2 h-4 w-4 animate-spin" />
									Importation en cours...
								{:else}
									Importer les données
								{/if}
							</Button>

							<Button color="red" on:click={resetImport} disabled={importStatus === 'importing'}>
								Annuler
							</Button>
						</div>
					{:else if importStatus !== 'idle'}
						<div class="py-6 text-center">
							<p class="text-gray-500">Chargement des données en cours...</p>
							<Progressbar progress={0} size="h-2" color="blue" class="mt-2" />
						</div>
					{:else}
						<div class="py-6 text-center">
							<p class="text-gray-500">Sélectionnez un fichier pour commencer</p>
						</div>
					{/if}
				</div>
			</Card>
		</div>
	{/if}
</div>
