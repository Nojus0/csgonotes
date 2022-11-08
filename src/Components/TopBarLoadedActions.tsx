import { GreenButton } from "@Components/Primitive/Button"
import { Show } from "solid-js"
import SaveIcon from "./Svg/SaveIcon"
import { styled } from "solid-styled-components"
import { useStateContext } from "@Common/Context/StateContext"
import { buttonSounds } from "@Common/Audio/AudioSource"
import EditIcon from "@Components/Svg/EditIcon"
import QuitIcon from "@Components/Svg/QuitIcon"
import { Input } from "@Components/Primitive/Input"

const TopBarLoadedActions = () => {
  const ctx = useStateContext()

  async function onAddNoteClicked() {
    buttonSounds.onClick()
    ctx.newIdea()
  }

  async function onSaveClicked() {
    buttonSounds.onClick()
    ctx.saveNotes()
  }

  async function onQuitClicked() {
    buttonSounds.onClick()
    ctx.resetCredentials()
  }

  return (
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
  )
}

const Icons = styled.div({
  display: "flex",
  justifyContent: "flex-end",
  flexGrow: 1,
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
const Edit = styled(EditIcon)({
  margin: "0 0 0 .25rem",
})

const SaveMargined = styled(SaveIcon)({
  margin: "0 0 0 .25rem",
})

export default TopBarLoadedActions
