import { buttonSounds, playErrorSound } from "@Common/Audio/AudioSource"
import { useStateContext } from "@Common/Context/StateContext"
import { GreenButton } from "@Components/Primitive/Button"
import { Show } from "solid-js"
import KeyIcon from "./Svg/KeyIcon"
import { styled } from "solid-styled-components"

const TopBarFirstStage = () => {
  const ctx = useStateContext()

  async function onNewKeyPairClicked() {
    buttonSounds.onClick()
    await ctx.newKeypair()
  }

  async function onLoadKeypairClicked() {
    buttonSounds.onClick()
    try {
      return await ctx.loadKeyPair()
    } catch (err) {
      playErrorSound()
    }
  }

  return (
    <>
      <Show when={!ctx.keypair.loaded && !ctx.notes.loaded}>
        <GreenButton
          padding=".65rem .85rem .65rem 1.15rem"
          onClick={onLoadKeypairClicked}
        >
          Load Key
          <Key height="1.2rem" />
        </GreenButton>
      </Show>

      <Show when={!ctx.keypair.loaded}>
        <GreenButton
          padding=".65rem .85rem .65rem 1.15rem"
          onClick={onNewKeyPairClicked}
        >
          New Key
          <Key height="1.2rem" />
        </GreenButton>
      </Show>
    </>
  )
}

export default TopBarFirstStage

const Key = styled(KeyIcon)({
  margin: "0 0 0 .25rem",
})
