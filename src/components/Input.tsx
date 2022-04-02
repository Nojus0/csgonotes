import { styled } from "solid-styled-components";

export const Input = styled.input(() => ({
  borderRadius: ".2rem",
  background: "transparent",
  outline: "none",
  fontSize: "1.2rem",
  padding: ".5rem",
  border: ".1rem solid #949494",
  margin: ".5rem",
  color: "#efefef",
  fontWeight: 400,
  "&::placeholder": {
    color: "#949494",
  },
}));

export const TextArea = styled.textarea({
  resize: "none",
  height: "100%",
  background: "transparent",
  border: "none",
  outline: "none",
  color: "white",
  fontSize: "1.4rem",
  "&::selection": {
    background: "#2c2c2c80",
  },
});
