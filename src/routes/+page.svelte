<script lang="ts">
	import UserInfo from '$lib/components/UserInfo.svelte';

	export let data;
</script>

<div class="mx-auto max-w-3xl">
	<h1 class="mb-6 text-3xl font-bold">Bienvenue sur cenov-distribution</h1>

	{#if data.user}
		<div class="mb-6 rounded-md bg-green-100 p-4 text-green-800">Vous êtes connecté !</div>
		<UserInfo user={data.user} />
	{:else}
		<div class="mb-6 rounded-md bg-blue-100 p-4">
			<p class="mb-2">
				Connectez-vous pour accéder à notre catalogue de pompes et moteurs industriels.
			</p>
			<form method="POST" action="?/signIn">
				<button
					type="submit"
					class="rounded-md bg-[#2563eb] px-4 py-2 font-medium text-white transition-colors hover:bg-[#3c24ac]"
				>
					Se connecter
				</button>
			</form>
		</div>
	{/if}
</div>
