import * as f from 'fpx'
import * as x from 'prax'
import {E} from 'prax'
import * as a from 'afr'
import * as c from './conf.mjs'
import * as u from './util.mjs'
import * as e from './elem.mjs'
import * as inl from './inline.mjs'

export function Html({page, site, theme}, ...children) {
  return x.doc(
    e.htmlv(
      e.headv(
        e.meta({charset:   `utf-8`}),
        e.meta({httpEquiv: `X-UA-Compatible`, content: `IE=edge,chrome=1`}),
        e.meta({name:      `viewport`,        content: `width=device-width, minimum-scale=1, maximum-scale=2, initial-scale=1, user-scalable=yes`}),
        e.link({rel:       `icon`,            href:    `data:;base64,=`}),
        e.meta({name:      `description`,     content: page.desc || `about:purelab`}),
        e.link({rel:       `stylesheet`,      type:    `text/css`, href: `/styles/main.css`}),
        e.meta({name:      `author`,          content: `Purelab.io`}),
        e.titlev(page.title || `about:purelab`),
        f.vac(!c.PROD) && e.script({type: `module`, src: a.clientPath(c.AFR_OPTS)}),
        swScript(),
        u.inlineScript({}, inl.head),
      ),
      e.bodyv(
        SkipToContent(),
        Header(page, site, theme),
        children,
        e.div({class: `mar-top-4`}),
        Footer(page, site),
      ),
    )
  )
}

function swScript() {
  const browserScriptUsesLibs = false
  if (!browserScriptUsesLibs) return null

  return e.scriptv(new x.Raw(`navigator.serviceWorker.register('/sw.mjs')`))
}

function Header(page, site, theme) {
  return E(
    `a-nav`,
    {id: `top`, role: `header`, class: x.cls(`navbar`, theme)},
    LogoLink(),
    e.span({class: `strut`}),
    f.map(site.main, ({link, title}) => (
      A({page, href: link, class: `navlink`}, title)
    )),
    A({page, href: `/start`, class: `navlink-btn`}, `Start a project`),
  )
}

function Footer(page, site, {class: cls, ...props} = {}) {
  return e.footer(
    {class: x.cls(`footer`, cls), ...props},
    e.div({class: `footer-track`},
      e.div({class: `footer-cell`}, LogoLink()),
      e.div({class: `footer-cell flex col-sta-sta gap-ver-1`},
        f.map(site.main, ({link, title}) => (
          A({page, href: link, class: `decolink`}, title)
        )),
      ),
      e.div({class: `footer-cell flex col-sta-end gap-ver-1 text-right`},
        A({page, href: `mailto:info@purelab.io`, class: `decolink`}, `info@purelab.io`),
        A({page, href: `tel:+7-123-456-78-90`}, `+7-123-456-78-90`),
      ),
    ),
    e.hr({class: `hr`}),
    e.div({class: `footer-track`},
      e.div({class: `footer-cell`}),
      e.div({class: `footer-cell flex row gap-hor-1`},
        A({page, href: ``, class: `decolink flex row-cen-cen`}, `LinkedIn`),
        A({page, href: ``, class: `decolink flex row-cen-cen`}, `GitHub`),
        A({page, href: ``, class: `decolink flex row-cen-cen`}, `Facebook`),
        A({page, href: ``, class: `decolink flex row-cen-cen`}, `Instagram`)
      ),
      e.div({class: `footer-cell text-right`},
        e.spanv(`© Purelab.io ${c.GEO}`),
      ),
    ),
  )
}

/*
Disabled for now. Known issues:

  * Doesn't interact well with sticky header.
  * Not properly tested with assistive tech.
  * Index page has main ID in the wrong place.
*/
function SkipToContent() {
  return undefined

  // return e.a(
  //   {
  //     href: c.MAIN_ID,
  //     class: `skip-to-content`,
  //     onclick: `event.preventDefault(); if (document.getElementById('main')) {document.getElementById('main').scrollIntoView()}`,
  //   },
  //   `Skip to content`,
  // )
}

export function Main(...children) {
  return e.main({id: c.MAIN_ID, class: `gap-ver-4`}, children)
}

export function Inner(...children) {
  return e.div({class: `page-inner gap-ver-2-to-4`}, children)
}

export function GridImg(src) {
  const img = Img({src})
  return img && e.span({class: `pad-4`}, img)
}

export function Jumbo({theme, title, sub, desc}) {
  return (
    e.div({class: theme},
      title && e.h1({class: `jumbo-title`}, title),
      sub && e.p({class: `jumbo-sub`}, sub),
      desc && e.p({class: `jumbo-desc`}, desc),
    )
  )
}

export function Img({src, ...props}) {
  src = f.str(src)
  return f.vac(src) && e.img({src, is: `a-img`, ...props})
}

export function LogoLink() {
  return e.a({href: `/`, class: `brand-logo-link`}, `<pure:lab>`)
}

// TODO: sync-up with design.
export function Showcase({title, desc, href, img}) {
  return e.div({class: `showcase`},
    e.div({class: `showcase-info`},
      e.h2v(title),
      e.p({style: {marginTop: `auto`}}, desc),
      f.vac(href) && A({href, class: `decolink`}, href),
    ),
    AspectRatio(
      {tagName: `a`, ...u.link(href), class: `showcase-img`},
      Img({src: img}),
    ),
  )
}

export function A({page, href, ...props}, ...children) {
  return e.a({...props, ...u.link(href, page)}, children)
}

/*
Unlike the "padding-bottom" trick, this doesn't require "position: absolute" for
children. Sources:

  * https://codeburst.io/keeping-aspect-ratio-with-html-and-no-padding-tricks-40705656808b
  * https://stackoverflow.com/a/53245657/1882154

The new CSS property `aspect-ratio` provides a better solution, but is
unsupported in Safari <= 14.
*/
export function AspectRatio(
  {ratio: [hor, ver] = [], tagName, class: cls, ...props},
  ...children
) {
  hor = f.nat(hor) || 16
  ver = f.nat(ver) || 9

  return E(
    tagName || `div`,
    {class: x.cls(`aspect-ratio`, cls), ...props},
    E(`svg`, {viewBox: `0 0 ${hor} ${ver}`}),
    children,
  )
}
