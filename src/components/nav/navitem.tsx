import { A } from "@solidjs/router";
import { JSX, ParentProps } from "solid-js";
import { cn } from "~/lib/utils";
import { As, Link, Tooltip } from "@kobalte/core";

export type NavItemProps = {
  href: string;
  class?: string;
  tooltip?: string;
};
export default function NavItem(props: NavItemProps & ParentProps) {
  return (
    <li
      class={cn(
        "relative text-muted-foreground hover:text-blue-500",
        props.class,
      )}
    >
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <As component={A} class={"transition-colors"} href={props.href}>
            {props.children}
          </As>
        </Tooltip.Trigger>
        {props.tooltip && (
          <Tooltip.Portal>
            <Tooltip.Content class="dark:bg-gray-500 bg-white drop-shadow-lg font-semibold text-gray-600 dark:text-gray-400 p-2 rounded-lg animate-in fade-in slide-in-from-bottom-1">
              <Tooltip.Arrow />
              <p>{props.tooltip}</p>
            </Tooltip.Content>
          </Tooltip.Portal>
        )}
      </Tooltip.Root>
    </li>
  );
}
