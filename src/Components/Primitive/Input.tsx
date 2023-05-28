import { JSX } from "solid-js"
import styles from "@Styles/Input.module.css"

export default function Input(p: JSX.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input {...p} class={styles.input + (p.class != null ? " " + p.class : "")}>
      {p.children}
    </input>
  )
}
