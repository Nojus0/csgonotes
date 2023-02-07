import { del, get } from "idb-keyval"
import { batch, Component, onMount } from "solid-js"
import Backdrop, { Description } from "./Backdrop"
import { useStateContext } from "@Common/Context/StateContext"
import { isHashSerialized } from "./CopyBackdrop"
import { TextButton } from "./Primitive/Button"
import { buttonSounds } from "@Common/Audio/AudioSource"

const RestoreBackdrop: Component = p => {
  const ctx = useStateContext()

  onMount(async () => {
    const [keypairHandle, notesHandle]: FileSystemFileHandle[] =
      await Promise.all([get("keypair"), get("notes")])

    if (keypairHandle && !notesHandle) {
      del("keypair")
    }

    if (!keypairHandle && notesHandle) {
      del("notes")
    }

    const values = isHashSerialized()

    // dont show restore if serialized url
    if (keypairHandle && notesHandle && !values) {
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
