//1import i18n from 'i18next'
//1import { initReactI18next } from 'react-i18next'
//1import LanguageDetector from 'i18next-browser-languagedetector'
//1import LocizeBackend from 'i18next-locize-backend'
//1import LastUsed from 'locize-lastused'
//1import { locizePlugin } from 'locize'

//1const isDev = import.meta.env.DEV

//1const locizeOptions = {
//1  projectId: import.meta.env.VITE_LOCIZE_PROJECTID,
//1  apiKey: import.meta.env.VITE_LOCIZE_APIKEY // // YOU should not expose your apps API key to production!!!
//1}

//1if (isDev) {
  // locize-lastused
  // sets a timestamp of last access on every translation segment on locize
  // -> safely remove the ones not being touched for weeks/months
  // https://github.com/locize/locize-lastused
//1  i18n.use(LastUsed)
//1}

//1i18n
  // i18next-locize-backend
  // loads translations from your project, saves new keys to it (saveMissing: true)
  // https://github.com/locize/i18next-locize-backend
//1  .use(LocizeBackend)
  // detect user language
  // learn more: https://github.com/i18next/i18next-browser-languageDetector
//1  .use(LanguageDetector)
  // Bind i18next to React
//1  .use(initReactI18next)
  // InContext Editor of locize
//1  .use(locizePlugin)
  // init i18next
//1  // for all options read: https://www.i18next.com/overview/configuration-options
//1  .init({
//1    debug: isDev, // Enable logging for development
//1    fallbackLng: 'en', // Default language
//1    backend: locizeOptions,
//1    locizeLastUsed: locizeOptions,
//1    saveMissing: isDev // you should not use saveMissing in production
//1  })

//1export default i18n

//localize Project Id 01c30097-06fe-4e37-9e12-6674dc8d10c0
//locize  Project slug 5zoaas1w
//API KEY   cacb42f6-239b-4c47-8a1d-41a11efc7773