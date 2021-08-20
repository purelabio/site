/* eslint-disable no-unused-vars */

import * as f from 'fpx'
import {E} from 'prax'
import * as x from 'prax'
import * as es from 'espo'
import * as c from './conf.mjs'
import * as u from './util.mjs'
import * as e from './elem.mjs'
import * as sm from './site_misc.mjs'

export class Site {
  constructor() {
    this.main = [
      new PageWhat(),
      new PageWho(),
      // new PageContact(),
    ]

    this.misc = [
      new Page404(),
      new PageIndex(),
      // new PageStart(),
    ]
  }

  *pages() {
    yield *this.main
    yield *this.misc
  }

  pageByLink(link) {
    for (const val of this.pages()) if (val.link === link) return val
    return undefined
  }
}

class Page {
  constructor(val) {f.assign(this, val)}
  get path() {return f.vac(this.link && f.str(this.link) + `.html`)}
  set path(path) {es.pubs(this, {path})}
  res() {throw Error(`implement in subclass`)}
}

export class PageErr extends Page {
  get title() {return `unexpected error`}

  res(site) {
    const err = this.err || Error(this.title)

    return u.resHtml(sm.Html(
      {page: this, site},
      e.pre({class: `page-inner pad-2`}, err.stack || err.message || err),
    ), {status: 500})
  }
}

export class Page404 extends Page {
  get path() {return `404.html`}
  get title() {return `Page Not Found`}

  res(site) {
    return u.resHtml(sm.Html(
      {page: this, site},
      sm.Main(
        sm.Jumbo({
          title: `Page Not Found`,
          sub: `Sorry! Page not found`,
        }),
      ),
    ), {status: 404})
  }
}

class PageIndex extends Page {
  get link() {return `/`}
  get path() {return `index.html`}

  res(site) {
    return u.resHtml(sm.Html(
      {page: this, site, theme: `theme-inv`},
      sm.Main(
        MainBanner(),
        sm.Inner(
          sm.Showcase({
            title: [e.bv(`Web`), e.br(), `Development`],
            desc: u.collapse(`
              We work with the latest tech stacks to engineer front-end
              and back-end solutions, and do everything from single page
              progressive web applications in React and Vue, to multi-tier
              services in Python, node.js and Go deployed on AWS
              and Google App Engine.
            `),
            img: u.imgPath(`Rectangle Copy 13.png`),
          }),
          sm.Showcase({
            title: [e.bv(`Mobile App`), e.br(), `Development`],
            desc: u.collapse(`
              We specialise in native and cross-platform consumer apps,
              creating exceptional digital experience at every touch point.
              We have crafted applications ranging from immersive
              AR experiences to complex social platforms and healthcare solutions.
            `),
            img: u.imgPath(`Rectangle Copy 33.png`),
          }),
          sm.Showcase({
            title: [e.bv(`UX / UI`), e.br(), `Interface Development`],
            desc: u.collapse(`
              We combine product innovation with optimum usability. Through our iterative design process and thorough prototyping, we create an engaging and human-centric design that is scalable and a joy to use. Our team stays involved from the discovery phase to the final milestones to ensure that no part of your vision is lost in translation.
            `),
            img: u.imgPath(`Rectangle Copy 34.png`),
          }),
          sm.Showcase({
            title: [e.bv(`IoT`), e.br(), `Development Services`],
            desc: u.collapse(`
              We help our customers design innovative IoT products to enable seamless and smooth experiences. Our teams are well-versed at all levels of the product development cycle - from board design to UX / UI to app development and system integration.
            `),
            img: u.imgPath(`Rectangle Copy 35.png`),
          }),
          sm.Showcase({
            title: [e.bv(`Quality`), e.br(), `Assurance`],
            desc: u.collapse(`
              We help ensure premium product quality by offering a comprehensive QA process which encompasses all stages of development. Our services consist of a combination of automated and manual testing, making sure your product follows up-to-date quality assurance standards.
            `),
            img: u.imgPath(`Rectangle Copy 36.png`),
          }),
          sm.Showcase({
            title: [e.bv(`AI & ML`), e.br(), `Artificial Intelligence & Machine Learning`],
            desc: u.collapse(`
              We provide services to augment your existing platforms and solutions with the power of computer vision, data visualizations, predictive analysis and more.
            `),
            img: u.imgPath(`Rectangle Copy 37.png`),
          }),
          e.div({class: `grid-logos`},
            sm.GridImg(u.imgPath(`Group 2@1,5x.svg`)),
            sm.GridImg(u.imgPath(`Group Copy 3@1,5x.svg`)),
            sm.GridImg(u.imgPath(`ecommpay-logo-blue@1,5x.svg`)),
            sm.GridImg(u.imgPath(`Group 5@1,5x.svg`)),
            sm.GridImg(u.imgPath(`Group Copy 4@1,5x.svg`)),
            sm.GridImg(u.imgPath(`VTB_Logo_2018 Copy.svg`)),
            sm.GridImg(u.imgPath(`Ford_logo_flat.svg`)),
            sm.GridImg(u.imgPath(`CS_Logo_Black.svg`)),
            sm.GridImg(u.imgPath(`Sberbank_Logo_2020.svg`)),
            sm.GridImg(u.imgPath(`Group 22 Copy.svg`)),
            sm.GridImg(u.imgPath(`Eurocement-logo-600x400 Copy.svg`)),
            sm.GridImg(u.imgPath(`download copy 4@1,5x.png`)),
            sm.GridImg(u.imgPath(`Bitmap Copy 8.png`)),
            sm.GridImg(u.imgPath(`trast-bank.png`)),
            sm.GridImg(u.imgPath(`Ilim_group_logo.png`)),
            sm.GridImg(u.imgPath(`Group 8.svg`)),
            sm.GridImg(u.imgPath(`Group 6.svg`)),
            sm.GridImg(u.imgPath(`Norilsk_Nickel_logo.svg`)),
            sm.GridImg(u.imgPath(`NLMK_Logo.svg`)),
            sm.GridImg(u.imgPath(`Rosneft_Logo.svg`)),
          )
        )
      )
    ))
  }
}

