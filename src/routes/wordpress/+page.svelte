<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import { Download, Package, AlertCircle } from 'lucide-svelte';
	import { toast } from 'svelte-sonner';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	let isDownloading = $state(false);
</script>

<svelte:head>
	<title>Export WordPress - CENOV</title>
</svelte:head>

<div class="container mx-auto max-w-4xl p-6">
	<!-- Titre principal -->
	<h1 class="mb-6 flex items-center gap-2 text-3xl font-bold">
		<Package class="h-8 w-8" />
		Export WordPress
	</h1>

	<!-- Card principale -->
	<Card.Root variant="blanc" class="w-full max-w-none">
		<Card.Content>
			<!-- Section Statistiques -->
			<div class="mb-6">
				<h2 class="mb-4 text-xl font-semibold text-black">📊 Base de données CENOV_DEV :</h2>

				<!-- Grille de statistiques -->
				<div class="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
					<!-- Total Produits -->
					<div class="rounded-lg border border-blue-200 bg-blue-50 p-4 text-center">
						<div class="text-2xl font-bold text-blue-600">{data.stats.total}</div>
						<div class="text-sm text-blue-800">Produits</div>
					</div>

					<!-- Publiés -->
					<div class="rounded-lg border border-green-200 bg-green-50 p-4 text-center">
						<div class="text-2xl font-bold text-green-600">{data.stats.published}</div>
						<div class="text-sm text-green-800">Publiés</div>
					</div>

					<!-- En stock -->
					<div class="rounded-lg border border-purple-200 bg-purple-50 p-4 text-center">
						<div class="text-2xl font-bold text-purple-600">{data.stats.in_stock}</div>
						<div class="text-sm text-purple-800">En stock</div>
					</div>

					<!-- Sans nom -->
					<div class="rounded-lg border border-orange-200 bg-orange-50 p-4 text-center">
						<div class="text-2xl font-bold text-orange-700">{data.stats.missing_name}</div>
						<div class="text-sm text-orange-800">Sans nom</div>
					</div>
				</div>

				<!-- Avertissements -->
				{#if data.stats.missing_name > 0 || data.stats.missing_price > 0}
					<div class="mb-6 rounded-lg border border-orange-200 bg-orange-50 p-4">
						<h3 class="mb-2 flex items-center gap-2 font-medium text-orange-800">
							<AlertCircle class="h-5 w-5" />
							Avertissements
						</h3>
						<ul class="space-y-1 text-sm text-orange-700">
							{#if data.stats.missing_name > 0}
								<li>
									• {data.stats.missing_name} produits sans nom (UGS utilisé comme fallback)
								</li>
							{/if}
							{#if data.stats.missing_price > 0}
								<li>• {data.stats.missing_price} produits sans prix</li>
							{/if}
						</ul>
					</div>
				{/if}

				<!-- Bouton de téléchargement -->
				<Button
					variant="vert"
					class="w-full"
					disabled={isDownloading}
					onclick={async () => {
						console.log('🔵 Bouton cliqué - Début téléchargement WordPress');
						isDownloading = true;
						try {
							console.log('🔵 Création lien de téléchargement...');

							// Créer un lien temporaire pour déclencher le téléchargement
							const link = document.createElement('a');
							link.href = '/wordpress'; // Appelle le GET handler de +server.ts
							link.download = ''; // Force le téléchargement
							document.body.appendChild(link);
							link.click();
							document.body.removeChild(link);

							console.log('✅ Téléchargement déclenché');

							setTimeout(() => {
								isDownloading = false;
								toast.success('CSV WordPress téléchargé avec succès');
							}, 1000);
						} catch (err) {
							console.error('❌ Erreur téléchargement:', err);
							isDownloading = false;
							toast.error('Erreur lors du téléchargement');
						}
					}}
				>
					<Download class="mr-2 h-5 w-5" />
					{isDownloading ? 'Génération en cours...' : 'Télécharger CSV WordPress'}
				</Button>
			</div>

			<!-- Informations complémentaires -->
			<div class="mt-6 rounded-lg border border-gray-200 bg-gray-50 p-4">
				<h3 class="mb-2 text-sm font-semibold text-gray-700">ℹ️ Informations :</h3>
				<ul class="space-y-1 text-xs text-gray-600">
					<li>• Format : CSV compatible WooCommerce</li>
					<li>
						• Champs exportés : Type, UGS, Nom, Publié, Visibilité, Descriptions, Prix, Images,
						Brand
					</li>
					<li>• Produits avec UGS uniquement (requis par WordPress)</li>
					<li>• Nom par défaut = UGS si non renseigné</li>
				</ul>
			</div>
		</Card.Content>
	</Card.Root>
</div>

<!-- Loader global -->
{#if isDownloading}
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
		<div class="rounded-lg bg-white p-6 shadow-lg">
			<div
				class="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"
			></div>
			<p class="text-center font-medium">Génération du CSV...</p>
		</div>
	</div>
{/if}
