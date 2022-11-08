import { Component, Show } from "solid-js"
import { styled } from "solid-styled-components"
import { useStateContext } from "@Common/Context/StateContext"
import { InspectUri } from "./CopyBackdrop"
import TopBarFirstStage from "@Components/TopBarFirstStage"
import TopBarSecondStage from "@Components/TopBarSecondStage"
import TopBarLoadedActions from "@Components/TopBarLoadedActions"

const TopBar: Component = () => {
  const ctx = useStateContext()

  const { IsSerializedLink } = InspectUri()

  if (IsSerializedLink) {
    ctx.setShowTopbar(false)
  }

  return (
    <Show when={ctx.showTopbar}>
      <TopBarWrapper>
        <TopBarFirstStage />
        <TopBarSecondStage />
        <TopBarLoadedActions />
      </TopBarWrapper>
    </Show>
  )
}

export default TopBar

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
})
