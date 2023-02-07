import base58 from "bs58"
import {
  batch,
  Component,
  createEffect,
  createSignal,
  onMount,
  untrack,
} from "solid-js"
import {
  AES_KEY_BITS,
  DetailedKeypair,
  serializeKeyPair,
  VERSION,
} from "@Common/KeyPair"
import Backdrop, { Description } from "./Backdrop"
import { useStateContext } from "@Common/Context/StateContext"
import { TextButton } from "./Primitive/Button"
import { buttonSounds } from "@Common/Audio/AudioSource"
import { decryptNotes, encryptNotes } from "@Common/Notes"


export function parseLocationHash(): Map<string, string> {
  let urlWithoutHash = location.hash.substring(1);
  const dirtyExpressions = urlWithoutHash.split("|")
  const expressions = dirtyExpressions.filter(item => item != "")

  var arrayKeyVals = expressions.map((stringExpression) => stringExpression && stringExpression.split("="))

  const keyVals = new Map<string, string>([])

  arrayKeyVals.forEach(item => {

    if (item.length < 2) return;

    keyVals.set(item[0], item[1])
  })

  return keyVals
}

// Improve this function and the code that calls it 3 calls same result same computation
export function isHashSerialized() {
  const values = parseLocationHash()
  console.log("call")
  if (values.size < 3) return

  const key = values.get("key")
  const iv = values.get("iv")
  const notes = values.get("notes")

  if (!key || !iv || !notes) {
    return null
  }

  return { key, iv, notes }
}

const CopyBackdrop: Component = () => {
  const ctx = useStateContext()
  const [text, setText] = createSignal("5")
  let timer: NodeJS.Timer

  createEffect(() => {
    if (!ctx.showCopyClipboard) {
      clearInterval(timer)
      setText("5")
      return
    }

    timer = setInterval(() => {
      const num = parseInt(text())
      if (num > 0) {
        setText(`${num - 1}`)
        buttonSounds.onMouseEnter()
      } else {
        buttonSounds.onMouseEnter()
        setText("Copy")
        clearInterval(timer)
        return
      }
    }, 1000)
  })

  onMount(async () => {
    const values = isHashSerialized()

    if(!values) return


    const keypair: DetailedKeypair = {
      key: await crypto.subtle.importKey(
        "raw",
        base58.decode(values.key),
        {
          name: "AES-GCM",
          hash: "SHA-512",
          length: AES_KEY_BITS,
        },
        true,
        ["encrypt", "decrypt"]
      ),
      iv: base58.decode(values.iv),
      version: VERSION,
    }

    const listStore = await decryptNotes(keypair, base58.decode(values.notes))

    // * VERY IMPORTANT *
    batch(() => {
      ctx.setShowTopbar(true)
      ctx.setKeyPair({ ...keypair, handle: null, loaded: true })
      ctx.setNotes({ ...listStore, handle: null, loaded: true })
    })
  })

  async function copyToClipboard() {
    const url = new URL(location.href)
    
    const notes = base58.encode(new Uint8Array(await encryptNotes(ctx.keypair, ctx.notes)))
    const s = await serializeKeyPair(ctx.keypair)
    url.hash = `#|key=${s.key}|iv=${s.iv}|notes=${notes}|`

    await navigator.clipboard.writeText(url.href)
  }

  return (
    <Backdrop
      title="Copy to Clipboard"
      width="32.5rem"
      description={
        <>
          <Description>
            Encode the Key and the Notes into a sharable URL.
          </Description>
          <Description>
            The data is stored directly in the URL and it does not auto-update.
          </Description>
        </>
      }
      onBackgroundClick={() => ctx.setCopyClipboard(false)}
      when={ctx.showCopyClipboard}
    >
      <TextButton
        onClick={() => {
          buttonSounds.onClick()
          ctx.setCopyClipboard(false)
        }}
      >
        Close
      </TextButton>
      <TextButton
        onClick={() => {
          if (ctx.showCopyClipboard && text() == "Copy") {
            copyToClipboard()
            buttonSounds.onClick()
          }
        }}
      >
        {ctx.showCopyClipboard ? text() : untrack(() => text())}
      </TextButton>
    </Backdrop>
  )
}

export default CopyBackdrop
