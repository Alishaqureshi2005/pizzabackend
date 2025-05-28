const DeliveryZone = require('../models/DeliveryZone');

/**
 * Find the matching delivery zone for given coordinates.
 * @param {Object} coordinates - { latitude: Number, longitude: Number }
 * @returns {Promise<DeliveryZone|null>} - Matching delivery zone or null if none found
 */
async function findMatchingDeliveryZone(coordinates) {
  if (!coordinates || typeof coordinates.latitude !== 'number' || typeof coordinates.longitude !== 'number') {
    throw new Error('Invalid coordinates');
  }

  const location = [coordinates.longitude, coordinates.latitude];

  // Find all available zones
  const availableZones = await DeliveryZone.find({ isAvailable: true });

  // Find the zone where location falls into distance range
  const matchingZone = availableZones.find(zone => zone.isLocationInZone(location));

  return matchingZone || null;
}

/**
 * Calculate delivery charge for given coordinates.
 * @param {Object} coordinates - { latitude: Number, longitude: Number }
 * @returns {Promise<{ zone: DeliveryZone|null, deliveryCharge: Number }>} - Zone and delivery charge
 */
async function calculateDeliveryCharge(coordinates) {
  const zone = await findMatchingDeliveryZone(coordinates);

  if (!zone) {
    return { zone: null, deliveryCharge: 0 };
  }

  const charge = zone.calculateDeliveryCharge([coordinates.longitude, coordinates.latitude]);
  return { zone, deliveryCharge: charge };
}

module.exports = {
  findMatchingDeliveryZone,
  calculateDeliveryCharge
};
