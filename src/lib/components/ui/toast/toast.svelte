<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { Toaster as Sonner, type ToasterProps as SonnerProps, toast } from 'svelte-sonner';
	import { mode } from 'mode-watcher';
	import { X, Info, CheckCircle, XCircle, AlertTriangle } from 'lucide-svelte';

	let {
		variant = 'info',
		message = '',
		closable = true,
		showToaster = false,
		...toasterProps
	}: {
		variant?: 'info' | 'success' | 'error' | 'warning';
		message?: string;
		closable?: boolean;
		showToaster?: boolean;
	} & SonnerProps = $props();

	const dispatch = createEventDispatcher();

	const variants = {
		info: {
			icon: Info,
			iconClass: 'text-blue-600',
			bgClass: 'bg-white border-blue-200'
		},
		success: {
			icon: CheckCircle,
			iconClass: 'text-green-600',
			bgClass: 'bg-white border-green-200'
		},
		error: {
			icon: XCircle,
			iconClass: 'text-red-600',
			bgClass: 'bg-white border-red-200'
		},
		warning: {
			icon: AlertTriangle,
			iconClass: 'text-yellow-600',
			bgClass: 'bg-white border-yellow-200'
		}
	};

	const currentVariant = $derived(variants[variant]);

	function handleClose() {
		dispatch('close');
	}
</script>

<div
	class="max-w-xs rounded-xl border shadow-lg {currentVariant.bgClass}"
	role="alert"
	tabindex="-1"
>
	<div class="flex p-4">
		<div class="shrink-0">
			{#if currentVariant.icon}
				{@const IconComponent = currentVariant.icon}
				<IconComponent class="mt-0.5 size-4 shrink-0 {currentVariant.iconClass}" />
			{/if}
		</div>
		<div class="ms-3 flex-1">
			<p class="text-sm text-gray-900">
				{message}
			</p>
		</div>
		{#if closable}
			<div class="ms-2">
				<button
					type="button"
					class="inline-flex size-5 shrink-0 items-center justify-center rounded-lg text-gray-600 opacity-50 hover:opacity-100 focus:opacity-100 focus:outline-none"
					onclick={handleClose}
				>
					<X class="size-4" />
				</button>
			</div>
		{/if}
	</div>
</div>

<!-- Toaster global pour les notifications dynamiques -->
{#if showToaster}
	<Sonner
		theme="light"
		position="top-center"
		duration={5000}
		class="toaster group"
		toastOptions={{
			style: 'background: white; color: black; border: 1px solid #e5e7eb;',
			duration: 5000
		}}
		{...toasterProps}
	/>
{/if}
