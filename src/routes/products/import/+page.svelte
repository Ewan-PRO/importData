<script lang="ts">
	import { enhance } from '$app/forms';
	import { Fileupload, Button, Alert, Spinner, Select, Toast } from 'flowbite-svelte';
	import {
		ChevronRightOutline,
		CheckCircleSolid,
		ExclamationCircleSolid,
		CloudArrowUpSolid
	} from 'flowbite-svelte-icons';
	import { onMount } from 'svelte';

	// Définition des types pour éviter les erreurs TypeScript
	// Définir le type correctement pour un composant Svelte
	type SelectedFileType = File | null;
	type PreviewDataType = {
		headers: string[];
		rows: Record<string, string>[];
	} | null;

	// Pour un composant Svelte, on ne type pas avec HTMLInputElement
	let fileInput: any = null;
	let selectedFile: SelectedFileType = null;
	let uploading = false;
	let uploadSuccess = false;
	let uploadError = false;
	let errorMessage = '';
	let importType = 'replace'; // 'replace' ou 'update'
	let importFormat = 'csv'; // 'csv', 'xlsx' ou 'json'
	let showToast = false;
	let previewData: PreviewDataType = null;

	const importTypeOptions = [
		{ value: 'replace', name: 'Remplacer les produits existants' },
		{ value: 'update', name: 'Mettre à jour les produits existants' }
	];

	const importFormatOptions = [
		{ value: 'csv', name: 'CSV (.csv)' },
		{ value: 'xlsx', name: 'Excel (.xlsx)' },
		{ value: 'json', name: 'JSON (.json)' }
	];

	const handleFileChange = (event: Event) => {
		const target = event.target as HTMLInputElement;
		const file = target.files?.[0];
		if (file) {
			selectedFile = file;
			resetStatus();
			// Simuler un aperçu des données
			setTimeout(() => {
				generatePreview(file);
			}, 500);
		}
	};

	const generatePreview = (file: File) => {
		// Simulation d'un aperçu des données - à remplacer par votre logique réelle
		// Dans un cas réel, vous utiliseriez FileReader et parserez le contenu selon le format
		previewData = {
			headers: ['reference', 'nom', 'description', 'prix', 'stock', 'categorie'],
			rows: [
				{
					reference: 'PMP001',
					nom: 'Pompe centrifuge 1.5kW',
					prix: '850.00',
					stock: '12',
					categorie: 'Pompes',
					description: 'Pompe industrielle haute performance'
				},
				{
					reference: 'PMP002',
					nom: 'Pompe submersible 2kW',
					prix: '1250.00',
					stock: '8',
					categorie: 'Pompes',
					description: 'Pompe submersible pour liquides agressifs'
				},
				{
					reference: 'MOT001',
					nom: 'Moteur électrique 3kW',
					prix: '720.00',
					stock: '15',
					categorie: 'Moteurs',
					description: 'Moteur industriel triphasé'
				}
			]
		};
	};

	const handleSubmit = async () => {
		if (!selectedFile) {
			errorMessage = 'Veuillez sélectionner un fichier à importer.';
			uploadError = true;
			return;
		}

		uploading = true;
		resetStatus();

		// Dans une implémentation réelle, vous enverriez le fichier au serveur
		// Simulation d'un appel API
		setTimeout(() => {
			uploading = false;
			uploadSuccess = true;
			showToast = true;

			// Cacher la notification après 5 secondes
			setTimeout(() => {
				showToast = false;
			}, 5000);
		}, 2000);
	};

	const resetFileInput = () => {
		// Accéder au input HTML natif via la référence du composant Svelte
		const inputElement = fileInput?.$.root?.querySelector('input');
		if (inputElement) {
			inputElement.value = '';
		}
		selectedFile = null;
		previewData = null;
		resetStatus();
	};

	const resetStatus = () => {
		uploadSuccess = false;
		uploadError = false;
		errorMessage = '';
	};

	onMount(() => {
		// Initialisation au chargement de la page si nécessaire
	});
</script>

<svelte:head>
	<title>Import de produits - Gestion B2B</title>
</svelte:head>

