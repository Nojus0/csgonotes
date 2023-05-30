import { JSX } from "solid-js"
import styles from "@Styles/Input.module.css"
import { buttonSounds } from "@Common/Audio/AudioSource"

export default function TextArea(
  p: JSX.TextareaHTMLAttributes<HTMLTextAreaElement>
) {
  return (
    <textarea
      {...p}
      class={styles.textarea + (p.class != null ? " " + p.class : "")}
    >
      {p.children}
    </textarea>
  )
}
