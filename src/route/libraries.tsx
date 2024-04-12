import { For, createResource } from "solid-js";
import libraries from "~/assets/libraries.json";

export default function Libraries() {
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
            <For each={libraries.results}>
              {(library) => (
                <tr class="w-full">
                  <td>{library.name}</td>
                  <td>{library.owner}</td>
                  <td>{library.preRelease}</td>
                </tr>
              )}
            </For>
          </tbody>
        </table>
      </main>
    </div>
  );
}
