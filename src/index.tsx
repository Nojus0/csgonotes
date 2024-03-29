/* @refresh reload */
import "@Styles/index.css"
import { preloadAudio, preloadPrimitiveAudio } from "@Common/Audio/Preload"
import { activeScene } from "@Common/Scene"
import CopyBackdrop from "@Components/CopyBackdrop"
import NotesBrowser from "@Components/NotesBrowser"
import MediaPlayer from "@Components/MediaPlayer"
import RestoreBackdrop from "@Components/RestoreBackdrop"
import ShortcutManager from "@Components/ShortcutManager"
import TopBar from "@Components/TopBar"
import { onMount } from "solid-js"
import { render } from "solid-js/web"
import {
  StateContextProvider,
  useStateContext,
} from "@Common/Context/StateContext"
import CompatabilityBackdrop from "@Components/CompatabilityBackdrop"
import styles from "./index.module.css"

function Index() {
  const ctx = useStateContext()
  onMount(() => {
    // Load video after render
    ctx.setVideo(true)
    preloadPrimitiveAudio()
    // Preload current scene audio in the background, IF the user has not interacted with the page
    // the audio will not preload, so the audio will start loading when he presses
    // somewhere on the page, we preload current scene audio on page load.
    preloadAudio(activeScene().audio)
  })

  return (
    <div class={styles.container}>
      <ShortcutManager />
      <CopyBackdrop />
      <RestoreBackdrop />
      <CompatabilityBackdrop />
      <TopBar />
      <MediaPlayer />
      <NotesBrowser />
    </div>
  )
}

export const MOUNT_ELEMENT = document.getElementById("root") as HTMLElement

render(
  () => (
    <StateContextProvider>
      <Index />
    </StateContextProvider>
  ),
  MOUNT_ELEMENT
)
