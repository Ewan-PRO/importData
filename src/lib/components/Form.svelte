<!-- src/lib/components/Form.svelte -->
<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { Modal } from 'flowbite-svelte';
	import { Label } from '$lib/components/ui/label';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Textarea } from '$lib/components/ui/textarea';
	import * as Select from '$lib/components/ui/select';
	import { CircleCheck, CircleX, Trash2 } from 'lucide-svelte';
	import { toast } from 'svelte-sonner';

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

	$: {
		console.log('Changement de isOpen détecté:', isOpen);
		if (isOpen && !isInitialized) {
			console.log('Initialisation du formulaire');
			formData = { ...data };
			errors = {};
			isInitialized = true;
			console.log('FormData initialisé:', formData);
		} else if (!isOpen) {
			isInitialized = false;
		}
	}

	function updateFormData(key: string, value: any) {
		formData = { ...formData, [key]: value };
		console.log('FormData mis à jour:', formData);
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

			// Toast
			if (isDelete) {
				toast.success('Élément supprimé avec succès');
			} else if (isEdit) {
				toast.success('Élément modifié avec succès');
			} else {
				toast.success('Élément créé avec succès');
			}

			dispatch('submit', {
				data: finalData,
				isEdit
			});
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

<Modal {title} bind:open={isOpen}>
	<form on:submit={onSubmit} class="space-y-4">
		{#each fields as field}
			<div>
				<Label for={field.key} class="mb-2">{field.label}</Label>

				{#if field.type === 'textarea'}
					<Textarea
						id={field.key}
						placeholder={field.placeholder || ''}
						required={field.required}
						bind:value={formData[field.key]}
						class={errors[field.key] ? 'border-red-500' : ''}
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
							<Select.SelectTrigger class={errors[field.key] ? 'border-red-500' : ''}>
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
											oninput={(e) => {
												const target = e.target as HTMLInputElement;
												updateFormData(field.key, target.value);
											}}
											class="w-full"
										/>
									</div>
									<Select.SelectSeparator />
								{/if}
								{#each field.options || [] as option}
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
						value={formData[field.key] || field.value || ''}
						oninput={(e) => {
							const target = e.target as HTMLInputElement;
							updateFormData(field.key, target.value);
						}}
						class={errors[field.key] ? 'border-red-500' : ''}
					/>
				{/if}

				{#if errors[field.key]}
					<p class="mt-1 text-sm text-red-600">{errors[field.key]}</p>
				{/if}
			</div>
		{/each}

		<div class="flex justify-end space-x-2 pt-4">
			<Button variant="noir" onclick={handleCancel}>
				<CircleX class="mr-2 h-4 w-4" />
				{cancelLabel}
			</Button>
			<Button type="submit" variant={isDelete ? 'rouge' : 'vert'}>
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
