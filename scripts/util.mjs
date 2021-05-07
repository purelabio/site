import * as f from 'fpx'
import * as x from 'prax'
import * as es from 'espo'
import * as e from './elem.mjs'

export class Res extends Response {
  constructor(body, init) {
    super(undefined, init)
    es.pubs(this, {body})
  }

  native() {return new Response(this.body, this)}

  get [Symbol.toStringTag]() {return this.constructor.name}
}

export function resHtml(body, init) {
  const res = new Res(body, init)
  res.headers.set('content-type', 'text/html')
  return res
}

export function resErr(err) {
  return new Response(err?.stack || err?.message || `unknown error`, {status: 500})
}

export function resUncache(res) {
  res.headers.set(`cache-control`, `no-store, max-age=0`)
  return res
}

// TODO generalize in makefile.
export function timing(msg, fun, ...args) {
  f.req(msg, f.isStr)
  f.req(fun, f.isFun)

  console.log(`[${msg}] starting`)
  const t0 = Date.now()
  try {
    // eslint-disable-next-line no-invalid-this
    return fun.apply(this, args)
  }
  finally {
    const t1 = Date.now()
    console.log(`[${msg}] done in ${t1 - t0}ms`)
  }
}

export function funTiming(fun, ...args) {
  return timing(f.show(fun), fun, ...args)
}

export function link(href, page) {
  href = f.vac(href)
  return {href, ...cur(href, page), ...blan(href)}
}

const ariaCurrentPage = Object.freeze({ariaCurrent: `page`})

export function cur(link, page) {
  return f.vac(isCur(link, page)) && ariaCurrentPage
}

// Semi-placeholder. Inefficient but not our bottleneck.
function isCur(link, page) {
  const one = new URL(f.str(link),       `file:`)
  const two = new URL(f.str(page?.link), `file:`)

  return (
    one.origin   === two.origin &&
    one.pathname === two.pathname
  )
}

export function strMarker(val) {return val ? '' : undefined}

export function spaced(...nodes) {return inter(nodes, ' ')}

export function inter(vals, sep) {
  const out = []
  for (const val of vals) out.push(val, sep)
  out.pop()
  return out
}

/*
TODO:

  * Validate that image exists.
  * If the image hasn't already been processed, process it.

Image processing:

  * Raster: enforce maximum width/height; downscale to specified width/height;
    if possible to upscale with high quality, upscale to specified width/height.
  * Vector: consider https://github.com/RazrFalcon/svgcleaner.
*/
export function imgPath(path) {
  return f.vac(path && pathJoin(`images/`, path))
}

// Semi-placeholder.
export function pathJoin(...vals) {
  return f.fold(vals, undefined, urlAppend)?.pathname
}

export function urlAppend(base, val) {
  if (f.isNil(val)) return base
  f.req(val, isStringer)
  return new URL(val, base || `file:`)
}

export function bgImg(url) {
  url = f.str(url)
  return f.vac(url && {backgroundImage: `url(${JSON.stringify(url)})`})
}

export const ablan = Object.freeze({
  target: `_blank`,
  rel: `noopener noreferrer`,
})

export function blan(href) {
  return f.vac(/^\w+:/.test(f.str(href)) && ablan)
}

export function inlineScript(props, fun) {
  f.req(fun, f.isFun)
  return x.E(`script`, props, new x.Raw(`void ${fun.toString()}()`))
}

// Adapted from `prax`.` Should be moved to `fpx`, possibly with some redesign.
export function isStringer(val) {
  if (f.isNil(val)) return false
  if (f.isPrim(val)) return true
  if (f.isFun(val)) return false

  const {toString} = val

  return (
    toString !== Object.prototype.toString &&
    toString !== Array.prototype.toString
  )
}

// Similar to HTML's treatment of text.
export function collapse(val) {
  return f.str(val).replace(/\s+/g, ' ').trim()
}

// Supports only `**` for bold and `_` for italic.`
export function mdToHtml(val) {
  val = f.str(val).trim()
  val = val.replaceAll(/[*][*]([^*]*)[*][*]/g, wrapBold)
  val = val.replaceAll(/_([^_]*)_/g, wrapItalic)
  return new x.Raw(val)
}

function wrapBold(_, val) {return e.bv(val)}
function wrapItalic(_, val) {return e.emv(val)}
