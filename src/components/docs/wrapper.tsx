import { A, useLocation } from "@solidjs/router";
import { createMemo } from "solid-js";
import { For } from "solid-js";
import { JSX } from "solid-js";
import Config from "docs/docs.config";
import { cn } from "~/lib/utils";
import "./style.css";
import Navbar from "~/components/nav/navbar";
import { NavbarConfig } from "~/app.config";
import MinestomLogo from "~/components/minestom-logo";
import { MDXProvider } from "solid-mdx";
import CodeBlock from "../code-block";

export default function DocsWrapper(props: { children?: JSX.Element }) {
  const location = useLocation();
  const pathname = createMemo(() => location.pathname);

  return (
    <div class="flex flex-row h-screen">
      <nav class="hidden sm:flex flex-col flex-none h-full overflow-auto gap-2 w-64 bg-muted border-r border-border p-6 py-5">
        <div class="items-center flex flex-none">
          <a href="/">
            <MinestomLogo />
          </a>
        </div>
        <For each={Config.sections}>
          {(section) => (
            <>
              <hr class="border-border my-2" />
              {section.name && <h4 class="font-semibold">{section.name}</h4>}
              <For each={section.links}>
                {(link) => (
                  <A
                    href={link.href}
                    class={cn(
                      "text-muted-foreground text-sm w-full hover:text-blue-500 transition-colors",
                      pathname() == link.href ? "text-blue-500" : "",
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
          <MDXProvider
            components={{
              h2(props: { children: string }) {
                let id = props.children.toLowerCase().replace(" ", "-");
                return (
                  <section class="relative" id={id}>
                    <a
                      href={`#${id}`}
                      class="absolute top-1 text-2xl text-muted-foreground -left-5"
                    >
                      #
                    </a>
                    <h2>{props.children}</h2>
                  </section>
                );
              },
              pre(props: { children: Element }) {
                return props.children;
              },
              code(props: { children: string; className: string }) {
                let language = props.children
                  .split(" ")
                  .find((str) => str.startsWith("language-"))
                  ?.replace("language-", "");
                return (
                  <CodeBlock
                    class="my-3 shadow-none"
                    language={language ?? "java"}
                    code={props.children}
                  />
                );
              },
            }}
          >
            {props.children}
          </MDXProvider>
        </main>
      </div>
    </div>
  );
}
