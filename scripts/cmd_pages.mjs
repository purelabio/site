import * as u from './util.mjs'
import * as s from './site.mjs'

const site = s.Site.main

u.timing(`pages`, cmdPages)

function cmdPages() {for (const page of site.pages()) page.write()}
