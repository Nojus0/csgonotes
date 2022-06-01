import { Component, JSX } from "solid-js";
import { styled } from "solid-styled-components";
import { buttonSounds } from "../../common/audio/button";

interface IBasicButtonProps {
  padding?: string;
  margin?: string;
}

export const GreenButton: Component<
  IBasicButtonProps & JSX.ButtonHTMLAttributes<HTMLButtonElement>
> = (p) => {
  return <GreenButtonStyle {...buttonSounds} {...p} />;
};

const GreenButtonStyle = styled.button(
  ({ margin = ".5rem", padding = ".65rem 1.15rem" }: IBasicButtonProps) => ({
    margin,
    padding,
    backgroundColor: "#4caf50",
    color: "white",
    border: "none",
    fontWeight: 500,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "1rem",
    fontFamily: "stratum, sans-serif",
    outline: "none",
    borderRadius: ".2rem",
    cursor: "pointer",
    "&:hover": {
      backgroundColor: "#52C55F",
    },
  })
);

export const TextButton: Component<
  IBasicButtonProps & JSX.ButtonHTMLAttributes<HTMLButtonElement>
> = (p) => {
  return <TextButtonStyle {...buttonSounds} {...p} />;
};

const TextButtonStyle = styled.button(
  ({ margin = ".5rem", padding = ".75rem 1.15rem" }: IBasicButtonProps) => ({
    border: "none",
    margin,
    padding,
    userSelect: "none",
    fontSize: "1rem",
    color: "white",
    cursor: "pointer",
    fontWeight: 500,
    outline: "none",
    borderRadius: ".2rem",
    background:
      "linear-gradient(to left, transparent 50%, rgba(0,0,0,0.2) 50%) right",
    backgroundSize: "205%",
    transition: "300ms ease",
    "&:hover": {
      backgroundPosition: "left",
    },
  })
);
