import CodeBlock from "../code-block";

const code = `var server = MinecraftServer.init();
var eventHandler = MinecraftServer.getGlobalEventHandler();
var instanceManager = MinecraftServer.getInstanceManager();

// Creating a world
var instance = instanceManager.createInstanceContainer();
instance.setChunkGenerator(new GeneratorDemo());

// Set the player's spawning instance when they join
eventHandler.addListener(AsyncPlayerConfigurationEvent.class, event -> {
  event.setSpawningInstance(instance);
  event.getPlayer.setRespawnPoint(new Pos(0, 64, 0));
});

// Enable online mode and start the server
MojangAuth.init();
server.start("0.0.0.0", 25565);`;

export default function Hero() {
  return (
    <section
      id="hero"
      class="h-screen w-full dark:bg-black bg-white bg-fixed bg-grid-minestom-orange/[0.2] relative flex items-center justify-center p-[10%] text-gray-700 dark:text-gray-200"
    >
      <div class="absolute pointer-events-none inset-0 sm:flex-row items-center justify-center dark:bg-black bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />

      <div class="flex flex-col lg:flex-row w-full z-20 gap-8 items-center justify-center">
        <div class="lg:mr-auto text-center lg:text-left">
          <h1 class="text-7xl font-bold relative bg-clip-text text-transparent bg-gradient-to-b from-minestom-orange to-minestom-pink drop-shadow-md">
            Minestom
          </h1>
          <p class="w-96 font-medium text-md">
            A Minecraft server implementation, open-source and without any code
            from Mojang.
          </p>
        </div>
        <CodeBlock
          class="flex-none h-fit overflow-auto w-full lg:w-3/5 text-sm"
          code={code}
          language="java"
        />
      </div>
    </section>
  );
}
