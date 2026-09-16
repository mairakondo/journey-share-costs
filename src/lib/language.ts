export type Language = { code: string; name: string; locale: string };

const ENGLISH: Language = { code: "en", name: "English", locale: "en-US" };

// Keyed by ISO 3166-1 alpha-2 country code. `code` is a MyMemory/Google
// translate language code; `locale` is a BCP-47 tag for speechSynthesis
// voice selection. Countries not listed fall back to English (no-op
// translation, since we can't guess a language confidently).
const LANGUAGE_BY_COUNTRY: Record<string, Language> = {
  JP: { code: "ja", name: "Japanese", locale: "ja-JP" },
  KR: { code: "ko", name: "Korean", locale: "ko-KR" },
  CN: { code: "zh-CN", name: "Chinese", locale: "zh-CN" },
  TW: { code: "zh-TW", name: "Chinese (Traditional)", locale: "zh-TW" },
  TH: { code: "th", name: "Thai", locale: "th-TH" },
  VN: { code: "vi", name: "Vietnamese", locale: "vi-VN" },
  ID: { code: "id", name: "Indonesian", locale: "id-ID" },
  MY: { code: "ms", name: "Malay", locale: "ms-MY" },
  PH: { code: "tl", name: "Filipino", locale: "fil-PH" },
  IN: { code: "hi", name: "Hindi", locale: "hi-IN" },
  FR: { code: "fr", name: "French", locale: "fr-FR" },
  BE: { code: "fr", name: "French", locale: "fr-BE" },
  DE: { code: "de", name: "German", locale: "de-DE" },
  AT: { code: "de", name: "German", locale: "de-AT" },
  CH: { code: "de", name: "German", locale: "de-CH" },
  ES: { code: "es", name: "Spanish", locale: "es-ES" },
  MX: { code: "es", name: "Spanish", locale: "es-MX" },
  AR: { code: "es", name: "Spanish", locale: "es-AR" },
  CO: { code: "es", name: "Spanish", locale: "es-CO" },
  CL: { code: "es", name: "Spanish", locale: "es-CL" },
  PE: { code: "es", name: "Spanish", locale: "es-PE" },
  CR: { code: "es", name: "Spanish", locale: "es-CR" },
  IT: { code: "it", name: "Italian", locale: "it-IT" },
  PT: { code: "pt", name: "Portuguese", locale: "pt-PT" },
  BR: { code: "pt", name: "Portuguese", locale: "pt-BR" },
  NL: { code: "nl", name: "Dutch", locale: "nl-NL" },
  SE: { code: "sv", name: "Swedish", locale: "sv-SE" },
  NO: { code: "no", name: "Norwegian", locale: "nb-NO" },
  DK: { code: "da", name: "Danish", locale: "da-DK" },
  FI: { code: "fi", name: "Finnish", locale: "fi-FI" },
  IS: { code: "is", name: "Icelandic", locale: "is-IS" },
  PL: { code: "pl", name: "Polish", locale: "pl-PL" },
  GR: { code: "el", name: "Greek", locale: "el-GR" },
  TR: { code: "tr", name: "Turkish", locale: "tr-TR" },
  RU: { code: "ru", name: "Russian", locale: "ru-RU" },
  EG: { code: "ar", name: "Arabic", locale: "ar-EG" },
  MA: { code: "ar", name: "Arabic", locale: "ar-MA" },
  AE: { code: "ar", name: "Arabic", locale: "ar-AE" },
  IL: { code: "he", name: "Hebrew", locale: "he-IL" },
  ZA: { code: "en", name: "English", locale: "en-ZA" },
  GB: ENGLISH,
  IE: ENGLISH,
  US: ENGLISH,
  CA: ENGLISH,
  AU: ENGLISH,
  NZ: ENGLISH,
};

export function languageForCountry(countryCode: string | null): Language {
  if (!countryCode) return ENGLISH;
  return LANGUAGE_BY_COUNTRY[countryCode.toUpperCase()] ?? ENGLISH;
}
