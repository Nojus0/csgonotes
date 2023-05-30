import { Component, createEffect, on, Show } from "solid-js"
import { activeScene } from "@Common/Scene"
import { useStateContext } from "@Common/Context/StateContext"
import { userInteracted } from "@Common/Audio/ChromeFix"
import styles from "./MediaPlayer.module.css"

const MediaPlayer: Component = () => {
  const ctx = useStateContext()

  function refCapture(e: HTMLVideoElement | HTMLAudioElement) {
    createEffect(
      on(activeScene, () => {
        e.load()
      })
    )
  }

  return (
    <>
      <Show when={ctx.showVideo}>
        <video
          class={styles.video}
          preload="auto"
          ref={refCapture}
          loop
          autoplay
          muted
          draggable={false}
        >
          <source type="video/webm" src={activeScene().video} />
        </video>
      </Show>
      <Show when={userInteracted() && !ctx.muted}>
        <audio ref={refCapture} loop autoplay>
          <source type="audio/ogg" src={activeScene().audio} />
        </audio>
      </Show>
    </>
  )
}

export default MediaPlayer
