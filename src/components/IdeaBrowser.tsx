import { Component, For, Show } from "solid-js";
import { styled } from "solid-styled-components";
import { buttonSounds } from "../common/audio/button";
import { useStateContext } from "../common/Context/StateContext";
import { TextButton } from "./Primitive/Button";
import { TextArea } from "./Primitive/Input";

const IdeaBrowser: Component = () => {
  const ctx = useStateContext();

  return (
    <Browser>
      <Show when={ctx.list.loaded}>
        <For each={ctx.list.ideas}>
          {(todo, i) => (
            <CardContainer>
              <Card>
                <TextArea
                  cols={30}
                  rows={10}
                  value={todo}
                  onChange={(e) =>
                    ctx.updateIdeaText(i(), e.currentTarget.value)
                  }
                />
                <DeleteButton
                  padding=".5rem 1rem"
                  onClick={() => {
                    ctx.deleteIdea(i());
                    buttonSounds.onClick();
                  }}
                >
                  Delete
                </DeleteButton>
              </Card>
            </CardContainer>
          )}
        </For>
      </Show>
    </Browser>
  );
};

export default IdeaBrowser;

const DeleteButton = styled(TextButton)({
  position: "absolute",
  bottom: 0,
  fontWeight: 400,
  fontSize: "1.15rem",
  right: 0,
});

const CardContainer = styled.div({
  padding: "1rem",
});

const Card = styled.div({
  background: "rgb(82, 82, 82, 0.999)",
  minWidth: "calc(100% / 3)",
  padding: "1rem 1rem 2.9rem 1rem",
  position: "relative",
  borderRadius: ".25rem"
});



// TODO Seperate file

const Browser = styled.div({
  display: "flex",
  overflowY: "auto",
  position: "relative",
  flexWrap: "wrap",
  flexGrow: 1,
  zIndex: 10,
  padding: "0 1.5rem",
  "@media (max-width: 30rem)": {
    padding: "0",
  },
  alignItems: "flex-start",
  justifyContent: "flex-start",
  width: "100%",
  "&::-webkit-scrollbar": {
    width: "14px",
  },
  "&::-webkit-scrollbar-track": {
    // borderRadius: "15rem",
    background: "rgba(82, 82, 82, 0.5)",
  },
  "&::-webkit-scrollbar-thumb": {
    borderRadius: "5rem",
    background: "#2e2e2e",
    backgroundClip: "content-box",
    border: "4px solid transparent",
  },
  "&::-webkit-scrollbar-thumb:hover": {
    background: "#2e2e2e",
    backgroundClip: "content-box",
    border: "3px solid transparent",
  },
});
