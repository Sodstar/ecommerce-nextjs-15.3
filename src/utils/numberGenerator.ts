// filepath: /Users/sodstar/development/web/frontend/mountain-pos/src/utils/numberGenerator.ts

/**
 * Generates a unique delivery number with the format DEL-YYYYMMDD-XXXXX
 * where YYYYMMDD is the current date and XXXXX is a random 5-digit number
 * @returns {string} A unique delivery number
 */
export function generateDeliveryNumber(prefix: string): string {
  // Get current date in YYYYMMDD format
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const dateStr = `${year}${month}${day}`;

  // Generate random 5-digit number
  const randomDigits = Math.floor(1000 + Math.random() * 9000);

  // Combine parts to create the delivery number
  return `${prefix}-${dateStr}-${randomDigits}`;
}

/**
 * Validates if a given string is a valid delivery number format
 * @param {string} deliveryNumber - The delivery number to validate
 * @returns {boolean} Whether the delivery number is valid
 */
export function isValidDeliveryNumber(deliveryNumber: string): boolean {
  // Regex pattern for DEL-YYYYMMDD-XXXXX format
  const pattern = /^D-\d{8}-\d{4}$/;
  return pattern.test(deliveryNumber);
}