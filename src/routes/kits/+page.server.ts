// src/routes/kits/+page.server.ts
import { error, fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { z } from 'zod';
import { superValidate } from 'sveltekit-superforms/server';
import { zod } from 'sveltekit-superforms/adapters';

// Fonction utilitaire pour convertir en toute sécurité les valeurs FormData en string
function safeFormDataToString(value: FormDataEntryValue | null): string {
	if (value === null) return '';
	if (typeof value === 'string') return value;
	if (value instanceof File) return value.name;
	return '';
}

// Schéma de validation pour les kits
const kitSchema = z.object({
	kit_label: z
		.string()
		.min(1, { message: 'Le nom du kit est requis' })
		.max(255, { message: 'Le nom du kit ne peut pas dépasser 255 caractères' }),
	atr_label: z
		.string()
		.min(1, { message: 'La caractéristique est requise' })
		.max(255, { message: 'La caractéristique ne peut pas dépasser 255 caractères' }),
	atr_val: z
		.string()
		.min(1, { message: "L'unité est requise" })
		.max(255, { message: "L'unité ne peut pas dépasser 255 caractères" }),
	kat_valeur: z
		.string()
		.min(1, { message: 'La valeur doit être un chiffre ou un nombre valide' })
		.max(255, { message: 'La valeur ne peut pas dépasser 255 caractères' })
		.refine((val) => !isNaN(parseFloat(val)), {
			message: 'La valeur doit être un nombre valide'
		})
});

// Cette fonction sera utilisée à la fois sur le serveur et le kit
export const load = (async ({ fetch, depends, url }) => {
	console.log('🚀 [KITS] Début du chargement de la page kits');
	console.log('🔍 [KITS] URL:', url.pathname);

	depends('app:kits'); // Pour permettre l'invalidation avec invalidateAll()

	try {
		console.log('📡 [KITS] Appel API: /kits/api');

		// Récupérer les kits via l'API
		const kitsResponse = await fetch('/kits/api');

		console.log('📡 [KITS] Réponse API:', {
			status: kitsResponse.status,
			statusText: kitsResponse.statusText,
			ok: kitsResponse.ok
		});

		if (!kitsResponse.ok) {
			console.error('❌ [KITS] Erreur API response:', kitsResponse.status);
			throw new Error(`Erreur API: ${kitsResponse.status} - ${kitsResponse.statusText}`);
		}

		const kits = await kitsResponse.json();
		console.log('📊 [KITS] Données reçues:', {
			count: Array.isArray(kits) ? kits.length : 'N/A',
			type: typeof kits,
			isArray: Array.isArray(kits),
			firstItem: Array.isArray(kits) && kits.length > 0 ? kits[0] : null
		});

		// Créer un formulaire vide pour l'ajout de kit
		console.log('📝 [KITS] Création du formulaire SuperForms');
		const form = await superValidate(zod(kitSchema));
		console.log('📝 [KITS] Formulaire créé:', {
			valid: form.valid,
			hasErrors: Object.keys(form.errors || {}).length > 0
		});

		console.log('✅ [KITS] Chargement terminé avec succès');
		return {
			kits,
			form
		};
	} catch (err) {
		console.error('❌ [KITS] Erreur dans le chargement de la page kits:', err);
		console.error('❌ [KITS] Stack trace:', err instanceof Error ? err.stack : 'N/A');
		throw error(
			500,
			`Erreur lors du chargement des kits: ${err instanceof Error ? err.message : 'Erreur inconnue'}`
		);
	}
}) satisfies PageServerLoad;

export const actions: Actions = {
	create: async ({ request, fetch }) => {
		console.log('=== Action CREATE appelée ===');
		const formData = await request.formData();
		console.log('FormData reçu:', Object.fromEntries(formData.entries()));

		const form = await superValidate(formData, zod(kitSchema));
		console.log('Validation SuperForms:', {
			valid: form.valid,
			errors: form.errors,
			data: form.data
		});

		if (!form.valid) {
			console.log('Formulaire invalide, retour fail(400)');
			return fail(400, { form });
		}

		try {
			console.log('Envoi vers API avec données:', form.data);
			const response = await fetch('/kits/api', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(form.data)
			});

			console.log('Réponse API:', { ok: response.ok, status: response.status });

			if (!response.ok) {
				const errorData = await response.json();
				console.log('Erreur API:', errorData);
				return fail(response.status, {
					form,
					error: errorData.error ?? 'Erreur lors de la création du kit'
				});
			}

			const result = await response.json();
			console.log('Succès API:', result);

			// Réinitialiser le formulaire après succès
			return { form, success: true };
		} catch (err) {
			console.error('Erreur lors de la création du kit:', err);
			return fail(500, {
				form,
				error: 'Erreur lors de la création du kit'
			});
		}
	},

	update: async ({ request, fetch }) => {
		const formData = await request.formData();
		const id = safeFormDataToString(formData.get('id'));

		if (!id) {
			return fail(400, { error: 'ID de kit manquant' });
		}

		// Extraire les données du formulaire pour la mise à jour
		const updateData = {
			kit_label: safeFormDataToString(formData.get('kit_label')),
			atr_label: safeFormDataToString(formData.get('atr_label')),
			atr_val: safeFormDataToString(formData.get('atr_val')),
			kat_valeur: safeFormDataToString(formData.get('kat_valeur'))
		};

		try {
			const response = await fetch(`/kits/api/${id}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(updateData)
			});

			if (!response.ok) {
				const errorData = await response.json();
				return fail(response.status, {
					error: errorData.error ?? 'Erreur lors de la mise à jour du kit'
				});
			}

			return { success: true };
		} catch (err) {
			console.error('Erreur lors de la mise à jour du kit:', err);
			return fail(500, { error: 'Erreur lors de la mise à jour du kit' });
		}
	},

	delete: async ({ request, fetch }) => {
		console.log('=== Action DELETE appelée ===');
		const formData = await request.formData();
		console.log('FormData reçu:', Object.fromEntries(formData.entries()));

		const id = safeFormDataToString(formData.get('id'));
		console.log('ID extrait:', id);

		if (!id) {
			console.log('Erreur: ID de kit manquant');
			return fail(400, { error: 'ID de kit manquant' });
		}

		try {
			console.log('Envoi vers API DELETE avec ID:', id);
			const response = await fetch(`/kits/api/${id}`, {
				method: 'DELETE'
			});

			console.log('Réponse API DELETE:', { ok: response.ok, status: response.status });

			if (!response.ok) {
				const errorData = await response.json();
				console.log('Erreur API DELETE:', errorData);
				return fail(response.status, {
					error: errorData.error ?? 'Erreur lors de la suppression du kit'
				});
			}

			const result = await response.json();
			console.log('Succès API DELETE:', result);
			return { success: true };
		} catch (err) {
			console.error('Erreur lors de la suppression du kit:', err);
			return fail(500, { error: 'Erreur lors de la suppression du kit' });
		}
	}
};
