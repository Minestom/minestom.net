import { DropdownMenu, useColorMode } from "@kobalte/core";
import { CgSun, CgMoon, CgLaptop } from "solid-icons/cg";

export default function ColorPicker() {
  const { setColorMode, colorMode } = useColorMode();
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger class="h-fit my-auto p-1">
        {colorMode() == "light" ? <CgSun /> : <CgMoon />}
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Arrow />
        <DropdownMenu.Content class="bg-background drop-shadow-md rounded-lg overflow-clip">
          <DropdownMenu.Item
            class="hover:bg-muted flex flex-row w-32 p-1 px-3 items-center gap-2"
            onSelect={() => setColorMode("dark")}
          >
            <CgMoon />
            Dark
          </DropdownMenu.Item>
          <DropdownMenu.Item
            class="hover:bg-muted flex flex-row w-32 p-1 px-3 items-center gap-2"
            onSelect={() => setColorMode("light")}
          >
            <CgSun />
            Light
          </DropdownMenu.Item>
          <DropdownMenu.Item
            class="hover:bg-muted flex flex-row w-32 p-1 px-3 items-center gap-2"
            onSelect={() => setColorMode("system")}
          >
            <CgLaptop />
            System
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
