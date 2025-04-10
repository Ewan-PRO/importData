<script lang="ts">
	export let user: any;
</script>

{#if user}
	<div class="mt-4 rounded-md bg-gray-50 p-4">
		<h2 class="mb-2 text-xl font-semibold">Informations utilisateur</h2>
		<div class="grid grid-cols-2 gap-2">
			{#if user.name}
				<div class="font-medium">Nom:</div>
				<div>{user.name}</div>
			{/if}
			{#if user.email}
				<div class="font-medium">Email:</div>
				<div>{user.email}</div>
			{/if}
			{#if user.roles && user.roles.length > 0}
				<div class="font-medium">Rôles:</div>
				<div>{user.roles.join(', ')}</div>
			{/if}
		</div>
	</div>
{/if}
