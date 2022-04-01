import { styled } from "solid-styled-components";

interface IBasicButtonProps {
  padding?: string;
  margin?: string;
}

export const GreenButton = styled.button(
  ({ margin = ".5rem", padding = ".75rem 1.15rem" }: IBasicButtonProps) => ({
    margin,
    padding,
    backgroundColor: "#4caf50",
    color: "white",
    border: "none",
    fontWeight: 500,
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

export const TextButton = styled.button(
  ({ margin = ".5rem", padding = ".75rem 1.15rem" }: IBasicButtonProps) => ({
    border: "none",
    margin,
    padding,
    color: "white",
    cursor: "pointer",
    fontWeight: 500,
    fontSize: "1rem",
    outline: "none",
    borderRadius: ".2rem",
    background:
      "linear-gradient(to left, transparent 50%, rgba(0,0,0,0.2) 50%) right",
    backgroundSize: "200%",
    transition: "300ms ease",
    "&:hover": {
      backgroundPosition: "left",
    },
  })
);
