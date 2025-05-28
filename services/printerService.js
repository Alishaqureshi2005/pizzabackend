const { ThermalPrinter, PrinterTypes, CharacterSet } = require('node-thermal-printer');
const printerConfig = require('../config/printer');
const logger = require('../utils/logger');

class PrinterService {
  constructor() {
    this.printer = null;
    this.settings = { ...printerConfig.defaultSettings };
  }

  async connect(settings = {}) {
    try {
      this.settings = { ...this.settings, ...settings };
      
      // Validate printer model
      const model = printerConfig.supportedModels.find(m => m.name === this.settings.model);
      if (!model) {
        throw new Error(printerConfig.errorMessages.UNSUPPORTED_MODEL);
      }

      // Initialize printer
      this.printer = new ThermalPrinter({
        type: PrinterTypes.EPSON,
        interface: this.settings.type,
        options: {
          host: this.settings.ip,
          port: this.settings.port
        },
        width: model.width,
        characterSet: CharacterSet[this.settings.characterSet],
        removeSpecialCharacters: this.settings.removeSpecialCharacters,
        lineSpacing: this.settings.lineSpacing
      });

      // Test connection
      const isConnected = await this.printer.isPrinterConnected();
      if (!isConnected) {
        throw new Error(printerConfig.errorMessages.PRINTER_OFFLINE);
      }

      return true;
    } catch (error) {
      logger.error('Printer connection error:', error);
      throw new Error(printerConfig.errorMessages.CONNECTION_ERROR);
    }
  }

  async printOrder(order, template = 'customerReceipt') {
    try {
      if (!this.printer) {
        await this.connect();
      }

      const printTemplate = printerConfig.templates[template];
      if (!printTemplate) {
        throw new Error(printerConfig.errorMessages.INVALID_TEMPLATE);
      }

      // Print header
      for (const line of printTemplate.header) {
        await this.printLine(line);
      }

      // Print order details
      await this.printOrderDetails(order);

      // Print footer
      for (const line of printTemplate.footer) {
        await this.printLine(this.replacePlaceholders(line, order));
      }

      // Cut paper
      await this.printer.cut();
      
      return true;
    } catch (error) {
      logger.error('Print order error:', error);
      throw new Error(printerConfig.errorMessages.PRINT_FAILED);
    }
  }

  async printOrderDetails(order) {
    // Order number and date
    await this.printer.alignLeft();
    await this.printer.bold(true);
    await this.printer.println(`Order #: ${order.orderNumber}`);
    await this.printer.println(`Date: ${new Date(order.createdAt).toLocaleString()}`);
    await this.printer.bold(false);
    await this.printer.println('');

    // Customer details
    await this.printer.println('Customer Details:');
    await this.printer.println(`Name: ${order.customer.name}`);
    await this.printer.println(`Phone: ${order.customer.phone}`);
    if (order.deliveryAddress) {
      await this.printer.println(`Address: ${order.deliveryAddress}`);
    }
    await this.printer.println('');

    // Order items
    await this.printer.println('Order Items:');
    for (const item of order.items) {
      await this.printer.println(`${item.quantity}x ${item.name}`);
      if (item.customization) {
        await this.printer.println(`  Size: ${item.customization.size.name}`);
        await this.printer.println(`  Crust: ${item.customization.crust.name}`);
        if (item.customization.toppings.length > 0) {
          await this.printer.println('  Toppings:');
          for (const topping of item.customization.toppings) {
            await this.printer.println(`    - ${topping.name}`);
          }
        }
      }
      await this.printer.println(`  Price: $${item.subtotal.toFixed(2)}`);
      await this.printer.println('');
    }

    // Order totals
    await this.printer.alignRight();
    await this.printer.println(`Subtotal: $${order.subtotal.toFixed(2)}`);
    await this.printer.println(`Tax: $${order.tax.toFixed(2)}`);
    if (order.deliveryFee) {
      await this.printer.println(`Delivery Fee: $${order.deliveryFee.toFixed(2)}`);
    }
    await this.printer.bold(true);
    await this.printer.println(`Total: $${order.total.toFixed(2)}`);
    await this.printer.bold(false);
  }

  async printLine(line) {
    if (line.align) {
      await this.printer[`align${line.align.charAt(0).toUpperCase() + line.align.slice(1)}`]();
    }
    if (line.bold) {
      await this.printer.bold(true);
    }
    await this.printer.println(line.value);
    if (line.bold) {
      await this.printer.bold(false);
    }
  }

  replacePlaceholders(line, order) {
    let value = line.value;
    const placeholders = {
      orderTime: new Date(order.createdAt).toLocaleString(),
      driverName: order.driver?.name || 'Not Assigned',
      // Add more placeholders as needed
    };

    for (const [key, val] of Object.entries(placeholders)) {
      value = value.replace(`{${key}}`, val);
    }

    return { ...line, value };
  }

  async printTest() {
    try {
      if (!this.printer) {
        await this.connect();
      }

      await this.printer.alignCenter();
      await this.printer.bold(true);
      await this.printer.println('PRINTER TEST PAGE');
      await this.printer.bold(false);
      await this.printer.println('');

      await this.printer.alignLeft();
      await this.printer.println('Printer Settings:');
      await this.printer.println(`Model: ${this.settings.model}`);
      await this.printer.println(`Type: ${this.settings.type}`);
      await this.printer.println(`IP: ${this.settings.ip}`);
      await this.printer.println(`Port: ${this.settings.port}`);
      await this.printer.println('');

      await this.printer.println('Test Patterns:');
      await this.printer.println('--------------------------------');
      await this.printer.println('ABCDEFGHIJKLMNOPQRSTUVWXYZ');
      await this.printer.println('abcdefghijklmnopqrstuvwxyz');
      await this.printer.println('0123456789');
      await this.printer.println('!@#$%^&*()_+-=[]{}|;:,.<>?');
      await this.printer.println('--------------------------------');

      await this.printer.cut();
      return true;
    } catch (error) {
      logger.error('Print test error:', error);
      throw new Error(printerConfig.errorMessages.PRINT_FAILED);
    }
  }
}

module.exports = new PrinterService(); 