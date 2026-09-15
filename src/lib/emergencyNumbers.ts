export type EmergencyNumbers = { police: string; medical: string; fire: string; general?: string };

// Keyed by ISO 3166-1 alpha-2 country code. Countries not listed use the
// DEFAULT_EMERGENCY fallback (112 works across the EU and much of the rest
// of the world as a redirect, though it isn't universal).
const EMERGENCY_BY_COUNTRY: Record<string, EmergencyNumbers> = {
  US: { police: "911", medical: "911", fire: "911", general: "911" },
  CA: { police: "911", medical: "911", fire: "911", general: "911" },
  MX: { police: "911", medical: "911", fire: "911", general: "911" },
  GB: { police: "999", medical: "999", fire: "999", general: "999" },
  IE: { police: "112", medical: "112", fire: "112", general: "112" },
  FR: { police: "17", medical: "15", fire: "18", general: "112" },
  DE: { police: "110", medical: "112", fire: "112", general: "112" },
  ES: { police: "091", medical: "112", fire: "112", general: "112" },
  IT: { police: "113", medical: "118", fire: "115", general: "112" },
  PT: { police: "112", medical: "112", fire: "112", general: "112" },
  NL: { police: "112", medical: "112", fire: "112", general: "112" },
  BE: { police: "101", medical: "112", fire: "112", general: "112" },
  CH: { police: "117", medical: "144", fire: "118", general: "112" },
  AT: { police: "133", medical: "144", fire: "122", general: "112" },
  GR: { police: "100", medical: "166", fire: "199", general: "112" },
  SE: { police: "112", medical: "112", fire: "112", general: "112" },
  NO: { police: "112", medical: "113", fire: "110", general: "112" },
  DK: { police: "112", medical: "112", fire: "112", general: "112" },
  FI: { police: "112", medical: "112", fire: "112", general: "112" },
  PL: { police: "997", medical: "999", fire: "998", general: "112" },
  IS: { police: "112", medical: "112", fire: "112", general: "112" },
  JP: { police: "110", medical: "119", fire: "119" },
  CN: { police: "110", medical: "120", fire: "119" },
  KR: { police: "112", medical: "119", fire: "119" },
  TH: { police: "191", medical: "1669", fire: "199" },
  VN: { police: "113", medical: "115", fire: "114" },
  ID: { police: "110", medical: "118", fire: "113", general: "112" },
  PH: { police: "911", medical: "911", fire: "911", general: "911" },
  IN: { police: "100", medical: "102", fire: "101", general: "112" },
  SG: { police: "999", medical: "995", fire: "995" },
  MY: { police: "999", medical: "999", fire: "994", general: "999" },
  AE: { police: "999", medical: "998", fire: "997" },
  TR: { police: "155", medical: "112", fire: "110", general: "112" },
  EG: { police: "122", medical: "123", fire: "180" },
  ZA: { police: "10111", medical: "10177", fire: "10177", general: "112" },
  AU: { police: "000", medical: "000", fire: "000", general: "000" },
  NZ: { police: "111", medical: "111", fire: "111", general: "111" },
  BR: { police: "190", medical: "192", fire: "193" },
  AR: { police: "911", medical: "107", fire: "100", general: "911" },
  CL: { police: "133", medical: "131", fire: "132" },
  PE: { police: "105", medical: "106", fire: "116" },
  CO: { police: "123", medical: "123", fire: "123", general: "123" },
  CR: { police: "911", medical: "911", fire: "911", general: "911" },
  JM: { police: "119", medical: "110", fire: "110" },
  IL: { police: "100", medical: "101", fire: "102" },
  RU: { police: "102", medical: "103", fire: "101", general: "112" },
  MA: { police: "19", medical: "15", fire: "15" },
};

const DEFAULT_EMERGENCY: EmergencyNumbers = {
  police: "112",
  medical: "112",
  fire: "112",
  general: "112",
};

export function emergencyNumbersForCountry(countryCode: string | null): EmergencyNumbers {
  if (!countryCode) return DEFAULT_EMERGENCY;
  return EMERGENCY_BY_COUNTRY[countryCode.toUpperCase()] ?? DEFAULT_EMERGENCY;
}
