# Anvil Loader

Anvil is the format made by Mojang for vanilla. Minestom provides this format and it is chosen **by default** on newly created instances. Anvil is a multi-file world format, so must be provided with a directory to store world data. The anvil loader also supports reading light data from the worlds, this is enabled by default.

## Requirements

Worlds to be used with [`AnvilLoader`](https://javadoc.minestom.net/net.minestom.server/net/minestom/server/instance/anvil/AnvilLoader.html) only need to contain the `region` directory, which is where the chunk data comes from. Chunk loaders do not read entity data.

## Usage

To use a world from the **runtime file system**, you can do something like the following code snippet, which constructs the loader using [`AnvilLoader#<init>(Path)`](https://javadoc.minestom.net/net.minestom.server/net/minestom/server/instance/anvil/AnvilLoader.html#%3Cinit%3E(java.nio.file.Path)).

```java
final Path directory = this.worlds.join("world");
final AnvilLoader loader = new AnvilLoader(directory);
final InstanceContainer instance = MinecraftServer.getInstanceManager().createInstanceContainer(loader);
```

Remember, however, that this **does not** read from the jar resources. Other war crimes must be committed for this to happen.