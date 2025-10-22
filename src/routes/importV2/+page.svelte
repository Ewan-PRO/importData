<script lang="ts">
	import { enhance } from '$app/forms';
	import { toast } from 'svelte-sonner';
	import { Button } from '$lib/components/ui/button';
	import { Card } from 'flowbite-svelte';
	import * as Alert from '$lib/components/ui/alert';
	import { Upload, AlertCircle, Check, CircleArrowLeft } from 'lucide-svelte';

	interface ValidationError {
		line: number;
		field: string;
		value: string;
		error: string;
	}

	interface ValidationResult {
		success: boolean;
		totalRows: number;
		validRows: number;
		errors: ValidationError[];
		warnings: Array<unknown>;
	}

	interface ImportStats {
		suppliers: number;
		kits: number;
		categories: number;
		families: number;
		products: number;
		productsUpdated: number;
		prices: number;
		categoryAttributes: number;
		kitAttributes: number;
	}

	interface ImportResult {
		success: boolean;
		stats: ImportStats;
	}

	let {
		form = $bindable()
	}: {
		form?: { validation?: ValidationResult; result?: ImportResult; error?: string } | null;
	} = $props();

	let step = $state(1);
	let csvFile = $state<File | null>(null);
	let csvContent = $state('');
	let fileName = $state('');
	let isProcessing = $state(false);

	let lastHandledValidation = $state<ValidationResult | null>(null);
	let lastHandledResult = $state<ImportResult | null>(null);

	let parsedPreview = $state<{
		product: Record<string, string>;
		attributes: Array<{ label: string; value: string }>;
	} | null>(null);

	function handleFileUpload(e: Event) {
		const input = e.target as HTMLInputElement;
		if (!input.files || input.files.length === 0) return;

		csvFile = input.files[0];
		fileName = csvFile.name;

		const reader = new FileReader();
		reader.onload = (e) => {
			csvContent = e.target?.result as string;
			parsePreview();
		};
		reader.readAsText(csvFile);
	}

	function parsePreview() {
		try {
			const lines = csvContent.split('\n');
			if (lines.length < 3) {
				toast.error('Fichier CSV invalide (moins de 3 lignes)');
				return;
			}

			const headers = lines[0].split(';');
			const dataLine = lines[1].split(';');
			const valuesLine = lines[2].split(';');

			const attributeIndexes: number[] = [];
			headers.forEach((h, i) => {
				if (h.trim() === 'atr_label') attributeIndexes.push(i);
			});

			const product: Record<string, string> = {};
			headers.forEach((h, i) => {
				if (!attributeIndexes.includes(i) && dataLine[i]) {
					product[h.trim()] = dataLine[i].trim();
				}
			});

			const attributes: Array<{ label: string; value: string }> = [];
			attributeIndexes.forEach((i) => {
				if (dataLine[i] && valuesLine[i]) {
					attributes.push({
						label: dataLine[i].trim(),
						value: valuesLine[i].trim()
					});
				}
			});

			parsedPreview = { product, attributes };
			step = 2;
		} catch (error) {
			toast.error('Erreur parsing CSV: ' + (error instanceof Error ? error.message : 'Erreur'));
		}
	}

	function resetImport() {
		step = 1;
		csvFile = null;
		csvContent = '';
		fileName = '';
		parsedPreview = null;
		form = null;
		lastHandledValidation = null;
		lastHandledResult = null;
	}

	$effect(() => {
		if (form?.validation && form.validation !== lastHandledValidation) {
			lastHandledValidation = form.validation;
			isProcessing = false;
			step = 3;
		}
	});

	$effect(() => {
		if (form?.result && form.result !== lastHandledResult) {
			lastHandledResult = form.result;
			isProcessing = false;
			step = 4;
			toast.success('Import réussi !');

			setTimeout(() => {
				resetImport();
			}, 3000);
		}
	});

	$effect(() => {
		if (form?.error) {
			toast.error(form.error);
			isProcessing = false;
		}
	});
</script>

