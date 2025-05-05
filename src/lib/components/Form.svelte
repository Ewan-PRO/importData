<!-- src/lib/components/Form.svelte -->
<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { Button, Label, Input, Select, Textarea, Modal } from 'flowbite-svelte';
	import { CircleCheck, CircleX } from 'lucide-svelte';

	export let fields: {
		key: string;
		label: string;
		type: 'text' | 'number' | 'email' | 'textarea' | 'select';
		placeholder?: string;
		required?: boolean;
		options?: Array<{ value: string; label: string }>;
		value?: any;
	}[] = [];
	export let data: any = {};
	export let title = 'Formulaire';
	export let submitLabel = 'Enregistrer';
	export let cancelLabel = 'Annuler';
	export let isOpen = false;
	export let isEdit = false;

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

		fields.forEach((field) => {
			console.log(`Validation du champ ${field.key}:`, formData[field.key]);
			if (field.required && (!formData[field.key] || formData[field.key] === '')) {
				errors[field.key] = `Le champ ${field.label} est requis`;
				isValid = false;
				console.log(`Erreur détectée pour ${field.key}: champ requis`);
			}
		});

		console.log('Résultat de la validation:', { isValid, errors });
		return isValid;
	}

	function handleSubmit() {
		console.log('handleSubmit appelé - État actuel:', { formData, errors });
		if (validateForm()) {
			const finalData = { ...data, ...formData };
			console.log('Formulaire valide, dispatch de submit avec:', { data: finalData, isEdit });
			dispatch('submit', {
				data: finalData,
				isEdit
			});
			isOpen = false;
		} else {
			console.log('Formulaire invalide - Erreurs:', errors);
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
						value={formData[field.key] || ''}
						on:input={(e) => {
							const target = e.target as HTMLTextAreaElement;
							updateFormData(field.key, target.value);
						}}
						class={errors[field.key] ? 'border-red-500' : ''}
					/>
				{:else if field.type === 'select'}
					<Select
						id={field.key}
						required={field.required}
						value={formData[field.key] || ''}
						on:change={(e) => {
							const target = e.target as HTMLSelectElement;
							updateFormData(field.key, target.value);
						}}
						class={errors[field.key] ? 'border-red-500' : ''}
					>
						<option value="">Sélectionnez une option</option>
						{#each field.options || [] as option}
							<option value={option.value}>{option.label}</option>
						{/each}
					</Select>
				{:else}
					<Input
						type={field.type}
						id={field.key}
						placeholder={field.placeholder || ''}
						required={field.required}
						value={formData[field.key] || ''}
						on:input={(e) => {
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
			<Button color="red" on:click={handleCancel}>
				<CircleX class="mr-2 h-4 w-4" />
				{cancelLabel}
			</Button>
			<Button type="submit" color="green">
				<CircleCheck class="mr-2 h-4 w-4" />
				{submitLabel}
			</Button>
		</div>
	</form>
</Modal>
