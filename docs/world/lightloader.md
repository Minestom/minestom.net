---
description: >-
  This page describes how to add lighting to a minestom instance
---

## Setting the chunk supplier

To use the LightingChunk class, you can call the `InstanceContainer#setChunkSupplier(LightingChunk::new)` method.
By default lighting will be generated for chunks when they are sent to the client.

An example of using this method:
```java
InstanceContainer.setChunkSupplier(LightingChunk::new);
```
## Precalculating Lighting

To load preload chunks and calculate lighting before players join, you can use the following code:

```java
var chunks = new ArrayList<CompletableFuture<Chunk>>();
ChunkUtils.forChunksInRange(0, 0, 32, (x, z) -> chunks.add(instanceContainer.loadChunk(x, z)));

CompletableFuture.runAsync(() -> {
    CompletableFuture.allOf(chunks.toArray(CompletableFuture[]::new)).join();
    System.out.println("load end");
    LightingChunk.relight(instanceContainer, instanceContainer.getChunks());
    System.out.println("light end");
});
```
