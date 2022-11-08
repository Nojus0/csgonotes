import { buttonSounds, playErrorSound } from "@Common/Audio/AudioSource"
import { Component, Show } from "solid-js"
import { styled } from "solid-styled-components"
import { useStateContext } from "@Common/Context/StateContext"
import { InspectUri } from "./CopyBackdrop"
import { GreenButton } from "./Primitive/Button"
import { Input } from "./Primitive/Input"
import EditIcon from "./Svg/EditIcon"
import KeyIcon from "./Svg/KeyIcon"
import QuitIcon from "./Svg/QuitIcon"
import SafeIcon from "./Svg/SafeIcon"
import SaveIcon from "./Svg/SaveIcon"

const TopBar: Component = () => {
  const ctx = useStateContext()

  const { IsSerializedLink } = InspectUri()

  if (IsSerializedLink) {
    ctx.setShowTopbar(false)
  }

  async function onLoadKeypairClicked() {
    buttonSounds.onClick()
    try {
      return await ctx.loadKeyPair()
    } catch (err) {
      playErrorSound()
    }
  }

  async function onNewKeyPairClicked() {
    buttonSounds.onClick()
    await ctx.newKeypair()
  }

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

  async function onAddNoteClicked() {
    buttonSounds.onClick()
    await ctx.newIdea()
  }

  async function onSaveClicked() {
    buttonSounds.onClick()
    await ctx.saveNotes()
  }

  async function onQuitClicked() {
    buttonSounds.onClick()
    await ctx.resetCredentials()
  }

  return (
    <Show when={ctx.showTopbar}>
      <TopBarWrapper>
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

        <Show when={ctx.notes.loaded}>
          <GreenButton
            padding=".65rem .5rem .65rem 1.15rem"
            onClick={onAddNoteClicked}
          >
            Add
            <Edit height="1.2rem" />
          </GreenButton>
          <GreenButton
            padding=".65rem .75rem .65rem 1.15rem"
            onClick={onSaveClicked}
          >
            Save
            <SaveMargined height="1.2rem" />
          </GreenButton>
        </Show>

        <Show when={ctx.keypair.loaded && ctx.notes.loaded}>
          <TopBarRightWrapper>
            <InputResponsiveWrapper>
              <Input
                width="100%"
                margin="0"
                value={ctx.notes.name}
                placeholder="List name"
                onInput={e => ctx.setNotesName(e.currentTarget.value)}
              />
            </InputResponsiveWrapper>
            <Icons>
              <Quit
                {...buttonSounds}
                onMouseDown={e => e.preventDefault()}
                onClick={onQuitClicked}
              />
            </Icons>
          </TopBarRightWrapper>
        </Show>
      </TopBarWrapper>
    </Show>
  )
}

export default TopBar

const Edit = styled(EditIcon)({
  margin: "0 0 0 .25rem",
})

const Safe = styled(SafeIcon)({
  margin: "0 0 0 .25rem",
})

const Key = styled(KeyIcon)({
  margin: "0 0 0 .25rem",
})

const Icons = styled.div({
  display: "flex",
  justifyContent: "flex-end",
  flexGrow: 1,
})

const SaveMargined = styled(SaveIcon)({
  margin: "0 0 0 .25rem",
})

const Quit = styled(QuitIcon)({
  margin: "0 .5rem",
  cursor: "pointer",
})

const InputResponsiveWrapper = styled.div({
  margin: ".5rem",
  maxWidth: "14rem",
  display: "flex",
})

const TopBarRightWrapper = styled.div({
  display: "flex",
  flexGrow: 1,
  alignItems: "center",
})

const TopBarWrapper = styled.div({
  background: "rgba(82, 82, 82, 0.5)",
  backdropFilter: "blur(40px)",
  display: "flex",
  width: "100%",
  position: "relative",
  zIndex: 10,
  alignItems: "center",
  padding: ".45rem 2rem",
  "@media (max-width: 30rem)": {
    padding: ".45rem .5rem",
  },
})
