import {Component, JSX, onCleanup, Show} from "solid-js";
import {styled} from "solid-styled-components";
import {Transition} from "solid-transition-group";
import {getFadeAnimation} from "@Common/Animations/Fade";

export interface IBackdrop {
    when: boolean;
    onBackgroundClick: () => void;
    title: string;
    width?: string
    description: JSX.Element;
    children: any
}

const Backdrop: Component<IBackdrop> = (p) => {
    return (
        <Transition {...getFadeAnimation(150)}>
            <Show when={p.when}>
                <Darken>
                    <PopupWrapper
                        width={p.width}
                        ref={(el) => {
                            const onClick = (e: MouseEvent) => {
                                if (el.contains(e.target as Node)) return;
                                p.onBackgroundClick();
                            };

                            document.body.addEventListener("click", onClick);

                            onCleanup(() =>
                                document.body.removeEventListener("click", onClick)
                            );
                        }}
                    >
                        <Header>
                            <HeaderText>{p.title}</HeaderText>
                        </Header>
                        <DescriptionContainer>
                            <Description>{p.description}</Description>
                        </DescriptionContainer>
                        <ButtonRow>{p.children}</ButtonRow>
                    </PopupWrapper>
                </Darken>
            </Show>
        </Transition>
    );
};

export default Backdrop;

const DescriptionContainer = styled.div({
    margin: "1rem 1.5rem .1rem 1.5rem",
});

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

export const Description = styled.p({
    lineHeight: "24px",
    color: "#CCCCCC",
    userSelect: "none",
    margin: ".25rem 0",
});

interface IPopupWrapper {
    width?: string
}

const PopupWrapper = styled.div((p: IPopupWrapper) => ({
    display: "flex",
    flexDirection: "column",
    width: p.width || "30rem",
    background: "#2C2C2C",
    border: ".1rem solid #444444",
}));


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
