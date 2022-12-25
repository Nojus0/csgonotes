import { del, get, set } from "idb-keyval"
import { batch, Component, onMount } from "solid-js"
import Backdrop, { Description } from "./Backdrop"
import { useStateContext } from "@Common/Context/StateContext"
import { InspectUri } from "./CopyBackdrop"
import { TextButton } from "./Primitive/Button"
import { buttonSounds } from "@Common/Audio/AudioSource"

const KEY = "dontShowAgain"

const CompatabilityBackdrop: Component = p => {
  const ctx = useStateContext()

  onMount(async () => {
    const isDontShowAgain = JSON.parse((await get(KEY)) || "false")

    const isCompatible =
      "showOpenFilePicker" in window && "showSaveFilePicker" in window

    if (isDontShowAgain) return

    ctx.setCompatability(isCompatible)
  })

  async function dontShowAgain() {
    buttonSounds.onClick()
    await set(KEY, JSON.stringify(true))
    ctx.setCompatability(false)
  }

  async function ok() {
    ctx.setCompatability(false)
    buttonSounds.onClick()
  }

  return (
    <Backdrop
      when={ctx.showCompatibility}
      onBackgroundClick={() => ctx.setCompatability(false)}
      title="Compatibility"
      width="40rem"
      description={
        <>
          <Description>
            Your browser is not fully supported. As a result, you will need to
            manually load your keys and notes each time you visit the site. You
            will not be able to use the restore previous session feature.
            Consider using a Chromium-based browser.
          </Description>
        </>
      }
    >
      <TextButton onClick={ok}>Dismiss</TextButton>
      <TextButton onClick={dontShowAgain}>Don't show again</TextButton>
    </Backdrop>
  )
}

export default CompatabilityBackdrop
