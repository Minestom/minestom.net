# Polar Loader

::: warning
Polar is an external library made by [Hollow Cube](https://github.com/hollow-cube/). External libraries have no obligation to be updated alongside Minestom and may go stale in the future.
:::

[Polar](https://github.com/hollow-cube/polar) is a format made by Hollow Cube, designed to store large amounts of user-generated instances. Polar has numerous benefits over Anvil, like being stored in a single file and supporting zstd compression. However, it is not the best option in many use cases.

Custom data provided by the server can also be stored in Polar files alongside chunk data, more information about this can be found in the [README](https://github.com/hollow-cube/polar/tree/main?tab=readme-ov-file#user-data--callbacks).

## Requirements

Polar requires a world in the Polar format, of course. The library ships with an Anvil conversion utility found in the `AnvilPolar` class. You may also opt to create your worlds using Minestom to be saved straight into Polar.

## Usage

Polar can be found on Maven Central, so no repositories are required on top of Minestom's.

:::tabs
== Gradle (Groovy)

```groovy-vue
dependencies {
    implementation 'dev.hollowcube:polar:<see releases>'
}
```

== Gradle (Kotlin)

```kotlin-vue
dependencies {
    implementation("dev.hollowcube:polar:<see releases>")
}
```

== Maven

```xml-vue
<dependencies>
    <dependency>
        <groupId>dev.hollowcube</groupId>
        <artifactId>polar</artifactId>
        <version>see releases</version>
    </dependency>
</dependencies>
```
:::

### Direct

```java
final Path file = this.worlds.join("world.polar");
final PolarLoader loader = new PolarLoader(file); // can also take an InputStream
final InstanceContainer instance = MinecraftServer.getInstanceManager().createInstanceContainer(loader);
```

### Streaming

Loads a polar world into an instance in a streaming manner. This method significantly reduces the memory overhead of loading a world and should generally be preferrable.

```java
final Path file = this.worlds.join("world.polar");
final FileChannel channel = FileChannel.open(file, StandardOpenOption.READ);
final InstanceContainer instance = MinecraftServer.getInstanceManager().createInstanceContainer();
final CompletableFuture<Void> future = PolarLoader.streamLoad(instance, channel, channel.size(), null, null, true);
```