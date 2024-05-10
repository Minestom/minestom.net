---
description: Includes everything you need to have your first server running.
---

# Your first server

Some things are needed before being able to connect to your Minestom server.

- Initialize the server
- Registering events/commands
- Start the server at the specified port and address

Here is a correct example:

::: tabs
=== Java

```java
public static void main(String[] args) {
    // Initialize the server
    MinecraftServer minecraftServer = MinecraftServer.init();

    // Register Events (set spawn instance, teleport player at spawn)
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

    // Register Events (set spawn instance, teleport player at spawn)
    // Start the server
    minecraftServer.start("0.0.0.0", 25565)
}
```

===
:::

However even after those steps, you will not be able to connect, because we are missing an instance.

_Please check the_ [_instances_](/docs/world/instances) _and_ [_events_](/docs/feature/events) _pages if you have any questions about how to create/listen to one._

::: tabs
=== Java

```java
Instance instance = // create instance
GlobalEventHandler globalEventHandler = MinecraftServer.getGlobalEventHandler();
globalEventHandler.addListener(AsyncPlayerConfigurationEvent.class, event -> {
   event.setSpawningInstance(instance);
});
```

===
=== Kotlin

```kotlin
val instance = // create instance
val globalEventHandler = MinecraftServer.getGlobalEventHandler();
globalEventHandler.addListener(AsyncPlayerConfigurationEvent::class.java) { event ->
    event.spawningInstance = instance
}
```

===
:::

Here is an example of a working Minestom server

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
    val minecraftServer = MinecraftServer.init();

    // Create the instance
    val instanceManager = MinecraftServer.getInstanceManager();
    val instanceContainer = instanceManager.createInstanceContainer();

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

## Building the server JAR

Once you have created your Minestom server, you will probably want to build it as a single JAR. This can be achieved with the Gradle `shadow` plugin.

Side note: For Maven users, you will need the "Shade" plugin. If you use Maven and would like to contribute an example
it would be appreciated :)

You can find the full documentation for the Shadow plugin [here](https://imperceptiblethoughts.com/shadow/introduction/).

First, let's add the Shadow plugin to our project.

::: warning
As of the time writing this, the original shadow plugin from johnrengelman has not been updated for Java 21 support, so we'll use a fork in this example.
:::

With all of this done, all we need to do is run the `shadowJar` task to create a working uber (fat) jar! (The jar will be put in `/build/libs/` by default)

Now, just to be sure that you understood everything, here is a complete `build.gradle`/`build.gradle.kts` file.

:::tabs
== groovy

```groovy
plugins {
    id 'java'
    id "io.github.goooler.shadow" version "8.1.7"
}

group 'org.example'
version '1.0-SNAPSHOT'

repositories {
    mavenCentral()
    maven { url 'https://jitpack.io' }
}

dependencies {
    // Change this to the latest version
    implementation 'net.minestom:minestom-snapshots:<version>'
}

jar {
    manifest {
        // Change this to your main class
        attributes 'Main-Class': 'org.example.Main'
    }
}
```

== kotlin

```kts
plugins {
    id("java")
    // If you need Kotlin support, use the kotlin("jvm") plugin
    id("io.github.goooler.shadow") version "8.1.7"
}

group = "org.example"
version = "1.0-SNAPSHOT"

repositories {
    mavenCentral()
    maven(url = "https://jitpack.io")
}

dependencies {
    // Change this to the latest version
    implementation("net.minestom:minestom-snapshots:<version>")
}

tasks.withType<Jar> {
    manifest {
        // Change this to your main class
        attributes["Main-Class"] = "org.example.Main"
    }
}
```

:::
