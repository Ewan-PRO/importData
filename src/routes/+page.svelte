<script lang="ts">
	import { LogIn } from 'lucide-svelte';
	import { Button } from '$lib/components/ui/button';
	import UserInfo from '$lib/components/UserInfo.svelte';

	export let data;
</script>

<div class="mx-auto max-w-3xl">
	<h1 class="mb-6 text-3xl font-bold">Bienvenue sur CenovDistribution</h1>

	{#if data.user}
		<div class="mb-6 rounded-md bg-green-100 p-4 text-green-800">Vous êtes connecté !</div>
		<UserInfo user={data.user} />
	{:else}
		<div class="mb-6 rounded-md bg-blue-100 p-4">
			<p class="mb-2">
				Connectez-vous pour accéder à notre catalogue de pompes et moteurs industriels.
			</p>
			<form method="POST" action="?/signIn">
				<Button type="submit" variant="bleu" class="me-2 mb-2">
					<LogIn size={16} />
					Se connecter
				</Button>
			</form>
		</div>
	{/if}
</div>
