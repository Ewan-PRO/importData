<!-- src/routes/kits/+page.svelte -->
<script lang="ts">
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import * as Alert from '$lib/components/ui/alert';
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
			label: 'Nom du Kit :',
			type: 'text',
			required: true,
			placeholder: 'Ex: Boulon, Pompe à palettes...'
		},
		{
			key: 'atr_label',
			label: 'Caractéristique :',
			type: 'text',
			required: true,
			placeholder: 'Ex: Poids, Diamètre, Pression...'
		},
		{
			key: 'atr_val',
			label: 'Unité :',
			type: 'text',
			required: true,
			placeholder: 'Ex: g, mm, MBAR...'
		},
		{
			key: 'kat_valeur',
			label: 'Valeur :',
			type: 'text',
			required: true,
			placeholder: 'Ex: 5, 12, 150...'
		}
	];

	// Champs pour le formulaire d'édition
	const editFormFields: FormField[] = [
		{
			key: 'kit_label',
			label: 'Nom du Kit :',
			type: 'text',
			required: true,
			placeholder: 'Ex: Boulon, Pompe à palettes...'
		},
		{
			key: 'atr_label',
			label: 'Caractéristique :',
			type: 'text',
			required: true,
			placeholder: 'Ex: Poids, Diamètre, Pression...'
		},
		{
			key: 'atr_val',
			label: 'Unité :',
			type: 'text',
			required: true,
			placeholder: 'Ex: g, mm, MBAR...'
		},
		{
			key: 'kat_valeur',
			label: 'Valeur :',
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

	function handleAddKit(): void {
		openAddForm();
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

		// Remplir les champs cachés avec les données du formulaire
		const kitLabelInput = formElement.querySelector('input[name="kit_label"]') as HTMLInputElement;
		const atrLabelInput = formElement.querySelector('input[name="atr_label"]') as HTMLInputElement;
		const atrValInput = formElement.querySelector('input[name="atr_val"]') as HTMLInputElement;
		const katValeurInput = formElement.querySelector(
			'input[name="kat_valeur"]'
		) as HTMLInputElement;

		if (kitLabelInput) kitLabelInput.value = event.detail.data.kit_label || '';
		if (atrLabelInput) atrLabelInput.value = event.detail.data.atr_label || '';
		if (atrValInput) atrValInput.value = event.detail.data.atr_val || '';
		if (katValeurInput) katValeurInput.value = event.detail.data.kat_valeur || '';

		console.log('Champs cachés remplis avec:', {
			kit_label: kitLabelInput?.value,
			atr_label: atrLabelInput?.value,
			atr_val: atrValInput?.value,
			kat_valeur: katValeurInput?.value
		});

		// Soumettre le formulaire
		formElement.requestSubmit();
		console.log('=== Fin handleFormSubmit ===');
	}

	function handleDeleteConfirm(): void {
		console.log('=== Début handleDeleteConfirm ===');
		console.log('Kit à supprimer:', selectedKit);

		if (!selectedKit?.id) {
			console.error('Aucun kit sélectionné ou ID manquant');
			Alert.alertActions.error('Erreur: Aucun kit sélectionné');
			deleteConfirmOpen = false;
			return;
		}

		const formElement = document.querySelector('#deleteForm') as HTMLFormElement;
		if (!formElement) {
			console.error('Formulaire de suppression non trouvé');
			deleteConfirmOpen = false;
			return;
		}

		// Remplir le champ caché avec l'ID
		const idInput = formElement.querySelector('input[name="id"]') as HTMLInputElement;
		if (idInput) {
			idInput.value = String(selectedKit.id);
		}

		console.log('ID rempli pour suppression:', idInput?.value);

		// Fermer la boîte de dialogue de confirmation
		deleteConfirmOpen = false;

		// Soumettre le formulaire
		formElement.requestSubmit();
		console.log('=== Fin handleDeleteConfirm ===');
	}

	async function confirmDeleteMultiple(items: Kit[]): Promise<void> {
		console.log('=== Début confirmDeleteMultiple ===');
		console.log('Kits à supprimer:', items);

		if (!items.length) {
			Alert.alertActions.error('Aucun kit sélectionné');
			return;
		}

		try {
			let successCount = 0;
			let errorCount = 0;

			// Supprimer chaque kit sélectionné
			for (const kit of items) {
				if (kit.id) {
					const response = await fetch(`/api/kits/${kit.id}`, {
						method: 'DELETE'
					});

					if (response.ok) {
						successCount++;
					} else {
						errorCount++;
						console.error(`Erreur lors de la suppression du kit ${kit.id}`);
					}
				} else {
					errorCount++;
					console.error('Kit sans ID:', kit);
				}
			}

			// Afficher le résultat
			if (errorCount === 0) {
				Alert.alertActions.success(`${successCount} kit(s) supprimé(s) avec succès`);
			} else if (successCount === 0) {
				Alert.alertActions.error(`Erreur lors de la suppression des ${errorCount} kit(s)`);
			} else {
				Alert.alertActions.error(`${successCount} kit(s) supprimé(s), ${errorCount} erreur(s)`);
			}

			// Recharger les données
			await invalidateAll();
		} catch (error) {
			console.error('Erreur dans confirmDeleteMultiple:', error);
			Alert.alertActions.error('Erreur lors de la suppression multiple');
		}
		console.log('=== Fin confirmDeleteMultiple ===');
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
	<div class="mb-6">
		<h1 class="text-3xl font-bold text-gray-900">Gestion des Kits</h1>
	</div>

	<Alert.GlobalAlert />

	<!-- Composant de filtrage avec bouton d'ajout -->
	<Filter
		fields={filterFields}
		placeholder="Rechercher un kit..."
		showAddButton={true}
		addButtonText="Ajouter un kit"
		on:filter={handleFilter}
		on:reset={handleResetFilter}
		on:add={handleAddKit}
	/>

	<!-- Tableau des données -->
	<DataTable
		data={filteredKits}
		{columns}
		selectable={true}
		multiSelect={true}
		on:edit={(e) => openEditForm(e.detail.item)}
		on:delete={(e) => confirmDelete(e.detail.item)}
		on:deleteSelected={(e) => confirmDeleteMultiple(e.detail.items)}
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

	<!-- Confirmation de suppression -->
	<Form
		bind:isOpen={deleteConfirmOpen}
		title="Confirmer la suppression"
		fields={[
			{
				key: 'confirmation',
				label: 'Confirmation',
				type: 'text',
				value: `Êtes-vous sûr de vouloir supprimer le kit "${selectedKit?.kit_label || ''}" ? Cette action est irréversible.`
			}
		]}
		submitLabel="Supprimer"
		cancelLabel="Annuler"
		on:submit={handleDeleteConfirm}
		on:cancel={() => {
			deleteConfirmOpen = false;
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
					Alert.alertActions.success(
						selectedKit ? 'Kit modifié avec succès' : 'Kit créé avec succès'
					);
					addFormOpen = false;
					editFormOpen = false;
					selectedKit = null;
					await invalidateAll();
				} else if (result.type === 'failure') {
					const errorMsg = (result.data as any)?.error || 'Une erreur est survenue';
					Alert.alertActions.error(errorMsg);
				}

				await update();
			};
		}}
		style="display: none;"
	>
		<input type="hidden" name="kit_label" value="" />
		<input type="hidden" name="atr_label" value="" />
		<input type="hidden" name="atr_val" value="" />
		<input type="hidden" name="kat_valeur" value="" />
		{#if selectedKit?.id}
			<input type="hidden" name="id" value={selectedKit.id} />
		{/if}
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
					Alert.alertActions.success('Kit supprimé avec succès');
					selectedKit = null;
					await invalidateAll();
				} else if (result.type === 'failure') {
					const errorMsg = (result.data as any)?.error || 'Erreur lors de la suppression';
					Alert.alertActions.error(errorMsg);
				}

				await update();
			};
		}}
		style="display: none;"
	>
		<input type="hidden" name="id" value="" />
	</form>
</div>
