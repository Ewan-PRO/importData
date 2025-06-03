<!-- src/routes/kits/+page.svelte -->
<script lang="ts">
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import { Button, Alert } from 'flowbite-svelte';
	import { CirclePlus } from 'lucide-svelte';
	import DataTable from '$lib/components/DataTable.svelte';
	import Filter from '$lib/components/Filter.svelte';
	import Form from '$lib/components/Form.svelte';
	import { superForm } from 'sveltekit-superforms/client';

	console.log('Script de la page kits chargé');

	export let data;

	// Définition de l'interface pour les kits
	interface Kit {
		id?: number;
		kit_label?: string;
		atr_label?: string;
		atr_val?: string;
		kat_valeur?: string;
		[key: string]: string | number | undefined;
	}

	// Définition de l'interface pour les événements de formulaire
	interface FormEvent {
		detail: {
			data: {
				kit_label: string;
				atr_label: string;
				atr_val: string;
				kat_valeur: string;
				[key: string]: string;
			};
		};
	}

	// Interface pour les événements de filtre
	interface FilterEvent {
		detail: {
			field: string;
			term: string;
		};
	}

	// Définition de l'interface pour les données du formulaire
	interface KitFormData {
		[key: string]: string;
	}

	// Pour le filtrage
	let filteredKits: Kit[] = [...data.kits];

	// Colonnes pour le tableau
	const columns = [
		{ key: 'kit_label', header: 'Nom du Kit' },
		{ key: 'atr_label', header: 'Caractéristique' },
		{ key: 'atr_val', header: 'Unité' },
		{ key: 'kat_valeur', header: 'Valeur' }
	];

	// Champs pour le filtrage
	const filterFields = [
		{ key: 'kit_label', label: 'Nom du Kit' },
		{ key: 'atr_label', label: 'Caractéristique' },
		{ key: 'atr_val', label: 'Unité' },
		{ key: 'kat_valeur', label: 'Valeur' }
	];

	// SuperForm pour la création
	const { form, enhance: formEnhance } = superForm(data.form, {
		onResult: ({ result }) => {
			if (result.type === 'success') {
				addFormOpen = false;
				invalidateAll();
			}
		}
	});

	// État pour les formulaires
	let addFormOpen = false;
	let editFormOpen = false;
	let deleteConfirmOpen = false;
	let selectedKit: Kit | null = null;
	let alertMessage = '';
	let alertType: 'green' | 'red' = 'green';
	let alertVisible = false;
	let formData: Record<string, any> = {};

	// Type pour les champs de formulaire
	type FormFieldType = 'text' | 'number' | 'select' | 'textarea' | 'email';

	// Interface pour les champs de formulaire
	interface FormField {
		key: string;
		label: string;
		type: FormFieldType;
		required?: boolean;
		placeholder?: string;
		options?: Array<{ value: string; label: string }>;
		value?: any;
	}

	// Champs pour le formulaire d'ajout
	const addFormFields: FormField[] = [
		{
			key: 'kit_label',
			label: 'Nom du Kit',
			type: 'text',
			required: true,
			placeholder: 'Ex: Boulon, Pompe à palettes...'
		},
		{
			key: 'atr_label',
			label: 'Caractéristique',
			type: 'text',
			required: true,
			placeholder: 'Ex: Poids, Diamètre, Pression...'
		},
		{
			key: 'atr_val',
			label: 'Unité',
			type: 'text',
			required: true,
			placeholder: 'Ex: g, mm, MBAR...'
		},
		{
			key: 'kat_valeur',
			label: 'Valeur',
			type: 'text',
			required: true,
			placeholder: 'Ex: 5, 12, 150...'
		}
	];

	// Champs pour le formulaire d'édition
	const editFormFields: FormField[] = [
		{
			key: 'kit_label',
			label: 'Nom du Kit',
			type: 'text',
			required: true,
			placeholder: 'Ex: Boulon, Pompe à palettes...'
		},
		{
			key: 'atr_label',
			label: 'Caractéristique',
			type: 'text',
			required: true,
			placeholder: 'Ex: Poids, Diamètre, Pression...'
		},
		{
			key: 'atr_val',
			label: 'Unité',
			type: 'text',
			required: true,
			placeholder: 'Ex: g, mm, MBAR...'
		},
		{
			key: 'kat_valeur',
			label: 'Valeur',
			type: 'text',
			required: true,
			placeholder: 'Ex: 5, 12, 150...'
		}
	];

	$: {
		console.log("État du formulaire d'ajout:", { addFormOpen });
		if (!addFormOpen) {
			// Réinitialiser les données quand le formulaire est fermé
			formData = {};
		}
	}

	function openAddForm(): void {
		console.log('Bouton "Ajouter un kit" cliqué - État actuel:', { addFormOpen });
		addFormOpen = true;
		console.log('Nouvel état après ouverture:', { addFormOpen });
	}

	function openEditForm(item: Kit): void {
		console.log('=== Début openEditForm ===');
		console.log('Item reçu du DataTable:', item);
		console.log('Type de id:', typeof item.id);
		console.log('Valeur de id:', item.id);

		// Si l'ID n'est pas dans l'objet item, vérifier si on peut le trouver dans les données originales
		if (!item.id) {
			console.log("ID non trouvé dans l'objet reçu, recherche dans les données originales");
			const originalKit = data.kits.find(
				(kit: Kit) =>
					kit.kit_label === item.kit_label &&
					kit.atr_label === item.atr_label &&
					kit.atr_val === item.atr_val &&
					kit.kat_valeur === item.kat_valeur
			);
			console.log('Kit original trouvé:', originalKit);

			// Si trouvé, utiliser l'objet original au lieu de l'objet partiel
			if (originalKit && originalKit.id) {
				selectedKit = originalKit;
			} else {
				selectedKit = item;
			}
		} else {
			selectedKit = item;
		}

		console.log('selectedKit avec ID:', selectedKit);
		console.log('=== Fin openEditForm ===');

		editFormOpen = true;
	}

	function confirmDelete(item: Kit): void {
		console.log('=== Début confirmDelete ===');
		console.log('Kit sélectionné pour suppression:', item);
		selectedKit = item;
		deleteConfirmOpen = true;
		console.log('=== Fin confirmDelete ===');
	}

	function hideAlert(): void {
		alertVisible = false;
	}

	function showAlert(message: string, type: 'success' | 'error' = 'success'): void {
		alertMessage = message;
		alertType = type === 'success' ? 'green' : 'red';
		alertVisible = true;
		setTimeout(hideAlert, 5000);
	}

	function handleFilter(event: FilterEvent): void {
		const { field, term } = event.detail;
		console.log('Filtrage:', { field, term });

		if (!term.trim()) {
			filteredKits = [...data.kits];
			return;
		}

		filteredKits = data.kits.filter((kit: Kit) => {
			const value = kit[field];
			if (value === undefined || value === null) return false;
			return String(value).toLowerCase().includes(term.toLowerCase());
		});

		console.log('Résultats filtrés:', filteredKits);
	}

	function handleResetFilter(): void {
		console.log('Réinitialisation du filtre');
		filteredKits = [...data.kits];
	}

	function handleFormSubmit(event: FormEvent): void {
		console.log('=== Début handleFormSubmit ===');
		console.log('Données du formulaire reçues:', event.detail.data);
		console.log('selectedKit actuel:', selectedKit);

		const formElement = document.querySelector('#kitForm') as HTMLFormElement;
		if (!formElement) {
			console.error('Formulaire non trouvé');
			return;
		}

		// Créer un FormData avec les données du formulaire
		const formData = new FormData(formElement);

		// Ajouter les données du formulaire
		Object.entries(event.detail.data).forEach(([key, value]) => {
			formData.set(key, String(value));
		});

		// Si c'est une modification, ajouter l'ID
		if (selectedKit?.id) {
			formData.set('id', String(selectedKit.id));
			console.log('ID ajouté pour modification:', selectedKit.id);
		}

		console.log('FormData préparé:', Object.fromEntries(formData.entries()));

		// Soumettre le formulaire
		formElement.requestSubmit();
		console.log('=== Fin handleFormSubmit ===');
	}

	function handleDeleteConfirm(): void {
		console.log('=== Début handleDeleteConfirm ===');
		console.log('Kit à supprimer:', selectedKit);

		if (!selectedKit?.id) {
			console.error('Aucun kit sélectionné ou ID manquant');
			showAlert('Erreur: Aucun kit sélectionné', 'error');
			return;
		}

		const formElement = document.querySelector('#deleteForm') as HTMLFormElement;
		if (!formElement) {
			console.error('Formulaire de suppression non trouvé');
			return;
		}

		const formData = new FormData(formElement);
		formData.set('id', String(selectedKit.id));

		console.log('FormData de suppression:', Object.fromEntries(formData.entries()));

		formElement.requestSubmit();
		deleteConfirmOpen = false;
		console.log('=== Fin handleDeleteConfirm ===');
	}

	// Réactivité pour mettre à jour les données filtrées
	$: {
		if (data.kits) {
			filteredKits = [...data.kits];
		}
	}
