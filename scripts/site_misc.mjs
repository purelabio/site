import * as a from '@mitranim/js/all.mjs'
import * as p from '@mitranim/js/prax.mjs'
import * as c from './conf.mjs'
import {A, E, S} from './util.mjs'
import * as u from './util.mjs'
import * as inl from './inline.mjs'

export function Html(page, ...chi) {
  return p.renderDocument(
    E.html.chi(
      E.head.chi(
        E.meta.props(A.charset(`utf-8`)),
        E.meta.props(A.httpEquiv(`X-UA-Compatible`).content(`IE=edge,chrome=1`)),
        E.meta.props(A.name(`viewport`).content(`width=device-width, minimum-scale=1, maximum-scale=2, initial-scale=1, user-scalable=yes`)),
        E.link.props(A.rel(`icon`).href(`data:;base64,=`)),
        E.meta.props(A.name(`author`).content(`Purelab.io`)),
        E.meta.props(A.name(`description`).content(page.desc || `about:purelab`)),
        E.link.props(A.rel(`stylesheet`).type(`text/css`).href(`/styles/main.css`)),
        E.title.chi(page.title() || `about:purelab`),
        u.inlineScript(inl.head),
      ),
      E.body.chi(
        Header(page),
        chi,
        E.div.props(A.cls(`mar-top-4`)),
        Footer(page),
      ),
    )
  )
}

function Header(page) {
  return E[`a-nav`]
    .props(A.role(`navigation`).cls(`navbar`).cls(page.theme()))
    .chi(
      LogoLink(),
      E.span.props(A.cls(`strut`)),
      a.map(page.site.main, sub => (
        E.a.props(A.href(sub.urlPath()).cur(page).cls(`navlink`)).chi(sub.title())
      )),
      // E.a.props(A.href(`/start`).cur(page).cls(`navlink-btn`)).chi(`Start a project`),
    )
}

function Footer(page) {
  const tel = `+0-123-456-78-90`

  return E.footer.props(A.cls(`footer`)).chi(
    E.div.props(A.cls(`footer-track`)).chi(
      E.div.props(A.cls(`footer-cell`)).chi(LogoLink()),
      E.div.props(A.cls(`footer-cell flex col-sta-sta gap-ver-1`)).chi(
        a.map(page.site.main, sub => (
          E.a.props(A.href(sub.urlPath()).cur(page).cls(`decolink`)).chi(sub.title())
        )),
      ),
      E.div.props(A.cls(`footer-cell flex col-sta-end gap-ver-1 text-right`)).chi(
        E.a.props(A.href(`mailto:info@purelab.io`).cls(`decolink`)).chi(`info@purelab.io`),
        E.a.props(A.href(`tel:` + tel)).chi(tel),
      ),
    ),
    E.hr.props(A.cls(`hr`)),
    E.div.props(A.cls(`footer-track`)).chi(
      E.div.props(A.cls(`footer-cell`)),
      E.div.props(A.cls(`footer-cell flex row gap-hor-1`)).chi(
        E.a.props(A.cls(`decolink flex row-cen-cen`).cur(page)).chi(`LinkedIn`),
        E.a.props(A.cls(`decolink flex row-cen-cen`).cur(page)).chi(`GitHub`),
        E.a.props(A.cls(`decolink flex row-cen-cen`).cur(page)).chi(`Facebook`),
        E.a.props(A.cls(`decolink flex row-cen-cen`).cur(page)).chi(`Instagram`)
      ),
      E.div.props(A.cls(`footer-cell text-right`)).chi(
        E.span.chi(`© Purelab.io `, c.GEO),
      ),
    ),
  )
}

export function Main(...chi) {
  return E.main.props(A.id(c.MAIN_ID).cls(`gap-ver-4`)).chi(...chi)
}

export function Inner(...chi) {
  return E.div.props(A.cls(`page-inner gap-ver-2-to-4`)).chi(...chi)
}

export function GridImg(src) {
  const img = Img(src)
  return a.vac(img) && E.span.props(A.cls(`pad-4`)).chi(img)
}

export function Jumbo({title, sub, desc}) {
  return E.div.chi(
    a.vac(title) && E.h1.props(A.cls(`jumbo-title`)).chi(title),
    a.vac(sub) && E.p.props(A.cls(`jumbo-sub`)).chi(sub),
    a.vac(desc) && E.p.props(A.cls(`jumbo-desc`)).chi(desc),
  )
}

export function Img(src) {
  src = a.renderLax(src)
  return a.vac(src) && E.img.props({src, is: `a-img`})
}

export function LogoLink() {
  return E.a.props(A.href(`/`).cls(`brand-logo-link`)).chi(`<pure:lab>`)
}

// TODO: sync-up with design.
export function Showcase({title, desc, href, img}) {
  return E.div.props(A.cls(`showcase`)).chi(
    E.div.props(A.cls(`showcase-info`)).chi(
      E.h2.chi(title),
      E.p.props(A.style(`margin-top: auto`)).chi(desc),
      a.vac(href) && E.a.props(A.href(href).cls(`decolink`)).chi(href),
    ),
    AspectRatio(
      {tagName: `a`, props: A.cls(`showcase-img`).href(href).tarblan()},
      Img(img),
    ),
  )
}

/*
Unlike the "padding-bottom" trick, this doesn't require "position: absolute" for
chi. Sources:

  * https://codeburst.io/keeping-aspect-ratio-with-html-and-no-padding-tricks-40705656808b
  * https://stackoverflow.com/a/53245657/1882154

The new CSS property `aspect-ratio` provides a better solution, but is
unsupported in Safari <= 14.
*/
export function AspectRatio(
  {ratio: [hor, ver] = [], tagName, props},
  ...chi
) {
  return E[tagName || `div`]
    .props(A.with(props).cls(`aspect-ratio`))
    .chi(
      S.svg.props({viewBox: `0 0 ${a.laxNat(hor) || 16} ${a.laxNat(ver) || 9}`}),
      chi,
    )
}
