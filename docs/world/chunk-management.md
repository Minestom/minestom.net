---
description: >-
  This page describes what you need to know about chunks management, more
  specifically for InstanceContainer
---

# Chunk management

## Load/Save Steps

When trying to load a chunk, the instance container does multiple checks in this order:

1. Verify if the chunk is already loaded (stop here if yes)
2. Try to load the chunk from the instance [IChunkLoader](https://minestom.github.io/Minestom/net/minestom/server/instance/IChunkLoader.html) using [IChunkLoader#loadChunk](https://minestom.github.io/Minestom/net/minestom/server/instance/IChunkLoader.html#loadChunk%28net.minestom.server.instance.Instance,int,int,net.minestom.server.utils.chunk.ChunkCallback%29) (stop here if the chunk loading is successful)
3. Create a new chunk and execute the instance ChunkGenerator (if any) to it to generate all of the chunk's blocks.

When trying to save a chunk, [IChunkLoader#saveChunk](https://minestom.github.io/Minestom/net/minestom/server/instance/IChunkLoader.html#saveChunk%28net.minestom.server.instance.Chunk,java.lang.Runnable%29) is called.

### Default behavior

`AnvilLoader` is the default chunk loader used by all `InstanceContainer`

## Create your own chunk type

[Chunk](https://minestom.github.io/Minestom/net/minestom/server/instance/Chunk.html) is an abstract class, you can simply create a new class extending it to create your own implementation.

Making your own chunk implementation allows you to customize how you want blocks to be stored, how you want chunks tick to happen, etc...

### How to make my instance use my implementation

If you are using a simple [InstanceContainer](https://minestom.github.io/Minestom/net/minestom/server/instance/InstanceContainer.html) with the default [IChunkLoader](https://minestom.github.io/Minestom/net/minestom/server/instance/IChunkLoader.html) you will just need to change the instance's chunk supplier

```java
instanceContainer.setChunkSupplier(YOUR_CHUNK_SUPPLIER);
```

It will be called when a chunk object needs to be provided.
