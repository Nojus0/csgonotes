import { buttonSounds, playErrorSound } from "@Common/Audio/AudioSource"
import { useStateContext } from "@Common/Context/StateContext"
import { Show } from "solid-js"
import KeyIcon from "./Svg/KeyIcon"
import GreenButton from "@Components/Primitive/GreenButton"

const TopBarFirstStage = () => {
  const ctx = useStateContext()

  async function onNewKeyPairClicked() {
    buttonSounds.onClick()
    await ctx.newKeypair()
  }

  async function onLoadKeypairClicked() {
    buttonSounds.onClick()
    try {
      const keypair = await ctx.loadKeyPair()
      buttonSounds.onClick()
      return keypair
    } catch (err) {
      playErrorSound()
    }
  }

  return (
    <>
      <Show when={!ctx.keypair.loaded && !ctx.notes.loaded}>
        <GreenButton
          style={{ padding: ".65rem .85rem .65rem 1.15rem" }}
          onClick={onLoadKeypairClicked}
        >
          Load Key
          <KeyIcon style={{ margin: "0 0 0 .25rem" }} height="1.2rem" />
        </GreenButton>
      </Show>

      <Show when={!ctx.keypair.loaded}>
        <GreenButton
          style={{ padding: ".65rem .85rem .65rem 1.15rem" }}
          onClick={onNewKeyPairClicked}
        >
          New Key
          <KeyIcon style={{ margin: "0 0 0 .25rem" }} height="1.2rem" />
        </GreenButton>
      </Show>
    </>
  )
}

export default TopBarFirstStage
