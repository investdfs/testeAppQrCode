export enum AppView {
  HOME = 'HOME',
  SCANNER = 'SCANNER',
  RESULT = 'RESULT',
  HISTORY = 'HISTORY'
}

export interface ScanResult {
  text: string;
  format: string;
  timestamp: number;
}

// Native BarcodeDetector API types
export interface BarcodeDetectorOptions {
  formats?: string[];
}

export interface DetectedBarcode {
  rawValue: string;
  format: string;
  boundingBox: DOMRectReadOnly;
}
