const printerConfig = {
  // Default printer settings
  defaultSettings: {
    type: 'network', // 'network', 'usb', 'serial'
    ip: '192.168.1.100',
    port: 9100,
    model: 'TM-T88V',
    width: 48, // characters per line
    characterSet: 'PC437_USA',
    removeSpecialCharacters: true,
    lineSpacing: 1,
    encoding: 'CP437'
  },

  // Supported printer models
  supportedModels: [
    {
      name: 'TM-T88V',
      width: 48,
      characterSets: ['PC437_USA', 'PC850_MULTILINGUAL', 'PC860_PORTUGUESE'],
      features: ['cut', 'openDrawer', 'barcode', 'qrCode']
    },
    {
      name: 'TM-T20',
      width: 42,
      characterSets: ['PC437_USA', 'PC850_MULTILINGUAL'],
      features: ['cut', 'openDrawer']
    }
  ],

  // Print templates
  templates: {
    customerReceipt: {
      header: [
        { type: 'text', value: 'PIZZA HOUSE', align: 'center', bold: true },
        { type: 'text', value: '123 Main Street', align: 'center' },
        { type: 'text', value: 'Phone: (555) 123-4567', align: 'center' },
        { type: 'text', value: '--------------------------------', align: 'center' }
      ],
      footer: [
        { type: 'text', value: '--------------------------------', align: 'center' },
        { type: 'text', value: 'Thank you for your order!', align: 'center' },
        { type: 'text', value: 'Please come again', align: 'center' }
      ]
    },
    kitchenOrder: {
      header: [
        { type: 'text', value: 'KITCHEN ORDER', align: 'center', bold: true },
        { type: 'text', value: '--------------------------------', align: 'center' }
      ],
      footer: [
        { type: 'text', value: '--------------------------------', align: 'center' },
        { type: 'text', value: 'Order Time: {orderTime}', align: 'left' }
      ]
    },
    deliverySlip: {
      header: [
        { type: 'text', value: 'DELIVERY SLIP', align: 'center', bold: true },
        { type: 'text', value: '--------------------------------', align: 'center' }
      ],
      footer: [
        { type: 'text', value: '--------------------------------', align: 'center' },
        { type: 'text', value: 'Driver: {driverName}', align: 'left' }
      ]
    }
  },

  // Error messages
  errorMessages: {
    PRINTER_OFFLINE: 'Printer is offline. Please check connection.',
    PAPER_OUT: 'Printer is out of paper.',
    CONNECTION_ERROR: 'Could not connect to printer.',
    INVALID_SETTINGS: 'Invalid printer settings.',
    PRINT_FAILED: 'Failed to print. Please try again.',
    UNSUPPORTED_MODEL: 'Unsupported printer model.',
    INVALID_TEMPLATE: 'Invalid print template.'
  }
};

module.exports = printerConfig; 