// Script de test pour déboguer la validation
console.log('=== Test de validation ===');

function testGetRequiredFields(targetTable) {
    console.log(`\n🧪 Testing with targetTable: "${targetTable}"`);
    console.log(`Type: ${typeof targetTable}`);
    
    let result = [];
    if (targetTable === 'attribute' || targetTable === 'attribute_dev') {
        result = ['atr_nat', 'atr_val'];
        console.log('✅ Matched attribute tables');
    } else if (targetTable === 'supplier_dev') {
        result = ['sup_code'];
        console.log('✅ Matched supplier_dev');
    } else if (targetTable === 'v_categories_dev') {
        result = ['atr_0_label'];
        console.log('✅ Matched categories');
    } else {
        console.log('❌ No match found');
    }
    
    console.log(`Result: [${result.join(', ')}]`);
    return result;
}

// Test cases
testGetRequiredFields('attribute_dev');
testGetRequiredFields('supplier_dev');
testGetRequiredFields('v_categories_dev');
testGetRequiredFields('supplier_dev '); // avec espace
testGetRequiredFields(' supplier_dev'); // avec espace
console.log('\n=== Tests completed ===');