<div class="container mx-auto max-w-4xl p-6">
	<h1 class="mb-6 text-3xl font-bold">Import CSV MVP</h1>

	<Alert.GlobalAlert />

	<div class="mb-8 flex justify-between">
		<div class="step flex-1 {step >= 1 ? 'active' : ''}">
			<div class="mb-2 text-center text-sm font-medium">1. Upload</div>
			<div class="mx-4 h-2 rounded bg-gray-200 {step >= 1 ? 'bg-blue-500' : ''}"></div>
		</div>
		<div class="step flex-1 {step >= 2 ? 'active' : ''}">
			<div class="mb-2 text-center text-sm font-medium">2. Preview</div>
			<div class="mx-4 h-2 rounded bg-gray-200 {step >= 2 ? 'bg-blue-500' : ''}"></div>
		</div>
		<div class="step flex-1 {step >= 3 ? 'active' : ''}">
			<div class="mb-2 text-center text-sm font-medium">3. Validation</div>
			<div class="mx-4 h-2 rounded bg-gray-200 {step >= 3 ? 'bg-blue-500' : ''}"></div>
		</div>
		<div class="step flex-1 {step >= 4 ? 'active' : ''}">
			<div class="mb-2 text-center text-sm font-medium">4. Import</div>
			<div class="mx-4 h-2 rounded bg-gray-200 {step >= 4 ? 'bg-blue-500' : ''}"></div>
		</div>
	</div>

	<Card>
		{#if step === 1}
			<div class="mb-6">
				<h2 class="mb-4 text-xl font-semibold">Upload fichier CSV</h2>
				<p class="mb-4 text-gray-600">Sélectionnez un fichier CSV au format MVP (vertical)</p>

				<div
					class="mb-4 cursor-pointer rounded-lg border-2 border-dashed border-gray-300 p-8 text-center transition-colors hover:border-blue-400 hover:bg-blue-50"
					role="button"
					tabindex="0"
					onclick={() => document.getElementById('fileInput')?.click()}
					onkeydown={(e) => {
						if (e.key === 'Enter' || e.key === ' ') {
							e.preventDefault();
							document.getElementById('fileInput')?.click();
						}
					}}
				>
					<Upload class="mx-auto mb-2 h-12 w-12 text-gray-400" />
					<p class="mb-2 text-lg">Glissez-déposez votre fichier ici</p>
					<p class="mb-4 text-sm text-gray-500">ou</p>
					<input
						type="file"
						id="fileInput"
						class="hidden"
						accept=".csv"
						onchange={handleFileUpload}
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
		{:else if step === 2 && parsedPreview}
			<div class="mb-6">
				<h2 class="mb-4 text-xl font-semibold">Preview des données - {fileName}</h2>

				<div class="mb-6 rounded-lg border bg-gray-50 p-4">
					<h3 class="mb-2 font-medium">Données produit :</h3>
					<div class="grid grid-cols-2 gap-2 text-sm">
						{#each Object.entries(parsedPreview.product) as [key, value] (key)}
							<div><span class="font-medium">{key}:</span> {value}</div>
						{/each}
					</div>
				</div>

				<div class="mb-6 rounded-lg border bg-blue-50 p-4">
					<h3 class="mb-2 font-medium">Attributs détectés ({parsedPreview.attributes.length}) :</h3>
					<div class="grid gap-2">
						{#each parsedPreview.attributes as attr (attr.label)}
							<div class="flex justify-between rounded bg-white p-2 text-sm">
								<span class="font-medium">{attr.label}:</span>
								<span>{attr.value || '(vide)'}</span>
							</div>
						{/each}
					</div>
				</div>

				<form
					method="POST"
					action="?/validate"
					use:enhance={() => {
						isProcessing = true;
						return async ({ update }) => {
							await update();
						};
					}}
				>
					<input type="hidden" name="csv" value={csvContent} />
					<div class="flex justify-between">
						<Button variant="noir" onclick={resetImport}>
							<CircleArrowLeft class="mr-2 h-4 w-4" />
							Retour
						</Button>
						<Button type="submit" variant="vert" disabled={isProcessing}>
							{isProcessing ? 'Validation...' : 'Valider →'}
						</Button>
					</div>
				</form>
			</div>
		{:else if step === 3 && form?.validation}
			<div class="mb-6">
				<h2 class="mb-4 text-xl font-semibold">Résultats validation</h2>

				<div class="mb-6 grid grid-cols-3 gap-4">
					<div class="rounded-lg border border-blue-200 bg-blue-50 p-4 text-center">
						<div class="text-2xl font-bold text-blue-600">{form.validation.totalRows}</div>
						<div class="text-sm text-blue-800">Lignes totales</div>
					</div>
					<div class="rounded-lg border border-green-200 bg-green-50 p-4 text-center">
						<div class="text-2xl font-bold text-green-600">{form.validation.validRows}</div>
						<div class="text-sm text-green-800">Lignes valides</div>
					</div>
					<div class="rounded-lg border border-red-200 bg-red-50 p-4 text-center">
						<div class="text-2xl font-bold text-red-600">{form.validation.errors.length}</div>
						<div class="text-sm text-red-800">Erreurs</div>
					</div>
				</div>

				{#if form.validation.errors.length > 0}
					<div class="mb-6 rounded-lg border border-red-200 bg-red-50 p-4">
						<h3 class="mb-2 font-medium text-red-800">Erreurs de validation :</h3>
						<div class="max-h-64 overflow-y-auto">
							{#each form.validation.errors as error, i (i)}
								<div class="mb-2 rounded bg-white p-2 text-sm">
									<div class="flex items-center gap-2">
										<AlertCircle class="h-4 w-4 text-red-500" />
										<span class="font-medium">Ligne {error.line}, champ "{error.field}":</span>
									</div>
									<div class="ml-6 text-gray-600">{error.error}</div>
									{#if error.value}
										<div class="ml-6 text-xs text-gray-500">Valeur: "{error.value}"</div>
									{/if}
								</div>
							{/each}
						</div>
					</div>
				{/if}

				<form
					method="POST"
					action="?/process"
					use:enhance={() => {
						isProcessing = true;
						return async ({ update }) => {
							await update();
						};
					}}
				>
					<input type="hidden" name="csv" value={csvContent} />
					<div class="flex justify-between">
						<Button variant="noir" onclick={() => (step = 2)}>
							<CircleArrowLeft class="mr-2 h-4 w-4" />
							Retour
						</Button>
						<Button
							type="submit"
							variant={form.validation.validRows > 0 ? 'vert' : 'noir'}
							disabled={form.validation.validRows === 0 || isProcessing}
						>
							{isProcessing
								? 'Import en cours...'
								: `Importer ${form.validation.validRows} ligne(s) →`}
						</Button>
					</div>
				</form>
			</div>
		{:else if step === 4 && form?.result}
			<div class="mb-6">
				<div class="rounded-lg border border-green-200 bg-green-50 p-6">
					<div class="mb-4 text-center">
						<Check class="mx-auto mb-2 h-12 w-12 text-green-500" />
						<h3 class="mb-2 text-xl font-medium text-green-800">Import terminé avec succès !</h3>
					</div>

					<div class="grid grid-cols-2 gap-4 text-sm">
						<div class="rounded bg-white p-3">
							<div class="font-medium">Fournisseurs créés:</div>
							<div class="text-2xl font-bold text-green-600">{form.result.stats.suppliers}</div>
						</div>
						<div class="rounded bg-white p-3">
							<div class="font-medium">Kits créés:</div>
							<div class="text-2xl font-bold text-green-600">{form.result.stats.kits}</div>
						</div>
						<div class="rounded bg-white p-3">
							<div class="font-medium">Produits créés:</div>
							<div class="text-2xl font-bold text-green-600">{form.result.stats.products}</div>
						</div>
						<div class="rounded bg-white p-3">
							<div class="font-medium">Produits mis à jour:</div>
							<div class="text-2xl font-bold text-blue-600">
								{form.result.stats.productsUpdated}
							</div>
						</div>
						<div class="rounded bg-white p-3">
							<div class="font-medium">Prix enregistrés:</div>
							<div class="text-2xl font-bold text-green-600">{form.result.stats.prices}</div>
						</div>
						<div class="rounded bg-white p-3">
							<div class="font-medium">Attributs importés:</div>
							<div class="text-2xl font-bold text-green-600">{form.result.stats.kitAttributes}</div>
						</div>
					</div>

					<p class="mt-4 text-center text-sm text-green-700">
						Redirection automatique dans 3 secondes...
					</p>
				</div>
			</div>
		{/if}
	</Card>

	{#if isProcessing}
		<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
			<div class="rounded-lg bg-white p-6 shadow-lg">
				<div
					class="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"
				></div>
				<p class="text-center font-medium">Traitement en cours...</p>
			</div>
		</div>
	{/if}
</div>
