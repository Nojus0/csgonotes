import { styled } from "solid-styled-components"

export interface IInput {
  margin?: string
  width?: string
}

export const Input = styled.input(
  ({ margin = ".5rem", width = "10rem" }: IInput) => ({
    margin,
    width,
    borderRadius: ".2rem",
    background: "transparent",
    outline: "none",
    fontSize: "1.15rem",
    padding: ".35rem",
    color: "#efefef",
    border: ".1rem solid #b6b6b6",
    fontWeight: 400,
    "&::placeholder": {
      color: "#b6b6b6",
    },
  })
)

export const TextArea = styled.textarea({
  resize: "none",
  height: "100%",
  maxWidth: "100%",
  width: "100%",
  background: "transparent",
  border: "none",
  cursor: "auto",
  outline: "none",
  color: "white",
  fontSize: "1.4rem",
  "&::-webkit-scrollbar": {
    width: "10px",
  },
  "&::-webkit-scrollbar-track": {
    borderRadius: "15rem",
    background: "rgba(82, 82, 82, 0.5)",
  },
  "&::-webkit-scrollbar-thumb": {
    borderRadius: "5rem",
    background: "#2e2e2e",
    backgroundClip: "content-box",
    border: "3px solid transparent",
  },
  "&::-webkit-scrollbar-thumb:hover": {
    background: "#2e2e2e",
    backgroundClip: "content-box",
    border: "1px solid transparent",
  },
})
