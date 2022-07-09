import { buttonSounds } from "@common/audio/AudioSource";
import { Component, createEffect, onMount, Show } from "solid-js";
import { styled } from "solid-styled-components";
import { useStateContext } from "../common/Context/StateContext";
import { InspectUri } from "./CopyBackdrop";
import { GreenButton } from "./Primitive/Button";
import { Input } from "./Primitive/Input";
import EditIcon from "./Svg/EditIcon";
import KeyIcon from "./Svg/KeyIcon";
import QuitIcon from "./Svg/QuitIcon";
import SafeIcon from "./Svg/SafeIcon";
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
            padding=".65rem .85rem .65rem 1.15rem"
            onClick={() => ctx.loadKeyPair() && buttonSounds.onClick()}
          >
            Load Key
            <Key height="1.2rem" />
          </GreenButton>
        )}

        {!ctx.keypair.loaded && (
          <GreenButton
            padding=".65rem .85rem .65rem 1.15rem"
            onClick={() => ctx.newKeypair() && buttonSounds.onClick()}
          >
            New Key
            <Key height="1.2rem" />
          </GreenButton>
        )}

        {ctx.keypair.loaded && !ctx.list.loaded && (
          <>
            <GreenButton
              padding=".65rem .85rem .65rem 1.15rem"
              onClick={() => ctx.loadList() && buttonSounds.onClick()}
            >
              Load List
              <Safe height="1.2rem" />
            </GreenButton>
            <GreenButton
              padding=".65rem .85rem .65rem 1.15rem"
              onClick={() => ctx.newList() && buttonSounds.onClick()}
            >
              New List
              <Safe height="1.2rem" />
            </GreenButton>
          </>
        )}

        {ctx.list.loaded && (
          <>
            <GreenButton
              padding=".65rem .5rem .65rem 1.15rem"
              onClick={() => {
                ctx.newIdea();
                buttonSounds.onClick();
              }}
            >
              Add
              <Edit height="1.2rem" />
            </GreenButton>
            <GreenButton
              padding=".65rem .75rem .65rem 1.15rem"
              onClick={() => ctx.saveList() && buttonSounds.onClick()}
            >
              Save
              <SaveMargined height="1.2rem" />
            </GreenButton>
          </>
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

const Edit = styled(EditIcon)({
  margin: "0 0 0 .25rem",
});

const Safe = styled(SafeIcon)({
  margin: "0 0 0 .25rem",
});

const Key = styled(KeyIcon)({
  margin: "0 0 0 .25rem",
});

const Icons = styled.div({
  display: "flex",
  justifyContent: "flex-end",
  flexGrow: 1,
});

const SaveMargined = styled(SaveIcon)({
  margin: "0 0 0 .25rem",
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
