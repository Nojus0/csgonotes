import { Component, createEffect, on, Show } from "solid-js";
import { styled } from "solid-styled-components";
import { activeScene } from "@Common/Scene";
import { useStateContext } from "@Common/Context/StateContext";
import { userInteracted } from "@Common/Audio/ChromeFix";

const MediaPlayer: Component = () => {
  const ctx = useStateContext();

  function refCapture(e: HTMLVideoElement | HTMLAudioElement) {
    createEffect(on(activeScene, ()=> {
        e.load()        
    }));
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
  zIndex: 0,
  objectFit: "cover",
  userSelect: "none",
  height: "100%",
  width: "100%",
});
