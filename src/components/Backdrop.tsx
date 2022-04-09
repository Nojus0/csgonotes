import { Component, Show } from "solid-js";
import { styled } from "solid-styled-components";
import { TextButton } from "./Button";

export interface IBackdrop {
  when: boolean;
}

// ! UNUSED !
const Backdrop: Component<IBackdrop> = (p) => {
  return (
    <Show when={p.when}>
      <Darken>
        <PopupWrapper>
          <Header>
            <HeaderText>Settings</HeaderText>
          </Header>
          <Description>
          </Description>
          <ButtonRow>
            <TextButton>Static</TextButton>
            <TextButton>Dynamic</TextButton>
          </ButtonRow>
        </PopupWrapper>
      </Darken>
    </Show>
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

const Darken = styled.div({
  height: "100vh",
  width: "100vw",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 1020,
  position: "absolute",
  top: 0,
  left: 0,
  background: "rgba(0, 0, 0, 0.5)",
});
