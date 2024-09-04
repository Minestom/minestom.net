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
import net.minestom.server.event.player.AsyncPlayerConfigurationEvent

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

Once you have created your Minestom server, you will probably want to build it as a single JAR.

## Building the server JAR (Gradle)

This can be achieved with the Gradle `shadow` plugin. You can find the full documentation for this plugin [here](https://gradleup.com/shadow/).

First, let's add the `shadow` plugin to our Gradle project.

::: tabs
=== Gradle (Groovy)

```groovy
plugins {
    id 'com.gradleup.shadow' version "8.3.0"
}
```

=== Gradle (Kotlin)

```kotlin
plugins {
    id("com.gradleup.shadow") version "8.3.0"
}
```

:::
With all of this done, all we need to do is run the `shadowJar` task to create a working uber (fat) jar for Gradle! (The jar will be put in `/build/libs/` by default).

Here is a complete `build.gradle`/`build.gradle.kts` file with a few extra niceities added.

:::tabs
=== Gradle (Groovy)

```groovy
plugins {
    id 'java'
    id 'com.gradleup.shadow' version "8.3.0"
}

group 'org.example'
version '1.0-SNAPSHOT'

repositories {
    mavenCentral()
}

dependencies {
    // Change this to the latest version
    implementation 'net.minestom:minestom-snapshots:<version>'
}

java {
    toolchain {
        languageVersion.set(JavaLanguageVersion.of(21)) // Minestom has a minimum Java version of 21
    }
}

tasks {
    jar {
        manifest {
            attributes["Main-Class"] = "org.example.Main" // Change this to your main class
        }
    }

    build {
        dependsOn(shadowJar)
    }
    shadowJar {
        mergeServiceFiles()
        archiveClassifier.set("") // Prevent the -all suffix on the shadowjar file.
    }
}

```

=== Gradle (Kotlin)

```kts
plugins {
    id("java")
    id("com.gradleup.shadow") version "8.3.0"
}

group = "org.example"
version = "1.0-SNAPSHOT"

repositories {
    mavenCentral()
}

dependencies {
    // Change this to the latest version
    implementation("net.minestom:minestom-snapshots:<version>")
}

java {
    toolchain {
        languageVersion.set(JavaLanguageVersion.of(21)) // Minestom has a minimum Java version of 21
    }
}

tasks {
    jar {
        manifest {
            attributes["Main-Class"] = "org.example.Main" // Change this to your main class
        }
    }

    build {
        dependsOn(shadowJar)
    }
    shadowJar {
        mergeServiceFiles()
        archiveClassifier.set("") // Prevent the -all suffix on the shadowjar file.
    }
}

```

:::

## Building the server JAR (Maven)

Start by adding a execution property and the `jar-with-dependencies` tag for our jar (It will be outputted in `/target/`).

You can use the `assembly` plugin to build the jar using the `clean package` command. Documentation on the plugin can be found [here](https://maven.apache.org/plugins/maven-assembly-plugin/).

Here is a complete `pom.xml` file with a few extra niceities added.

```xml
<project>
    <groupId>org.example</groupId>
    <artifactId>Main</artifactId>
    <version>1.0.0</version>

    <properties>
        <java.version>21</java.version> <!--Minestom has a minimum Java version of 21-->
        <maven.compiler.source>${java.version}</maven.compiler.source>
        <maven.compiler.target>${java.version}</maven.compiler.target>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
    </properties>

    <dependencies>
        <dependency>
            <groupId>net.minestom</groupId>
            <artifactId>minestom-snapshots</artifactId>
            <version>version</version> <!--Change this to the Minestom version you are using-->
        </dependency>
    </dependencies>

    <build>
        <defaultGoal>clean package</defaultGoal>
        <resources>
            <resource>
                <directory>${project.basedir}/src/main/resources</directory>
                <filtering>true</filtering>
            </resource>
        </resources>
        <plugins>
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-assembly-plugin</artifactId>
                <executions>
                    <execution>
                        <phase>package</phase>
                        <goals>
                            <goal>single</goal> <!--Prevent dependecies from shading multiple times-->
                        </goals>
                    </execution>
                </executions>
                <configuration>
                    <archive>
                        <manifest>
                            <mainClass>org.example.Main</mainClass> <!--Change this to your main class-->
                        </manifest>
                    </archive>
                    <descriptorRefs>
                        <descriptorRef>jar-with-dependencies</descriptorRef>
                    </descriptorRefs>
                    <appendAssemblyId>false</appendAssemblyId>
                </configuration>
            </plugin>
        </plugins>
    </build>
</project>
```

<sub>_Example by [AlexDerProGamer](https://github.com/AlexDerProGamer)_</sub>
