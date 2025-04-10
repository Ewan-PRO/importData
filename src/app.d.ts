declare global {
	namespace App {
		// Étend l'objet Locals pour inclure l'utilisateur authentifié
		interface Locals {
			user?: {
				userId: string;
				rm;
				name: string;
				email: string;
				[key: string]: unknown; // Autoriser d'autres propriétés
			};
		}
	}
}

export {};
