export interface ILoaded {
  loaded: boolean
}

import { JSX } from "solid-js"
export type TransitionProps = {
  name?: string
  enterActiveClass?: string
  enterClass?: string
  enterToClass?: string
  exitActiveClass?: string
  exitClass?: string
  exitToClass?: string
  onBeforeEnter?: (el: Element) => void
  onEnter?: (el: Element, done: () => void) => void
  onAfterEnter?: (el: Element) => void
  onBeforeExit?: (el: Element) => void
  onExit?: (el: Element, done: () => void) => void
  onAfterExit?: (el: Element) => void
  children?: JSX.Element
  appear?: boolean
  mode?: "inout" | "outin"
}

/**
 * Example `2020 January 5 @ 7'40 PM` 
 */
export function getExportTime() {
  const currentTime = new Date();

  const year = currentTime.getFullYear();
  const month = currentTime.toLocaleString("en-US", { month: "long" });
  const day = currentTime.getDate();
  const hour = currentTime.getHours();
  const minute = currentTime.getMinutes();

  const hourPm = (hour % 12) || 12; // if hour is 0, use 12 instead
  const amPm = (hour < 12) ? "AM" : "PM";
  return `${year} ${month} ${day} @ ${hourPm}'${minute} ${amPm}`
}