<main class="mx-auto max-w-4xl p-4">
	<div class="mb-8">
		<h1 class="mb-2 text-2xl font-bold text-gray-800">Importation de produits</h1>
		<p class="text-gray-600">
			Importez votre catalogue de produits en utilisant un fichier CSV, Excel ou JSON.
		</p>
	</div>

	<div class="mb-6 rounded-lg bg-white p-6 shadow-md">
		<h2 class="mb-4 text-lg font-semibold text-gray-700">Configuration de l'import</h2>

		<div class="mb-6 grid gap-6 md:grid-cols-2">
			<div>
				<span class="mb-2 block text-sm font-medium text-gray-700">Type d'importation</span>
				<Select items={importTypeOptions} bind:value={importType} class="mb-4" />
				<p class="mt-1 text-sm text-gray-500">
					{#if importType === 'replace'}
						Les produits existants avec les mêmes références seront remplacés.
					{:else}
						Seuls les champs fournis seront mis à jour, les autres resteront inchangés.
					{/if}
				</p>
			</div>

			<div>
				<span class="mb-2 block text-sm font-medium text-gray-700">Format du fichier</span>
				<Select items={importFormatOptions} bind:value={importFormat} class="mb-4" />
				<p class="mt-1 text-sm text-gray-500">
					{#if importFormat === 'csv'}
						Format CSV avec séparateur point-virgule (;) et encodage UTF-8.
					{:else if importFormat === 'xlsx'}
						Fichier Excel avec une feuille de calcul nommée "Produits".
					{:else}
						Format JSON avec tableau d'objets produits.
					{/if}
				</p>
			</div>
		</div>

		<div class="mt-6 mb-6">
			<label for="file-upload" class="mb-2 block text-sm font-medium text-gray-700">
				Fichier à importer
			</label>

			<div class="flex items-center space-x-4">
				<Fileupload
					id="file-upload"
					bind:this={fileInput}
					on:change={handleFileChange}
					accept={importFormat === 'csv'
						? '.csv'
						: importFormat === 'xlsx'
							? '.xlsx, .xls'
							: '.json'}
					class="w-full"
				/>

				{#if selectedFile}
					<Button size="sm" color="light" on:click={resetFileInput}>Réinitialiser</Button>
				{/if}
			</div>

			{#if selectedFile}
				<p class="mt-2 text-sm text-gray-600">
					Fichier sélectionné: <span class="font-semibold">{selectedFile.name}</span> ({Math.round(
						selectedFile.size / 1024
					)} Ko)
				</p>
			{/if}
		</div>

		{#if uploadError}
			<Alert color="red" class="my-4">
				<ExclamationCircleSolid slot="icon" class="h-4 w-4" />
				<span class="font-medium">Erreur!</span>
				{errorMessage}
			</Alert>
		{/if}

		{#if uploadSuccess}
			<Alert color="green" class="my-4">
				<CheckCircleSolid slot="icon" class="h-4 w-4" />
				<span class="font-medium">Succès!</span> L'importation a été réalisée avec succès.
			</Alert>
		{/if}

		<div class="mt-6">
			<Button
				color="blue"
				disabled={!selectedFile || uploading}
				on:click={handleSubmit}
				class="w-full md:w-auto"
			>
				{#if uploading}
					<Spinner size="4" class="mr-2" />
					Importation en cours...
				{:else}
					<CloudArrowUpSolid class="mr-2 h-4 w-4" />
					Importer les produits
				{/if}
			</Button>
		</div>
	</div>

	{#if previewData}
		<div class="rounded-lg bg-white p-6 shadow-md">
			<h2 class="mb-4 text-lg font-semibold text-gray-700">Aperçu des données</h2>

			<div class="overflow-x-auto">
				<table class="w-full text-left text-sm text-gray-700">
					<thead class="bg-gray-100 text-xs uppercase">
						<tr>
							{#each previewData.headers as header}
								<th class="px-4 py-2">{header}</th>
							{/each}
						</tr>
					</thead>
					<tbody>
						{#each previewData.rows as row, i}
							<tr class={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
								{#each previewData.headers as header}
									<td class="px-4 py-2">{row[header] || '-'}</td>
								{/each}
							</tr>
						{/each}
					</tbody>
				</table>
			</div>

			<p class="mt-4 text-sm text-gray-500">
				Aperçu des {previewData.rows.length} premières lignes sur un total estimé de {selectedFile
					? Math.floor(selectedFile.size / 150)
					: '0'} produits.
			</p>
		</div>
	{/if}
</main>

{#if showToast}
	<Toast position="bottom-right" dismissable color="green" class="mb-4">
		<CheckCircleSolid slot="icon" class="h-5 w-5" />
		<p class="ml-3 text-sm font-normal">
			Importation réussie. {previewData?.rows.length || 0} produits ont été importés.
		</p>
		<button
			on:click={() => (showToast = false)}
			class="-mx-1.5 -my-1.5 ml-auto inline-flex h-8 w-8 rounded-lg bg-green-50 p-1.5 text-green-500 hover:bg-green-200"
		>
			<span class="sr-only">Fermer</span>
			<svg
				class="h-5 w-5"
				fill="currentColor"
				viewBox="0 0 20 20"
				xmlns="http://www.w3.org/2000/svg"
				><path
					fill-rule="evenodd"
					d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
					clip-rule="evenodd"
				></path></svg
			>
		</button>
	</Toast>
{/if}

<style>
	:global(body) {
		background-color: #f9fafb;
	}

	/* Personnalisation des couleurs selon les spécifications du projet */
	:global(.btn-blue) {
		background-color: #2563eb !important;
	}

	:global(.btn-blue:hover) {
		background-color: #3c24ac !important;
	}

	:global(.text-red-500) {
		color: #e31206 !important;
	}

	:global(.bg-red-500) {
		background-color: #e31206 !important;
	}

	:global(.bg-red-500:hover) {
		background-color: #af301f !important;
	}
</style>
