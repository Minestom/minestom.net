import { For, createResource } from "solid-js";
import implementations from "~/assets/implementations.json";

export default function Implementations() {
  return (
    <div>
      <div>{JSON.stringify(implementations)}</div>
      <For each={implementations.results}>
        {(implementation) => <div>{JSON.stringify(implementation)}</div>}
      </For>
    </div>
  );
}
