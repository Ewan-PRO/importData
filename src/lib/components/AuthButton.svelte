<script lang="ts">
	export let user: any;
</script>

<form method="POST" action="?/{user ? 'signOut' : 'signIn'}">
	<button
		type="submit"
		class="me-2 mb-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 focus:outline-none dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
	>
		{user ? 'Se déconnecter' : 'Se connecter'}
	</button>
</form>
