import * as a from '@mitranim/js/all.mjs'
import * as hd from '@mitranim/js/http_deno.mjs'
import * as ld from '@mitranim/js/live_deno.mjs'
import * as c from './conf.mjs'
import * as s from './site.mjs'
import * as cl from './cmd_live.mjs'

export const dirs = ld.LiveDirs.of(
  hd.dirRel(c.TARGET),
  hd.dirRel(c.STATIC),
  hd.dirRel(`.`, /^(?:images)[/]/),
  hd.dirRel(`images`),
  a.vac(!c.PROD) && hd.dirAbs(),
)

const site = s.Site.main

const srv = new class Srv extends hd.Srv {
  async res(req) {
    const rou = new a.ReqRou(req)

    return live(await (
      (await dirs.resolveSiteFile(rou.url))?.res() ||
      site.pageByPath(rou.url.pathname)?.res() ||
      site.notFound.res(rou)
    ))
  }

  errRes(err) {return live(new s.PageErr(site, err).res())}
}()

async function main() {
  liveReload()
  await srv.listen({port: c.SRV_PORT, hostname: `localhost`})
}

/*
Tells each connected "live client" to reload the page.
Requires `make live`, which is invoked by default by `make`.
*/
function liveReload() {
  fetch(cl.LIVE_SEND, {method: `post`, body: `{"type":"change"}`}).catch(a.nop)
}

function live(res) {return ld.withLiveClient(cl.LIVE_CLIENT, res)}

if (import.meta.main) await main()
