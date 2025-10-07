// Test pour vérifier si Prisma DMMF expose nativeType pour @db.Date
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const require = createRequire(import.meta.url);

const devPrismaPath = path.resolve(__dirname, '../prisma/cenov_dev/generated');
const { Prisma } = require(devPrismaPath);

// Trouver le modèle price_purchase
const model = Prisma.dmmf.datamodel.models.find(m => m.name === 'price_purchase');

console.log('=== PRICE_PURCHASE MODEL ===');
console.log('Model name:', model.name);
console.log('\n=== FIELDS ===');

// Afficher tous les champs DateTime avec leurs métadonnées complètes
const dateTimeFields = model.fields.filter(f => f.type === 'DateTime');

dateTimeFields.forEach(field => {
  console.log('\n---', field.name, '---');
  console.log('Type:', field.type);
  console.log('Kind:', field.kind);
  console.log('IsRequired:', field.isRequired);
  console.log('IsId:', field.isId);
  console.log('HasDefaultValue:', field.hasDefaultValue);

  // Vérifier si nativeType existe (Prisma v6+)
  if (field.nativeType) {
    console.log('✅ NativeType:', JSON.stringify(field.nativeType, null, 2));
  } else {
    console.log('❌ NativeType: Non disponible');
  }

  // Autres métadonnées potentielles
  console.log('Toutes les propriétés:', Object.keys(field));
});

console.log('\n=== PRIMARY KEY ===');
console.log('Primary key:', model.primaryKey);

console.log('\n=== UNIQUE CONSTRAINTS ===');
console.log('Unique indexes:', model.uniqueIndexes);
