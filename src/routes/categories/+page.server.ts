// src/routes/categories/+page.server.ts
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

// Schéma de validation pour les catégories
const categorySchema = z.object({
	atr_0_label: z.string().min(1, { message: 'Le premier niveau est requis' }),
	atr_1_label: z.string().optional(),
	atr_2_label: z.string().optional(),
	atr_3_label: z.string().optional(),
	atr_4_label: z.string().optional(),
	atr_5_label: z.string().optional(),
	atr_6_label: z.string().optional(),
	atr_7_label: z.string().optional()
});

// Cette fonction sera utilisée à la fois sur le serveur et le client
export const load = (async ({ fetch, depends }) => {
	depends('app:categories'); // Pour permettre l'invalidation avec invalidateAll()

	try {
		// Récupérer les catégories via l'API
		const categoriesResponse = await fetch('/api/categories');

		if (!categoriesResponse.ok) {
			throw new Error('Erreur lors de la récupération des catégories');
		}

		const categories = await categoriesResponse.json();

		// Créer un formulaire vide pour l'ajout de catégorie
		const form = await superValidate(zod(categorySchema));

		return {
			categories,
			form
		};
	} catch (err) {
		console.error('Erreur dans le chargement de la page catégories:', err);
		throw error(500, 'Erreur lors du chargement des catégories');
	}
}) satisfies PageServerLoad;

export const actions: Actions = {
	create: async ({ request, fetch }) => {
		const formData = await request.formData();
		const form = await superValidate(formData, zod(categorySchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		try {
			const response = await fetch('/api/categories', {
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
					error: errorData.error ?? 'Erreur lors de la création de la catégorie'
				});
			}

			// Réinitialiser le formulaire après succès
			return { form, success: true };
		} catch (err) {
			console.error('Erreur lors de la création de la catégorie:', err);
			return fail(500, {
				form,
				error: 'Erreur lors de la création de la catégorie'
			});
		}
	},

	update: async ({ request, fetch }) => {
		const formData = await request.formData();
		const id = safeFormDataToString(formData.get('id'));

		if (!id) {
			return fail(400, { error: 'ID de catégorie manquant' });
		}

		// Extraire les données du formulaire pour la mise à jour
		const updateData = {
			atr_val: safeFormDataToString(formData.get('atr_val')),
			atr_label: safeFormDataToString(formData.get('atr_label'))
		};

		try {
			const response = await fetch(`/api/categories/${id}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(updateData)
			});

			if (!response.ok) {
				const errorData = await response.json();
				return fail(response.status, {
					error: errorData.error ?? 'Erreur lors de la mise à jour de la catégorie'
				});
			}

			return { success: true };
		} catch (err) {
			console.error('Erreur lors de la mise à jour de la catégorie:', err);
			return fail(500, { error: 'Erreur lors de la mise à jour de la catégorie' });
		}
	},

	delete: async ({ request, fetch }) => {
		const formData = await request.formData();
		const id = safeFormDataToString(formData.get('id'));

		if (!id) {
			return fail(400, { error: 'ID de catégorie manquant' });
		}

		try {
			const response = await fetch(`/api/categories/${id}`, {
				method: 'DELETE'
			});

			if (!response.ok) {
				const errorData = await response.json();
				return fail(response.status, {
					error: errorData.error ?? 'Erreur lors de la suppression de la catégorie'
				});
			}

			return { success: true };
		} catch (err) {
			console.error('Erreur lors de la suppression de la catégorie:', err);
			return fail(500, { error: 'Erreur lors de la suppression de la catégorie' });
		}
	}
};
