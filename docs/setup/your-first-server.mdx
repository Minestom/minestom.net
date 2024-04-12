---
description: Includes everything you need to have your first server running.
---

# Your first server

Some things are needed before being able to connect to your Minestom server.

* Initialize the server
* Registering events/commands
* Start the server at the specified port and address

Here is a correct example:

```java
    public static void main(String[] args) {
        // Initialize the server
        MinecraftServer minecraftServer = MinecraftServer.init();

        // REGISTER EVENTS (set spawn instance, teleport player at spawn)

        // Start the server
        minecraftServer.start("0.0.0.0", 25565);
    }
```

However even after those steps, you will not be able to connect, what we miss here is an instance (the world)

_Please check the_ [_instances_](../world/instances.md) _and_ [_events_](../feature/events/) _pages if you have any question about how to create/listen to one_

```java
GlobalEventHandler globalEventHandler = MinecraftServer.getGlobalEventHandler();
globalEventHandler.addListener(AsyncPlayerConfigurationEvent.class, event -> {
   event.setSpawningInstance(YOUR_SPAWNING_INSTANCE);
});
```

Here is an example of a working Minestom server

```java
package demo;

import net.minestom.server.MinecraftServer;
import net.minestom.server.entity.Player;
import net.minestom.server.event.GlobalEventHandler;
import net.minestom.server.event.player.AsyncPlayerConfigurationEvent;
import net.minestom.server.instance.*;
import net.minestom.server.instance.batch.ChunkBatch;
import net.minestom.server.instance.block.Block;
import net.minestom.server.coordinate.Pos;
import net.minestom.server.world.biomes.Biome;

import java.util.Arrays;
import java.util.List;

public class MainDemo {

    public static void main(String[] args) {
        // Initialization
        MinecraftServer minecraftServer = MinecraftServer.init();
        InstanceManager instanceManager = MinecraftServer.getInstanceManager();
        // Create the instance
        InstanceContainer instanceContainer = instanceManager.createInstanceContainer();
        // Set the ChunkGenerator
        instanceContainer.setGenerator(unit -> 
                        unit.modifier().fillHeight(0, 40, Block.GRASS_BLOCK));
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

## Building the server JAR

Once you have created your Minestom server, you will probably want to build it and distribute it to a host or friend.
To do so we will set up the Shadow plugin so that we can make a final working uber (fat) jar.

Side note: For Maven users, you will need the "Shade" plugin. If you use Maven and would like to contribute an example
it would be appreciated :)

You can find the full documentation for the Shadow plugin [here](https://imperceptiblethoughts.com/shadow/introduction/).

First, let's add the Shadow plugin to our project.

{% tabs %}
{% tab title="Gradle (Groovy)" %}
```groovy
plugins {
    id "com.github.johnrengelman.shadow" version "8.1.1"
}
```
{% endtab %}

{% tab title="Gradle (Kotlin)" %}
```kts
plugins {
    id("com.github.johnrengelman.shadow") version "8.1.1"
}
```
{% endtab %}
{% endtabs %}

If the JAR is meant to be run, which it probably is, you also need to specify the class containing the main method like so,

{% tabs %}
{% tab title="Gradle (Groovy)" %}
```groovy
jar {
    manifest {
        // Change this to your main class
        attributes 'Main-Class': 'org.example.Main'
    }
}
```
{% endtab %}

{% tab title="Gradle (Kotlin)" %}
```kts
tasks.withType<Jar> {
    manifest {
        // Change this to your main class
        attributes["Main-Class"] = "org.example.Main"
    }
}
```
{% endtab %}
{% endtabs %}

With all of this done, all we need to do is run the `shadowJar` task to create a working uber (fat) jar! (The jar will be put in `/build/libs/` by default)

Now, just to be sure that you understood everything, here is a complete `build.gradle`/`build.gradle.kts` file.

{% tabs %}
{% tab title="Gradle (Groovy)" %}
```groovy
plugins {
    id 'java'
    id "com.github.johnrengelman.shadow" version "8.1.1"
}

group 'org.example'
version '1.0-SNAPSHOT'

repositories {
    mavenCentral()
    maven { url 'https://jitpack.io' }
}

dependencies {
    // Change this to the latest version
    implementation 'com.github.Minestom:Minestom:VERSION'
}

jar {
    manifest {
        // Change this to your main class
        attributes 'Main-Class': 'org.example.Main'
    }
}
```
{% endtab %}

{% tab title="Gradle (Kotlin)" %}
```kts
plugins {
    id("java")
    id("com.github.johnrengelman.shadow") version "8.1.1"
}

group = "org.example"
version = "1.0-SNAPSHOT"

repositories {
    mavenCentral()
    maven(url = "https://jitpack.io")
}

dependencies {
    // Change this to the latest version
    implementation("com.github.Minestom.Minestom:Minestom:VERSION")
}

tasks.withType<Jar> {
    manifest {
        // Change this to your main class
        attributes["Main-Class"] = "org.example.Main"
    }
}
```
{% endtab %}
{% endtabs %}
