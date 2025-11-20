import type { WordPressProduct } from '../repositories/wordpress.repository';

/**
 * En-têtes CSV fixes (colonnes de base du produit)
 * @see https://woocommerce.com/document/product-csv-import-schema/
 */
const BASE_CSV_HEADERS = [
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
 * Génère une ligne CSV pour un produit WordPress avec attributs
 * @param product Produit WordPress
 * @param maxAttributes Nombre max d'attributs (pour padding)
 * @returns Ligne CSV formatée
 */
function generateRow(product: WordPressProduct, maxAttributes: number): string {
	// Colonnes fixes de base
	const baseColumns = [
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
	];

	// Colonnes attributs (4 colonnes par attribut : nom, valeur, visible, global)
	const attributeColumns: string[] = [];

	for (let i = 0; i < maxAttributes; i++) {
		const attr = product.attributes[i];

		if (attr) {
			attributeColumns.push(
				escapeCSV(attr.name),
				escapeCSV(attr.value),
				attr.visible ? '1' : '0',
				attr.global ? '1' : '0'
			);
		} else {
			// Padding : colonnes vides si produit a moins d'attributs
			attributeColumns.push('', '', '', '');
		}
	}

	return [...baseColumns, ...attributeColumns].join(',');
}

/**
 * Génère un fichier CSV complet pour import WordPress/WooCommerce avec attributs
 *
 * Format attendu :
 * ```csv
 * Type,UGS,Nom,...,Brand,Nom de l'attribut 1,Valeur(s) de l'attribut 1,Attribut 1 visible,Attribut 1 global,...
 * simple,PRO123,Pompe,...,Brand,POIDS,4,1,1,TENSION,230,1,1
 * ```
 *
 * ⚠️ BOM UTF-8 ajouté pour garantir encodage correct dans Excel/LibreOffice
 *
 * @param products Liste des produits à exporter
 * @returns Contenu CSV complet avec en-têtes et BOM UTF-8
 */
export function generateWordPressCSV(products: WordPressProduct[]): string {
	// BOM UTF-8 pour garantir encodage correct dans Excel/LibreOffice
	const BOM = '\uFEFF';

	// Calculer le nombre max d'attributs
	const maxAttributes = Math.max(...products.map((p) => p.attributes.length), 0);

	// Générer headers dynamiques
	const headers: string[] = [...BASE_CSV_HEADERS];

	for (let i = 1; i <= maxAttributes; i++) {
		headers.push(
			`Nom de l'attribut ${i}`,
			`Valeur(s) de l'attribut ${i}`,
			`Attribut ${i} visible`,
			`Attribut ${i} global`
		);
	}

	// Générer lignes
	const lines = [headers.join(',')];

	for (const product of products) {
		lines.push(generateRow(product, maxAttributes));
	}

	return BOM + lines.join('\n');
}
