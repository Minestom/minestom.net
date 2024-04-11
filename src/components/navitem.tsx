import { A } from "@solidjs/router";
import { JSX } from "solid-js";
import { cn } from "~/utils/cn";
import { As, Link, Tooltip } from "@kobalte/core";

export default function NavItem(props: {
  href: string;
  class?: string;
  tooltip?: string;
  children?: JSX.Element;
}) {
  return (
    <li class={cn("relative", props.class)}>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <As
            component={A}
            class="dark:text-gray-100 dark:hover:text-gray-200 text-gray-600 hover:text-gray-700 transition-colors"
            href={props.href}
          >
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
