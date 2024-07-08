---
description: Describes how to get a basic server running.
---

# Your first server

There are a few steps necessary before you can connect to your Minestom server:

- Initializing the server
- Registering your events/commands
- Creating an instance for players to join
- Starting the server on a port and address

Here is an example of a server without an instance:

::: tabs
=== Java

```java
public static void main(String[] args) {
    // Initialize the server
    MinecraftServer minecraftServer = MinecraftServer.init();

    // Register events (set spawn instance, teleport player at spawn)
    // Start the server
    minecraftServer.start("0.0.0.0", 25565);
}
```

===
=== Kotlin

```kotlin
fun main() {
    // Initialize the server
    val minecraftServer = MinecraftServer.init()

    // Register events (set spawn instance, teleport player at spawn)
    // Start the server
    minecraftServer.start("0.0.0.0", 25565)
}
```

===
:::

Add an instance for players to connect to:

::: tabs
=== Java

```java
Instance instance = // Create an instance
GlobalEventHandler globalEventHandler = MinecraftServer.getGlobalEventHandler();
globalEventHandler.addListener(AsyncPlayerConfigurationEvent.class, event -> {
   event.setSpawningInstance(instance);
});
```

===
=== Kotlin

```kotlin
val instance = // Create an instance
val globalEventHandler = MinecraftServer.getGlobalEventHandler()
globalEventHandler.addListener(AsyncPlayerConfigurationEvent::class.java) { event ->
    event.spawningInstance = instance
}
```

===
:::

_Check out the_ [_instances_](/docs/world/instances) _and_ [_events_](/docs/feature/events) _pages to see more on how to create and listen to instances_

Here is an example of a working Minestom server:

::: tabs
=== Java

```java
package demo;

import net.minestom.server.MinecraftServer;
import net.minestom.server.entity.Player;
import net.minestom.server.event.GlobalEventHandler;
import net.minestom.server.event.player.AsyncPlayerConfigurationEvent;
import net.minestom.server.instance.*;
import net.minestom.server.instance.block.Block;
import net.minestom.server.coordinate.Pos;

public class MainDemo {
    public static void main(String[] args) {
        // Initialization
        MinecraftServer minecraftServer = MinecraftServer.init();

        // Create the instance
        InstanceManager instanceManager = MinecraftServer.getInstanceManager();
        InstanceContainer instanceContainer = instanceManager.createInstanceContainer();

        // Set the ChunkGenerator
        instanceContainer.setGenerator(unit -> unit.modifier().fillHeight(0, 40, Block.GRASS_BLOCK));

        // Add an event callback to specify the spawning instance (and the spawn position)
        GlobalEventHandler globalEventHandler = MinecraftServer.getGlobalEventHandler();
        globalEventHandler.addListener(AsyncPlayerConfigurationEvent.class, event -> {
            final Player player = event.getPlayer();
            event.setSpawningInstance(instanceContainer);
            player.setRespawnPoint(new Pos(0, 42, 0));
        });

        // Start the server on port 25565
        minecraftServer.start("0.0.0.0", 25565);
    }
}
```

===
=== Kotlin

```kotlin
package demo

import net.minestom.server.MinecraftServer
import net.minestom.server.instance.block.Block
import net.minestom.server.coordinate.Pos

fun main() {
    // Initialization
    val minecraftServer = MinecraftServer.init()

    // Create the instance
    val instanceManager = MinecraftServer.getInstanceManager()
    val instanceContainer = instanceManager.createInstanceContainer()

    // Set the ChunkGenerator
    instanceContainer.setGenerator { unit ->
        unit.modifier().fillHeight(0, 40, Block.GRASS_BLOCK)
    }

    // Add an event callback to specify the spawning instance (and the spawn position)
    val globalEventHandler = MinecraftServer.getGlobalEventHandler()
    globalEventHandler.addListener(AsyncPlayerConfigurationEvent::class.java) { event ->
        val player = event.getPlayer()
        event.spawningInstance = instanceContainer
        player.respawnPoint = Pos(0.0, 42.0, 0.0)
    }
}
```

===
:::
