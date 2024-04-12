import { A, useLocation } from "@solidjs/router";
import { createMemo } from "solid-js";
import { For } from "solid-js";
import { JSX } from "solid-js";
import Config from "docs/docs.config";
import { cn } from "~/utils/cn";
import "./docs-modest.css";
import Navbar from "./navbar";
import { NavbarConfig } from "~/app.config";
import MinestomLogo from "./minestom-logo";

export default function DocsWrapper(props: { children?: JSX.Element }) {
  const location = useLocation();
  const pathname = createMemo(() => location.pathname);

  return (
    <div class="flex flex-row h-screen">
      <nav class="hidden sm:flex flex-col flex-none h-full overflow-auto gap-2 w-64 bg-muted border-r-2 border-gray-800 p-6 py-5">
        <div class="items-center flex flex-none">
          <a href="/">
            <MinestomLogo />
          </a>
        </div>
        <For each={Config.sections}>
          {(section) => (
            <>
              <hr class="border-gray-800 my-2" />
              {section.name && <h4 class="font-semibold">{section.name}</h4>}
              <For each={section.links}>
                {(link) => (
                  <A
                    href={link.href}
                    class={cn(
                      "text-muted-foreground rounded-lg text-sm w-full hover:text-blue-500 transition-colors",
                      pathname() == link.href
                        ? "bg-background text-blue-500"
                        : "",
                    )}
                  >
                    {link.name}
                  </A>
                )}
              </For>
            </>
          )}
        </For>
      </nav>
      <div class="h-full flex flex-col">
        <Navbar logo={false} {...NavbarConfig} class="flex-none" />
        <main class="p-8 flex-auto overflow-auto markdown">
          {props.children}
        </main>
      </div>
    </div>
  );
}
