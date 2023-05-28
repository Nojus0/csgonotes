import { Show } from "solid-js"
import { buttonSounds, playErrorSound } from "@Common/Audio/AudioSource"
import { useStateContext } from "@Common/Context/StateContext"
import SafeIcon from "./Svg/SafeIcon"
import GreenButton from "@Components/Primitive/GreenButton"

const TopBarSecondStage = () => {
  const ctx = useStateContext()

  async function onNewNotesClicked() {
    buttonSounds.onClick()
    await ctx.newNotes()
  }

  async function onLoadNotesClicked() {
    buttonSounds.onClick()
    try {
      const notes = await ctx.loadNotes()
      buttonSounds.onClick()
      return notes
    } catch (err) {
      playErrorSound()
    }
  }

  return (
    <Show when={ctx.keypair.loaded && !ctx.notes.loaded}>
      <GreenButton
        style={{ padding: ".65rem .85rem .65rem 1.15rem" }}
        onClick={onLoadNotesClicked}
      >
        Load Notes
        <SafeIcon style={{ margin: "0 0 0 .25rem" }} height="1.2rem" />
      </GreenButton>
      <GreenButton
        style={{ padding: ".65rem .85rem .65rem 1.15rem" }}
        onClick={onNewNotesClicked}
      >
        New Notes
        <SafeIcon style={{ margin: "0 0 0 .25rem" }} height="1.2rem" />
      </GreenButton>
    </Show>
  )
}

export default TopBarSecondStage
