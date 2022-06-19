import * as a from '@mitranim/js/all.mjs'
import * as p from '@mitranim/js/prax.mjs'
import * as dr from '@mitranim/js/dom_reg.mjs'
import * as ds from '@mitranim/js/dom_shim.mjs'
import * as dg from '@mitranim/js/dom_glob'

dr.Reg.main.setDefiner(dg.customElements)

export const ren = new p.Ren(dg.document).patchProto(dg.glob.Element)
export const E = ren.E
export const S = ren.S

/*
Short for "attributes". Provides shortcuts for element props/attributes.
See examples in `site.mjs`.
*/
export const A = class PropBui extends p.PropBui {
  bgImg(val) {
    val = a.renderLax(val)
    if (val) return this.style({backgroundImage: `url(${val})`})
    return this
  }

  href(val) {
    const self = super.href(val)
    if (/^\w+:/.test(a.laxStr(self.get(`href`)))) return self.tarblan()
    return self
  }

  // Must be called after `.href()`.
  cur(page) {return this.current(a.isSubpath(this.get(`href`), page.urlPath()))}

  current(ok) {return ok ? this.set(`aria-current`, `page`) : this}
}.main

export function MixElem(cls) {return p.MixChild(a.MixNode(cls))}

// TODO generalize in makefile.
export function timing(msg, fun, ...args) {
  a.reqStr(msg)
  a.reqFun(fun)

  console.log(`[${msg}] starting`)
  const t0 = Date.now()

  try {
    return fun(...args)
  }
  finally {
    const t1 = Date.now()
    console.log(`[${msg}] done in ${t1 - t0}ms`)
  }
}

export function funTiming(fun, ...args) {
  return timing(a.show(fun), fun, ...args)
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
  return a.url().setPath(`/images`, path)
}

export function inlineScript(fun) {
  a.reqFun(fun)
  return E.script.chi(`void ${fun.toString()}()`)
}

// Similar to HTML's treatment of text.
export function collapse(val) {
  return a.laxStr(val).replace(/\s+/g, ` `).trim()
}

// Supports only `**` for bold and `_` for italic.`
export function mdToHtml(val) {
  val = a.trim(val)
  val = val.replaceAll(/[*][*]([^*]*)[*][*]/g, wrapBold)
  val = val.replaceAll(/_([^_]*)_/g, wrapItalic)
  return new p.Raw(val)
}

function wrapBold(_, val) {return `<b>${ds.escapeText(val)}</b>`}
function wrapItalic(_, val) {return `<em>${ds.escapeText(val)}</em>`}
