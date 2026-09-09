export type Language = 'mr' | 'hi' | 'en';

export type AppMode = 'farmer' | 'lab' | 'govt' | 'fusion' | 'hardware';

export interface SensorTelemetry {
  airTemp: number;         // °C
  humidity: number;        // %
  soilN: number;           // mg/kg
  soilP: number;           // mg/kg
  soilK: number;           // mg/kg
  soilMoisture: number;    // %
  soilPh: number;          // 0-14
  vpd: number;             // kPa (Vapor Pressure Deficit)
  batteryLevel: number;    // %
  solarCharging: boolean;
  timestamp: string;
}

export type SpectralBand = 'rgb' | 'nir' | 'ndvi' | 'ndre';

export interface CropScenario {
  id: string;
  cropName: string;
  cropNameMr: string;
  cropNameHi: string;
  diagnosis: string;
  diagnosisMr: string;
  diagnosisHi: string;
  category: 'disease' | 'pest' | 'nutrient_deficiency' | 'healthy';
  confidence: number;       // e.g. 96.2
  severityPercent: number;  // 0-100%
  earlyWarningDays: number; // e.g. 3 days before visible symptoms
  ndviScore: number;        // -1.0 to 1.0
  ndreScore: number;        // -1.0 to 1.0
  visionStressScore: number; // 0-100
  climateRiskScore: number;  // 0-100
  soilNutrientScore: number; // 0-100
  defaultTelemetry: SensorTelemetry;
  symptomSummary: {
    en: string;
    mr: string;
    hi: string;
  };
  disambiguationNote: {
    en: string;
    mr: string;
    hi: string;
  };
  ipmAdvice: {
    cultural: { en: string; mr: string; hi: string };
    biological: { en: string; mr: string; hi: string };
    chemical: {
      activeIngredient: string;
      commercialBrand: string;
      dosePer15LPump: string;
      dosePerAcre: string;
      cibrcApproved: boolean;
      waitingPeriodDays: number;
    };
  };
  spectralDetails: {
    rgbDescription: string;
    nirDescription: string;
    ndviDescription: string;
    ndreDescription: string;
  };
}

export interface OutbreakCluster {
  id: string;
  taluka: string;
  district: string;
  crop: string;
  threat: string;
  threatMr: string;
  riskLevel: 'Low' | 'Moderate' | 'Critical';
  casesReported: number;
  lat: number;
  lng: number;
  etlExceeded: boolean;
  advisorySent: boolean;
  lastUpdated: string;
}

export interface VoiceQueryItem {
  id: string;
  query: { en: string; mr: string; hi: string };
  answer: { en: string; mr: string; hi: string };
  actionAudio: string;
}
