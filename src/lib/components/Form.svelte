<!-- src/lib/components/Form.svelte -->
<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { Modal } from 'flowbite-svelte';
	import { Label } from '$lib/components/ui/label';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Textarea } from '$lib/components/ui/textarea';
	import * as Select from '$lib/components/ui/select';
	import { CircleCheck, CircleX, Trash2, Search } from 'lucide-svelte';
	import { toast } from 'svelte-sonner';
	import { Badge } from '$lib/components/ui/badge';

	export let fields: {
		key: string;
		label: string;
		type: 'text' | 'number' | 'email' | 'textarea' | 'select';
		placeholder?: string;
		required?: boolean;
		options?: Array<{ value: string; label: string }>;
		value?: any;
		disabled?: boolean;
		allowCustom?: boolean;
	}[] = [];
	export let data: any = {};
	export let title = 'Formulaire';
	export let submitLabel = 'Enregistrer';
	export let cancelLabel = 'Annuler';
	export let isOpen = false;
	export let isEdit = false;
	export let isDelete = false; // Nouvelle propriété pour les modals de suppression

	const dispatch = createEventDispatcher();
	let formData: Record<string, any> = { ...data };
	let errors: Record<string, string> = {};
	let isInitialized = false;
	let searchTerms: Record<string, string> = {}; // Pour stocker les termes de recherche par champ
	let deleteConfirmationText = ''; // Pour la confirmation de suppression
	let originalData: Record<string, any> = {}; // Pour stocker les valeurs initiales
	let modifiedFields: Record<string, boolean> = {}; // Pour tracker les champs modifiés

	// Variable réactive pour l'état du bouton supprimer
	$: isDeleteConfirmed = deleteConfirmationText.trim() === 'SUPPRIMER';

	$: {
		console.log('Changement de isOpen détecté:', isOpen);
		if (isOpen && !isInitialized) {
			console.log('Initialisation du formulaire');
			formData = { ...data };
			originalData = { ...data }; // Sauvegarder les valeurs initiales
			errors = {};
			searchTerms = {}; // Réinitialiser les termes de recherche
			deleteConfirmationText = ''; // Réinitialiser la confirmation de suppression
			modifiedFields = {}; // Réinitialiser les champs modifiés
			isInitialized = true;
			console.log('FormData initialisé:', formData);
		} else if (!isOpen) {
			isInitialized = false;
		}
	}

	// Fonction pour filtrer les options basée sur le terme de recherche
	function getFilteredOptions(field: any): Array<{ value: string; label: string }> {
		const searchTerm = searchTerms[field.key]?.toLowerCase() || '';
		if (!searchTerm || !field.options) {
			return field.options || [];
		}

		return field.options.filter(
			(option: { value: string; label: string }) =>
				option.label.toLowerCase().includes(searchTerm) ||
				option.value.toLowerCase().includes(searchTerm)
		);
	}

	function updateFormData(key: string, value: any) {
		formData = { ...formData, [key]: value };

		// Vérifier si la valeur a été modifiée par rapport à l'original
		const originalValue = originalData[key] || '';
		const currentValue = value || '';

		// Marquer le champ comme modifié si les valeurs diffèrent
		modifiedFields = {
			...modifiedFields,
			[key]: isEdit && originalValue.toString() !== currentValue.toString()
		};

		console.log('FormData mis à jour:', formData);
		console.log('Champs modifiés:', modifiedFields);
	}

	function updateSearchTerm(fieldKey: string, value: string) {
		searchTerms = { ...searchTerms, [fieldKey]: value };
	}

	function validateForm(): boolean {
		console.log('Validation du formulaire - Données actuelles:', formData);
		errors = {};
		let isValid = true;

		// Validation des champs requis
		fields.forEach((field) => {
			console.log(`Validation du champ ${field.key}:`, formData[field.key]);
			if (
				field.required &&
				!field.disabled &&
				(!formData[field.key] || formData[field.key] === '')
			) {
				errors[field.key] = `Le champ ${field.label} est requis`;
				isValid = false;
				console.log(`Erreur détectée pour ${field.key}: champ requis`);
			}
		});

		// Validation spéciale pour les catégories : au moins un niveau doit être rempli
		const categoryLevels = [
			'atr_1_label',
			'atr_2_label',
			'atr_3_label',
			'atr_4_label',
			'atr_5_label',
			'atr_6_label',
			'atr_7_label'
		];
		const hasCategoryFields = fields.some((field) => categoryLevels.includes(field.key));

		if (hasCategoryFields) {
			const hasAtLeastOneLevel = categoryLevels.some((key) => {
				const value = formData[key] || data[key];
				return value && value.toString().trim() !== '';
			});

			if (!hasAtLeastOneLevel) {
				errors['atr_1_label'] =
					'Au moins un niveau entre atr_1_label et atr_7_label doit être rempli';
				isValid = false;
				console.log('Erreur détectée: aucun niveau de catégorie rempli');
			}
		}

		console.log('Résultat de la validation:', { isValid, errors });
		return isValid;
	}

	function handleSubmit() {
		console.log('handleSubmit appelé - État actuel:', { formData, errors });

		// Vérification spéciale pour les suppressions
		if (isDelete && !isDeleteConfirmed) {
			toast.error('Veuillez taper SUPPRIMER pour confirmer la suppression');
			return;
		}

		if (validateForm()) {
			// Filtrer les champs disabled des données finales
			const filteredFormData = Object.fromEntries(
				Object.entries(formData).filter(([key]) => {
					const field = fields.find((f) => f.key === key);
					return !field?.disabled;
				})
			);
			const finalData = { ...data, ...filteredFormData };
			console.log('Formulaire valide, dispatch de submit avec:', { data: finalData, isEdit });

			// Les toasts sont gérés par les handlers dans les pages après la réponse API

			dispatch('submit', {
				data: finalData,
				isEdit
			});

			// Réinitialiser les champs modifiés après soumission réussie
			modifiedFields = {};
			isOpen = false;
		} else {
			console.log('Formulaire invalide - Erreurs:', errors);
			toast.error('Erreur de validation', {
				description: 'Veuillez corriger les erreurs dans le formulaire.'
			});
		}
	}

	function handleCancel() {
		console.log('handleCancel appelé - État actuel:', { formData, errors });
		isOpen = false;
		dispatch('cancel');
	}

	function onSubmit(event: Event) {
		console.log('onSubmit appelé - Événement:', event);
		event.preventDefault();
		handleSubmit();
	}
