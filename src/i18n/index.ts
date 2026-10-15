import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

import es from './locales/es.json'
import de from './locales/de.json'

void i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      es: { translation: es },
      de: { translation: de },
    },
    fallbackLng: 'es',
    supportedLngs: ['es', 'de'],
    defaultNS: 'translation',
    ns: ['translation'],
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'i18nextLng',
    },
    interpolation: { escapeValue: false },
  })

// Que los lectores de pantalla lean con la fonética del idioma activo.
const syncLang = (lng: string) => document.documentElement.setAttribute('lang', lng.slice(0, 2))
syncLang(i18n.resolvedLanguage ?? 'es')
i18n.on('languageChanged', syncLang)

export default i18n
