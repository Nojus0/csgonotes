import { styled } from "solid-styled-components";

export const Input = styled.input(() => ({
  borderRadius: ".2rem",
  background: "transparent",
  outline: "none",
  fontSize: "1.2rem",
  padding: ".5rem 0 .5rem .5rem",
  border: ".1rem solid #dadada",
  margin: ".5rem",
  color: "#efefef",
  fontWeight: 400,
  "&::placeholder": {
    color: "#dadada",
  },
}));
