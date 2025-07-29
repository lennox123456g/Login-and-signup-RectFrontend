/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string
  readonly VITE_LOCIZE_PROJECTID: string
  readonly VITE_LOCIZE_APIKEY: string
  readonly VITE_LOCIZE_VERSION: string
  // DEV, PROD, SSR are already provided by Vite
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}