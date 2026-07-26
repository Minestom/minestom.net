---
title: Loading an existing world
---

# Loading an existing world

An instance generates every chunk on the fly, unless it is given a `ChunkLoader` to read them from disk. The default is `ChunkLoader.noop()`, which loads and saves nothing. Chunks a loader does not have still fall through to the [`Generator`](./terrain-generation).

## Anvil

Anvil is Mojang's own world format, the one a vanilla client or server writes to disk.

```java
Path worldPath = Path.of("worlds/lobby");
InstanceContainer instance = instanceManager.createInstanceContainer(new AnvilLoader(worldPath, DimensionType.OVERWORLD.key()));
```

The second argument selects a dimension inside that folder. Vanilla stores each one under `dimensions/<namespace>/<dimension>/`, so this reads region files from `worlds/lobby/dimensions/minecraft/overworld/region`. For another dimension, pass its key and give the instance the matching dimension type.

Passing the loader to `createInstanceContainer` also runs `ChunkLoader#loadInstance`, which reads `level.dat` into the instance's [tag handler](/docs/feature/tags). `setChunkLoader` on an existing instance does not.

Blocks, biomes, block entities, heightmaps, and baked lighting all come from the region file. A chunk whose `status` is anything other than `minecraft:full` is skipped with a warning and comes out empty.

::: warning
`new AnvilLoader(Path)` and `new AnvilLoader(String)` read `region/` from the top of the world folder, the layout used before Minecraft 26.1. Both are deprecated for removal.
:::

## Saving

Saving goes back through the same loader. Each method returns a `CompletableFuture<Void>`, completed on the calling thread unless the loader reports `supportsParallelSaving`.

| Method                      | Writes                                        |
| --------------------------- | --------------------------------------------- |
| `saveChunkToStorage(Chunk)` | One chunk                                     |
| `saveChunksToStorage()`     | Every loaded chunk                            |
| `saveInstance()`            | The instance's tags, to `level.dat` for Anvil |

::: tip
If your world is small enough to keep in memory, [Polar](https://github.com/hollow-cube/polar) is a single-file format designed for compact maps. If you only need to place a structure rather than back a whole world, the [schem](https://github.com/hollow-cube/schem) library reads schematics. Both are third-party, so they may lag behind Minestom releases.
:::
