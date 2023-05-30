import { Component, Show } from "solid-js"
import styles from "./TopBar.module.css"
import { useStateContext } from "@Common/Context/StateContext"
import TopBarFirstStage from "@Components/TopBarFirstStage"
import TopBarSecondStage from "@Components/TopBarSecondStage"
import TopBarLoadedActions from "@Components/TopBarLoadedActions"

const TopBar: Component = () => {
  const ctx = useStateContext()

  // Avoid flicker because parsing is done onMount and async

  return (
    <Show when={ctx.showTopbar}>
      <div class={styles.topbarWrapper}>
        <TopBarFirstStage />
        <TopBarSecondStage />
        <TopBarLoadedActions />
      </div>
    </Show>
  )
}

export default TopBar
