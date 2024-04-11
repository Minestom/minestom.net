/* @refresh reload */
import { render } from "solid-js/web";

import "./index.css";
import { Route, Router } from "@solidjs/router";
import Implementations from "./route/implementations";
import Index from "./route";
import Navbar from "./components/navbar";
import First from "./route/docs/first.mdx";
import Second from "./route/docs/second.mdx";
import { ParentProps } from "solid-js";
import Wrapper from "./route/docs/wrapper";

const root = document.getElementById("root");

if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
  throw new Error(
    "Root element not found. Did you forget to add it to your index.html? Or maybe the id attribute got misspelled?",
  );
}

render(
  () => (
    <>
      <Router>
        <Route
          path={"/"}
          component={(props: ParentProps) => (
            <>
              <Navbar />
              {props.children}
            </>
          )}
        >
          <Route path={"/"} component={Index} />
          <Route path="/docs" component={Wrapper}>
            <Route path="/first" component={First} />
            <Route path="/second" component={Second} />
          </Route>
          <Route path={"/libraries"} component={Index} />
          <Route path={"/implementations"} component={Implementations} />
        </Route>
      </Router>
    </>
  ),
  root!,
);
