import { z } from 'zod';

export const attributeSchema = z.object({
	atr_id: z.number().int(),
	atr_nat: z.string().max(60),
	atr_val: z.string().max(60),
	atr_label: z.string().max(100),
	created_at: z.date(),
	updated_at: z.date().nullable()
});

export const documentSchema = z.object({
	doc_id: z.number().int(),
	doc_name: z.string().max(100),
	doc_extension: z.string().max(5),
	doc_type: z.string().max(10),
	doc_binary: z.instanceof(Buffer).optional()
});

export const kitSchema = z.object({
	kit_id: z.number().int(),
	kit_label: z.string().max(100),
	created_at: z.date(),
	updated_at: z.date().nullable()
});

export const kitAttributeSchema = z.object({
	fk_kit: z.number().int(),
	fk_attribute_carac: z.number().int(),
	fk_attribute: z.number().int(),
	kat_valeur: z.number().nullable(),
	created_at: z.date(),
	updated_at: z.date().nullable()
});

export const kitDocumentSchema = z.object({
	fk_kit: z.number().int(),
	fk_document: z.number().int(),
	kit_description: z.string().max(255),
	created_at: z.date(),
	updated_at: z.date().nullable()
});

export const kitKitSchema = z.object({
	kik_id: z.number().int(),
	fk_kit_parent: z.number().int(),
	fk_kit_child: z.number().int(),
	kik_qty: z.number().int(),
	kik_index: z.number().int(),
	created_at: z.date(),
	updated_at: z.date().nullable()
});

export const partSchema = z.object({
	par_id: z.number().int(),
	par_kit: z.number().int().nullable(),
	par_label: z.string().max(100),
	created_at: z.date(),
	updated_at: z.date().nullable()
});

export const supplierSchema = z.object({
	sup_id: z.number().int(),
	sup_code: z.string().max(10),
	sup_label: z.string().max(50)
});

export const v_categoriesSchema = z.object({
	atr_0_label: z.string().max(100),
	atr_1_label: z.string().max(100),
	atr_2_label: z.string().max(100),
	atr_3_label: z.string().max(100),
	atr_4_label: z.string().max(100),
	atr_5_label: z.string().max(100),
	atr_6_label: z.string().max(100),
	atr_7_label: z.string().max(100)
});

export const v_kit_caracSchema = z.object({
	kit_label: z.string().max(100),
	atr_label: z.string().max(100),
	atr_val: z.string().max(60),
	kat_valeur: z.number().nullable()
});

type CompleteKitType = z.infer<typeof kitSchema> & {
	attributes?: z.infer<typeof kitAttributeSchema>[];
	documents?: z.infer<typeof kitDocumentSchema>[];
	parts?: z.infer<typeof partSchema>[];
	children?: CompleteKitType[];
};

export const completeKitSchema: z.ZodType<CompleteKitType> = kitSchema.extend({
	attributes: z.array(kitAttributeSchema).optional(),
	documents: z.array(kitDocumentSchema).optional(),
	parts: z.array(partSchema).optional(),
	children: z.array(z.lazy(() => completeKitSchema)).optional()
});

export const completeSupplierSchema = supplierSchema.extend({
	kits: z.array(kitSchema).optional()
});

export const createKitSchema = z.object({
	kit_label: z.string().min(1).max(100),
	attributes: z
		.array(
			z.object({
				atr_id: z.number().int(),
				kat_valeur: z.number().nullable()
			})
		)
		.optional()
});

export const updateKitSchema = createKitSchema.partial();

export const createPartSchema = z.object({
	par_label: z.string().min(1).max(100),
	par_kit: z.number().int().nullable()
});

export const updatePartSchema = createPartSchema.partial();

export const schemas = {
	attribute: attributeSchema,
	supplier: supplierSchema,
	document: documentSchema,
	kit: kitSchema,
	part: partSchema,
	kitAttribute: kitAttributeSchema,
	kitDocument: kitDocumentSchema,
	kitKit: kitKitSchema,
	category: v_categoriesSchema,
	kitCarac: v_kit_caracSchema,
	completeKit: completeKitSchema,
	completeSupplier: completeSupplierSchema,
	createKit: createKitSchema,
	updateKit: updateKitSchema,
	createPart: createPartSchema,
	updatePart: updatePartSchema
};

export default schemas;
