// src/routes/kits/+page.server.ts
import { error, fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { z } from 'zod';
import { superValidate } from 'sveltekit-superforms/server';
import { zod } from 'sveltekit-superforms/adapters';
import { protect } from '$lib/auth/protect';

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
export const load = (async (event) => {
	// Protection de la route - redirection vers / si non connecté
	await protect(event);
	
	const { fetch, depends } = event;
	depends('app:kits'); // Pour permettre l'invalidation avec invalidateAll()

	try {
		// Récupérer les kits via l'API
		const kitsResponse = await fetch('/kits/api');

		if (!kitsResponse.ok) {
			throw new Error(`Erreur API: ${kitsResponse.status} - ${kitsResponse.statusText}`);
		}

		const kits = await kitsResponse.json();

		// Créer un formulaire vide pour l'ajout de kit
		const form = await superValidate(zod(kitSchema));

		return {
			kits,
			form
		};
	} catch (err) {
		throw error(
			500,
			`Erreur lors du chargement des kits: ${err instanceof Error ? err.message : 'Erreur inconnue'}`
		);
	}
}) satisfies PageServerLoad;

export const actions: Actions = {
	create: async (event) => {
		// Protection de l'action - redirection vers / si non connecté
		await protect(event);
		
		const { request, fetch } = event;
		const formData = await request.formData();
		const form = await superValidate(formData, zod(kitSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		try {
			const response = await fetch('/kits/api', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(form.data)
			});

			if (!response.ok) {
				const errorData = await response.json();
				return fail(response.status, {
					form,
					error: errorData.error ?? 'Erreur lors de la création du kit'
				});
			}

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

	update: async (event) => {
		// Protection de l'action - redirection vers / si non connecté
		await protect(event);
		
		const { request, fetch } = event;
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

	delete: async (event) => {
		// Protection de l'action - redirection vers / si non connecté
		await protect(event);
		
		const { request, fetch } = event;
		const formData = await request.formData();
		const id = safeFormDataToString(formData.get('id'));

		if (!id) {
			return fail(400, { error: 'ID de kit manquant' });
		}

		try {
			const response = await fetch(`/kits/api/${id}`, {
				method: 'DELETE'
			});

			if (!response.ok) {
				const errorData = await response.json();
				return fail(response.status, {
					error: errorData.error ?? 'Erreur lors de la suppression du kit'
				});
			}

			return { success: true };
		} catch (err) {
			console.error('Erreur lors de la suppression du kit:', err);
			return fail(500, { error: 'Erreur lors de la suppression du kit' });
		}
	}
};
