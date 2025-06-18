<!-- src/routes/categories/+page.svelte -->
<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import * as Alert from '$lib/components/ui/alert';
	import DataTable from '$lib/components/DataTable.svelte';
	import Filter from '$lib/components/Filter.svelte';
	import Form from '$lib/components/Form.svelte';
	import { superForm } from 'sveltekit-superforms/client';

	console.log('Script de la page catégories chargé');

	export let data;

	// Définition de l'interface pour les catégories
	interface Category {
		row_key: number;
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

	// Pour le filtrage - utilisation de réactivité Svelte
	let filterTerm = '';
	let filterField = '';

	$: filteredCategories = filterCategories(data.categories, filterTerm, filterField);

	// Fonction pure de filtrage
	function filterCategories(categories: Category[], term: string, field: string): Category[] {
		if (!term) return [...categories];

		const searchTerm = term.toLowerCase();
		return categories.filter((category: Category) => {
			return Object.entries(category).some(([key, value]) => {
				if (!key.startsWith('atr_')) return false;

				if (field && field !== key) {
					const currentLevel = parseInt(key.split('_')[1]);
					const selectedLevel = parseInt(field.split('_')[1]);
					if (currentLevel < selectedLevel) return false;
				}

				return value?.toString().toLowerCase().includes(searchTerm);
			});
		});
	}

	// Colonnes pour le tableau
	const columns = [
		{ key: 'atr_0_label', header: 'atr_0_label' },
		{ key: 'atr_1_label', header: 'atr_1_label' },
		{ key: 'atr_2_label', header: 'atr_2_label' },
		{ key: 'atr_3_label', header: 'atr_3_label' },
		{ key: 'atr_4_label', header: 'atr_4_label' },
		{ key: 'atr_5_label', header: 'atr_5_label' },
		{ key: 'atr_6_label', header: 'atr_6_label' },
		{ key: 'atr_7_label', header: 'atr_7_label' }
	];

	// Champs pour le filtrage
	const filterFields = [
		{ key: 'atr_0_label', label: 'atr_0_label' },
		{ key: 'atr_1_label', label: 'atr_1_label' },
		{ key: 'atr_2_label', label: 'atr_2_label' },
		{ key: 'atr_3_label', label: 'atr_3_label' }
	];

	// SuperForm pour la création
	const { form, enhance: formEnhance } = superForm(data.form, {
		onResult: ({ result }) => {
			if (result.type === 'success') {
				addFormOpen = false;
				// Ne pas appeler invalidateAll ici car on gère la mise à jour manuellement
			}
		}
	});

	// État pour les formulaires
	let addFormOpen = false;
	let editFormOpen = false;
	let deleteConfirmOpen = false;
	let selectedCategory: Category | null = null;
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
		disabled?: boolean;
		allowCustom?: boolean;
	}

	// Champs pour le formulaire d'ajout
	const addFormFields: FormField[] = [
		{
			key: 'atr_0_label',
			label: 'atr_0_label (ajouté automatiquement) :',
			type: 'text',
			value: 'Catégorie des produits',
			disabled: true
		},
		{
			key: 'atr_1_label',
			label: 'atr_1_label :',
			type: 'select',
			placeholder: 'Ex: pièce, équipement industriel...',
			options: [
				{ value: 'pièce', label: 'pièce' },
				{ value: 'equipement industriel', label: 'équipement industriel' }
			],
			allowCustom: true
		},
		{
			key: 'atr_2_label',
			label: 'atr_2_label :',
			type: 'select',
			placeholder: 'Ex: piece mécanique, étanchéité, filtration...',
			options: [
				{ value: 'piece mécanique', label: 'piece mécanique' },
				{ value: 'étanchéité', label: 'étanchéité' },
				{ value: 'filtration', label: 'filtration' },
				{ value: 'filtration sur des gaz', label: 'filtration sur des gaz' },
				{ value: 'kit', label: 'kit' },
				{ value: 'pompe', label: 'pompe' },
				{
					value: 'moteurs électriques et équipements associés',
					label: 'moteurs électriques et équipements associés'
				},
				{
					value: 'process : agitation mélange et pulvérisation',
					label: 'process : agitation mélange et pulvérisation'
				},
				{ value: 'tuyauterie et robinetterie', label: 'tuyauterie et robinetterie' },
				{ value: 'équipements industriels de mesure', label: 'équipements industriels de mesure' },
				{ value: 'pompes industrielles', label: 'pompes industrielles' }
			],
			allowCustom: true
		},
		{
			key: 'atr_3_label',
			label: 'atr_3_label :',
			type: 'select',
			placeholder: 'Ex: guidage, transmission des efforts, joint...',
			options: [
				{ value: 'guidage', label: 'guidage' },
				{ value: 'transmission des efforts', label: 'transmission des efforts' },
				{ value: 'joint', label: 'joint' },
				{ value: 'filtration sur des liquides', label: 'filtration sur des liquides' },
				{ value: 'pompe à vide', label: 'pompe à vide' },
				{ value: 'moteurs électriques', label: 'moteurs électriques' },
				{ value: 'pompes volumétriques', label: 'pompes volumétriques' },
				{ value: 'pompes doseuses', label: 'pompes doseuses' }
			],
			allowCustom: true
		},
		{
			key: 'atr_4_label',
			label: 'atr_4_label :',
			type: 'select',
			placeholder: 'Ex: guidage en rotation, accouplement, joint statique...',
			options: [
				{ value: 'guidage en rotation', label: 'guidage en rotation' },
				{ value: 'accouplement', label: 'accouplement' },
				{ value: 'joint statique', label: 'joint statique' },
				{ value: 'pompe à vis', label: 'pompe à vis' },
				{ value: 'pompe à ionisation', label: 'pompe à ionisation' },
				{ value: 'pompe à adsorption', label: 'pompe à adsorption' },
				{
					value: 'moteurs AC (à courant alternatif )',
					label: 'moteurs AC (à courant alternatif )'
				},
				{ value: 'moteurs DC (à courant continu)', label: 'moteurs DC (à courant continu)' }
			],
			allowCustom: true
		},
		{
			key: 'atr_5_label',
			label: 'atr_5_label :',
			type: 'select',
			placeholder: 'Ex: roulement, accouplement rigide, joint torique...',
			options: [
				{ value: 'roulement', label: 'roulement' },
				{ value: 'roulement à rouleaux', label: 'roulement à rouleaux' },
				{ value: 'accouplement rigide', label: 'accouplement rigide' },
				{ value: 'accouplement semi-elastiques', label: 'accouplement semi-elastiques' },
				{ value: 'accouplements temporaires', label: 'accouplements temporaires' },
				{ value: 'accouplement élastique', label: 'accouplement élastique' },
				{ value: 'accouplements articulés', label: 'accouplements articulés' },
				{ value: 'joint torique', label: 'joint torique' },
				{ value: 'pompe à éjecteur', label: 'pompe à éjecteur' }
			],
			allowCustom: true
		},
		{
			key: 'atr_6_label',
			label: 'atr_6_label :',
			type: 'select',
			placeholder: 'Ex: roulement à billes, galets a rouleaux...',
			options: [
				{ value: 'roulement à billes', label: 'roulement à billes' },
				{ value: 'galets a rouleaux', label: 'galets a rouleaux' }
			],
			allowCustom: true
		},
		{
			key: 'atr_7_label',
			label: 'atr_7_label :',
			type: 'text',
			placeholder: 'Ex: roulement rigide à billes...'
		}
	];

	// Champs pour le formulaire d'édition
	const editFormFields: FormField[] = JSON.parse(JSON.stringify(addFormFields));

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

	function showAlert(message: string, type: 'success' | 'error' = 'success'): void {
		if (type === 'success') {
			Alert.alertActions.success(message);
		} else {
			Alert.alertActions.error(message);
		}
	}

	function handleFilter(event: FilterEvent): void {
		const { field, term } = event.detail;
		console.log('Filter event:', { field, term });

		filterTerm = term;
		filterField = field;
	}

	function handleFilterReset(): void {
		filterTerm = '';
		filterField = '';
	}

	async function handleEditSubmit(event: FormEvent): Promise<void> {
		console.log('=== Début handleEditSubmit ===');
		console.log('Données du formulaire:', event.detail);
		console.log('Catégorie sélectionnée:', selectedCategory);

		const { data: formData } = event.detail;

		// Ne pas envoyer atr_0_label, il est géré automatiquement par la vue
		delete formData.atr_0_label;

		if (!selectedCategory || !selectedCategory.atr_id) {
			console.error('Erreur: Catégorie ou ID manquant pour la modification.');
			showAlert('Erreur: Informations de catégorie incomplètes', 'error');
			console.log('=== Fin handleEditSubmit (erreur) ===');
			return;
		}

		// Important: Ajouter l'ID à formData
		formData.atr_id = selectedCategory.atr_id.toString();
		console.log('Données à envoyer avec ID:', formData);

		try {
			const apiUrl = `/categories/api/${selectedCategory.atr_id}`;
			console.log('Envoi de la requête PUT à:', apiUrl);

			const response = await fetch(apiUrl, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(formData)
			});

			console.log(`Réponse reçue. Statut: ${response.status} ${response.statusText}`);

			if (!response.ok) {
				let errorData;
				try {
					errorData = await response.json();
					console.error("Détails de l'erreur du serveur:", errorData);
				} catch (e) {
					console.error("Impossible de parser la réponse d'erreur en JSON.");
					errorData = { error: `Erreur serveur (${response.status})` };
				}
				showAlert(errorData.error || 'Erreur lors de la modification', 'error');
				return;
			}

			const result = await response.json();
			console.log('Réponse de succès du serveur:', result);

			console.log('Modification réussie. Invalidation des données...');
			await invalidateAll();
			console.log(
				'Invalidation terminée. Les données de la page devraient maintenant être rafraîchies.'
			);

			showAlert('Catégorie modifiée avec succès', 'success');
			editFormOpen = false;
		} catch (error) {
			console.error('Erreur (bloc catch) dans handleEditSubmit:', error);
			showAlert('Erreur réseau ou inattendue lors de la modification.', 'error');
		} finally {
			console.log('=== Fin handleEditSubmit ===');
		}
	}

	async function handleDeleteConfirm(): Promise<void> {
		console.log('=== Début handleDeleteConfirm ===');
		if (selectedCategory && selectedCategory.row_key) {
			const rowKeyToDelete = selectedCategory.row_key;
			console.log('ID de la ligne à supprimer:', rowKeyToDelete);

			try {
				console.log('Envoi de la requête de suppression...');
				const response = await fetch(`/categories/api/${rowKeyToDelete}`, {
					method: 'DELETE'
				});

				console.log('Statut de la réponse:', response.status);

				if (response.ok) {
					console.log('Suppression réussie');

					const updatedCategories = data.categories.filter(
						(cat: Category) => cat.row_key !== rowKeyToDelete
					);
					data.categories = updatedCategories;

					showAlert('Catégorie supprimée avec succès', 'success');
					deleteConfirmOpen = false;
				} else {
					const result = await response.json();
					console.log('Erreur lors de la suppression:', result.error);
					showAlert(result.error || 'Erreur lors de la suppression', 'error');
				}
			} catch (error) {
				console.error('Erreur dans handleDeleteConfirm:', error);
				showAlert('Erreur lors de la suppression', 'error');
			}
		} else {
			console.log('Erreur: Catégorie ou ID de ligne manquant');
			showAlert('Erreur: Informations de catégorie incomplètes', 'error');
		}
		console.log('=== Fin handleDeleteConfirm ===');
	}

	async function handleAddSubmit(event: FormEvent): Promise<void> {
		console.log('Add submission event:', event.detail);
		try {
			// Préparer les données à envoyer à l'API
			const apiData = { ...event.detail.data };
			// Ne pas envoyer atr_0_label, il est géré automatiquement par l'API
			delete apiData.atr_0_label;

			console.log("Données à envoyer à l'API:", apiData);

			const response = await fetch('/categories/api', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(apiData)
			});

			console.log('API Response status:', response.status);

			if (!response.ok) {
				const errorData = await response.json();
				showAlert(errorData.error || "Erreur lors de l'ajout de la catégorie", 'error');
				return;
			}

			const serverResponse = await response.json();
			console.log('Réponse du serveur:', serverResponse);

			// Vérifier si l'API a vraiment réussi
			if (!serverResponse.success) {
				showAlert(serverResponse.error || "Erreur lors de l'ajout de la catégorie", 'error');
				return;
			}

			showAlert('Catégorie ajoutée avec succès', 'success');
			addFormOpen = false;

			// Créer l'objet complet avec atr_0_label pour l'affichage immédiat
			const newCategoryForDisplay = {
				...apiData,
				atr_0_label: 'Catégorie des produits',
				atr_id: Date.now() // ID temporaire pour l'affichage
			};

			// Mettre à jour les données localement pour affichage immédiat
			data.categories = [...data.categories, newCategoryForDisplay];

			console.log('Données mises à jour localement, nouvelle catégorie visible immédiatement');

			// Rafraîchir les données en arrière-plan pour synchroniser avec le serveur
			setTimeout(async () => {
				await invalidateAll();
				console.log('Données rafraîchies en arrière-plan');
			}, 500);
		} catch (error) {
			console.error('Error in form submission:', error);
			showAlert("Erreur lors de l'ajout de la catégorie", 'error');
		}
	}

	async function confirmDeleteMultiple(items: Category[]): Promise<void> {
		console.log('=== Début confirmDeleteMultiple ===');
		console.log('Items à supprimer:', items);
		const rowKeysToDelete = items.map((item) => item.row_key).filter(Boolean) as number[];

		try {
			// Supprimer chaque élément sélectionné
			for (const rowKey of rowKeysToDelete) {
				const response = await fetch(`/categories/api/${rowKey}`, {
					method: 'DELETE'
				});

				if (!response.ok) {
					const errorData = await response.json();
					showAlert(errorData.error || 'Erreur lors de la suppression', 'error');
					return;
				}
			}

			// Mettre à jour les données localement
			const updatedCategories = data.categories.filter(
				(cat: Category) => !rowKeysToDelete.includes(cat.row_key)
			);

			// Mettre à jour les données de la page
			data.categories = updatedCategories;

			showAlert(`${items.length} catégorie(s) supprimée(s) avec succès`, 'success');
		} catch (error) {
			console.error('Erreur dans confirmDeleteMultiple:', error);
			showAlert('Erreur lors de la suppression multiple', 'error');
		}
		console.log('=== Fin confirmDeleteMultiple ===');
	}
</script>

<div class="container mx-auto py-6">
	<div class="mb-6">
		<h1 class="text-3xl font-bold text-gray-900">Gestion des Catégories</h1>
	</div>

	<Alert.GlobalAlert />

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
		isDelete={true}
		on:submit={handleDeleteConfirm}
		on:cancel={() => (deleteConfirmOpen = false)}
	/>
</div>
