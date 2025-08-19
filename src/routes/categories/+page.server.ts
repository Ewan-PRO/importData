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
const categorySchema = z
	.object({
		atr_0_label: z
			.string()
			.max(255, 'Le label ne peut pas dépasser 255 caractères')
			.default('Catégorie des produits'),
		atr_1_label: z.string().max(255, 'Le label ne peut pas dépasser 255 caractères').optional(),
		atr_2_label: z.string().max(255, 'Le label ne peut pas dépasser 255 caractères').optional(),
		atr_3_label: z.string().max(255, 'Le label ne peut pas dépasser 255 caractères').optional(),
		atr_4_label: z.string().max(255, 'Le label ne peut pas dépasser 255 caractères').optional(),
		atr_5_label: z.string().max(255, 'Le label ne peut pas dépasser 255 caractères').optional(),
		atr_6_label: z.string().max(255, 'Le label ne peut pas dépasser 255 caractères').optional(),
		atr_7_label: z.string().max(255, 'Le label ne peut pas dépasser 255 caractères').optional()
	})
	.refine(
		(data) => {
			const levels = [
				data.atr_1_label,
				data.atr_2_label,
				data.atr_3_label,
				data.atr_4_label,
				data.atr_5_label,
				data.atr_6_label,
				data.atr_7_label
			];

			const firstEmptyIndex = levels.findIndex((level) => !level || level.trim() === '');

			// Si aucun niveau n'est vide, ou si tous les niveaux sont vides, c'est valide (le cas "tous vides" est géré par le refine suivant)
			if (firstEmptyIndex === -1) {
				return true;
			}

			// Une fois qu'un niveau vide est trouvé, tous les niveaux suivants doivent aussi être vides.
			const subsequentLevels = levels.slice(firstEmptyIndex + 1);
			return subsequentLevels.every((level) => !level || level.trim() === '');
		},
		{
			message:
				'Les niveaux de catégorie doivent être consécutifs. Vous ne pouvez pas laisser de vide.',
			path: ['atr_1_label'] // L'erreur est affichée globalement ou sur le premier champ.
		}
	)
	.refine(
		(data) => {
			// Vérifier qu'au moins un champ entre atr_1_label et atr_7_label est rempli
			const hasAtLeastOneLevel = [
				data.atr_1_label,
				data.atr_2_label,
				data.atr_3_label,
				data.atr_4_label,
				data.atr_5_label,
				data.atr_6_label,
				data.atr_7_label
			].some((label) => label && label.trim() !== '');

			return hasAtLeastOneLevel;
		},
		{
			message: 'Au moins un niveau entre atr_1_label et atr_7_label doit être rempli',
			path: ['atr_1_label'] // Afficher l'erreur sur le premier champ
		}
	);

// Cette fonction sera utilisée à la fois sur le serveur et le client
export const load = (async ({ fetch, depends, url }) => {
	console.log('🚀 [CATEGORIES] Début du chargement de la page categories');
	console.log('🔍 [CATEGORIES] URL:', url.pathname);

	depends('app:categories'); // Pour permettre l'invalidation avec invalidateAll()

	try {
		console.log('📡 [CATEGORIES] Appel API: /categories/api');

		// Récupérer les catégories via l'API
		const categoriesResponse = await fetch('/categories/api');

		console.log('📡 [CATEGORIES] Réponse API:', {
			status: categoriesResponse.status,
			statusText: categoriesResponse.statusText,
			ok: categoriesResponse.ok
		});

		if (!categoriesResponse.ok) {
			console.error('❌ [CATEGORIES] Erreur API response:', categoriesResponse.status);
			throw new Error(
				`Erreur API: ${categoriesResponse.status} - ${categoriesResponse.statusText}`
			);
		}

		const categories = await categoriesResponse.json();
		console.log('📊 [CATEGORIES] Données reçues:', {
			count: Array.isArray(categories) ? categories.length : 'N/A',
			type: typeof categories,
			isArray: Array.isArray(categories),
			firstItem: Array.isArray(categories) && categories.length > 0 ? categories[0] : null
		});

		// Créer un formulaire vide pour l'ajout de catégorie
		console.log('📝 [CATEGORIES] Création du formulaire SuperForms');
		const form = await superValidate(zod(categorySchema));
		console.log('📝 [CATEGORIES] Formulaire créé:', {
			valid: form.valid,
			hasErrors: Object.keys(form.errors || {}).length > 0
		});

		console.log('✅ [CATEGORIES] Chargement terminé avec succès');
		return {
			categories,
			form
		};
	} catch (err) {
		console.error('❌ [CATEGORIES] Erreur dans le chargement de la page catégories:', err);
		console.error('❌ [CATEGORIES] Stack trace:', err instanceof Error ? err.stack : 'N/A');
		throw error(
			500,
			`Erreur lors du chargement des catégories: ${err instanceof Error ? err.message : 'Erreur inconnue'}`
		);
	}
}) satisfies PageServerLoad;

export const actions: Actions = {
	create: async ({ request, fetch }) => {
		const formData = await request.formData();

		// S'assurer que atr_0_label est toujours "Catégorie des produits"
		formData.set('atr_0_label', 'Catégorie des produits');

		const form = await superValidate(formData, zod(categorySchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		try {
			const response = await fetch('/categories/api', {
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
			const response = await fetch(`/categories/api/${id}`, {
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
			const response = await fetch(`/categories/api/${id}`, {
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
