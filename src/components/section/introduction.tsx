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

export default function Introducution() {
  return (
    <section
      id="introduction"
      class="w-full flex flex-row items-center bg-gray-200 dark:bg-[#111] justify-center p-[10%] gap-4"
    >
      <div class="flex flex-col flex-auto w-2/3">
        <h1 class="text-4xl font-bold relative bg-clip-text text-transparent bg-gradient-to-b from-minestom-orange to-minestom-pink drop-shadow-md">
          Introduction
        </h1>
        <p class="font-medium text-md">
          The main difference from default Minecraft is that Minestom does not
          contain any features by default. However, we have a complete API that
          allows you to make anything possible with extensions, similar to how
          plugins and mods work.
        </p>
      </div>

      <div class="flex flex-col gap-2 flex-auto">
        <p class="font-medium text-md p-4 bg-yellow-500 rounded-lg">
          This is a developer API; It is not meant to be used by the end-users.
        </p>
        <p class="font-medium text-md p-4 bg-red-500 dark:bg-red-600 rounded-lg">
          Replacing Bukkit/Forge/Sponge with this will not work since we do not
          implement any of their APIs.
        </p>
      </div>
    </section>
  );
}
