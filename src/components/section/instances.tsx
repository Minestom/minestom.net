import CodeBlock from "../code-block";

const code = `// Get the instance manager
InstanceManager instanceManager = MinecraftServer.getInstanceManager();

// Create the instance
InstanceContainer instanceContainer = instanceManager.createInstanceContainer();

// Set the ChunkGenerator
instanceContainer.setChunkGenerator(/* chunk generator here */);

// Make chunks automatically load
instanceContainer.enableAutoChunkLoad(true);`;

export default function Instances() {
  return (
    <section
      id="introduction"
      class="w-full flex flex-col-reverse bg-muted lg:flex-row items-center justify-center p-[5%] gap-8"
    >
      <CodeBlock
        code={code}
        class="min-h-full overflow-auto w-full text-sm flex-1"
        language="java"
      />
      <div class="flex flex-col gap-2 flex-1">
        <h1 class="text-4xl font-bold relative text-center lg:text-left bg-clip-text text-transparent bg-gradient-to-b from-minestom-orange to-minestom-pink drop-shadow-md">
          Instances
        </h1>
        <p class="font-medium text-md">
          Worlds in default Minecraft are great for playing with friends, but
          scaling them up can be unmanageable. The best examples of this can be
          found in minigames; it's hard to separate worlds properly and all
          worlds are saved in files. Plus, there's a lot of overhead caused by
          unnecessary data contained in them.
        </p>
        <p class="font-medium text-md">
          Instances are our lightweight solution to it. You can copy and send
          them to another player in no time, create a serializer, decide if
          they're saved in memory only, and more.
        </p>
        <p class="font-medium text-md">
          Being able to create instances on the go is a must-have that can help
          push many more projects forward. Instances also come with performance
          benefits. Unlike other implementations of worlds that may be fully
          singlethreaded or use one thread per world, Minestom uses a set number
          of threads (a thread pool) to manage chunks independently from
          instances so that lag can be reduced.
        </p>
      </div>
    </section>
  );
}
