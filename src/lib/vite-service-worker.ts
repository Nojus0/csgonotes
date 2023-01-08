// Core logic regarding service worker is from https://github.com/GoogleChromeLabs/squoosh/blob/dev/lib/sw-plugin.js
// Manifest part is heavily inspired from vite-plugin-pwa
import { loadEnv, PluginOption } from "vite"
import { OutputChunk } from "rollup"
import { createHash } from "crypto"
import { posix } from "path"
import { StaticAudioSource, ThirdPartyAudioSource } from "../Common/Audio/AudioSources"
import { StaticVideoSource, ThirdPartyVideoSource } from "../Common/VideoSources"
import * as fs from "fs"

const importPrefix = "service-worker:"

interface Options {
  SERVICE_WORKER_FILE_NAME?: string
  // TODO: add actual types one day.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  manifest: Record<string, any>
}

export const serviceWorker = ({
  SERVICE_WORKER_FILE_NAME = "sw.js",
  manifest,
}: Options): PluginOption => {
  const fileRefs = new Set<string>()

  return {
    name: "service-worker",
    enforce: "post",
    async resolveId(id, importer) {
      if (!id.startsWith(importPrefix)) {
        return undefined
      }

      const plainId = id.slice(importPrefix.length)
      const result = await this.resolve(plainId, importer)
      if (!result) {
        return undefined
      }

      return importPrefix + result.id
    },
    load(id) {
      if (!id.startsWith(importPrefix)) {
        return undefined
      }
      const fileId = this.emitFile({
        type: "chunk",
        id: id.slice(importPrefix.length),
        fileName: SERVICE_WORKER_FILE_NAME,
      })
      fileRefs.add(fileId)

      return `export default import.meta.ROLLUP_FILE_URL_${fileId};`
    },
    resolveFileUrl({ referenceId, fileName }) {
      // Vite always removes import meta https://github.com/vitejs/vite/issues/3380
      // so use document.baseURI instead as a workaround
      if (fileRefs.has(referenceId)) {
        return `new URL('${fileName}', document.baseURI).href`
      }

      return undefined
    },
    generateBundle(_, bundle) {
      const SERVICE_WORKER_CHUNK = bundle[
        SERVICE_WORKER_FILE_NAME
      ] as OutputChunk
      // const MANIFEST_FILE = 'manifest.webmanifest'

      for (const file of Object.values(bundle)) {
        if (
          file.type === "asset" &&
          file.fileName.endsWith("html") &&
          typeof file.source === "string"
        ) {
          const manifestLink = `<link rel="manifest" href="manifest.webmanifest">`
          file.source = file.source.replace("</head>", `${manifestLink}</head>`)
        }
      }

      bundle["manifest.webmanifest"] = {
        isAsset: true,
        type: "asset",
        name: undefined,
        source: JSON.stringify(manifest, null, 0),
        fileName: "manifest.webmanifest",
      }

      if (!SERVICE_WORKER_CHUNK) {
        return
      }

      const toCacheInSW = Object.values(bundle).filter(
        item => item !== SERVICE_WORKER_CHUNK
      )

      const urls = toCacheInSW.map(item =>
        posix.relative(posix.dirname(SERVICE_WORKER_FILE_NAME), item.fileName)
      )

      const versionHash = createHash("sha1")
      for (const item of toCacheInSW) {
        let contents
        if (item.type === "asset") {
          contents = item.source
        } else {
          contents = item.code
        }
        versionHash.update(contents)
      }
      for (const icon of manifest.icons) {
        urls.push(icon.src)
        versionHash.update(icon.src)
      }

      const env = loadEnv(null, ".")
      const S = env.VITE_NO_THIRD_PARTY_SERVER_MODE == "true"

      const AudioSource = S ? StaticAudioSource : ThirdPartyAudioSource

      const VideoSource = S ? StaticVideoSource : ThirdPartyVideoSource
      const FontsSource = fs
        .readdirSync("public/static/font")
        .map(f => `/static/font/${f}`)
      urls.push(
        ...Object.values(AudioSource.Ambience),
        ...Object.values(AudioSource.Button),
        ...Object.values(VideoSource),
        ...FontsSource
      )

      const version = versionHash.digest("hex")
      SERVICE_WORKER_CHUNK.code = `
const ASSETS = ${JSON.stringify(urls, null, 2)};
const VERSION = ${JSON.stringify(version)};

${SERVICE_WORKER_CHUNK.code}`
    },
  }
}
