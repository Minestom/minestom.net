# Lighting

A chunk renders black unless it carries light data. Chunks read from an [Anvil world](./loading#anvil) have it cached in their region files, but generated chunks have none. The `LightingChunk` supplier computes sky and block light for them:

```java
InstanceContainer instance = instanceManager.createInstanceContainer();
instance.setChunkSupplier(LightingChunk::new);
```

Light is computed the first time a chunk is sent to a client, then again after block changes, batched behind a 100ms delay set by `minestom.send-light-after-block-placement-delay`.

## Precomputing lighting

Lighting chunks up front can speed up the first player join:

```java
List<CompletableFuture<Chunk>> chunks = new ArrayList<>();
ChunkRange.chunksInRange(0, 0, 32, (x, z) -> chunks.add(instance.loadChunk(x, z)));

CompletableFuture.allOf(chunks.toArray(CompletableFuture[]::new))
        .thenRun(() -> LightingChunk.relight(instance, instance.getChunks()));
```

`relight` can be called from any thread, and is also how you fix lighting after a [batch](./block-batches) or any other bulk edit.

## Full bright

A dimension type with `ambientLight` set to `1.0F` renders every block fully lit, no light computation needed:

```java
RegistryKey<DimensionType> lobbyDimension = MinecraftServer.getDimensionTypeRegistry()
        .register("minestom:lobby", DimensionType.builder()
                .ambientLight(1.0F)
                .build());

InstanceContainer lobby = instanceManager.createInstanceContainer(lobbyDimension);
```

::: warning
`ambientLight` blends between normal lighting at `0.0F` and fully lit at `1.0F`. Anything higher, such as the `2.0F` in older snippets, breaks rendering.
:::
