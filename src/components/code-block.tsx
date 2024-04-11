import hljs from "highlight.js";
import "highlight.js/styles/androidstudio.css";
import { cn } from "../utils/cn";
import { writeClipboard } from "@solid-primitives/clipboard";
import { FaRegularClipboard } from "solid-icons/fa";

export default function CodeBlock(props: {
  class?: string;
  code: string;
  language: string;
}) {
  let copy = async () => {
    await writeClipboard(props.code);
  };
  return (
    <div
      class={cn(
        "dark:bg-black bg-white text-gray-700 border-minestom-orange border dark:text-gray-300 rounded-lg shadow-lg relative",
        props.class,
      )}
    >
      <button
        class="p-2 hover:bg-gray-600 rounded-md absolute m-2 top-0 right-0 opacity-15 hover:opacity-80 transition-all"
        onClick={copy}
      >
        <FaRegularClipboard size={20} />
      </button>
      <pre class="p-4 overflow-auto">
        <code
          innerHTML={
            hljs.highlight(props.code, {
              language: props.language,
            }).value
          }
        />
      </pre>
    </div>
  );
}
