import { JSX, createMemo, createSignal, onCleanup, onMount } from "solid-js";
import NavItem, { NavItemProps } from "./navitem";
import ThemeToggle from "~/components/theme-toggle";
import { cn } from "~/lib/utils";
import { useLocation } from "@solidjs/router";
import MinestomLogo from "~/components/minestom-logo";
import { Show } from "solid-js";
import { For } from "solid-js";

export type NavbarSocial = NavItemProps & {
  display?: () => JSX.Element;
};
export type NavbarProps = {
  logo?: boolean;
  items?: (NavItemProps & { display: string })[];
  socials?: NavbarSocial[];
};
export default function Navbar(props: NavbarProps & { class?: string }) {
  const [isScrolled, setIsScrolled] = createSignal(false);
  const location = useLocation();
  const pathname = createMemo(() => location.pathname);
  const handleScroll = () => {
    setIsScrolled(window.scrollY > 0);
  };
  onMount(() => {
    window.addEventListener("scroll", handleScroll);
  });
  onCleanup(() => window.removeEventListener("scroll", handleScroll));
  return (
    <nav
      class={cn(
        props.class,
        "h-16 z-50 transition-all border-border px-6 flex flex-row items-center",
        isScrolled() ? "bg-muted border-b" : "",
        pathname() == "/" ? "" : "bg-muted border-b",
      )}
    >
      {props.logo == true && (
        <div class="items-center flex flex-none">
          <a href="/">
            <MinestomLogo />
          </a>
        </div>
      )}
      <span class="flex-auto" />
      <ul class="font-semibold gap-4 h-full flex flex-row flex-none items-center">
        <For each={props.items}>
          {(item) => (
            <NavItem
              {...item}
              class={cn(
                "font-normal",
                pathname() == item.href ? "text-blue-500" : "",
              )}
            >
              {item.display}
            </NavItem>
          )}
        </For>
      </ul>
      <span class="h-1/3 my-auto mx-4 w-[1px] bg-border" />
      <ThemeToggle />
      <span class="h-1/3 my-auto mx-4 w-[1px] bg-border" />
      <Show when={(props.socials?.length ?? 0) != 0}>
        <ul class="font-semibold gap-4 h-full flex flex-row flex-none items-center">
          <For each={props.socials}>
            {(social) => (
              <NavItem {...social}>
                {(social.display ?? (() => null))()}
              </NavItem>
            )}
          </For>
        </ul>
      </Show>
    </nav>
  );
}
