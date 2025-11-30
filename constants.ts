import { BindingType, PaperSize, PaperType, PrintColor } from "./types";

export const PRICING = {
  [PrintColor.BlackAndWhite]: 3.00, // ₹3 per page base
  [PrintColor.Color]: 12.00,        // ₹12 per page base
  [PaperType.Standard]: 0.00,
  [PaperType.Premium]: 2.00,        // +₹2
  [PaperType.Cardstock]: 6.00,      // +₹6
  [PaperType.Glossy]: 10.00,        // +₹10
  [BindingType.None]: 0.00,
  [BindingType.Staple]: 5.00,       // ₹5 binding
  [BindingType.Spiral]: 45.00,      // ₹45 binding
  [BindingType.Thermal]: 80.00,     // ₹80 binding
};

export const SIZE_MULTIPLIERS = {
  [PaperSize.A4]: 1.0,
  [PaperSize.Legal]: 1.2,
  [PaperSize.A3]: 2.0, // A3 costs double per page
};

export const DELIVERY_FEE = 40.00; // Flat ₹40 for delivery
export const EXPRESS_FEE_PERCENTAGE = 0.20; // 20% extra for rush orders

export const MOCK_API_DELAY = 2000; // ms

// ---------------------------------------------------------
// PAYMENT GATEWAY CONFIGURATION
// ---------------------------------------------------------
// INSTRUCTION: Replace 'your-username@fam' with your actual FamPay UPI ID.
// Example: 'john.doe@fam'
export const PAYMENT_CONFIG = {
  upiId: '6385446952@fam', 
  payeeName: 'AMUDHANX'
};