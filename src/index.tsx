/* @refresh reload */
import { Route, Router, Routes } from "solid-app-router";
import { render } from "solid-js/web";
import Entry from "./pages/Home";

render(
  () => (
    <Router>
      <Routes>
        <Route path="/" component={Entry} />
      </Routes>
    </Router>
  ),
  document.getElementById("root") as HTMLElement
);
