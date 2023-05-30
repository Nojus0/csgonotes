import {
  Component,
  createDeferred,
  createEffect,
  createMemo,
  createRenderEffect,
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
  const [shouldStayMounted, setStayMounted] = createSignal(false)

  function onClick(e: MouseEvent) {
    e.target == e.currentTarget && p.onBackgroundClick()
  }

  function getStyle() {
    const style: JSX.CSSProperties = {}
    p.width && (style.width = p.width)
    return style
  }

  createEffect(() => {
    // console.log(p.when, inTransition())
  })

  function playFadeInAnimation(ref: HTMLDivElement) {
    return ref.animate([{ opacity: 0 }, { opacity: 1 }], {
      easing: "ease-in-out",
      duration: BACKDROP_FADE_DURATION,
    })
  }

  function playFadeOutAnimation(ref: HTMLDivElement) {
    return ref.animate([{ opacity: 1 }, { opacity: 0 }], {
      easing: "ease-in-out",
      duration: BACKDROP_FADE_DURATION,
    })
  }

  function onBackdropElementRefBeforeMount(ref: HTMLDivElement) {
    onMount(() => {
      createEffect(() => {
        if (p.when) {
          setStayMounted(true)
          playFadeInAnimation(ref)
          return
        }

        setStayMounted(true)
        playFadeOutAnimation(ref).finished.then(() => setStayMounted(false))
      })
    })
  }

  return (
    <Show when={p.when || shouldStayMounted()}>
      <div
        ref={onBackdropElementRefBeforeMount}
        onClick={onClick}
        class={styles.backdropDimBackground}
      >
        <div class={styles.popupWrapper} style={getStyle()}>
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
// if (whenSignal()) {
//   ref.animate([{ opacity: 0 }, { opacity: 1 }], {
//     easing: "ease-in-out",
//     duration: 500,
//   })
// } else {
//   setTransition(true)
//   ref
//     .animate([{ opacity: 1 }, { opacity: 0 }], {
//       easing: "ease-in-out",
//       duration: 500,
//     })
//     .finished.then(() => setTransition(false))
// }
export function Description(p: JSX.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      {...p}
      class={styles.description + (p.class != null ? " " + p.class : "")}
    ></p>
  )
}

export default Backdrop
