/// <reference lib='WebWorker' />

// IMPORTANT! This file cannot use any code also imported
// in other parts of the app or bundling into single file will fail.
declare const self: ServiceWorkerGlobalScope

// Constants from plugin
declare const ASSETS: string[]
declare const VERSION: string

export type {}

/**
 * If navigating to a different page via browser set as index.html cache key
 * Else just send the request as normal
 */
self.addEventListener("fetch", event => {
  const respondToRequest = async () => {
    const { request } = event
    const url = new URL(request.url)

    if (request.method === "GET" && self.location.origin === url.origin) {
      const adjustedRequest =
        request.mode === "navigate" ? "/index.html" : request

      const CachedResult = await caches.match(adjustedRequest)

      if (CachedResult) {
        console.log(`[service-worker] cached request: ${CachedResult.url}`)
        return CachedResult
      }

      console.log(`[service-worker] uncached request: ${request.url}`)
      return navigator.onLine ? fetch(request) : null
    }

    return fetch(request)
  }

  event.respondWith(respondToRequest())
})

/**
 * After Register
 */
self.addEventListener("install", event => {
  console.log("Installed Service Worker")
  const addToCachePromise = caches
    .open(VERSION)
    .then(cache => cache.addAll(ASSETS))

  event.waitUntil(addToCachePromise)
})

/**
 * After Install
 */
self.addEventListener("activate", event => {
  self.clients.claim()

  const removePromise = caches.keys().then(keys => {
    const promises = keys.map(key => {
      if (key === VERSION) {
        return undefined
      }

      return caches.delete(key)
    })

    return Promise.all(promises)
  })

  event.waitUntil(removePromise)
})

self.addEventListener("message", event => {
  if (event.data === "skip-waiting") {
    self.skipWaiting()
  }
})
