<!-- src/routes/categories/+page.svelte -->
<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import { Alert } from 'flowbite-svelte';
	import DataTable from '$lib/components/DataTable.svelte';
	import Filter from '$lib/components/Filter.svelte';
	import Form from '$lib/components/Form.svelte';
	import { superForm } from 'sveltekit-superforms/client';

	console.log('Script de la page catégories chargé');

	export let data;

	// Définition de l'interface pour les catégories
	interface Category {
		atr_id?: number;
		atr_0_label?: string;
		atr_1_label?: string;
		atr_2_label?: string;
		atr_3_label?: string;
		atr_4_label?: string;
		atr_5_label?: string;
		atr_6_label?: string;
		atr_7_label?: string;
		atr_val?: string;
		atr_label?: string;
		[key: string]: string | number | undefined;
	}

	// Définition de l'interface pour les événements de formulaire
	interface FormEvent {
		detail: {
			data: {
				atr_val: string;
				atr_label: string;
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
	interface CategoryFormData {
		[key: string]: string;
	}

	// Pour le filtrage
	let filteredCategories: Category[] = [...data.categories];

	// Colonnes pour le tableau
	const columns = [
		{ key: 'atr_0_label', header: 'Niveau 1' },
		{ key: 'atr_1_label', header: 'Niveau 2' },
		{ key: 'atr_2_label', header: 'Niveau 3' },
		{ key: 'atr_3_label', header: 'Niveau 4' },
		{ key: 'atr_4_label', header: 'Niveau 5' },
		{ key: 'atr_5_label', header: 'Niveau 6' },
		{ key: 'atr_6_label', header: 'Niveau 7' },
		{ key: 'atr_7_label', header: 'Niveau 8' }
	];

	// Champs pour le filtrage
	const filterFields = [
		{ key: 'atr_0_label', label: 'Niveau 1' },
		{ key: 'atr_1_label', label: 'Niveau 2' },
		{ key: 'atr_2_label', label: 'Niveau 3' },
		{ key: 'atr_3_label', label: 'Niveau 4' }
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
	let selectedCategory: Category | null = null;
	let alertMessage = '';
	let alertType: 'success' | 'error' = 'success';
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
		{ key: 'atr_0_label', label: 'Niveau 1', type: 'text', required: true },
		{ key: 'atr_1_label', label: 'Niveau 2', type: 'text' },
		{ key: 'atr_2_label', label: 'Niveau 3', type: 'text' },
		{ key: 'atr_3_label', label: 'Niveau 4', type: 'text' },
		{ key: 'atr_4_label', label: 'Niveau 5', type: 'text' },
		{ key: 'atr_5_label', label: 'Niveau 6', type: 'text' },
		{ key: 'atr_6_label', label: 'Niveau 7', type: 'text' },
		{ key: 'atr_7_label', label: 'Niveau 8', type: 'text' }
	];

	// Champs pour le formulaire d'édition
	const editFormFields: FormField[] = [
		{ key: 'atr_0_label', label: 'Niveau 1', type: 'text', required: true },
		{ key: 'atr_1_label', label: 'Niveau 2', type: 'text' },
		{ key: 'atr_2_label', label: 'Niveau 3', type: 'text' },
		{ key: 'atr_3_label', label: 'Niveau 4', type: 'text' },
		{ key: 'atr_4_label', label: 'Niveau 5', type: 'text' },
		{ key: 'atr_5_label', label: 'Niveau 6', type: 'text' },
		{ key: 'atr_6_label', label: 'Niveau 7', type: 'text' },
		{ key: 'atr_7_label', label: 'Niveau 8', type: 'text' }
	];

	$: {
		console.log("État du formulaire d'ajout:", { addFormOpen });
		if (!addFormOpen) {
			// Réinitialiser les données quand le formulaire est fermé
			formData = {};
		}
	}

	function openAddForm(): void {
		console.log('Bouton "Ajouter une catégorie" cliqué - État actuel:', { addFormOpen });
		addFormOpen = true;
		console.log('Nouvel état après ouverture:', { addFormOpen });
	}

	function openEditForm(item: Category): void {
		console.log('=== Début openEditForm ===');
		console.log('Item reçu du DataTable:', item);
		console.log('Type de atr_id:', typeof item.atr_id);
		console.log('Valeur de atr_id:', item.atr_id);

		// Si l'ID n'est pas dans l'objet item, vérifier si on peut le trouver dans les données originales
		if (!item.atr_id) {
			console.log("ID non trouvé dans l'objet reçu, recherche dans les données originales");
			const originalCategory = data.categories.find(
				(cat: Category) =>
					cat.atr_0_label === item.atr_0_label &&
					cat.atr_1_label === item.atr_1_label &&
					cat.atr_2_label === item.atr_2_label
			);
			console.log('Catégorie originale trouvée:', originalCategory);

			// Si trouvé, utiliser l'objet original au lieu de l'objet partiel
			if (originalCategory && originalCategory.atr_id) {
				selectedCategory = originalCategory;
			} else {
				selectedCategory = item;
			}
		} else {
			selectedCategory = item;
		}

		console.log('selectedCategory avec ID:', selectedCategory);
		console.log('=== Fin openEditForm ===');

		editFormOpen = true;
	}

	function confirmDelete(item: Category): void {
		console.log('=== Début confirmDelete ===');
		console.log('Catégorie sélectionnée pour suppression:', item);
		selectedCategory = item;
		deleteConfirmOpen = true;
		console.log('=== Fin confirmDelete ===');
	}

	function hideAlert(): void {
		alertVisible = false;
	}

	function showAlert(message: string, type: 'success' | 'error' = 'success'): void {
		alertMessage = message;
		alertType = type;
		alertVisible = true;
		setTimeout(hideAlert, 5000);
	}

	function handleFilter(event: FilterEvent): void {
		const { field, term } = event.detail;
		console.log('Filter event:', { field, term });

		if (!term) {
			filteredCategories = [...data.categories];
			return;
		}

		const searchTerm = term.toLowerCase();
		console.log('Searching for:', searchTerm, 'in field:', field);
		console.log('Current categories:', data.categories);

		filteredCategories = data.categories.filter((category: Category) => {
			// Vérifie tous les champs de catégorie
			return Object.entries(category).some(([key, value]) => {
				// Ne vérifie que les champs de catégorie (commençant par atr_)
				if (!key.startsWith('atr_')) return false;

				// Si un champ spécifique est sélectionné, vérifie aussi les autres champs
				if (field && field !== key) {
					// Si c'est un champ de niveau supérieur, vérifie aussi les niveaux inférieurs
					const currentLevel = parseInt(key.split('_')[1]);
					const selectedLevel = parseInt(field.split('_')[1]);
					if (currentLevel < selectedLevel) return false;
				}

				const match = value?.toString().toLowerCase().includes(searchTerm);
				console.log('Checking', key, value, 'Match:', match);
				return match;
			});
		});
		console.log('Filtered results:', filteredCategories);
	}

	function handleFilterReset(): void {
		filteredCategories = [...data.categories];
	}

	async function handleEditSubmit(event: FormEvent): Promise<void> {
		console.log('=== Début handleEditSubmit ===');
		console.log('Données du formulaire:', event.detail);
		console.log('Catégorie sélectionnée:', selectedCategory);

		const { data: formData } = event.detail;

		// Ajouter l'ID à formData si selectedCategory existe
		if (selectedCategory && selectedCategory.atr_id) {
			// Important: Ajouter l'ID à formData
			formData.atr_id = selectedCategory.atr_id.toString();

			console.log('Données à envoyer avec ID:', formData);

			try {
				console.log('Envoi de la requête PUT à:', `/api/categories/${selectedCategory.atr_id}`);
				const response = await fetch(`/api/categories/${selectedCategory.atr_id}`, {
					method: 'PUT',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify(formData)
				});

				console.log('Statut de la réponse:', response.status);
				const result = await response.json();
				console.log('Données de la réponse:', result);

				if (response.ok) {
					console.log('Modification réussie');

					// Mettre à jour les données localement sans recharger la page
					const updatedCategories = data.categories.map((cat: Category) => {
						if (selectedCategory && cat.atr_id === selectedCategory.atr_id) {
							// Mettre à jour tous les champs modifiés
							return { ...cat, ...formData };
						}
						return cat;
					});

					// Mettre à jour les données de la page et le tableau filtré
					data.categories = updatedCategories;
					filteredCategories = [...updatedCategories];

					showAlert('Catégorie modifiée avec succès', 'success');
					editFormOpen = false;
				} else {
					console.log('Erreur lors de la modification:', result.error);
					showAlert(result.error || 'Erreur lors de la modification', 'error');
				}
			} catch (error) {
				console.error('Erreur dans handleEditSubmit:', error);
				showAlert('Erreur lors de la modification', 'error');
			}
		} else {
			console.log('Erreur: Catégorie ou ID manquant');
			showAlert('Erreur: Informations de catégorie incomplètes', 'error');
		}
		console.log('=== Fin handleEditSubmit ===');
	}

	async function handleDeleteConfirm(): Promise<void> {
		console.log('=== Début handleDeleteConfirm ===');
		if (selectedCategory && selectedCategory.atr_id) {
			console.log('ID de la catégorie à supprimer:', selectedCategory.atr_id);
			const formData = new FormData();
			formData.append('id', selectedCategory.atr_id.toString());

			try {
				console.log('Envoi de la requête de suppression...');
				const response = await fetch(`/api/categories/${selectedCategory.atr_id}`, {
					method: 'DELETE'
				});

				console.log('Statut de la réponse:', response.status);
				const result = await response.json();
				console.log('Résultat de la suppression:', result);

				if (response.ok) {
					console.log('Suppression réussie');

					// Mettre à jour les données localement sans recharger la page
					const updatedCategories = data.categories.filter(
						(cat: Category) => cat.atr_id !== selectedCategory?.atr_id
					);

					// Mettre à jour les données de la page et le tableau filtré
					data.categories = updatedCategories;
					filteredCategories = [...updatedCategories];

					showAlert('Catégorie supprimée avec succès', 'success');
					deleteConfirmOpen = false;

					// Ne plus recharger la page après la suppression
					// invalidateAll();
				} else {
					console.log('Erreur lors de la suppression:', result.error);
					showAlert(result.error || 'Erreur lors de la suppression', 'error');
				}
			} catch (error) {
				console.error('Erreur dans handleDeleteConfirm:', error);
				showAlert('Erreur lors de la suppression', 'error');
			}
		} else {
			console.log('Erreur: Catégorie ou ID manquant');
		}
		console.log('=== Fin handleDeleteConfirm ===');
	}

	async function handleAddSubmit(event: FormEvent): Promise<void> {
		console.log('Add submission event:', event.detail);
		try {
			const formData = new FormData();
			for (const field of addFormFields) {
				const value = event.detail.data[field.key] || '';
				formData.append(field.key, value);
				console.log(`Champ ${field.key} traité:`, value);
			}
			console.log('Prepared form data:', Object.fromEntries(formData));

			const response = await fetch('?/create', {
				method: 'POST',
				body: formData
			});

			console.log('API Response status:', response.status);
			const responseData = await response.json();
			console.log('API Response data:', responseData);

			if (!response.ok) {
				showAlert(responseData.error || "Erreur lors de l'ajout de la catégorie", 'error');
				return;
			}

			showAlert('Catégorie ajoutée avec succès', 'success');
			addFormOpen = false;

			// Mettre à jour les données localement
			const newCategory = event.detail.data;
			filteredCategories = [...filteredCategories, newCategory];
			data.categories = [...data.categories, newCategory];

			// Rafraîchir les données du serveur
			await invalidateAll();
		} catch (error) {
			console.error('Error in form submission:', error);
			showAlert("Erreur lors de l'ajout de la catégorie", 'error');
		}
	}

	async function confirmDeleteMultiple(items: Category[]): Promise<void> {
		console.log('=== Début confirmDeleteMultiple ===');
		console.log('Items à supprimer:', items);

		try {
			// Supprimer chaque élément sélectionné
			for (const item of items) {
				if (item.atr_id) {
					const response = await fetch(`/api/categories/${item.atr_id}`, {
						method: 'DELETE'
					});

					if (!response.ok) {
						const errorData = await response.json();
						showAlert(errorData.error || 'Erreur lors de la suppression', 'error');
						return;
					}
				}
			}

			// Mettre à jour les données localement
			const updatedCategories = data.categories.filter(
				(cat: Category) => !items.some((item) => item.atr_id === cat.atr_id)
			);

			// Mettre à jour les données de la page et le tableau filtré
			data.categories = updatedCategories;
			filteredCategories = [...updatedCategories];

			showAlert(`${items.length} catégorie(s) supprimée(s) avec succès`, 'success');
		} catch (error) {
			console.error('Erreur dans confirmDeleteMultiple:', error);
			showAlert('Erreur lors de la suppression multiple', 'error');
		}
		console.log('=== Fin confirmDeleteMultiple ===');
	}
</script>

<div class="container mx-auto py-6">
	<h1 class="mb-6 text-3xl font-bold">Gestion des Catégories</h1>

	{#if alertVisible}
		<Alert
			color={alertType === 'success' ? 'green' : 'red'}
			dismissable
			on:dismiss={hideAlert}
			class="mb-4"
		>
			{alertMessage}
		</Alert>
	{/if}

	<div class="mb-4">
		<Filter
			fields={filterFields}
			placeholder="Rechercher une catégorie..."
			showAddButton={true}
			addButtonText="Ajouter une catégorie"
			on:filter={(event) => {
				handleFilter(event);
			}}
			on:reset={handleFilterReset}
			on:add={openAddForm}
		/>
	</div>

	<DataTable
		data={filteredCategories}
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
		title="Ajouter une catégorie"
		fields={addFormFields}
		submitLabel="Ajouter"
		on:submit={handleAddSubmit}
		on:cancel={() => {
			console.log('Formulaire annulé');
			addFormOpen = false;
		}}
	/>

	<!-- Formulaire d'édition -->
	<Form
		bind:isOpen={editFormOpen}
		title="Modifier la catégorie"
		fields={editFormFields}
		data={selectedCategory || {}}
		isEdit={true}
		submitLabel="Modifier"
		on:submit={(e) => {
			console.log('Form edit submit event triggered');
			handleEditSubmit(e);
		}}
		on:cancel={() => {
			console.log('Form edit cancel triggered');
			editFormOpen = false;
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
				value: 'Êtes-vous sûr de vouloir supprimer cette catégorie ? Cette action est irréversible.'
			}
		]}
		submitLabel="Supprimer"
		cancelLabel="Annuler"
		on:submit={handleDeleteConfirm}
		on:cancel={() => (deleteConfirmOpen = false)}
	/>
</div>
