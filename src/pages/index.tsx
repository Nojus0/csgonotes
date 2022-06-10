/* @refresh reload */
import { Component, createEffect, onMount } from "solid-js";
import { styled } from "solid-styled-components";
import { activeScene, Scenes, setScene } from "../common/scene";
import { preloadPrimitiveAudio, preloadAudio } from "../common/audio/preload";
import { useStateContext } from "../common/Context/StateContext";
import TopBar from "../components/TopBar";
import MediaPlayer from "../components/MediaPlayer";
import RestoreBackdrop from "../components/RestoreBackdrop";
import CopyBackdrop from "../components/CopyBackdrop";
import IdeaBrowser from "../components/IdeaBrowser";
import ShortcutManager from "components/ShortcutManager";
const Home: Component = () => {
  const ctx = useStateContext();

  onMount(() => {
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
};

const Container = styled.div({
  width: "100%",
  height: "100%",
  display: "flex",
  position: "relative",
  flexDirection: "column",
});

export default Home;
