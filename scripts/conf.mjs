Error.stackTraceLimit = Infinity

export const SRV_PORT = 53734
export const LIVE_PORT = SRV_PORT - 1
export const PROD     = Deno.env.get(`PROD`) === `true`
export const TARGET   = `target`
export const STATIC   = `static`
export const MAIN_ID  = `main`
export const GEO      = `London / Moscow / Podgorica`
