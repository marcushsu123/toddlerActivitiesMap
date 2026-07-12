export const LEEDS_CENTER = { lat: 53.8008, lng: -1.5491 }
export const DEFAULT_ZOOM = 13
export const NEARBY_RADIUS_KM = 20

export const LANGUAGES = [
  { code: 'en', name: 'English',    flag: '🇬🇧' },
  { code: 'ur', name: 'Urdu',       flag: '🇵🇰' },
  { code: 'pl', name: 'Polish',     flag: '🇵🇱' },
  { code: 'ro', name: 'Romanian',   flag: '🇷🇴' },
  { code: 'hi', name: 'Hindi',      flag: '🇮🇳' },
  { code: 'ar', name: 'Arabic',     flag: '🇸🇦' },
  { code: 'fr', name: 'French',     flag: '🇫🇷' },
  { code: 'es', name: 'Spanish',    flag: '🇪🇸' },
  { code: 'zh', name: 'Mandarin',   flag: '🇨🇳' },
  { code: 'de', name: 'German',     flag: '🇩🇪' },
  { code: 'it', name: 'Italian',    flag: '🇮🇹' },
  { code: 'pt', name: 'Portuguese', flag: '🇵🇹' },
]

export const languageFlag = (code) => LANGUAGES.find((l) => l.code === code)?.flag ?? '🌐'

export const AGE_RANGES = [
  { label: 'Baby (0–12m)', min: 0, max: 12 },
  { label: 'Toddler (1–3y)', min: 12, max: 36 },
  { label: 'Pre-school (3–5y)', min: 36, max: 60 },
  { label: 'School age (5–7y)', min: 60, max: 84 },
]
