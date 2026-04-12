export const TRANSLATION_MODES = ['altTranslate', 'annotate', 'translate'] as const
export type TranslationMode = (typeof TRANSLATION_MODES)[number]

export const TRANSLATION_LANGUAGES = {
  az: 'Azərbaycanca',
  be: 'Беларуская',
  bg: 'Български',
  et: 'Eesti',
  ka: 'ქართული',
  kk: 'Қазақша',
  ky: 'Кыргызча',
  lt: 'Lietuvių',
  lv: 'Latviešu',
  mn: 'Монгол',
  ru: 'Русский',
  tg: 'Тоҷикӣ',
  tk: 'Türkmençe',
  uk: 'Українська',
  hy: 'Հայերեն',
  uz: 'oʻzbek',
} as const

export type TranslationLanguage = keyof typeof TRANSLATION_LANGUAGES

export type TranslateRequest = {
  id: number
  type: 'post' | 'comment'
  mode: TranslationMode
  language?: TranslationLanguage
}

export type TranslateResponse = string
