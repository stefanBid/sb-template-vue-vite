import { useLocalStorage } from '@vueuse/core'
import { watch } from 'vue'
import { createI18n } from 'vue-i18n'

import en from './locales/en.json'
import it from './locales/it.json'

// https://vue-i18n.intlify.dev/guide/advanced/typescript

export type MessageSchema = typeof en

export const SUPPORTED_LOCALES = ['en', 'it'] as const
export type AppLocale = typeof SUPPORTED_LOCALES[number]
export const DEFAULT_LOCALE: AppLocale = 'en'

const _isSupported = (code: string | null | undefined): code is AppLocale =>
  SUPPORTED_LOCALES.includes(code as AppLocale)

// First visit: the first browser language the app supports, else the default
const _detectBrowserLocale = (): AppLocale => {
  const match = navigator.languages
    .map(language => language.split('-')[0])
    .find(_isSupported)
  return match ?? DEFAULT_LOCALE
}

// The user's choice survives reloads; nothing is written until the locale actually changes
const _storedLocale = useLocalStorage<string>('sb-locale', _detectBrowserLocale(), { writeDefaults: false })

export const i18n = createI18n<[MessageSchema], AppLocale, false>({
  legacy: false,
  locale: _isSupported(_storedLocale.value) ? _storedLocale.value : DEFAULT_LOCALE,
  fallbackLocale: DEFAULT_LOCALE,
  messages: { en, it },
})

watch(
  i18n.global.locale,
  (locale) => {
    _storedLocale.value = locale
    document.documentElement.lang = locale
  },
  { immediate: true },
)

declare module 'vue-i18n' {
  // Types the keys accepted by t() / $t() everywhere in the app
  export interface DefineLocaleMessage extends MessageSchema {}
}
