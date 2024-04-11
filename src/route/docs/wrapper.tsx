import { A } from "@solidjs/router";
import { For } from "solid-js";
import { JSX, ParentProps } from "solid-js";
import { cn } from "~/utils/cn";

type Link = {
  name: string;
  href: string;
  class?: string;
};
const links: Link[] = [
  {
    name: "First Doc",
    href: "/docs/first",
  },
  {
    name: "Second Doc",
    href: "/docs/second",
  },
];

export default function Wrapper(props: { children?: JSX.Element }) {
  return (
    <div class="flex flex-row">
      <nav class="hidden sm:flex flex-col w-32 bg-black pt-16 px-4">
        <ul>
          <For each={links}>
            {(link) => (
              <li>
                <A
                  href={link.href}
                  class={cn(
                    "hover:text-blue-500 transition-colors",
                    link.class,
                  )}
                >
                  {link.name}
                </A>
              </li>
            )}
          </For>
        </ul>
      </nav>
      <main class="p-16">{props.children}</main>
    </div>
  );
}
