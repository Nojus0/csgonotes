/* @refresh reload */
import { preloadAudio, preloadPrimitiveAudio } from "@common/audio/Preload";
import { activeScene } from "@common/Scene";
import CopyBackdrop from "components/CopyBackdrop";
import IdeaBrowser from "components/IdeaBrowser";
import MediaPlayer from "components/MediaPlayer";
import RestoreBackdrop from "components/RestoreBackdrop";
import ShortcutManager from "components/ShortcutManager";
import TopBar from "components/TopBar";
import { Component, onMount } from "solid-js";
import { render } from "solid-js/web";
import { styled } from "solid-styled-components";
import {
  StateContextProvider,
  useStateContext,
} from "./common/Context/StateContext";

function Index() {
  const ctx = useStateContext();

  onMount(() => {
    // Load video after render
    ctx.setVideo(true);
    preloadPrimitiveAudio();

    // Preload current scene audio in the background, IF the user has not interacted with the page
    // the audio will not preload, so the audio will start loading when he presses
    // somewhere on the page, we preload current scene audio on page load.
    preloadAudio(activeScene().audio);
  });

  return (
    <Container>
      <ShortcutManager />
      <CopyBackdrop />
      <RestoreBackdrop />
      <TopBar />
      <MediaPlayer />
      <IdeaBrowser />
    </Container>
  );
}
const Container = styled.div({
  width: "100%",
  height: "100%",
  display: "flex",
  position: "relative",
  flexDirection: "column",
});

render(
  () => (
    <StateContextProvider>
      <Index />
    </StateContextProvider>
  ),
  document.getElementById("root") as HTMLElement
);
