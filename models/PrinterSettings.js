const mongoose = require('mongoose');

const printerSettingsSchema = new mongoose.Schema({
  // Basic Settings - Only these are required
  isEnabled: { 
    type: Boolean, 
    default: true 
  },
  printerName: { 
    type: String, 
    required: true 
  },
  paperWidth: { 
    type: Number, 
    default: 80 
  },

  // Optional Header/Footer
  headerText: { 
    type: String, 
    default: '' 
  },
  footerText: { 
    type: String, 
    default: '' 
  },
  
  // Optional Print Triggers - All default to false, user can enable what they want
  printOnNewOrder: { 
    type: Boolean, 
    default: false 
  },
  printOnOrderUpdate: { 
    type: Boolean, 
    default: false 
  },
  printOnOrderComplete: { 
    type: Boolean, 
    default: false 
  },
  printOnOrderCancel: { 
    type: Boolean, 
    default: false 
  },
  
  // Optional Print Copies - All default to false, user can enable what they want
  printCustomerCopy: { 
    type: Boolean, 
    default: false 
  },
  printKitchenCopy: { 
    type: Boolean, 
    default: false 
  },
  printDeliveryCopy: { 
    type: Boolean, 
    default: false 
  },
  
  // Optional Receipt Content - All default to false, user can enable what they want
  showOrderNumber: { 
    type: Boolean, 
    default: false 
  },
  showTimestamp: { 
    type: Boolean, 
    default: false 
  },
  showCustomerDetails: { 
    type: Boolean, 
    default: false 
  },
  showDeliveryInfo: { 
    type: Boolean, 
    default: false 
  },
  showSpecialInstructions: { 
    type: Boolean, 
    default: false 
  },
  showItemDetails: { 
    type: Boolean, 
    default: false 
  },
  showToppings: { 
    type: Boolean, 
    default: false 
  },
  showPrices: { 
    type: Boolean, 
    default: false 
  },
  showTaxBreakdown: { 
    type: Boolean, 
    default: false 
  },
  showDeliveryFee: { 
    type: Boolean, 
    default: false 
  },
  showTotal: { 
    type: Boolean, 
    default: false 
  },
  
  // Optional Styling Options - All have defaults
  fontSize: { 
    type: String, 
    enum: ['small', 'medium', 'large'], 
    default: 'medium' 
  },
  fontStyle: { 
    type: String, 
    enum: ['normal', 'bold'], 
    default: 'normal' 
  },
  lineSpacing: { 
    type: String, 
    enum: ['compact', 'normal', 'spacious'], 
    default: 'normal' 
  },
  alignment: { 
    type: String, 
    enum: ['left', 'center', 'right'], 
    default: 'left' 
  },
  showBorders: { 
    type: Boolean, 
    default: false 
  },
  showDivider: { 
    type: Boolean, 
    default: false 
  },
  
  // Optional Additional Features - All default to false
  showQRCode: { 
    type: Boolean, 
    default: false 
  },
  qrCodeContent: { 
    type: String, 
    default: '' 
  },
  showBarcode: { 
    type: Boolean, 
    default: false 
  },
  barcodeContent: { 
    type: String, 
    default: '' 
  },
  showLogo: { 
    type: Boolean, 
    default: false 
  },
  logoUrl: { 
    type: String, 
    default: '' 
  },
  
  // Optional Copy-specific Notes - All default to empty
  kitchenCopyNotes: { 
    type: String, 
    default: '' 
  },
  deliveryCopyNotes: { 
    type: String, 
    default: '' 
  },
  customerCopyNotes: { 
    type: String, 
    default: '' 
  },

  // Optional Printer Connection Settings
  printerType: {
    type: String,
    enum: ['usb', 'network', 'cloud'],
    default: 'usb'
  },
  printerIP: {
    type: String,
    default: ''
  },
  printerPort: {
    type: Number,
    default: 9100
  },
  printerModel: {
    type: String,
    default: ''
  },
  printerDriver: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

// Add a method to check if printer is properly configured
printerSettingsSchema.methods.isConfigured = function() {
  return this.printerName && this.isEnabled;
};

// Add a method to get active print triggers
printerSettingsSchema.methods.getActiveTriggers = function() {
  const triggers = [];
  if (this.printOnNewOrder) triggers.push('newOrder');
  if (this.printOnOrderUpdate) triggers.push('orderUpdate');
  if (this.printOnOrderComplete) triggers.push('orderComplete');
  if (this.printOnOrderCancel) triggers.push('orderCancel');
  return triggers;
};

// Add a method to get active print copies
printerSettingsSchema.methods.getActiveCopies = function() {
  const copies = [];
  if (this.printCustomerCopy) copies.push('customer');
  if (this.printKitchenCopy) copies.push('kitchen');
  if (this.printDeliveryCopy) copies.push('delivery');
  return copies;
};

module.exports = mongoose.models.PrinterSettings || mongoose.model('PrinterSettings', printerSettingsSchema); 