import { For, createResource } from "solid-js";
import implementations from "~/assets/implementations.json";

export default function Implementations() {
  return (
    <div class="flex flex-row h-screen">
      <main class="p-8 pt-16 w-full flex flex-col">
        <table class="table-auto w-full">
          <thead>
            <tr>
              <th>Name</th>
              <th>Owner</th>
              <th>Pre-release</th>
            </tr>
          </thead>
          <tbody>
            <For each={implementations.results}>
              {(implementation) => (
                <tr class="w-full">
                  <td>{implementation.name}</td>
                  <td>{implementation.owner}</td>
                  <td>{implementation.preRelease}</td>
                </tr>
              )}
            </For>
          </tbody>
        </table>
      </main>
    </div>
  );
}
