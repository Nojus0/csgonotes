import { JSX } from "solid-js"
import styles from "@Styles/Button.module.css"
import { buttonSounds } from "@Common/Audio/AudioSource"

export default function TextButton(
  p: JSX.ButtonHTMLAttributes<HTMLButtonElement>
) {
  return (
    <button
      {...buttonSounds}
      {...p}
      class={styles.textButton + (p.class != null ? " " + p.class : "")}
    >
      {p.children}
    </button>
  )
}