</script>

<svelte:head>
	<title>Gestion des Kits</title>
</svelte:head>

<div class="container mx-auto p-6">
	<div class="mb-6 flex items-center justify-between">
		<h1 class="text-3xl font-bold text-gray-900">Gestion des Kits</h1>
		<Button color="green" on:click={openAddForm}>
			<CirclePlus class="mr-2 h-5 w-5" />
			Ajouter un kit
		</Button>
	</div>

	{#if alertVisible}
		<Alert color={alertType} class="mb-4" dismissable on:close={hideAlert}>
			{alertMessage}
		</Alert>
	{/if}

	<!-- Composant de filtrage -->
	<Filter
		fields={filterFields}
		placeholder="Rechercher un kit..."
		showAddButton={false}
		on:filter={handleFilter}
		on:reset={handleResetFilter}
	/>

	<!-- Tableau des données -->
	<DataTable
		data={filteredKits}
		{columns}
		selectable={true}
		multiSelect={true}
		on:edit={(e) => openEditForm(e.detail.item)}
		on:delete={(e) => confirmDelete(e.detail.item)}
		on:deleteSelected={(e) => {
			console.log('Suppression multiple:', e.detail.items);
			// TODO: Implémenter la suppression multiple
		}}
	/>

	<!-- Formulaire d'ajout -->
	<Form
		bind:isOpen={addFormOpen}
		title="Ajouter un kit"
		fields={addFormFields}
		data={formData}
		submitLabel="Créer"
		on:submit={handleFormSubmit}
		on:cancel={() => {
			addFormOpen = false;
			formData = {};
		}}
	/>

	<!-- Formulaire d'édition -->
	<Form
		bind:isOpen={editFormOpen}
		title="Modifier le kit"
		fields={editFormFields}
		data={selectedKit || {}}
		submitLabel="Modifier"
		isEdit={true}
		on:submit={handleFormSubmit}
		on:cancel={() => {
			editFormOpen = false;
			selectedKit = null;
		}}
	/>

	<!-- Formulaire caché pour les actions -->
	<form
		id="kitForm"
		method="POST"
		action={selectedKit ? '?/update' : '?/create'}
		use:enhance={() => {
			return async ({ result, update }) => {
				console.log('Résultat de la soumission:', result);

				if (result.type === 'success') {
					showAlert(selectedKit ? 'Kit modifié avec succès' : 'Kit créé avec succès', 'success');
					addFormOpen = false;
					editFormOpen = false;
					selectedKit = null;
					await invalidateAll();
				} else if (result.type === 'failure') {
					const errorMsg = (result.data as any)?.error || 'Une erreur est survenue';
					showAlert(errorMsg, 'error');
				}

				await update();
			};
		}}
		style="display: none;"
	>
		<!-- Les champs seront ajoutés dynamiquement par JavaScript -->
	</form>

	<!-- Formulaire de suppression -->
	<form
		id="deleteForm"
		method="POST"
		action="?/delete"
		use:enhance={() => {
			return async ({ result, update }) => {
				console.log('Résultat de la suppression:', result);

				if (result.type === 'success') {
					showAlert('Kit supprimé avec succès', 'success');
					await invalidateAll();
				} else if (result.type === 'failure') {
					const errorMsg = (result.data as any)?.error || 'Erreur lors de la suppression';
					showAlert(errorMsg, 'error');
				}

				await update();
			};
		}}
		style="display: none;"
	>
		<!-- L'ID sera ajouté dynamiquement -->
	</form>
</div>
