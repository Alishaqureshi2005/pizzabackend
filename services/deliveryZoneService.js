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

  // Find all available zones
  const availableZones = await DeliveryZone.find({ isAvailable: true });

  // Find the zone where location falls into distance range
  const matchingZone = availableZones.find(zone => 
    zone.isLocationInZone(coordinates.latitude, coordinates.longitude)
  );

  return matchingZone || null;
}

/**
 * Get the zone with the highest delivery fee
 * @returns {Promise<DeliveryZone|null>} - Zone with highest fee or null if no zones exist
 */
async function getHighestFeeZone() {
  const zones = await DeliveryZone.find({ isAvailable: true })
    .sort({ baseDeliveryFee: -1 })
    .limit(1);
  return zones[0] || null;
}

/**
 * Calculate delivery charge for given coordinates.
 * @param {Object} coordinates - { latitude: Number, longitude: Number }
 * @returns {Promise<{ zone: DeliveryZone|null, deliveryCharge: Number }>} - Zone and delivery charge
 */
async function calculateDeliveryCharge(coordinates) {
  const zone = await findMatchingDeliveryZone(coordinates);

  if (!zone) {
    // If no matching zone found, use the zone with highest delivery fee
    const highestFeeZone = await getHighestFeeZone();
    if (highestFeeZone) {
      return { 
        zone: highestFeeZone, 
        deliveryCharge: highestFeeZone.baseDeliveryFee,
        isOutOfZone: true 
      };
    }
    return { zone: null, deliveryCharge: 0, isOutOfZone: false };
  }

  const charge = zone.calculateDeliveryFee(coordinates.latitude, coordinates.longitude);
  return { zone, deliveryCharge: charge, isOutOfZone: false };
}

module.exports = {
  findMatchingDeliveryZone,
  calculateDeliveryCharge,
  getHighestFeeZone
};
