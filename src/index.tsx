/* @refresh reload */
import { render } from "solid-js/web";
import Home from "./pages";
import { registerSW } from "virtual:pwa-register";

render(() => <Home />, document.getElementById("root") as HTMLElement);

registerSW();
