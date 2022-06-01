/* @refresh reload */
import { Component, onMount } from "solid-js";
import { styled } from "solid-styled-components";
import { buttonSounds } from "../common/audio/button";
import { activeScene, Scenes, setScene } from "../common/scene";
import { preloadPrimitiveAudio, preloadAudio } from "../common/audio";
import { useStateContext } from "../components/Context/StateContext";
import TopBar from "../components/TopBar";
import MediaPlayer from "../components/MediaPlayer";
import RestoreBackdrop from "../components/RestoreBackdrop";
import CopyBackdrop from "../components/CopyBackdrop";
import IdeaBrowser from "../components/IdeaBrowser";
const Home: Component = () => {
  const ctx = useStateContext();

  onMount(async () => {
    preloadPrimitiveAudio();
    preloadAudio(activeScene().audio);
    addEventListener("keyup", onShortcutKey);
    ctx.setVideo(true);
  });

  let i = 0;

  function onShortcutKey(e: KeyboardEvent) {
    if (
      e.target instanceof HTMLTextAreaElement ||
      e.target instanceof HTMLInputElement
    ) {
      return;
    }
    switch (e.key) {
      case "n":
        i = (i + 1) % Scenes.length;
        setScene(Scenes[i]);
        buttonSounds.onClick();
        break;

      case "b":
        i = i < 1 ? Scenes.length - 1 : (i - 1) % Scenes.length;
        setScene(Scenes[i]);
        buttonSounds.onClick();
        break;

      case e.ctrlKey && ctx.keypair.loaded && ctx.list.loaded && "c":
        ctx.setCopyClipboard(true);
        break;

      case "m":
        ctx.toggleMute();
        buttonSounds.onClick();
        break;
    }
  }

  return (
    <Container>
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
