import type { WordPressProduct } from '../repositories/wordpress.repository';

/**
 * En-têtes CSV conformes au format WooCommerce
 * @see https://woocommerce.com/document/product-csv-import-schema/
 */
const CSV_HEADERS = [
	'Type',
	'UGS',
	'Nom',
	'Publié',
	'Mis en avant ?',
	'Visibilité dans le catalogue',
	'Description courte',
	'Description',
	'En stock ?',
	'Tarif régulier',
	'Images',
	'Brand'
] as const;

/**
 * Échappe une valeur pour l'inclusion dans un CSV
 * Règles RFC 4180 :
 * - Guillemets doubles doublés : " devient ""
 * - Champs avec virgules, guillemets ou sauts de ligne encadrés par "
 * - Valeurs null/undefined deviennent chaîne vide
 *
 * @param value Valeur à échapper
 * @returns Valeur échappée prête pour CSV
 */
function escapeCSV(value: string | null | undefined): string {
	if (value === null || value === undefined) return '';

	const str = String(value);

	// Si contient guillemets, virgules ou sauts de ligne → encadrer et échapper
	if (str.includes('"') || str.includes(',') || str.includes('\n')) {
		return `"${str.replace(/"/g, '""')}"`;
	}

	return str;
}

/**
 * Génère une ligne CSV pour un produit WordPress
 * Format booléen : 1 (true) / 0 (false)
 * Format décimal : . comme séparateur
 *
 * @param product Produit WordPress à convertir
 * @returns Ligne CSV formatée
 */
function generateRow(product: WordPressProduct): string {
	return [
		escapeCSV(product.type),
		escapeCSV(product.sku),
		escapeCSV(product.name),
		product.published ? '1' : '0',
		product.featured ? '1' : '0',
		escapeCSV(product.visibility),
		escapeCSV(product.short_description),
		escapeCSV(product.description),
		product.in_stock ? '1' : '0',
		escapeCSV(product.regular_price),
		escapeCSV(product.images),
		escapeCSV(product.brand)
	].join(',');
}

/**
 * Génère un fichier CSV complet pour import WordPress/WooCommerce
 *
 * Format attendu :
 * ```csv
 * Type,UGS,Nom,Publié,Mis en avant ?,Visibilité dans le catalogue,...
 * simple,PRO123,Pompe,1,0,visible,"Description courte","Description",1,1250.00,https://...,Brand
 * ```
 *
 * @param products Liste des produits à exporter
 * @returns Contenu CSV complet avec en-têtes
 */
export function generateWordPressCSV(products: WordPressProduct[]): string {
	const lines = [CSV_HEADERS.join(',')];

	for (const product of products) {
		lines.push(generateRow(product));
	}

	return lines.join('\n');
}
