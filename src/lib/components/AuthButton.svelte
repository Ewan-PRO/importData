<script lang="ts">
	export let user: any;
</script>

<form method="POST" action="?/{user ? 'signOut' : 'signIn'}">
	<button
		type="submit"
		class="rounded-md bg-[#2563eb] px-4 py-2 font-medium text-white transition-colors hover:bg-[#3c24ac]"
	>
		{user ? 'Se déconnecter' : 'Se connecter'}
	</button>
</form>
