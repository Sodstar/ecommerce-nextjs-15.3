export const generateBarcode = () => {
    // Generate EAN-13 barcode
    // First generate 12 random digits (the 13th will be a check digit)
    const randomDigits = Array.from({ length: 12 }, () => 
      Math.floor(Math.random() * 10)
    );
    
    // Calculate check digit (13th digit) using EAN-13 algorithm
    // Multiply each digit by weight (1 or 3) based on position, sum them
    // and calculate what number needs to be added to make it divisible by 10
    let sum = 0;
    for (let i = 0; i < 12; i++) {
      // Even positions get weight 3, odd positions get weight 1
      const weight = i % 2 === 0 ? 1 : 3;
      sum += randomDigits[i] * weight;
    }
    const checkDigit = (10 - (sum % 10)) % 10;
    
    // Add check digit to the barcode
    const fullBarcode = [...randomDigits, checkDigit].join('');
    
    return fullBarcode;
  // Update the state as well
  };