<script lang="ts">
	import { Button } from '$lib/components/ui/button';

	export let data;
	const user = data.user;
</script>

<div class="mx-auto max-w-4xl p-6">
	<h1 class="mb-6 text-2xl font-bold">Mon compte</h1>

	<div class="rounded-lg bg-white p-6 shadow">
		<h2 class="mb-4 text-xl font-semibold">Informations personnelles</h2>

		{#if user}
			<div class="grid grid-cols-2 gap-4">
				<div class="font-medium">Identifiant :</div>
				<div>{user.sub || 'Non disponible'}</div>

				<div class="font-medium">Nom :</div>
				<div>{user.name || 'Non disponible'}</div>

				<div class="font-medium">Email :</div>
				<div>{user.email || 'Non disponible'}</div>

				{#if user.roles && user.roles.length > 0}
					<div class="font-medium">Rôles :</div>
					<div>{user.roles.join(', ')}</div>
				{/if}
			</div>

			<div class="mt-6">
				<form method="POST" action="/?/signOut">
					<Button type="submit" variant="rouge">Se déconnecter</Button>
				</form>
			</div>
		{:else}
			<p class="text-red-500">Vous n'êtes pas connecté. Redirection en cours...</p>
		{/if}
	</div>
</div>
