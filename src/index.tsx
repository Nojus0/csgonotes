/* @refresh reload */
import { preloadAudio, preloadPrimitiveAudio } from "@Common/Audio/Preload"
import { activeScene } from "@Common/Scene"
import CopyBackdrop from "@Components/CopyBackdrop"
import IdeaBrowser from "@Components/IdeaBrowser"
import MediaPlayer from "@Components/MediaPlayer"
import RestoreBackdrop from "@Components/RestoreBackdrop"
import ShortcutManager from "@Components/ShortcutManager"
import TopBar from "@Components/TopBar"
import { onMount } from "solid-js"
import { render } from "solid-js/web"
import { styled } from "solid-styled-components"
import {
  StateContextProvider,
  useStateContext,
} from "@Common/Context/StateContext"
import ServiceWorker from "@Components/ServiceWorker"

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
    <Container>
      <ShortcutManager />
      <CopyBackdrop />
      <RestoreBackdrop />
      <TopBar />
      <MediaPlayer />
      <IdeaBrowser />
      <ServiceWorker />
    </Container>
  )
}

const Container = styled.div({
  width: "100%",
  height: "100%",
  display: "flex",
  position: "relative",
  flexDirection: "column",
})

render(
  () => (
    <StateContextProvider>
      <Index />
    </StateContextProvider>
  ),
  document.getElementById("root") as HTMLElement
)
