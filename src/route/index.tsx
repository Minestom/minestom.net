import hljs from "highlight.js";
import java from "highlight.js/lib/languages/java";
import gradle from "highlight.js/lib/languages/gradle";
import kotlin from "highlight.js/lib/languages/kotlin";
import xml from "highlight.js/lib/languages/xml";
import Hero from "~/components/section/hero";
import Introducution from "~/components/section/introduction";
import Instances from "~/components/section/instances";

export default function Index() {
  hljs.registerLanguage("java", java);
  hljs.registerLanguage("gradle", gradle);
  hljs.registerLanguage("kotlin", kotlin);
  hljs.registerLanguage("xml", xml);
  return (
    <>
      <Hero />
      <Introducution />
      <Instances />
    </>
  );
}
