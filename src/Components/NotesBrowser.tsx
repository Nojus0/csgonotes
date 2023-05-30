import { buttonSounds } from "@Common/Audio/AudioSource"
import { Component, For, Show } from "solid-js"
import { styled } from "solid-styled-components"
import { useStateContext } from "@Common/Context/StateContext"
import TextArea from "@Components/Primitive/TextArea"
import TextButton from "@Components/Primitive/TextButton"
import styles from "./NotesBrowser.module.css"

const NotesBrowser: Component = () => {
  const ctx = useStateContext()

  return (
    <div class={styles.browser}>
      <Show when={ctx.notes.loaded}>
        <For each={ctx.notes.ideas}>
          {(todo, i) => (
            <div style={{ padding: "1rem" }}>
              <div class={styles.card}>
                <TextArea
                  cols={30}
                  rows={10}
                  value={todo}
                  onChange={e => ctx.updateIdeaText(i(), e.currentTarget.value)}
                />
                <TextButton
                  class={styles.deleteButton}
                  style={{ padding: ".5rem 1rem" }}
                  onClick={() => {
                    ctx.deleteIdea(i())
                    buttonSounds.onClick()
                  }}
                >
                  Delete
                </TextButton>
              </div>
            </div>
          )}
        </For>
      </Show>
    </div>
  )
}

export default NotesBrowser
