import { Show } from "solid-js"
import SaveIcon from "./Svg/SaveIcon"
import { useStateContext } from "@Common/Context/StateContext"
import { buttonSounds } from "@Common/Audio/AudioSource"
import EditIcon from "@Components/Svg/EditIcon"
import GreenButton from "@Components/Primitive/GreenButton"
import Input from "@Components/Primitive/Input"
import styles from "./TopBarLoadedActions.module.css"
import QuitIcon from "@Components/Svg/QuitIcon"

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
        style={{ padding: ".65rem .5rem .65rem 1.15rem" }}
        onClick={onAddNoteClicked}
      >
        Add
        <EditIcon style={{ margin: "0 0 0 .25rem" }} height="1.2rem" />
      </GreenButton>
      <GreenButton
        style={{ padding: ".65rem .75rem .65rem 1.15rem" }}
        onClick={onSaveClicked}
      >
        Save
        <SaveIcon style={{ margin: "0 0 0 .25rem" }} height="1.2rem" />
      </GreenButton>

      <div class={styles.topbarRightWrapper}>
        <div class={styles.inputResponsiveWrapper}>
          <Input
            width="100%"
            style={{ margin: 0 }}
            value={ctx.notes.name}
            placeholder="Notes name"
            onInput={e => ctx.setNotesName(e.currentTarget.value)}
          />
        </div>
        <div class={styles.icons}>
          <QuitIcon
            {...buttonSounds}
            class={styles.quitIcon}
            onMouseDown={e => e.preventDefault()}
            onClick={onQuitClicked}
          />
        </div>
      </div>
    </Show>
  )
}

export default TopBarLoadedActions
