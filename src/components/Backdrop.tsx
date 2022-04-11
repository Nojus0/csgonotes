import { Component, onCleanup, Setter, Show } from "solid-js";
import { styled } from "solid-styled-components";
import { ButtonSounds } from "../common/audio/button";
import { TextButton } from "./Button";
import { Transition } from "solid-transition-group";
import { getFadeAnimation } from "../common/animations/fade";

export interface IBackdrop {
  when: boolean;
  setWhen: Setter<boolean>;
}

// ! UNUSED !
const Backdrop: Component<IBackdrop> = (p) => {
  return (
    <Transition {...getFadeAnimation(150)}>
      <Show when={p.when}>
        <Darken>
          <PopupWrapper
            ref={(el) => {
              const onClick = (e: MouseEvent) => {
                if (el.contains(e.target as Node)) return;
                p.setWhen(false);
              };

              document.body.addEventListener("click", onClick);

              onCleanup(() =>
                document.body.removeEventListener("click", onClick)
              );
            }}
          >
            <Header>
              <HeaderText>Settings</HeaderText>
            </Header>
            <Description>Example</Description>
            <ButtonRow>
              <TextButton
                onClick={() => {
                  p.setWhen((prev) => !prev);
                  ButtonSounds.onClick();
                }}
              >
                Close
              </TextButton>
              <TextButton>Ok</TextButton>
            </ButtonRow>
          </PopupWrapper>
        </Darken>
      </Show>
    </Transition>
  );
};

// export default Backdrop;

const ButtonRow = styled.div({
  display: "flex",
  alignSelf: "flex-end",
  flexWrap: "wrap",
  margin: ".35rem",
});

const HeaderText = styled.h2({
  letterSpacing: "0.095em",
  color: "#9A9A9A",
  userSelect: "none",
  fontWeight: "bold",
  margin: ".75rem 1.5rem",
  fontSize: "1.5rem",
});
const Header = styled.div({
  display: "flex",
  width: "100%",
  background: "#252525",
});

const Description = styled.p({
  lineHeight: "24px",
  color: "#CCCCCC",
  userSelect: "none",
  margin: "1.5rem",
});

const PopupWrapper = styled.div({
  display: "flex",
  flexDirection: "column",
  width: "30rem",
  background: "#2C2C2C",
  border: ".1rem solid #444444",
});

interface IDarken {
  opacity: number;
}

const Darken = styled.div({
  height: "100vh",
  width: "100vw",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 1020,
  position: "absolute",
  // transition: "500ms opacity ease-in-out",
  top: 0,
  left: 0,
  background: "rgba(0, 0, 0, 0.5)",
});