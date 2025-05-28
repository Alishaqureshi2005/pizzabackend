const mongoose = require('mongoose');
const colors = require('colors');
const { importData: importCategories } = require('./categorySeeder');
const { importData: importUsers, destroyData: destroyUsers } = require('./userSeeder');
const { importData: importProducts, destroyData: destroyProducts } = require('./productSeeder');
const { importData: importToppings, destroyData: destroyToppings } = require('./toppingSeeder');
const { importData: importExtraItems, destroyData: destroyExtraItems } = require('./extraItemSeeder');
const { importData: importOrders, destroyData: destroyOrders } = require('./orderSeeder');

const destroyAll = async () => {
  try {
    console.log('Destroying all data...'.yellow);
    await destroyOrders();
    await destroyExtraItems();
    await destroyToppings();
    await destroyProducts();
    await destroyUsers();
    console.log('All data destroyed successfully!'.green.inverse);
  } catch (error) {
    console.error(`Error destroying data: ${error.message}`.red.underline.bold);
    process.exit(1);
  }
};

const importAll = async () => {
  try {
    console.log('Importing all data...'.yellow);
    await importCategories();
    await importUsers();
    await importProducts();
    await importToppings();
    await importExtraItems();
    await importOrders();
    console.log('All data imported successfully!'.green.inverse);
  } catch (error) {
    console.error(`Error importing data: ${error.message}`.red.underline.bold);
    process.exit(1);
  }
};

const seed = async () => {
  try {
    await destroyAll();
    await importAll();
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`.red.underline.bold);
    process.exit(1);
  }
};

seed(); 