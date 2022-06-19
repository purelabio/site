/*
Caches semantically-versioned assets from a CDN. Useful for offline development,
because SW bypasses "disable cache". In production this is unnecessary but
harmless. In development this is also unnecessary if cache is enabled.
*/

/* eslint-disable no-restricted-globals */

self.onfetch = onFetch

function onFetch(event) {
  const {request: req} = event
  if (shouldCache(req.url)) {
    event.respondWith(fetchWithCache(req))
  }
}

async function fetchWithCache(req) {
  const cache = await caches.open('main')

  let res = await cache.match(req)
  if (!res) {
    res = await fetch(req)
    if (res.ok) cache.put(req, res.clone())
  }

  return res
}

function shouldCache(url) {
  /*
  Semantically-versioned assets from a CDN are assumed to be immutable and ok to
  cache. This is useful for offline development, because SW bypasses "disable
  cache". In production it's unnecessary but harmless.

  Other external requests should just use HTTP cache headers.
  */
  return /[@/]v?\d+[.]\d+[.]\d+/.test(url)
}
