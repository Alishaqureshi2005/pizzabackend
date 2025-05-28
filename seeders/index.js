const { connectDB, closeDB } = require('./db');
const userSeeder = require('./userSeeder');
const categorySeeder = require('./categorySeeder');
const productSeeder = require('./productSeeder');
const toppingSeeder = require('./toppingSeeder');
const extraItemSeeder = require('./extraItemSeeder');
const deliveryZoneSeeder = require('./deliveryZoneSeeder');
const deliveryAreaSeeder = require('./deliveryAreaSeeder');
const deliveryAddressSeeder = require('./deliveryAddressSeeder');
const printerSettingsSeeder = require('./printerSettingsSeeder');
const menuSeeder = require('./menuSeeder');

const importData = async () => {
  try {
    // Connect to database
    await connectDB();
    console.log('Connected to database');

    // First seed independent data
    console.log('\nSeeding users...');
    await userSeeder.importData();
    
    console.log('\nSeeding categories...');
    await categorySeeder.importData();
    
    console.log('\nSeeding delivery zones...');
    await deliveryZoneSeeder.importData();

    // Then seed dependent data
    console.log('\nSeeding products...');
    await productSeeder.importData();
    
    console.log('\nSeeding toppings...');
    await toppingSeeder.importData();
    
    console.log('\nSeeding extra items...');
    await extraItemSeeder.importData();
    
    console.log('\nSeeding delivery areas...');
    await deliveryAreaSeeder.importData();
    
    console.log('\nSeeding delivery addresses...');
    await deliveryAddressSeeder.importData();
    
    console.log('\nSeeding printer settings...');
    await printerSettingsSeeder.importData();
    
    console.log('\nSeeding menu items...');
    await menuSeeder.importData();

    console.log('\nAll data imported successfully!');
  } catch (error) {
    console.error('\nError:', error.message);
    process.exit(1);
  } finally {
    await closeDB();
  }
};

const destroyData = async () => {
  try {
    // Connect to database
    await connectDB();
    console.log('Connected to database');

    // Destroy in reverse order of dependencies
    console.log('\nDestroying menu items...');
    await menuSeeder.destroyData();
    
    console.log('\nDestroying printer settings...');
    await printerSettingsSeeder.destroyData();
    
    console.log('\nDestroying delivery addresses...');
    await deliveryAddressSeeder.destroyData();
    
    console.log('\nDestroying delivery areas...');
    await deliveryAreaSeeder.destroyData();
    
    console.log('\nDestroying extra items...');
    await extraItemSeeder.destroyData();
    
    console.log('\nDestroying toppings...');
    await toppingSeeder.destroyData();
    
    console.log('\nDestroying products...');
    await productSeeder.destroyData();
    
    console.log('\nDestroying delivery zones...');
    await deliveryZoneSeeder.destroyData();
    
    console.log('\nDestroying categories...');
    await categorySeeder.destroyData();
    
    console.log('\nDestroying users...');
    await userSeeder.destroyData();

    console.log('\nAll data destroyed successfully!');
  } catch (error) {
    console.error('\nError:', error.message);
    process.exit(1);
  } finally {
    await closeDB();
  }
};

// Handle command line arguments
if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
} 