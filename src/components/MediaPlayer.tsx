import { Component, createEffect, createMemo, on, Show } from "solid-js";
import { styled } from "solid-styled-components";
import { userInteracted } from "../common/audio/chromeInteraction";
import { activeScene } from "../common/scene";
import { useStateContext } from "./Context/StateContext";

const MediaPlayer: Component = () => {
  const ctx = useStateContext();

  function refCapture(e: HTMLVideoElement | HTMLAudioElement) {
    createEffect(() => {
      activeScene();
      e.load();
    });
  }

  return (
    <>
      <Show when={ctx.showVideo}>
        <Video
          preload="auto"
          ref={refCapture}
          loop
          autoplay
          muted
          draggable={false}
        >
          <source type="video/webm" src={activeScene().video} />
        </Video>
      </Show>
      <Show when={userInteracted() && !ctx.muted}>
        <audio ref={refCapture} loop autoplay>
          <source type="audio/ogg" src={activeScene().audio} />
        </audio>
      </Show>
    </>
  );
};

export default MediaPlayer;

const Video = styled.video({
  position: "absolute",
  top: 0,
  left: 0,
  filter: "brightness(90%)",
  zIndex: 0,
  objectFit: "cover",
  userSelect: "none",
  height: "100%",
  width: "100%",
});