</script>

<Modal bind:open={isOpen}>
	<h3 class="text-lg font-bold {isDelete ? 'text-black' : 'text-gray-900'}">
		{isDelete ? 'Confirmer la suppression :' : title}
	</h3>
	<form on:submit={onSubmit} class="space-y-4">
		{#if isDelete}
			<!-- Interface spéciale pour la suppression -->
			<div class="space-y-4">
				<p class="text-gray-700">
					Êtes-vous sûr de vouloir supprimer cette {title.includes('catégorie')
						? 'catégorie'
						: 'kit'} ? Cette action est irréversible.
				</p>
				<div>
					<Label for="deleteConfirmation" class="text-black"
						>Taper SUPPRIMER pour supprimer cette {title.includes('catégorie')
							? 'catégorie :'
							: 'kit :'}</Label
					>
					<Input
						id="deleteConfirmation"
						type="text"
						bind:value={deleteConfirmationText}
						placeholder=""
						class="mt-2"
					/>
				</div>
			</div>
		{:else}
			<!-- Interface normale pour création/édition -->
			{#each fields as field}
				<div>
					<div class="mb-2 flex items-center justify-between">
						<Label for={field.key}>{field.label}</Label>
						<div class="flex gap-2">
							{#if modifiedFields[field.key]}
								<Badge variant="orange">Modifié</Badge>
							{:else if formData[field.key] && formData[field.key] !== ''}
								<Badge variant="vert">Valeur remplie</Badge>
							{/if}
						</div>
					</div>

					{#if field.type === 'textarea'}
						<Textarea
							id={field.key}
							placeholder={field.placeholder || ''}
							required={field.required}
							bind:value={formData[field.key]}
							class={errors[field.key]
								? 'border-red-500'
								: modifiedFields[field.key]
									? 'bg-orange-100'
									: ''}
						/>
					{:else if field.type === 'select'}
						<div class="relative">
							<Select.Select
								type="single"
								value={formData[field.key] || ''}
								onValueChange={(value: string) => {
									if (value) {
										updateFormData(field.key, value);
									}
								}}
							>
								<Select.SelectTrigger
									class={errors[field.key]
										? 'border-red-500'
										: modifiedFields[field.key]
											? 'bg-orange-100'
											: ''}
									hasValue={!!(formData[field.key] && formData[field.key] !== '')}
								>
									{formData[field.key]
										? field.options?.find((opt) => opt.value === formData[field.key])?.label ||
											formData[field.key]
										: field.placeholder || 'Sélectionnez une option'}
								</Select.SelectTrigger>
								<Select.SelectContent>
									{#if field.allowCustom}
										<div class="px-2 py-1">
											<Input
												type="text"
												placeholder="Saisir une valeur personnalisée..."
												value={formData[field.key] || ''}
												oninput={(e) => {
													const target = e.target as HTMLInputElement;
													updateFormData(field.key, target.value);
												}}
												class="w-full"
											/>
										</div>
										<Select.SelectSeparator />
									{/if}
									{#if field.options && field.options.length > 0}
										<div class="px-2 py-1">
											<div class="relative">
												<div
													class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"
												>
													<Search class="h-4 w-4 text-gray-400" />
												</div>
												<Input
													type="text"
													placeholder="Rechercher une catégorie..."
													value={searchTerms[field.key] || ''}
													oninput={(e) => {
														const target = e.target as HTMLInputElement;
														updateSearchTerm(field.key, target.value);
													}}
													class="w-full pl-9"
												/>
											</div>
										</div>
										<Select.SelectSeparator />
									{/if}
									{#each getFilteredOptions(field) as option}
										<Select.SelectItem value={option.value}>{option.label}</Select.SelectItem>
									{/each}
								</Select.SelectContent>
							</Select.Select>
						</div>
					{:else}
						<Input
							type={field.type}
							id={field.key}
							placeholder={field.placeholder || ''}
							required={field.required}
							disabled={field.disabled || false}
							step={field.type === 'number' ? 'any' : undefined}
							value={formData[field.key] || field.value || ''}
							oninput={(e) => {
								const target = e.target as HTMLInputElement;
								updateFormData(field.key, target.value);
							}}
							class={errors[field.key]
								? 'border-red-500'
								: modifiedFields[field.key]
									? 'bg-orange-100'
									: ''}
						/>
					{/if}

					{#if errors[field.key]}
						<p class="mt-1 text-sm text-red-600">{errors[field.key]}</p>
					{/if}
				</div>
			{/each}
		{/if}

		<div class="flex justify-end space-x-2 pt-4">
			<Button variant="noir" onclick={handleCancel}>
				<CircleX class="mr-2 h-4 w-4" />
				{cancelLabel}
			</Button>
			<Button
				type="submit"
				variant={isDelete ? 'rouge' : 'vert'}
				disabled={isDelete && !isDeleteConfirmed}
				class={isDelete && !isDeleteConfirmed ? 'cursor-not-allowed opacity-50' : ''}
			>
				{#if isDelete}
					<Trash2 class="mr-2 h-4 w-4" />
				{:else}
					<CircleCheck class="mr-2 h-4 w-4" />
				{/if}
				{submitLabel}
			</Button>
		</div>
	</form>
</Modal>
