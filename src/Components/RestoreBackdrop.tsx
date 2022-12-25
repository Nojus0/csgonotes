import { del, get } from "idb-keyval"
import { batch, Component, onMount } from "solid-js"
import Backdrop, { Description } from "./Backdrop"
import { useStateContext } from "@Common/Context/StateContext"
import { InspectUri } from "./CopyBackdrop"
import { TextButton } from "./Primitive/Button"
import { buttonSounds } from "@Common/Audio/AudioSource"

const RestoreBackdrop: Component = p => {
  const ctx = useStateContext()

  onMount(async () => {
    const [keypairHandle, notesHandle]: FileSystemFileHandle[] =
      await Promise.all([get("keypair"), get("list")])

    if (keypairHandle && !notesHandle) {
      del("keypair")
    }

    if (!keypairHandle && notesHandle) {
      del("list")
    }

    const { IsSerializedLink } = InspectUri()
    if (keypairHandle && notesHandle && !IsSerializedLink) {
      ctx.setRestore(true)
    }
  })

  function RestoreCancel() {
    batch(() => {
      ctx.setRestore(false)
      ctx.resetCredentials()
    })
  }

  return (
    <Backdrop
      title="Restore"
      description={
        <>
          <Description>Restore your previous session?</Description>
        </>
      }
      onBackgroundClick={RestoreCancel}
      when={ctx.showRestore}
    >
      <TextButton
        onClick={() => {
          RestoreCancel()
          buttonSounds.onClick()
        }}
      >
        No
      </TextButton>
      <TextButton onClick={ctx.restoreSession}>Yes</TextButton>
    </Backdrop>
  )
}

export default RestoreBackdrop
