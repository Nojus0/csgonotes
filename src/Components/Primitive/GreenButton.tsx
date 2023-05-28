import { JSX } from "solid-js"
import styles from "@Styles/Button.module.css"
import { buttonSounds } from "@Common/Audio/AudioSource"

export default function GreenButton(
  p: JSX.ButtonHTMLAttributes<HTMLButtonElement>
) {
  return (
    <button
      {...buttonSounds}
      {...p}
      class={styles.greenButton + (p.class != null ? " " + p.class : "")}
    >
      {p.children}
    </button>
  )
}
