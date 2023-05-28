import {
  Component,
  createEffect,
  createMemo,
  createSignal,
  JSX,
  onCleanup,
  onMount,
  Show,
} from "solid-js"
import styles from "./Backdrop.module.css"

export interface IBackdrop {
  when: boolean
  onBackgroundClick: () => void
  title: string
  width?: string
  description: JSX.Element
  children: any
}

export const BACKDROP_FADE_DURATION = 150

// BETER FUNC ARCHITECTURE
const Backdrop: Component<IBackdrop> = p => {
  const [isShown, setShown] = createSignal(false)

  function onClick(e: MouseEvent) {
    e.target == e.currentTarget && p.onBackgroundClick()
  }

  return (
    <Show when={p.when}>
      <div onClick={onClick} class={styles.darken}>
        <div class={styles.popupWrapper} style={{ width: p.width || "" }}>
          <div class={styles.header}>
            <h2 class={styles.headerText}>{p.title}</h2>
          </div>
          <div class={styles.descriptionContainer}>{p.description}</div>
          <div class={styles.buttonRow}>{p.children}</div>
        </div>
      </div>
    </Show>
  )
}

export function Description(p: JSX.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      {...p}
      class={styles.description + (p.class != null ? " " + p.class : "")}
    ></p>
  )
}

export default Backdrop
