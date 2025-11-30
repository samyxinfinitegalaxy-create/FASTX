export enum PrintColor {
  BlackAndWhite = 'B&W',
  Color = 'Color'
}

export enum PaperType {
  Standard = 'Standard (80gsm)',
  Premium = 'Premium (100gsm)',
  Cardstock = 'Cardstock (200gsm)',
  Glossy = 'Glossy Photo'
}

export enum BindingType {
  None = 'No Binding',
  Staple = 'Staple (Corner)',
  Spiral = 'Spiral Binding',
  Thermal = 'Thermal Binding'
}

export enum PaperSize {
  A4 = 'A4',
  A3 = 'A3',
  Legal = 'Legal'
}

export enum DeliveryMode {
  Pickup = 'Store Pickup',
  Delivery = 'Home Delivery'
}

export interface PrintSettings {
  copies: number;
  pagesPerCopy: number;
  doubleSided: boolean;
  colorMode: PrintColor;
  paperType: PaperType;
  binding: BindingType;
  paperSize: PaperSize;
  deliveryMode: DeliveryMode;
  isExpress: boolean;
  specialInstructions: string;
}

export interface UploadedFile {
  id: string;
  name: string;
  size: number;
  previewUrl: string | null;
  base64Data: string; // For Gemini analysis
  analysis?: string; // Gemini suggestion
}

export interface Order {
  id: string;
  files: UploadedFile[];
  settings: PrintSettings;
  totalCost: number;
  status: 'pending' | 'processing' | 'paid' | 'completed';
}