function MainBanner() {
  return e.div(
    {class: `theme-inv pad-top-8 flex row-bet-sta page-pad-outer-1 gold-rat-lg-sm`},
    e.div({class: `gap-ver-aro-1`},
      e.div(
        {class: `size-huge wid-narrow`},
        u.mdToHtml(u.collapse(`
          **System integrator** that builds
          world class **digital products**
          creating **real business value**
        `)),
      ),
      e.pv(c.GEO),
    ),
    sm.Img({
      src: u.imgPath(`Group 11 Copy.svg`),
      style: {marginBottom: '-2rem'},
    }),
  )
}

class PageWho extends Page {
  get link() {return `/who`}
  get title() {return `Who we are`}

  // Placeholder.
  res(site) {
    return u.resHtml(sm.Html(
      {page: this, site},
      sm.Main(
        sm.Jumbo({
          title: this.title,
          sub: u.mdToHtml(u.collapse(`
            **We are**
            creative **designers**,
            insightful **strategists**,
            exceptional **engineers**,
            pedantic **managers** and
            talented **developers**.
          `)),
          desc: u.collapse(`
            Purelab was founded in 2014 to help customers navigate the pace of technological change,
            enabling them to more meaningfully interact with their customers by creating technologically advanced,
            world class digital products for them. We are proud of the work that we have done for a wide range
            of prospective clients, marked by grateful feedback from us, and the culture that we created in Purelab,
            a culture that allows all our employees to do the best work in their lives.
          `),
        }),
        sm.Inner(
          Mugs(),
          Boasting(),
          LetsWorkTogether(),
        ),
      ),
    ))
  }
}

const MUGS = [
  {name: `Yury Egorenkov`, title: `Chief Executive Officer`,  img: u.imgPath(`ye.jpg`)},
  {name: `Nelo Mitranim`,  title: `Chief Technology Officer`, img: u.imgPath(`nm.jpg`)},
  {name: `Anton Minkov`,   title: `Chief Creative Officer`,   img: u.imgPath(`am.jpg`)},
  {name: `Mike Frolov`,    title: `Team Lead`,                img: u.imgPath(`mf.jpg`)},
]

function Mugs() {
  return e.div({class: `grid-2-to-4`}, f.map(MUGS, Mug))
}

function Mug({name, title, img}) {
  return e.div({class: `flex col gap-ver-1`},
    sm.AspectRatio(
      {hor: 1, ver: 1},
      sm.Img({src: img, class: `img-std grayscale`}),
    ),
    e.pv(e.bv(title)),
    e.pv(name),
  )
}

const BOASTS = [
  {
    title: `Frontend`,
    list: [
      `JavaScript`, `React`, `Note`, `Prax`, `Flux`, `D3.js`,
      `SCSS`, `Stylebox`, `Webpack`,
    ],
  },
  {
    title: `Backend`,
    list: [
      `Node`, `Clojure`, `Erlang`, `Haskell`,
      `Elastic Search`, `Apache Ignite`,
    ],
  },
  {
    title: `Database`,
    list: [
      `Firebase`, `Datomic`, `PostgreSQL`, `MS SQL`,
      `My SQL`, `Mongo DB`,
    ],
  },
  {
    title: `Mobile`,
    list: [
      `React Native`,
      `iOs`,
      `Andriod`,
      `Swift`,
    ],
  },
  {
    title: `Design`,
    list: [
      `Sketch`, `Figma`, `Adobe CS`, `Principle`,
      `InVision`, `Axure`, `Zeplin`,
    ],
  },
  {
    title: `Management`,
    list: [
      `Product management`,
      `Agile`,
      `Git`,
      `Jira`,
      `Trello`,
      `Redmine`,
    ],
  },
  {
    title: `Cutting edge tech`,
    list: [
      `Artificial Intelligence`,
      `Machine Learning`,
      `Data Mining`,
      `Natural Language`,
      `Processing`,
    ],
  },
]

