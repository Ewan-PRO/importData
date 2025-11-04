<!-- Galerie de démonstration Spinner - À supprimer après tests -->
<script lang="ts">
	import { Spinner } from './index.js';
	import { Button } from '$lib/components/ui/button';
</script>

<div class="rounded-lg border-2 border-purple-200 bg-purple-50 p-6">
	<h3 class="mb-4 text-lg font-bold text-purple-900">🎨 Galerie Spinners Shadcn</h3>

	<!-- Tailles -->
	<div class="mb-6">
		<h4 class="mb-3 font-semibold text-purple-800">Tailles :</h4>
		<div class="flex flex-wrap items-center gap-6">
			<div class="flex flex-col items-center gap-2">
				<Spinner class="size-3" />
				<span class="text-xs text-gray-600">size-3</span>
			</div>
			<div class="flex flex-col items-center gap-2">
				<Spinner class="size-4" />
				<span class="text-xs text-gray-600">size-4 (défaut)</span>
			</div>
			<div class="flex flex-col items-center gap-2">
				<Spinner class="size-6" />
				<span class="text-xs text-gray-600">size-6</span>
			</div>
			<div class="flex flex-col items-center gap-2">
				<Spinner class="size-8" />
				<span class="text-xs text-gray-600">size-8</span>
			</div>
			<div class="flex flex-col items-center gap-2">
				<Spinner class="size-12" />
				<span class="text-xs text-gray-600">size-12</span>
			</div>
			<div class="flex flex-col items-center gap-2">
				<Spinner class="size-16" />
				<span class="text-xs text-gray-600">size-16</span>
			</div>
			<div class="flex flex-col items-center gap-2">
				<Spinner class="size-20" />
				<span class="text-xs text-gray-600">size-20</span>
			</div>
		</div>
	</div>

	<!-- Couleurs -->
	<div class="mb-6">
		<h4 class="mb-3 font-semibold text-purple-800">Couleurs :</h4>
		<div class="flex flex-wrap items-center gap-6">
			<div class="flex flex-col items-center gap-2">
				<Spinner class="size-8 text-blue-500" />
				<span class="text-xs text-gray-600">Bleu</span>
			</div>
			<div class="flex flex-col items-center gap-2">
				<Spinner class="size-8 text-green-500" />
				<span class="text-xs text-gray-600">Vert</span>
			</div>
			<div class="flex flex-col items-center gap-2">
				<Spinner class="size-8 text-red-500" />
				<span class="text-xs text-gray-600">Rouge</span>
			</div>
			<div class="flex flex-col items-center gap-2">
				<Spinner class="size-8 text-yellow-500" />
				<span class="text-xs text-gray-600">Jaune</span>
			</div>
			<div class="flex flex-col items-center gap-2">
				<Spinner class="size-8 text-purple-500" />
				<span class="text-xs text-gray-600">Violet</span>
			</div>
			<div class="flex flex-col items-center gap-2">
				<Spinner class="size-8 text-orange-500" />
				<span class="text-xs text-gray-600">Orange</span>
			</div>
			<div class="flex flex-col items-center gap-2">
				<Spinner class="size-8 text-pink-500" />
				<span class="text-xs text-gray-600">Rose</span>
			</div>
			<div class="flex flex-col items-center gap-2">
				<Spinner class="size-8 text-gray-500" />
				<span class="text-xs text-gray-600">Gris</span>
			</div>
			<div class="flex flex-col items-center gap-2">
				<Spinner class="size-8 text-cyan-500" />
				<span class="text-xs text-gray-600">Cyan</span>
			</div>
			<div class="flex flex-col items-center gap-2">
				<Spinner class="size-8 text-indigo-500" />
				<span class="text-xs text-gray-600">Indigo</span>
			</div>
		</div>
	</div>

	<!-- Couleurs variantes sombres -->
	<div class="mb-6">
		<h4 class="mb-3 font-semibold text-purple-800">Couleurs sombres :</h4>
		<div class="flex flex-wrap items-center gap-6">
			<div class="flex flex-col items-center gap-2">
				<Spinner class="size-8 text-blue-700" />
				<span class="text-xs text-gray-600">Bleu 700</span>
			</div>
			<div class="flex flex-col items-center gap-2">
				<Spinner class="size-8 text-green-700" />
				<span class="text-xs text-gray-600">Vert 700</span>
			</div>
			<div class="flex flex-col items-center gap-2">
				<Spinner class="size-8 text-red-700" />
				<span class="text-xs text-gray-600">Rouge 700</span>
			</div>
			<div class="flex flex-col items-center gap-2">
				<Spinner class="size-8 text-purple-700" />
				<span class="text-xs text-gray-600">Violet 700</span>
			</div>
		</div>
	</div>

	<!-- Dans des boutons -->
	<div class="mb-6">
		<h4 class="mb-3 font-semibold text-purple-800">Dans des boutons :</h4>
		<div class="flex flex-wrap gap-4">
			<Button variant="bleu" disabled>
				<Spinner class="mr-2" />
				Loading...
			</Button>
			<Button variant="vert" disabled>
				<Spinner class="mr-2" />
				Processing
			</Button>
			<Button variant="rouge" disabled>
				<Spinner class="mr-2" />
				Please wait
			</Button>
			<Button variant="noir" disabled>
				<Spinner class="mr-2 size-5" />
				Importing
			</Button>
			<Button variant="jaune" disabled>
				<Spinner class="mr-2" />
				Syncing
			</Button>
			<Button variant="blanc" disabled>
				<Spinner class="mr-2" />
				Updating
			</Button>
		</div>
	</div>

	<!-- Centré avec texte -->
	<div class="mb-6">
		<h4 class="mb-3 font-semibold text-purple-800">Centré avec texte :</h4>
		<div class="grid grid-cols-1 gap-4 md:grid-cols-3">
			<div class="rounded-lg bg-white p-6">
				<Spinner class="mx-auto mb-3 size-10 text-blue-600" />
				<p class="text-center text-sm text-gray-600">Chargement en cours...</p>
			</div>
			<div class="rounded-lg bg-white p-6">
				<Spinner class="mx-auto mb-3 size-12 text-green-600" />
				<p class="text-center text-sm text-gray-600">Traitement des données...</p>
			</div>
			<div class="rounded-lg bg-white p-6">
				<Spinner class="mx-auto mb-3 size-8 text-purple-600" />
				<p class="text-center text-sm text-gray-600">Veuillez patienter...</p>
			</div>
		</div>
	</div>

	<!-- Inline avec texte -->
	<div>
		<h4 class="mb-3 font-semibold text-purple-800">Inline avec texte :</h4>
		<div class="space-y-3 rounded-lg bg-white p-4">
			<div class="flex items-center gap-2">
				<Spinner class="size-4 text-blue-500" />
				<span class="text-sm">Synchronisation en cours...</span>
			</div>
			<div class="flex items-center gap-2">
				<Spinner class="size-5 text-green-500" />
				<span class="text-sm font-medium">Import des produits...</span>
			</div>
			<div class="flex items-center gap-2">
				<Spinner class="size-6 text-red-500" />
				<span class="text-base font-bold">Validation des données...</span>
			</div>
		</div>
	</div>
</div>
