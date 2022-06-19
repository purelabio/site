import * as a from '@mitranim/js/all.mjs'
import {paths as pt} from '@mitranim/js/io_deno.mjs'
import * as c from './conf.mjs'
import {A, E} from './util.mjs'
import * as u from './util.mjs'
import * as sm from './site_misc.mjs'

export class Site extends a.MixMain(a.Emp) {
  constructor() {
    super()

    this.notFound = new Page404(this)

    this.main = [
      new PageWhat(this),
      new PageWho(this),
      // new PageContact(this),
    ]

    this.misc = [
      this.notFound,
      new PageIndex(this),
      // new PageStart(this),
    ]
  }

  *pages() {
    yield *this.main
    yield *this.misc
  }

  pageByPath(path) {
    for (const val of this.pages()) if (val.urlPath() === path) return val
    return undefined
  }
}

class Page extends a.Emp {
  constructor(site) {super().site = site}

  #site = undefined
  get site() {return this.#site}
  set site(val) {this.#site = a.reqInst(val, Site)}

  fsPath() {
    const path = a.laxStr(this.urlPath())
    return path && a.stripPre(path, `/`) + `.html`
  }

  urlPath() {}
  title() {}
  theme() {}

  targetPath() {
    const path = a.laxStr(this.fsPath())
    return path && pt.join(c.TARGET, path)
  }

  res() {return a.resBui().html(this.body()).res()}
  body() {return this.html()}
  html(...chi) {return sm.Html(this, ...chi)}

  write() {
    const path = this.targetPath()
    if (!path) return

    const body = this.body()
    if (!body) return

    globalThis.Deno.mkdirSync(pt.dir(path), {recursive: true})
    globalThis.Deno.writeTextFileSync(path, body)
  }
}

export class PageErr extends Page {
  constructor(site, err) {super(site).err = err}
  res() {return a.resBui().html(this.body()).code(this.code()).res()}
  code() {return 500}
  title() {return `unexpected error`}

  body() {
    const err = this.err || Error(this.title())
    return this.html(
      E.pre
        .props(A.cls(`page-inner pad-2`))
        .chi(err.stack || err.message || err),
    )
  }
}

export class Page404 extends PageErr {
  fsPath() {return `404.html`}
  code() {return 404}
  title() {return `Page Not Found`}

  body() {
    return this.html(sm.Main(
      sm.Jumbo({
        title: this.title(),
        sub: `Sorry! Page not found`,
      }),
    ))
  }
}

class PageIndex extends Page {
  fsPath() {return `index.html`}
  urlPath() {return `/`}
  theme() {return `theme-inv`}

  body() {
    return this.html(
      sm.Main(
        MainBanner(),
        sm.Inner(
          sm.Showcase({
            title: [E.b.chi(`Web`), E.br, `Development`],
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
            title: [E.b.chi(`Mobile App`), E.br, `Development`],
            desc: u.collapse(`
              We specialise in native and cross-platform consumer apps,
              creating exceptional digital experience at every touch point.
              We have crafted applications ranging from immersive
              AR experiences to complex social platforms and healthcare solutions.
            `),
            img: u.imgPath(`Rectangle Copy 33.png`),
          }),
          sm.Showcase({
            title: [E.b.chi(`UX / UI`), E.br, `Interface Development`],
            desc: u.collapse(`
              We combine product innovation with optimum usability. Through our iterative design process and thorough prototyping, we create an engaging and human-centric design that is scalable and a joy to use. Our team stays involved from the discovery phase to the final milestones to ensure that no part of your vision is lost in translation.
            `),
            img: u.imgPath(`Rectangle Copy 34.png`),
          }),
          sm.Showcase({
            title: [E.b.chi(`IoT`), E.br, `Development Services`],
            desc: u.collapse(`
              We help our customers design innovative IoT products to enable seamless and smooth experiences. Our teams are well-versed at all levels of the product development cycle - from board design to UX / UI to app development and system integration.
            `),
            img: u.imgPath(`Rectangle Copy 35.png`),
          }),
          sm.Showcase({
            title: [E.b.chi(`Quality`), E.br, `Assurance`],
            desc: u.collapse(`
              We help ensure premium product quality by offering a comprehensive QA process which encompasses all stages of development. Our services consist of a combination of automated and manual testing, making sure your product follows up-to-date quality assurance standards.
            `),
            img: u.imgPath(`Rectangle Copy 36.png`),
          }),
          sm.Showcase({
            title: [E.b.chi(`AI & ML`), E.br, `Artificial Intelligence & Machine Learning`],
            desc: u.collapse(`
              We provide services to augment your existing platforms and solutions with the power of computer vision, data visualizations, predictive analysis and more.
            `),
            img: u.imgPath(`Rectangle Copy 37.png`),
          }),
          E.div.props(A.cls(`grid-logos`)).chi(
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
    )
  }
}

function MainBanner() {
  return E.div
    .props(A.cls(`theme-inv pad-top-8 flex row-bet-sta page-pad-outer-1 gold-rat-lg-sm`))
    .chi(
      E.div.props(A.cls(`gap-ver-aro-1`)).chi(
        E.h1.props(A.cls(`size-huge wid-narrow`)).chi(
          u.mdToHtml(u.collapse(`
            **System integrator** that builds
            world class **digital products**
            creating **real business value**
          `)),
        ),
        E.p.chi(c.GEO),
      ),
      sm.Img(u.imgPath(`Group 11 Copy.svg`))
        .props(A.style(`margin-bottom: -2rem`)),
    )
}

class PageWho extends Page {
  urlPath() {return `/who`}
  title() {return `Who we are`}

  // Placeholder.
  body() {
    return this.html(
      sm.Main(
        sm.Jumbo({
          title: this.title(),
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
    )
  }
}

const MUGS = [
  {name: `Yury Egorenkov`, title: `Chief Executive Officer`,  img: u.imgPath(`ye.jpg`)},
  {name: `Nelo Mitranim`,  title: `Chief Technology Officer`, img: u.imgPath(`nm.jpg`)},
  {name: `Anton Minkov`,   title: `Chief Creative Officer`,   img: u.imgPath(`am.jpg`)},
  // {name: `Mike Frolov`,    title: `Team Lead Mobile`,                img: u.imgPath(`mf.jpg`)},
]

function Mugs() {
  return E.div.props(A.cls(`grid-2-to-4`)).chi(a.map(MUGS, Mug))
}

function Mug({name, title, img}) {
  return E.div.props(A.cls(`flex col gap-ver-1`)).chi(
    sm.AspectRatio(
      {hor: 1, ver: 1},
      sm.Img(img).props(A.cls(`img-std grayscale`)),
    ),
    E.p.chi(E.b.chi(title)),
    E.p.chi(name),
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
  return E.div.props(A.cls(`gap-ver-2`)).chi(
    E.p.chi(u.collapse(`
      Сontinuous improvement of our own skills
      and mastering the most modern technologies
      allow us and our customers
      to be at the top of technological excellence,
      providing the best service to customers.
    `)),
    E.div.props(A.cls(`grid-2-to-4`)).chi(a.map(BOASTS, Boast)),
    BoastIcons(),
  )
}

function Boast({title, list}) {
  return E.div.props(A.cls(`gap-ver-1`)).chi(
    E.h3.props(A.cls(`bold`)).chi(title),
    E.ul.props(A.cls(`list-inside`)).chi(a.map(list, ListItem)),
  )
}

function ListItem(val) {return E.li.chi(val)}

// Placeholder.
function BoastIcons() {}

// Placeholder.
function LetsWorkTogether() {}

class PageWhat extends Page {
  urlPath() {return `/what`}
  title() {return `What we've done`}

  body() {
    return this.html(
      sm.Main(
        sm.Jumbo({
          title: this.title(),
          sub: [
            `We have done `,
            E.b.chi(`many projects`),
            `, here are some of them`,
          ],
          desc: u.collapse(`
            We create value for our clients by creating value for their customers and our products always meet a number of important requirements: Flexibility & scalability, Search engine visibility (SEO), Ease of use, Brand consistency, Clarity of communication, Accessibility via a range of devices, Surprise & delight.
          `)
        }),
        sm.Inner(
          sm.Showcase({
            title: [E.b.chi(`Butik`), E.br, `Digital Department Store`],
            desc: `Russia's first dark store — type automated store`,
            img: u.imgPath(`Rectangle.png`),
            href: `https://butik.ru`,
          }),
          sm.Showcase({
            title: [E.b.chi(`Butik`), E.br, `Ecosystem of Digital Products`],
            desc: `E-commerce several mobile applications and website`,
            img: u.imgPath(`Rectangle Copy.png`),
            href: `https://butik.ru`,
          }),
          sm.Showcase({
            title: [E.b.chi(`AI & ML`), E.br, `E-commerce Personalization and Recommendations`],
            desc: `Artificial Intelligence & Machine Learning platform for mobile applications and website`,
            img: u.imgPath(`Group 9@1x.png`),
            href: `https://butik.ru`,
          }),
          sm.Showcase({
            title: [E.b.chi(`Expert Me`), E.br, `Web Platform`],
            desc: `Automated web platform and website`,
            img: u.imgPath(`Group 12@1x.png`),
            href: `https://expertme.ru`,
          }),
          // TODO: better description! (Update design first.)
          sm.Showcase({
            title: [E.b.chi(`Core Spirit`), E.br, `Social Web Platform`],
            desc: `Web platform`,
            img: u.imgPath(`Group 13@1x.png`),
            href: `https://corespirit.com`,
          }),
          sm.Showcase({
            title: [E.b.chi(`Binary Management`), E.br, `Management Tool for Interior Designers`],
            desc: `Web platform and marketing website`,
            img: u.imgPath(`Group 14@1x.png`),
            href: `https://binarymanagement.com`,
          }),
          sm.Showcase({
            title: [E.b.chi(`Ford Fiesta`), E.br, `Marketing Website`],
            desc: `Marketing website`,
            img: u.imgPath(`Rectangle Copy 5.png`),
            href: `https://fiesta.ford.ru`,
          }),
          sm.Showcase({
            title: [E.b.chi(`Tobox (Redmond)`), E.br, `Ecosystem of Digital Products`],
            desc: `E-commerce several mobile applications and website`,
            img: u.imgPath(`Group 15@1x.png`),
            href: `https://tobox.com`,
          }),
          sm.Showcase({
            title: [E.b.chi(`Shanzhai City`), E.br, `Charity Web Platform`],
            desc: `Website`,
            img: u.imgPath(`Group 16@1x.png`),
            href: `https://shanzhai.city`,
          }),
          sm.Showcase({
            title: [E.b.chi(`Shake`), E.br, `Car Sharing Marketplace`],
            desc: `Mobile applications for iOS and Android and website`,
            img: u.imgPath(`Group 17@1x.png`),
            href: `https://shakeapp.ru`,
          }),
        ),
      )
    )
  }
}

// Placeholder.
class _PageContact extends Page {
  urlPath() {return `/contact`}
  title() {return `Contact us`}
}

// Placeholder.
class _PageStart extends Page {
  urlPath() {return `/start`}
  title() {return `Start a project with us`}
}
