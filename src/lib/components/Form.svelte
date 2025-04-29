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

	$: {
		if (isOpen) {
			formData = { ...data };
			errors = {};
		}
	}

	function validateForm(): boolean {
		errors = {};
		let isValid = true;

		fields.forEach((field) => {
			if (field.required && (!formData[field.key] || formData[field.key] === '')) {
				errors[field.key] = `Le champ ${field.label} est requis`;
				isValid = false;
			}
		});

		return isValid;
	}

	function handleSubmit() {
		if (validateForm()) {
			dispatch('submit', {
				data: formData,
				isEdit
			});
		}
	}

	function handleCancel() {
		dispatch('cancel');
	}

	function onSubmit(event: Event) {
		event.preventDefault();
		handleSubmit();
	}
</script>

<Modal {title} bind:open={isOpen} autoclose>
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
					<Select
						id={field.key}
						required={field.required}
						bind:value={formData[field.key]}
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
						bind:value={formData[field.key]}
						class={errors[field.key] ? 'border-red-500' : ''}
					/>
				{/if}

				{#if errors[field.key]}
					<p class="mt-1 text-sm text-red-600">{errors[field.key]}</p>
				{/if}
			</div>
		{/each}

		<div class="flex justify-end space-x-2 pt-4">
			<Button color="light" on:click={handleCancel}>
				<CircleX class="mr-2 h-4 w-4" />
				{cancelLabel}
			</Button>
			<Button type="submit" color={isEdit ? 'blue' : 'green'}>
				<CircleCheck class="mr-2 h-4 w-4" />
				{submitLabel}
			</Button>
		</div>
	</form>
</Modal>
