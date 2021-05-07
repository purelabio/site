export const PORT     = 53734
export const PROD     = (Deno.env.get('PROD') === 'true') || undefined
export const TARGET   = 'target'
export const STATIC   = 'static'
export const SRV_OPTS = {port: PORT, hostname: 'localhost'}
export const AFR_OPTS = {port: PORT - 1}
export const MAIN_ID  = `main`
export const GEO      = `London / Moscow / Podgorica`
