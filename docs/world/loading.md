# World Loading

In order to load or save an [`Instance`](https://javadoc.minestom.net/net/minestom/server/instance/Instance.html), you must provide an [`IChunkLoader`](https://javadoc.minestom.net/net/minestom/server/instance/IChunkLoader.html) that Minestom will use to read and write chunk data to and from.

When creating your instance, you can provide the loader in multiple ways:
* [`InstanceManager#createInstanceContainer(@Nullable IChunkLoader)`](https://javadoc.minestom.net/net/minestom/server/instance/InstanceManager.html#createInstanceContainer(net.minestom.server.instance.IChunkLoader))
* [`InstanceManager#createInstanceContainer(RegistryKey<DimensionType>, @Nullable IChunkLoader)`](https://javadoc.minestom.net/net/minestom/server/instance/InstanceManager.html#createInstanceContainer(net.minestom.server.instance.IChunkLoader))
* [`InstanceContainer#setChunkLoader(IChunkLoader)`](https://javadoc.minestom.net/net/minestom/server/instance/InstanceContainer.html#setChunkLoader(net.minestom.server.instance.IChunkLoader))

Minestom will automatically load chunks from the loader once provided.

## Saving

Saving must be done in two steps:
1. [`Instance#saveChunksToStorage`](https://javadoc.minestom.net/net/minestom/server/instance/Instance.html#saveChunksToStorage())
2. [`Instance#saveInstance`](https://javadoc.minestom.net/net/minestom/server/instance/Instance.html#saveInstance())

```java
MinecraftServer.getSchedulerManager().buildShutdownTask(() -> {
    this.instance.saveChunksToStorage();
    this.instance.saveInstance();
});
```

## Loaders

* [No-op](https://javadoc.minestom.net/net/minestom/server/instance/IChunkLoader.html#noop())
* [Anvil](/docs/world/loading/anvil.md)
* [Polar](/docs/world/loading/polar.md)
