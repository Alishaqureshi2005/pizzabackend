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
 * Calculate delivery charge based on distance
 * @param {Object} coordinates - The delivery location coordinates
 * @returns {Object} - Object containing delivery charge, zone info, and out of zone status
 */
const calculateDeliveryCharge = async (coordinates) => {
  try {
    // Get all active delivery zones
    const zones = await DeliveryZone.find({ isActive: true });

    if (!zones || zones.length === 0) {
      throw new Error('No active delivery zones found');
    }

    // Find the zone with the highest delivery fee
    const highestFeeZone = zones.reduce((prev, current) => {
      return (prev.deliveryFee > current.deliveryFee) ? prev : current;
    });

    // For now, we'll use the highest fee zone for all deliveries
    // In the future, you can implement actual distance calculation here
    return {
      deliveryCharge: highestFeeZone.deliveryFee,
      zone: highestFeeZone,
      isOutOfZone: true // Always true since we're using the highest fee
    };
  } catch (error) {
    console.error('Error calculating delivery charge:', error);
    throw error;
  }
};

/**
 * Get all active delivery zones
 * @returns {Array} - Array of active delivery zones
 */
const getAllActiveZones = async () => {
  try {
    return await DeliveryZone.find({ isActive: true });
  } catch (error) {
    console.error('Error fetching active delivery zones:', error);
    throw error;
  }
};

/**
 * Get delivery zone by ID
 * @param {string} zoneId - The ID of the delivery zone
 * @returns {Object} - The delivery zone object
 */
const getZoneById = async (zoneId) => {
  try {
    const zone = await DeliveryZone.findById(zoneId);
    if (!zone) {
      throw new Error('Delivery zone not found');
    }
    return zone;
  } catch (error) {
    console.error('Error fetching delivery zone:', error);
    throw error;
  }
};

module.exports = {
  findMatchingDeliveryZone,
  calculateDeliveryCharge,
  getHighestFeeZone,
  getAllActiveZones,
  getZoneById
};
