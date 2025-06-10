// Store pour gérer les alertes globalement
import { writable } from 'svelte/store';

export type AlertType = 'success' | 'error' | 'info' | 'warning';

export interface AlertState {
	id: string;
	message: string;
	type: AlertType;
	title?: string;
	visible: boolean;
	autoHide: boolean;
	autoHideDelay: number;
}

// Store principal
export const alertStore = writable<AlertState>({
	id: '',
	message: '',
	type: 'info',
	title: '',
	visible: false,
	autoHide: true,
	autoHideDelay: 5000
});

// Fonctions utilitaires
export const alertActions = {
	// Afficher une alerte
	show: (
		message: string,
		type: AlertType = 'info',
		title?: string,
		options?: Partial<Pick<AlertState, 'autoHide' | 'autoHideDelay'>>
	) => {
		const id = `alert-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
		alertStore.set({
			id,
			message,
			type,
			title: title ?? getDefaultTitle(type),
			visible: true,
			autoHide: options?.autoHide ?? true,
			autoHideDelay: options?.autoHideDelay ?? 5000
		});
	},

	// Masquer l'alerte
	hide: () => {
		alertStore.update((state) => ({ ...state, visible: false }));
	},

	// Raccourcis pour les types courants
	success: (message: string, title?: string) => alertActions.show(message, 'success', title),
	error: (message: string, title?: string) => alertActions.show(message, 'error', title),
	info: (message: string, title?: string) => alertActions.show(message, 'info', title),
	warning: (message: string, title?: string) => alertActions.show(message, 'warning', title)
};

// Fonction helper pour les titres par défaut
function getDefaultTitle(type: AlertType): string {
	const titles: Record<AlertType, string> = {
		success: 'Succès',
		error: 'Erreur',
		info: 'Information',
		warning: 'Attention'
	};
	return titles[type];
}
