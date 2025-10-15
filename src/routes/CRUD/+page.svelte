<!-- src/routes/CRUD/+page.svelte -->
<script lang="ts">
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import * as Alert from '$lib/components/ui/alert';
	import DataTable from '$lib/components/DataTable.svelte';
	import Filter from '$lib/components/Filter.svelte';
	import Form from '$lib/components/Form.svelte';
	import { superForm } from 'sveltekit-superforms/client';
	import { toast } from 'svelte-sonner';

	console.log('Script de la page CRUD chargé');

	// Interface pour les données du serveur
	interface ServerData {
		data: DataRecord[];
		columns: Array<{
			name: string;
			type: string;
			isRequired: boolean;
			isPrimaryKey: boolean;
		}>;
		form: any; // SuperValidated de superforms, any nécessaire pour compatibilité
	}

	export let data: ServerData;

	// Interface générique pour les enregistrements (100% dynamique)
	interface DataRecord {
		[key: string]: string | number | undefined;
	}

	// Interface générique pour les événements de formulaire
	interface FormEvent {
		detail: {
			data: Record<string, string>;
		};
	}

	// Interface pour les événements de filtre
	interface FilterEvent {
		detail: {
			field: string;
			term: string;
		};
	}

	// Pour le filtrage (100% dynamique)
	let filteredData: DataRecord[] = [...data.data];

	// Génération dynamique des colonnes depuis les métadonnées du serveur
	$: columns =
		data.columns?.map((column) => ({
			key: column.name,
			header: column.name
		})) || [];

	// Génération dynamique des champs de filtrage depuis les colonnes
	$: filterFields = columns.map((column) => ({
		key: column.key,
		label: column.header
	}));

	// SuperForm pour la création (callback onResult uniquement)
	superForm(data.form, {
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
	let selectedRecord: DataRecord | null = null;
	let formData: Record<string, unknown> = {};

	// Type pour les champs de formulaire
	type FormFieldType = 'text' | 'number' | 'select' | 'textarea' | 'email';

	// Génération dynamique des champs de formulaire depuis les métadonnées du serveur
	$: formFields =
		data.columns?.map((column) => {
			let fieldType: FormFieldType = 'text';

			// Déterminer le type selon le type de colonne
			switch (column.type) {
				case 'Int':
				case 'Float':
				case 'Decimal':
					fieldType = 'number';
					break;
				case 'Boolean':
					fieldType = 'select';
					break;
				case 'DateTime':
					fieldType = 'text'; // ou 'datetime-local' si supporté
					break;
				default:
					fieldType = 'text';
			}

			return {
				key: column.name,
				label: `${column.name} :`,
				type: fieldType,
				required: column.isRequired && !column.isPrimaryKey,
				placeholder: `Saisir ${column.name}...`,
				...(fieldType === 'select' && column.type === 'Boolean'
					? {
							options: [
								{ value: 'true', label: 'Oui' },
								{ value: 'false', label: 'Non' }
							]
						}
					: {})
			};
		}) || [];

	// Utiliser les mêmes champs pour l'ajout et l'édition
	$: addFormFields = formFields;
	$: editFormFields = formFields;

	$: {
		console.log("État du formulaire d'ajout:", { addFormOpen });
		if (!addFormOpen) {
			// Réinitialiser les données quand le formulaire est fermé
			formData = {};
		}
	}

	function openAddForm(): void {
		console.log('Bouton "Ajouter un enregistrement" cliqué - État actuel:', { addFormOpen });
		addFormOpen = true;
		console.log('Nouvel état après ouverture:', { addFormOpen });
	}

	function openEditForm(item: DataRecord): void {
		console.log('=== Début openEditForm ===');
		console.log('Item reçu du DataTable:', item);

		// Trouver la clé primaire dynamiquement
		const primaryKeyColumn = data.columns?.find((col) => col.isPrimaryKey);
		const primaryKey = primaryKeyColumn?.name || 'id';

		console.log('Clé primaire détectée:', primaryKey);
		console.log('Valeur de la clé primaire:', item[primaryKey]);

		// Si la clé primaire n'est pas dans l'objet item, chercher dans les données originales
		if (!item[primaryKey]) {
			console.log('Clé primaire non trouvée, recherche dans les données originales');
			// Trouver l'enregistrement par comparaison de tous les champs non-clés
			const originalRecord = data.data.find((record: DataRecord) => {
				return Object.keys(item).every((key) => key === primaryKey || record[key] === item[key]);
			});
			console.log('Enregistrement original trouvé:', originalRecord);

			selectedRecord = originalRecord || item;
		} else {
			selectedRecord = item;
		}

		console.log('selectedRecord avec clé primaire:', selectedRecord);
		console.log('=== Fin openEditForm ===');

		editFormOpen = true;
	}

	function confirmDelete(item: DataRecord): void {
		console.log('=== Début confirmDelete ===');
		console.log('Enregistrement sélectionné pour suppression:', item);
		selectedRecord = item;
		deleteConfirmOpen = true;
		console.log('=== Fin confirmDelete ===');
	}

	function handleFilter(event: FilterEvent): void {
		const { field, term } = event.detail;
		console.log('Filtrage:', { field, term });

		if (!term.trim()) {
			filteredData = [...data.data];
			return;
		}

		filteredData = data.data.filter((record: DataRecord) => {
			const value = record[field];
			if (value === undefined || value === null) return false;
			return String(value).toLowerCase().includes(term.toLowerCase());
		});

		console.log('Résultats filtrés:', filteredData);
	}

	async function handleResetFilter(): Promise<void> {
		console.log('Réinitialisation du filtre');
		filteredData = [...data.data];
		try {
			await invalidateAll();
			toast.success('Données réinitialisées');
		} catch (error) {
			console.error('Erreur lors de la réinitialisation:', error);
			toast.error('Erreur lors de la réinitialisation');
		}
	}

	async function handleSort(event: CustomEvent<{ order: 'asc' | 'desc' }>): Promise<void> {
		console.log('Tri demandé:', event.detail.order);
		try {
			// Tri local par la clé primaire
			const primaryKeyColumn = data.columns?.find((col) => col.isPrimaryKey);
			const primaryKey = primaryKeyColumn?.name || 'id';

			let sortedData = [...data.data];

			// Tri selon l'ordre demandé
			sortedData.sort((a: DataRecord, b: DataRecord) => {
				const aVal = a[primaryKey];
				const bVal = b[primaryKey];

				if (event.detail.order === 'asc') {
					return (aVal as number) - (bVal as number);
				} else {
					return (bVal as number) - (aVal as number);
				}
			});

			data.data = sortedData;
			filteredData = [...sortedData];
			toast.success(
				`Tri appliqué : ${event.detail.order === 'asc' ? 'Ordre croissant' : 'Ordre décroissant'}`
			);
		} catch (error) {
			console.error('Erreur lors du tri:', error);
			toast.error('Erreur lors du tri');
		}
	}

	function handleAddRecord(): void {
		openAddForm();
	}

	function handleFormSubmit(event: FormEvent): void {
		console.log('=== Début handleFormSubmit ===');
		console.log('Données du formulaire reçues:', event.detail.data);
		console.log('selectedRecord actuel:', selectedRecord);
		console.log('editFormOpen:', editFormOpen);
		console.log('addFormOpen:', addFormOpen);

		const formElement = document.querySelector('#dynamicForm') as HTMLFormElement;
		if (!formElement) {
			console.error('Formulaire non trouvé');
			return;
		}

		// Vider tous les champs existants
		formElement.querySelectorAll('input[type="hidden"]').forEach((input) => {
			(input as HTMLInputElement).value = '';
		});

		// Remplir dynamiquement tous les champs depuis les données du formulaire
		Object.entries(event.detail.data).forEach(([fieldName, fieldValue]) => {
			let input = formElement.querySelector(`input[name="${fieldName}"]`) as HTMLInputElement;

			// Créer l'input s'il n'existe pas
			if (!input) {
				input = document.createElement('input');
				input.type = 'hidden';
				input.name = fieldName;
				formElement.appendChild(input);
			}

			input.value = String(fieldValue || '');
		});

		// Pour la modification, s'assurer que la clé primaire est présente
		const primaryKeyColumn = data.columns?.find((col) => col.isPrimaryKey);
		const primaryKey = primaryKeyColumn?.name || 'id';

		if (selectedRecord?.[primaryKey]) {
			let idInput = formElement.querySelector(`input[name="${primaryKey}"]`) as HTMLInputElement;
			if (!idInput) {
				idInput = document.createElement('input');
				idInput.type = 'hidden';
				idInput.name = primaryKey;
				formElement.appendChild(idInput);
			}
			idInput.value = String(selectedRecord[primaryKey]);
			console.log(`${primaryKey} défini dans le formulaire caché:`, idInput.value);
		}

		console.log('Champs cachés remplis dynamiquement');

		// Soumettre le formulaire
		formElement.requestSubmit();
		console.log('=== Fin handleFormSubmit ===');
	}

	function handleDeleteConfirm(): void {
		console.log('=== Début handleDeleteConfirm ===');
		console.log('Enregistrement à supprimer:', selectedRecord);

		// Trouver la clé primaire dynamiquement
		const primaryKeyColumn = data.columns?.find((col) => col.isPrimaryKey);
		const primaryKey = primaryKeyColumn?.name || 'id';

		if (!selectedRecord?.[primaryKey]) {
			console.error('Aucun enregistrement sélectionné ou clé primaire manquante');
			Alert.alertActions.error('Erreur: Aucun enregistrement sélectionné');
			deleteConfirmOpen = false;
			return;
		}

		const formElement = document.querySelector('#deleteForm') as HTMLFormElement;
		if (!formElement) {
			console.error('Formulaire de suppression non trouvé');
			deleteConfirmOpen = false;
			return;
		}

		// Remplir le champ caché avec la clé primaire
		let idInput = formElement.querySelector(`input[name="${primaryKey}"]`) as HTMLInputElement;
		if (!idInput) {
			idInput = document.createElement('input');
			idInput.type = 'hidden';
			idInput.name = primaryKey;
			formElement.appendChild(idInput);
		}
		idInput.value = String(selectedRecord[primaryKey]);

		console.log(`${primaryKey} rempli pour suppression:`, idInput.value);

		// Fermer la boîte de dialogue de confirmation
		deleteConfirmOpen = false;

		// Soumettre le formulaire
		formElement.requestSubmit();
		console.log('=== Fin handleDeleteConfirm ===');
	}

	async function confirmDeleteMultiple(items: DataRecord[]): Promise<void> {
		console.log('=== Début confirmDeleteMultiple ===');
		console.log('Enregistrements à supprimer:', items);

		if (!items.length) {
			Alert.alertActions.error('Aucun enregistrement sélectionné');
			return;
		}

		// Trouver la clé primaire dynamiquement
		const primaryKeyColumn = data.columns?.find((col) => col.isPrimaryKey);
		const primaryKey = primaryKeyColumn?.name || 'id';

		try {
			let successCount = 0;
			let errorCount = 0;

			// Supprimer chaque enregistrement sélectionné
			for (const record of items) {
				const primaryKeyValue = record[primaryKey];
				if (primaryKeyValue) {
					// Utiliser l'action de suppression via formulaire
					const formData = new FormData();
					formData.append(primaryKey, String(primaryKeyValue));

					const response = await fetch('?/delete', {
						method: 'POST',
						body: formData
					});

					if (response.ok) {
						successCount++;
					} else {
						errorCount++;
						console.error(`Erreur lors de la suppression de l'enregistrement ${primaryKeyValue}`);
					}
				} else {
					errorCount++;
					console.error('Enregistrement sans clé primaire:', record);
				}
			}

			// Afficher le résultat
			if (errorCount === 0) {
				Alert.alertActions.success(`${successCount} enregistrement(s) supprimé(s) avec succès`);
				toast.success(`${successCount} élément(s) supprimé(s) avec succès`);
			} else if (successCount === 0) {
				Alert.alertActions.error(
					`Erreur lors de la suppression des ${errorCount} enregistrement(s)`
				);
			} else {
				Alert.alertActions.error(
					`${successCount} enregistrement(s) supprimé(s), ${errorCount} erreur(s)`
				);
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
		if (data.data) {
			filteredData = [...data.data];
		}
	}
</script>

<svelte:head>
	<title>Gestion des Données</title>
</svelte:head>

<div class="container mx-auto p-6">
	<div class="mb-6">
		<h1 class="text-3xl font-bold text-gray-900">Gestion des Données</h1>
	</div>

	<Alert.GlobalAlert />

	<!-- Composant de filtrage avec bouton d'ajout -->
	<Filter
		fields={filterFields}
		placeholder="Rechercher..."
		showAddButton={true}
		addButtonText="Ajouter un enregistrement"
		showSortFilter={true}
		hideIdDesc={true}
		on:filter={handleFilter}
		on:reset={handleResetFilter}
		on:add={handleAddRecord}
		on:sort={handleSort}
	/>

	<!-- Tableau des données -->
	<DataTable
		data={filteredData}
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
		title="Ajouter un enregistrement"
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
		title="Modifier l'enregistrement"
		fields={editFormFields}
		data={selectedRecord || {}}
		submitLabel="Modifier"
		isEdit={true}
		on:submit={handleFormSubmit}
		on:cancel={() => {
			editFormOpen = false;
			selectedRecord = null;
		}}
	/>

	<!-- Confirmation de suppression -->
	<Form
		bind:isOpen={deleteConfirmOpen}
		title="Supprimer cet enregistrement"
		fields={[]}
		submitLabel="Supprimer"
		cancelLabel="Annuler"
		isDelete={true}
		on:submit={handleDeleteConfirm}
		on:cancel={() => {
			deleteConfirmOpen = false;
			selectedRecord = null;
		}}
	/>

	<!-- Formulaire caché pour les actions CRUD dynamiques -->
	<form
		id="dynamicForm"
		method="POST"
		action={selectedRecord ? '?/update' : '?/create'}
		use:enhance={() => {
			return async ({ result, update }) => {
				console.log('Résultat de la soumission:', result);

				if (result.type === 'success') {
					Alert.alertActions.success(
						selectedRecord
							? 'Enregistrement modifié avec succès'
							: 'Enregistrement créé avec succès'
					);
					toast.success(
						selectedRecord ? 'Élément modifié avec succès' : 'Élément créé avec succès'
					);
					addFormOpen = false;
					editFormOpen = false;
					selectedRecord = null;
					await invalidateAll();
				} else if (result.type === 'failure') {
					const errorData = result.data as Record<string, unknown>;
					const errorMsg = (errorData?.error as string) || 'Une erreur est survenue';
					Alert.alertActions.error(errorMsg);
				}

				await update();
			};
		}}
		style="display: none;"
	>
		<!-- Les champs cachés sont créés dynamiquement par JavaScript -->
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
					Alert.alertActions.success('Enregistrement supprimé avec succès');
					toast.success('Élément supprimé avec succès');
					selectedRecord = null;
					await invalidateAll();
				} else if (result.type === 'failure') {
					const errorData = result.data as Record<string, unknown>;
					const errorMsg = (errorData?.error as string) || 'Erreur lors de la suppression';
					Alert.alertActions.error(errorMsg);
				}

				await update();
			};
		}}
		style="display: none;"
	>
		<!-- Le champ de clé primaire est créé dynamiquement par JavaScript -->
	</form>
</div>
