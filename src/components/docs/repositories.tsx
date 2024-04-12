import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import CodeBlock from "../code-block";

export type RepositoriesProps = {
  code: { name: string; code: string }[];
};

export default function Repositories() {
  return (
    <Tabs defaultValue="groovy" class="w-full">
      <TabsList class="grid w-full grid-cols-3">
        <TabsTrigger value="groovy">Gradle (Groovy)</TabsTrigger>
        <TabsTrigger value="kotlin">Gradle (Kotlin)</TabsTrigger>
        <TabsTrigger value="maven">Maven</TabsTrigger>
      </TabsList>
      <TabsContent value="groovy">
        <CodeBlock
          language="groovy"
          code={`repositories {
  // ...
  mavenCentral()
  maven { url 'https://jitpack.io' }
}`}
        />
      </TabsContent>
      <TabsContent value="kotlin">
        <CodeBlock
          language="kotlin"
          code={`repositories {
  // ...
  mavenCentral()
  maven(url = "https://jitpack.io")
}`}
        />
      </TabsContent>
      <TabsContent value="maven">
        <CodeBlock
          language="xml"
          code={`<repositories>
  <!-- ... -->
  <repository>
      <id>jitpack</id>
      <url>https://jitpack.io</url>
  </repository>
</repositories>`}
        />
      </TabsContent>
    </Tabs>
  );
}
