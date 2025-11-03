<script lang="ts">
	import { enhance } from '$app/forms';
	import { resolve } from '$app/paths';
	import { toast } from 'svelte-sonner';
	import { SvelteMap } from 'svelte/reactivity';
	import { Button } from '$lib/components/ui/button';
	import { Card } from 'flowbite-svelte';
	import * as Alert from '$lib/components/ui/alert';
	import {
		Upload,
		AlertCircle,
		Check,
		CircleArrowLeft,
		CircleArrowRight,
		ChevronsUpDown
	} from 'lucide-svelte';
	import * as Command from '$lib/components/ui/command';
	import * as Popover from '$lib/components/ui/popover';
	import { cn } from '$lib/utils';

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

	interface ChangeDetail {
		table: string;
		schema: string;
		column: string;
		oldValue: string | number | null;
		newValue: string | number | null;
		recordId: string;
	}

	interface ImportResult {
		success: boolean;
		stats: ImportStats;
		changes: ChangeDetail[];
	}

	let {
		data,
		form = $bindable()
	}: {
		data: {
			categories: Array<{
				cat_id: number;
				cat_code: string;
				cat_label: string;
				attributeCount: number;
			}>;
		};
		form?: { validation?: ValidationResult; result?: ImportResult; error?: string } | null;
	} = $props();

	let step = $state(0); // ✅ Commencer à 0 pour l'ÉTAPE 0
	let csvFile = $state<File | null>(null);
	let csvContent = $state('');
	let fileName = $state('');
	let isProcessing = $state(false);
	let selectedDatabase = $state<'cenov_dev' | 'cenov_preprod'>('cenov_dev');

	// ✅ États pour le Combobox (ÉTAPE 0)
	let open = $state(false);
	let selectedCategory = $state<string>(''); // cat_code
	let searchValue = $state('');

	// Flags pour détecter les nouvelles réponses (Solution 5 - Pattern Svelte 5)
	let validationReceived = $state(false);
	let resultReceived = $state(false);

	let parsedPreview = $state<{
		columns: Array<{ header: string; value: string }>;
	} | null>(null);

	// Grouper les changements par table
	let changesByTable = $derived.by(() => {
		if (!form?.result?.changes) return new SvelteMap();

		const grouped = new SvelteMap<string, ChangeDetail[]>();
		for (const change of form.result.changes) {
			const key = `${change.schema}.${change.table}`;
			if (!grouped.has(key)) {
				grouped.set(key, []);
			}
			grouped.get(key)!.push(change);
		}
		return grouped;
	});

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
			if (lines.length < 2) {
				toast.error('Fichier CSV invalide (moins de 2 lignes)');
				return;
			}

			const headers = lines[0].split(';');
			const values = lines[1].split(';');

			const columns: Array<{ header: string; value: string }> = [];

			headers.forEach((h, i) => {
				const header = h.trim();
				const value = values[i] ? values[i].trim() : '';

				if (header) {
					columns.push({ header, value });
				}
			});

			parsedPreview = { columns };
			step = 2;
		} catch (error) {
			toast.error('Erreur parsing CSV: ' + (error instanceof Error ? error.message : 'Erreur'));
		}
	}

	function resetImport() {
		step = 0; // ✅ Retour à l'ÉTAPE 0
		csvFile = null;
		csvContent = '';
		fileName = '';
		parsedPreview = null;
		form = null;
		validationReceived = false;
		resultReceived = false;
		// Réinitialiser états Combobox
		selectedCategory = '';
		searchValue = '';
		open = false;
	}

	$effect(() => {
		if (form?.validation && validationReceived) {
			validationReceived = false; // Auto-reset après traitement
			isProcessing = false;
			step = 3;
		}
	});

	$effect(() => {
		if (form?.result && resultReceived) {
			resultReceived = false; // Auto-reset après traitement
			isProcessing = false;
			step = 4;
			toast.success('Import réussi !');
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
		<div class="step flex-1 {step >= 0 ? 'active' : ''}">
			<div class="mb-2 text-center text-sm font-medium">0. Template</div>
			<div class="mx-4 h-2 rounded bg-gray-200 {step >= 0 ? 'bg-blue-500' : ''}"></div>
		</div>
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

	<Card class="w-full max-w-full">
		{#if step === 0}
			<!-- ✅ ÉTAPE 0 : Génération template (optionnelle) -->
			<div class="mb-6">
				<h2 class="mb-4 text-xl font-semibold text-black">
					0. Télécharger template CSV (optionnel) :
				</h2>
				<p class="mb-6 text-gray-600">
					Choisissez une catégorie pour générer un fichier CSV avec les bonnes colonnes d'attributs.
				</p>

				<!-- Combobox pour sélectionner la catégorie -->
				<div class="mb-6">
					<label for="category-combobox" class="mb-2 block text-sm font-medium text-gray-700">
						Sélectionner une catégorie :
					</label>

					<Popover.Root bind:open>
						<Popover.Trigger
							id="category-combobox"
							role="combobox"
							aria-expanded={open}
							aria-controls="category-list"
							class="border-input bg-background ring-offset-background hover:bg-accent hover:text-accent-foreground focus-visible:ring-ring flex h-10 w-full items-center justify-between rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
						>
							{#if selectedCategory}
								{@const category = data.categories.find((c) => c.cat_code === selectedCategory)}
								{category?.cat_label} ({category?.attributeCount} attribut{category?.attributeCount
									? 's'
									: ''})
							{:else}
								Rechercher une catégorie...
							{/if}
							<ChevronsUpDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
						</Popover.Trigger>
						<Popover.Content class="w-[600px] p-0">
							<Command.Root id="category-list">
								<Command.Input placeholder="Rechercher une catégorie..." bind:value={searchValue} />
								<Command.List>
									<Command.Empty>Aucune catégorie trouvée.</Command.Empty>
									<Command.Group>
										{#each data.categories.filter((c) => c.cat_label
												.toLowerCase()
												.includes(searchValue.toLowerCase())) as category (category.cat_code)}
											<Command.Item
												value={category.cat_code}
												onSelect={() => {
													selectedCategory = category.cat_code;
													open = false;
												}}
											>
												<Check
													class={cn(
														'mr-2 h-4 w-4',
														selectedCategory === category.cat_code ? 'opacity-100' : 'opacity-0'
													)}
												/>
												{category.cat_label}
												<span class="text-muted-foreground ml-auto text-sm">
													({category.attributeCount} attribut{category.attributeCount > 1
														? 's'
														: ''})
												</span>
											</Command.Item>
										{/each}
									</Command.Group>
								</Command.List>
							</Command.Root>
						</Popover.Content>
					</Popover.Root>
				</div>

				<!-- Boutons en bas -->
				{#if selectedCategory}
					<div class="flex justify-end">
						<a
							href="{resolve('/importV2')}?cat_code={selectedCategory}&database={selectedDatabase}"
							download="template_{selectedCategory}.csv"
							data-sveltekit-reload
						>
							<Button variant="vert">
								Télécharger template CSV
								<CircleArrowRight class="ml-2 h-4 w-4" />
							</Button>
						</a>
					</div>
				{:else}
					<div class="flex justify-end">
						<Button variant="noir" onclick={() => (step = 1)}>
							Passer cette étape
							<CircleArrowRight class="ml-2 h-4 w-4" />
						</Button>
					</div>
				{/if}
			</div>
		{:else if step === 1}
			<div class="mb-6">
				<h2 class="mb-4 text-xl font-semibold text-black">1. Upload fichier CSV :</h2>
				<p class="mb-4 text-gray-600">Sélectionnez un fichier CSV :</p>

				<div class="mb-6">
					<h3 class="mb-3 text-sm font-medium text-gray-700">Base de données cible :</h3>
					<div class="flex gap-4">
						<label class="flex cursor-pointer items-center">
							<input
								type="radio"
								name="database"
								value="cenov_dev"
								bind:group={selectedDatabase}
								class="mr-2"
							/>
							<span class="text-sm">CENOV_DEV</span>
						</label>
						<label class="flex cursor-pointer items-center">
							<input
								type="radio"
								name="database"
								value="cenov_preprod"
								bind:group={selectedDatabase}
								class="mr-2"
							/>
							<span class="text-sm">CENOV_PREPROD</span>
						</label>
					</div>
				</div>

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

				<!-- Bouton Retour -->
				<div class="flex justify-start">
					<Button variant="noir" onclick={() => (step = 0)}>
						<CircleArrowLeft class="mr-2 h-4 w-4" />
						Retour
					</Button>
				</div>
			</div>
		{:else if step === 2 && parsedPreview}
			<div class="mb-6">
				<h2 class="mb-4 text-xl font-semibold text-black">2. Preview des données : {fileName}</h2>

				<div class="mb-6 rounded-lg border bg-gray-50 p-4">
					<h3 class="mb-2 font-medium">
						Données détectées ({parsedPreview.columns.length} colonnes) :
					</h3>
					<div class="mb-3 rounded border border-blue-200 bg-blue-50 p-3">
						<p class="text-sm font-medium text-blue-800">
							Note: Le système détectera automatiquement le nombre de produits lors de la validation
						</p>
					</div>
					<div class="grid grid-cols-2 gap-2 text-sm">
						{#each parsedPreview.columns as col (col.header)}
							<div>
								<span class="font-medium">{col.header}:</span>
								<span class="text-gray-700">{col.value || '(vide)'}</span>
							</div>
						{/each}
					</div>
				</div>

				<form
					method="POST"
					action="?/validate"
					use:enhance={() => {
						validationReceived = true;
						isProcessing = true;
						return async ({ update }) => {
							await update();
						};
					}}
				>
					<input type="hidden" name="csv" value={csvContent} />
					<input type="hidden" name="database" value={selectedDatabase} />
					<div class="flex justify-between">
						<Button variant="noir" onclick={resetImport}>
							<CircleArrowLeft class="mr-2 h-4 w-4" />
							Retour
						</Button>
						<Button type="submit" variant="vert" disabled={isProcessing}>
							Valider
							<CircleArrowRight class="ml-2 h-4 w-4" />
						</Button>
					</div>
				</form>
			</div>
		{:else if step === 3 && form?.validation}
			<div class="mb-6">
				<h2 class="mb-4 text-xl font-semibold text-black">3. Résultats validation :</h2>

				<div class="mb-6 grid grid-cols-3 gap-4">
					<div class="rounded-lg border border-blue-200 bg-blue-50 p-4 text-center">
						<div class="text-2xl font-bold text-blue-600">{form.validation.totalRows}</div>
						<div class="text-sm text-blue-800">
							Produit{form.validation.totalRows > 1 ? 's' : ''} détecté{form.validation.totalRows >
							1
								? 's'
								: ''}
						</div>
					</div>
					<div class="rounded-lg border border-green-200 bg-green-50 p-4 text-center">
						<div class="text-2xl font-bold text-green-600">{form.validation.validRows}</div>
						<div class="text-sm text-green-800">
							Produit{form.validation.validRows > 1 ? 's' : ''} valide{form.validation.validRows > 1
								? 's'
								: ''}
						</div>
					</div>
					<div class="rounded-lg border border-red-200 bg-red-50 p-4 text-center">
						<div class="text-2xl font-bold text-red-600">{form.validation.errors.length}</div>
						<div class="text-sm text-red-800">
							Erreur{form.validation.errors.length > 1 ? 's' : ''}
						</div>
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
						resultReceived = true;
						isProcessing = true;
						return async ({ update }) => {
							await update();
						};
					}}
				>
					<input type="hidden" name="csv" value={csvContent} />
					<input type="hidden" name="database" value={selectedDatabase} />
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
								: `Importer ${form.validation.validRows} produit${form.validation.validRows > 1 ? 's' : ''}`}
							<CircleArrowRight class="ml-2 h-4 w-4" />
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

					<h4 class="mb-3 font-semibold text-green-800">Résumé des modifications :</h4>

					<div class="mb-4 grid grid-cols-2 gap-3 text-sm">
						{#if form.result.stats.suppliers > 0}
							<div class="rounded bg-white p-3 shadow-sm">
								<div class="text-xs text-gray-600">Fournisseurs créés</div>
								<div class="text-2xl font-bold text-green-600">{form.result.stats.suppliers}</div>
							</div>
						{/if}
						{#if form.result.stats.categories > 0}
							<div class="rounded bg-white p-3 shadow-sm">
								<div class="text-xs text-gray-600">Catégories créées</div>
								<div class="text-2xl font-bold text-green-600">{form.result.stats.categories}</div>
							</div>
						{/if}
						{#if form.result.stats.families > 0}
							<div class="rounded bg-white p-3 shadow-sm">
								<div class="text-xs text-gray-600">Familles créées</div>
								<div class="text-2xl font-bold text-green-600">{form.result.stats.families}</div>
							</div>
						{/if}
						{#if form.result.stats.kits > 0}
							<div class="rounded bg-white p-3 shadow-sm">
								<div class="text-xs text-gray-600">Kits créés</div>
								<div class="text-2xl font-bold text-green-600">{form.result.stats.kits}</div>
							</div>
						{/if}
						{#if form.result.stats.products > 0}
							<div class="rounded bg-white p-3 shadow-sm">
								<div class="text-xs text-gray-600">Produits créés</div>
								<div class="text-2xl font-bold text-green-600">{form.result.stats.products}</div>
							</div>
						{/if}
						{#if form.result.stats.productsUpdated > 0}
							<div class="rounded bg-white p-3 shadow-sm">
								<div class="text-xs text-gray-600">Produits mis à jour</div>
								<div class="text-2xl font-bold text-blue-600">
									{form.result.stats.productsUpdated}
								</div>
							</div>
						{/if}
						{#if form.result.stats.prices > 0}
							<div class="rounded bg-white p-3 shadow-sm">
								<div class="text-xs text-gray-600">Prix enregistrés</div>
								<div class="text-2xl font-bold text-green-600">{form.result.stats.prices}</div>
							</div>
						{/if}
						{#if form.result.stats.categoryAttributes > 0}
							<div class="rounded bg-white p-3 shadow-sm">
								<div class="text-xs text-gray-600">Attributs catégorie</div>
								<div class="text-2xl font-bold text-green-600">
									{form.result.stats.categoryAttributes}
								</div>
							</div>
						{/if}
						{#if form.result.stats.kitAttributes > 0}
							<div class="rounded bg-white p-3 shadow-sm">
								<div class="text-xs text-gray-600">Attributs kit</div>
								<div class="text-2xl font-bold text-green-600">
									{form.result.stats.kitAttributes}
								</div>
							</div>
						{/if}
					</div>

					<!-- Détails des modifications -->
					{#if form.result.changes && form.result.changes.length > 0}
						<div class="mt-6 border-t border-green-200 pt-4">
							<h4 class="mb-3 font-semibold text-green-800">
								Détails des modifications ({form.result.changes.length}) :
							</h4>

							<div class="space-y-4">
								{#each Array.from(changesByTable.entries()) as [tableKey, changes] (tableKey)}
									{@const typedChanges = changes as ChangeDetail[]}
									<div class="rounded-lg border border-gray-200 bg-white p-4">
										<h5 class="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-700">
											<span class="rounded bg-blue-100 px-2 py-1 font-mono text-xs text-blue-700">
												{tableKey}
											</span>
											<span class="text-gray-500">
												({typedChanges.length} modification{typedChanges.length > 1 ? 's' : ''})
											</span>
										</h5>

										<div class="space-y-2">
											{#each typedChanges as change, i (i)}
												{@const isCreation = change.oldValue === null}
												<div
													class="grid gap-3 rounded border p-3 text-sm {isCreation
														? 'border-green-200 bg-green-50'
														: 'border-gray-100 bg-gray-50'} {isCreation
														? 'grid-cols-[150px_1fr]'
														: 'grid-cols-[150px_1fr_auto_1fr]'}"
												>
													<div class="flex items-center gap-2">
														<span class="font-medium text-gray-600">{change.column}</span>
														{#if isCreation}
															<span
																class="rounded bg-green-600 px-2 py-0.5 text-xs font-semibold text-white"
															>
																CRÉATION
															</span>
														{/if}
													</div>

													{#if isCreation}
														<!-- Mode création : afficher seulement la nouvelle valeur -->
														<div class="flex items-center">
															<div
																class="max-w-full overflow-hidden rounded bg-white px-3 py-1 text-xs font-medium text-ellipsis whitespace-nowrap text-green-700 shadow-sm"
															>
																{change.newValue}
															</div>
														</div>
													{:else}
														<!-- Mode modification : afficher ancienne → nouvelle -->
														<div class="flex items-center gap-2">
															<div
																class="max-w-full overflow-hidden rounded bg-red-50 px-2 py-1 text-xs text-ellipsis whitespace-nowrap text-red-700"
															>
																{change.oldValue}
															</div>
														</div>

														<div class="flex items-center justify-center text-gray-400">→</div>

														<div class="flex items-center gap-2">
															<div
																class="max-w-full overflow-hidden rounded bg-green-50 px-2 py-1 text-xs text-ellipsis whitespace-nowrap text-green-700"
															>
																{change.newValue}
															</div>
														</div>
													{/if}

													<div
														class="{isCreation
															? 'col-span-2'
															: 'col-span-4'} mt-1 text-xs text-gray-500"
													>
														ID: {change.recordId}
													</div>
												</div>
											{/each}
										</div>
									</div>
								{/each}
							</div>
						</div>
					{/if}

					<div class="mt-4 flex justify-center">
						<Button variant="vert" onclick={resetImport}>
							<Upload class="mr-2 h-4 w-4" />
							Nouvel import
						</Button>
					</div>
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
