import { Component, createEffect, onMount, Show } from "solid-js";
import { styled } from "solid-styled-components";
import { buttonSounds } from "../common/audio/button";
import { useStateContext } from "./Context/StateContext";
import { InspectUri } from "./CopyBackdrop";
import { GreenButton } from "./Primitive/Button";
import { Input } from "./Primitive/Input";
import QuitIcon from "./Svg/QuitIcon";
import SaveIcon from "./Svg/SaveIcon";

const TopBar: Component = () => {
  const ctx = useStateContext();

  const { IsSerializedLink } = InspectUri();

  if (IsSerializedLink) {
    ctx.setShowTopbar(false);
  }

  return (
    // No flicker because ideas and show top bar is applied at once
    <Show when={ctx.showTopbar}>
      <TopBarWrapper>
        {!ctx.keypair.loaded && !ctx.list.loaded && (
          <GreenButton
            onClick={() => ctx.loadKeyPair() && buttonSounds.onClick()}
          >
            Load Keypair
          </GreenButton>
        )}

        {ctx.keypair.loaded && !ctx.list.loaded && (
          <>
            <GreenButton
              onClick={() => ctx.loadList() && buttonSounds.onClick()}
            >
              Load List
            </GreenButton>
            <GreenButton
              onClick={() => ctx.newList() && buttonSounds.onClick()}
            >
              New List
            </GreenButton>
          </>
        )}

        {ctx.list.loaded && (
          <>
            <AdaptiveGreenButton
              onClick={() => {
                ctx.newIdea();
                buttonSounds.onClick();
              }}
            >
              Add
            </AdaptiveGreenButton>
            <AdaptiveGreenButton
              onClick={() => ctx.saveList() && buttonSounds.onClick()}
            >
              <SaveMargined height="1.2rem" />
              Save
            </AdaptiveGreenButton>
          </>
        )}

        {!ctx.keypair.loaded && (
          <GreenButton
            onClick={() => ctx.newKeypair() && buttonSounds.onClick()}
          >
            New Keypair
          </GreenButton>
        )}

        <Show when={ctx.keypair.loaded && ctx.list.loaded}>
          <TopBarRightWrapper>
            <InputResponsiveWrapper>
              <Input
                width="100%"
                margin="0"
                value={ctx.list.name}
                placeholder="List name"
                onInput={(e) => ctx.setListName(e.currentTarget.value)}
              />
            </InputResponsiveWrapper>
            <Icons>
              <Quit
                {...buttonSounds}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  ctx.resetCredentials();
                  buttonSounds.onClick();
                }}
              />
            </Icons>
          </TopBarRightWrapper>
        </Show>
      </TopBarWrapper>
    </Show>
  );
};

export default TopBar;

const AdaptiveGreenButton = styled(GreenButton)({
  padding: ".65rem 1.75rem",
  "@media (max-width: 30rem)": {
    padding: ".65rem 1rem",
  },
});

const Icons = styled.div({
  display: "flex",
  justifyContent: "flex-end",
  flexGrow: 1,
});

const SaveMargined = styled(SaveIcon)({
  margin: "0 .2rem 0 0",
});

const Quit = styled(QuitIcon)({
  margin: "0 .5rem",
  cursor: "pointer",
});

const InputResponsiveWrapper = styled.div({
  margin: ".5rem",
  maxWidth: "14rem",
  display: "flex",
});

const TopBarRightWrapper = styled.div({
  display: "flex",
  flexGrow: 1,
  alignItems: "center",
});

const TopBarWrapper = styled.div({
  background: "rgba(82, 82, 82, 0.5)",
  backdropFilter: "blur(40px)",
  display: "flex",
  width: "100%",
  position: "relative",
  zIndex: 10,
  alignItems: "center",
  padding: ".45rem 2rem",
  "@media (max-width: 30rem)": {
    padding: ".45rem .5rem",
  },
});
