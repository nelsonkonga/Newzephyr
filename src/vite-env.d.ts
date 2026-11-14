/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL?: string
  readonly VITE_SUPABASE_ANON_KEY?: string
  readonly VITE_MOMO_ENDPOINT?: string
  readonly VITE_MTN_MOMO_NUMBER?: string
  readonly VITE_ORANGE_MONEY_NUMBER?: string
  readonly VITE_CALENDLY_URL?: string
  readonly VITE_META_PIXEL_ID?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