function Boasting() {
  return e.div({class: `gap-ver-2`},
    e.pv(u.collapse(`
      Сontinuous improvement of our own skills
      and mastering the most modern technologies
      allow us and our customers
      to be at the top of technological excellence,
      providing the best service to customers.
    `)),
    e.div({class: `grid-2-to-4`}, f.map(BOASTS, Boast)),
    BoastIcons(),
  )
}

function Boast({title, list}) {
  return e.div({class: `gap-ver-1`},
    e.h3({class: `bold`}, title),
    e.ul({class: `list-inside`}, f.map(list, f.cwk, e.liv)),
  )
}

// Placeholder.
function BoastIcons() {}

// Placeholder.
function LetsWorkTogether() {}

class PageWhat extends Page {
  get link() {return `/what`}
  get title() {return `What we've done`}

  res(site) {
    return u.resHtml(sm.Html(
      {page: this, site},
      sm.Main(
        sm.Jumbo({
          title: this.title,
          sub: [
            `We have done `,
            e.bv(`many projects`),
            `, here are some of them`,
          ],
          desc: u.collapse(`
            We create value for our clients by creating value for their customers and our products always meet a number of important requirements: Flexibility & scalability, Search engine visibility (SEO), Ease of use, Brand consistency, Clarity of communication, Accessibility via a range of devices, Surprise & delight.
          `)
        }),
        sm.Inner(
          sm.Showcase({
            title: [e.bv(`Butik`), e.br(), `Digital Department Store`],
            desc: `Russia's first dark store — type automated store`,
            img: u.imgPath(`Rectangle.png`),
            href: `https://butik.ru`,
          }),
          sm.Showcase({
            title: [e.bv(`Butik`), e.br(), `Ecosystem of Digital Products`],
            desc: `E-commerce several mobile applications and website`,
            img: u.imgPath(`Rectangle Copy.png`),
            href: `https://butik.ru`,
          }),
          sm.Showcase({
            title: [e.bv(`AI & ML`), e.br(), `E-commerce Personalization and Recommendations`],
            desc: `Artificial Intelligence & Machine Learning platform for mobile applications and website`,
            img: u.imgPath(`Group 9@1x.png`),
            href: `https://butik.ru`,
          }),
          sm.Showcase({
            title: [e.bv(`Expert Me`), e.br(), `Web Platform`],
            desc: `Automated web platform and website`,
            img: u.imgPath(`Group 12@1x.png`),
            href: `https://expertme.ru`,
          }),
          // TODO: better description! (Update design first.)
          sm.Showcase({
            title: [e.bv(`Core Spirit`), e.br(), `Social Web Platform`],
            desc: `Web platform`,
            img: u.imgPath(`Group 13@1x.png`),
            href: `https://corespirit.com`,
          }),
          sm.Showcase({
            title: [e.bv(`Binary Management`), e.br(), `Management Tool for Interior Designers`],
            desc: `Web platform and marketing website`,
            img: u.imgPath(`Group 14@1x.png`),
            href: `https://binarymanagement.com`,
          }),
          sm.Showcase({
            title: [e.bv(`Ford Fiesta`), e.br(), `Marketing Website`],
            desc: `Marketing website`,
            img: u.imgPath(`Rectangle Copy 5.png`),
            href: `https://fiesta.ford.ru`,
          }),
          sm.Showcase({
            title: [e.bv(`Tobox (Redmond)`), e.br(), `Ecosystem of Digital Products`],
            desc: `E-commerce several mobile applications and website`,
            img: u.imgPath(`Group 15@1x.png`),
            href: `https://tobox.com`,
          }),
          sm.Showcase({
            title: [e.bv(`Shanzhai City`), e.br(), `Charity Web Platform`],
            desc: `Website`,
            img: u.imgPath(`Group 16@1x.png`),
            href: `https://shanzhai.city`,
          }),
          sm.Showcase({
            title: [e.bv(`Shake`), e.br(), `Car Sharing Marketplace`],
            desc: `Mobile applications for iOS and Android and website`,
            img: u.imgPath(`Group 17@1x.png`),
            href: `https://shakeapp.ru`,
          }),
        ),
      )
    ))
  }
}

class PageContact extends Page {
  get link() {return `contact`}
  get title() {return `Contact us`}

  // Placeholder.
  res(site) {
    return u.resHtml(sm.Html({page: this, site}))
  }
}

class PageStart extends Page {
  get link() {return `/start`}

  // Placeholder.
  res(site) {
    return u.resHtml(sm.Html({page: this, site}))
  }
}
