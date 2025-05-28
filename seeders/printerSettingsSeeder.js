const PrinterSettings = require('../models/PrinterSettings');

const printerSettings = [
  {
    printerName: 'Kitchen Printer',
    type: 'thermal',
    ipAddress: '192.168.1.100',
    port: 9100,
    isActive: true,
    paperSize: '80mm',
    printCategories: ['pizza', 'pasta', 'sides']
  },
  {
    printerName: 'Bar Printer',
    type: 'thermal',
    ipAddress: '192.168.1.101',
    port: 9100,
    isActive: true,
    paperSize: '80mm',
    printCategories: ['drinks', 'desserts']
  }
];

const importData = async () => {
  try {
    await PrinterSettings.deleteMany({});
    await PrinterSettings.insertMany(printerSettings);
    console.log('Printer Settings Imported!');
  } catch (error) {
    console.error(`Error: ${error.message}`);
    throw error;
  }
};

const destroyData = async () => {
  try {
    await PrinterSettings.deleteMany({});
    console.log('Printer Settings Destroyed!');
  } catch (error) {
    console.error(`Error: ${error.message}`);
    throw error;
  }
};

module.exports = {
  importData,
  destroyData
}; 