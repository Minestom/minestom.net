/* @refresh reload */
import { render } from "solid-js/web";
import routes from "~solid-pages";

import "./index.css";
import { Route, Router } from "@solidjs/router";
import Implementations from "./route/implementations";
import Index from "./route";
import Navbar from "./components/navbar";
import { ParentProps } from "solid-js";
import DocsWrapper from "~/components/docs-wrapper";
import {
  ColorModeProvider,
  ColorModeScript,
  localStorageManager,
} from "@kobalte/core";
import { NavbarConfig } from "./app.config";

const root = document.getElementById("root");

if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
  throw new Error(
    "Root element not found. Did you forget to add it to your index.html? Or maybe the id attribute got misspelled?",
  );
}

render(() => {
  console.log(routes);
  return (
    <>
      <ColorModeScript storageType={localStorageManager.type} />
      <ColorModeProvider storageManager={localStorageManager}>
        <Router>
          <Route
            path={"/"}
            component={(props: ParentProps) => (
              <>
                <Navbar
                  {...NavbarConfig}
                  logo
                  class="fixed top-0 left-0 w-screen"
                />
                {props.children}
              </>
            )}
          >
            <Route path={"/"} component={Index} />
            <Route path={"/libraries"} component={Index} />
            <Route path={"/implementations"} component={Implementations} />
          </Route>
          <Route path="/docs" component={DocsWrapper}>
            {routes}
          </Route>
        </Router>
      </ColorModeProvider>
    </>
  );
}, root!);
