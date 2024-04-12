import CodeBlock from "~/components/code-block";
import hljs from "highlight.js";
import java from "highlight.js/lib/languages/java";
import Navbar from "~/components/ui/navbar";
import Hero from "~/components/section/hero";
import Introducution from "~/components/section/introduction";
import Instances from "~/components/section/instances";

export default function Index() {
  let code = hljs.registerLanguage("java", java);
  return (
    <>
      <Hero />
      <Introducution />
      <Instances />
    </>
  );
}
