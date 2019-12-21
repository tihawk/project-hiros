import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import detector from 'i18next-browser-languagedetector'
import backend from 'i18next-xhr-backend'
import en from '../../public/locales/en.json'
import bg from '../../public/locales/bg.json'
import de from '../../public/locales/de.json'

const resources = {
  en: {
    translation: en
  },
  bg: {
    translation: bg
  },
  de: {
    translation: de
  }
}

const init = () => {
  i18n
    .use(detector)
    .use(initReactI18next) // passes i18n down to react-i18next
    .use(backend)
    .init({
      resources,
      lng: 'en',
      fallbackLng: 'en',

      interpolation: {
        escapeValue: false
      }
    })
}

export default init()
