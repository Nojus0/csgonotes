import { GreenButton } from "@Components/Primitive/Button"
import { Show } from "solid-js"
import { buttonSounds, playErrorSound } from "@Common/Audio/AudioSource"
import { useStateContext } from "@Common/Context/StateContext"
import SafeIcon from "./Svg/SafeIcon"
import { styled } from "solid-styled-components"

const TopBarSecondStage = () => {
  const ctx = useStateContext()

  async function onNewNotesClicked() {
    buttonSounds.onClick()
    await ctx.newNotes()
  }

  async function onLoadNotesClicked() {
    buttonSounds.onClick()
    try {
      return await ctx.loadNotes()
    } catch (err) {
      playErrorSound()
    }
  }

  return (
    <Show when={ctx.keypair.loaded && !ctx.notes.loaded}>
      <GreenButton
        padding=".65rem .85rem .65rem 1.15rem"
        onClick={onLoadNotesClicked}
      >
        Load Notes
        <Safe height="1.2rem" />
      </GreenButton>
      <GreenButton
        padding=".65rem .85rem .65rem 1.15rem"
        onClick={onNewNotesClicked}
      >
        New Notes
        <Safe height="1.2rem" />
      </GreenButton>
    </Show>
  )
}

const Safe = styled(SafeIcon)({
  margin: "0 0 0 .25rem",
})

export default TopBarSecondStage
