/* @refresh reload */
import { render } from "solid-js/web";
import Home from "./pages";
import { preload } from "./utils/Audio";

preload();

render(() => <Home />, document.getElementById("root") as HTMLElement);
