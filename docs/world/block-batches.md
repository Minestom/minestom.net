---
title: Block Batches
---

# Block batches

A batch collects block changes and applies them all at once. This is faster than calling `Instance#setBlock` in a loop: each affected chunk is locked once rather than once per block, and viewers are only notified after every block has been placed.

There are three implementations:

| Type                 | Coordinates                          | Scope                                |
| -------------------- | ------------------------------------ | ------------------------------------ |
| `ChunkBatch`         | Chunk-relative X/Z, absolute Y       | One chunk, applicable to any chunk   |
| `AbsoluteBlockBatch` | World                                | Any number of chunks, fixed position |
| `RelativeBlockBatch` | Origin-relative, translated on apply | Any number of chunks, translatable   |

::: tip
Batches modify an already-loaded world. To produce terrain, write a [`Generator`](./terrain-generation) instead, which runs before the chunk is ever sent to a player.
:::

## Setting blocks

All batches implement `Block.Setter`, the same interface as `Instance` and `GenerationUnit#modifier`:

```java
AbsoluteBlockBatch batch = new AbsoluteBlockBatch();
batch.setBlock(0, 40, 0, Block.STONE);
batch.setBlock(new BlockVec(1, 40, 0), Block.OAK_LOG);

// Area is experimental
batch.setBlockArea(Area.cuboid(new BlockVec(0, 41, 0), new BlockVec(15, 45, 15)), Block.GLASS);
```

Setting the same coordinate twice overwrites the previous entry, and `Batch#clear` empties the batch.

## Applying

All batches expose `apply(Instance, callback)`, which applies the batch at its default position and runs the callback on the instance's next tick. For an immediate callback on whichever thread finished the placement, use `unsafeApply` instead, named `applyUnsafe` on `RelativeBlockBatch`.

```java
AbsoluteBlockBatch batch = new AbsoluteBlockBatch();
batch.setBlock(0, 40, 0, Block.STONE);

batch.apply(instance, inverse -> {
    // all blocks are placed and the clients have been notified
});
```

The callback type differs per batch. `ChunkBatch` hands you the `Chunk` it was applied to, while `AbsoluteBlockBatch` and `RelativeBlockBatch` hand you the inverse batch (see [Inverses](#inverses)), which is `null` unless inverse calculation is enabled.

## Options

`BatchOption` is passed to the batch constructor and configures how application behaves.

```java
BatchOption options = new BatchOption()
        .setFullChunk(true)
        .setCalculateInverse(true);

ChunkBatch batch = new ChunkBatch(options);
```

| Option                | Default | Effect                                                                                                                                                               |
| --------------------- | ------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `setFullChunk`        | `false` | The batch is responsible for the entire chunk. Existing blocks are cleared before placement, and viewers receive a full chunk resend instead of per-section updates. |
| `setCalculateInverse` | `false` | `apply` returns a batch undoing the changes. Otherwise it returns `null`.                                                                                            |
| `setUnsafeApply`      | `false` | `apply` does not wait for the batch to be ready. Applying a batch that is not ready yet gives an undefined result.                                                   |
| `setSendUpdate`       | `true`  | Whether viewers are notified at all. Disable it if you intend to send the block updates yourself.                                                                    |

## ChunkBatch

X and Z are chunk-relative (0-15) rather than world coordinates, and values outside that range are masked into it. Y is an absolute world coordinate, so it must fall within the instance's build limits.

The default `apply` position is chunk (0, 0), but any chunk works:

```java
ChunkBatch batch = new ChunkBatch();
batch.setBlock(0, 64, 0, Block.STONE);

// Applies at chunk (1, 2), so block (16, 64, 32)
batch.apply(instance, 1, 2, chunk -> { /* ... */ });

// Or against a chunk you already have
batch.apply(instance, chunk, null);
```

::: warning
The target chunk must be loaded. Otherwise the batch logs a warning, places nothing, and never runs the callback. The `apply(Instance, int, int, ChunkCallback)` overload additionally returns `null`.
:::

## AbsoluteBlockBatch

There are no position arguments, since the coordinates passed to `setBlock` are already the final ones:

```java
AbsoluteBlockBatch batch = new AbsoluteBlockBatch();

for (int x = -32; x < 32; x++) {
    for (int z = -32; z < 32; z++) {
        batch.setBlock(x, 40, z, Block.WHITE_CONCRETE);
    }
}

batch.apply(instance, null);
```

Each affected chunk is applied independently, so the batch is not atomic across chunk borders: a player near a boundary can briefly see one chunk updated before the next. The callback runs once every chunk has finished.

## RelativeBlockBatch

Coordinates are relative to (0, 0, 0), and the position passed to `apply` translates every block by that amount. Offsets are stored in 16 bits, so each coordinate must be within ±32,767 blocks of the first one set. Larger areas need an `AbsoluteBlockBatch`.

```java
RelativeBlockBatch batch = new RelativeBlockBatch();

for (int x = 0; x < 5; x++) {
    for (int z = 0; z < 5; z++) {
        batch.setBlock(x, 0, z, Block.QUARTZ_BLOCK);
    }
}

// Applies at the instance origin
batch.apply(instance, null);

// Or anywhere else
batch.apply(instance, player.getPosition(), null);
batch.apply(instance, 100, 64, 100, null);
```

Every apply rebuilds an `AbsoluteBlockBatch` from scratch. If you apply the same batch to the same position repeatedly, convert it once and cache the result:

```java
AbsoluteBlockBatch absolute = batch.toAbsoluteBatch(100, 64, 100);
```

`toAbsoluteBatch()` without arguments converts at the origin.

## Inverses

An inverse undoes a batch after it has been applied. With `setCalculateInverse(true)`, `apply` returns a new batch holding the previous state of every block it overwrote. The inverse of a `RelativeBlockBatch` is an `AbsoluteBlockBatch`, pinned to the position it was applied at.

```java
RelativeBlockBatch batch = new RelativeBlockBatch(new BatchOption().setCalculateInverse(true));
batch.setBlock(0, 0, 0, Block.TNT);

batch.apply(instance, player.getPosition(), inverse -> {
    // Undo the batch one second later
    instance.scheduler().buildTask(() -> inverse.apply(instance, null))
            .delay(TaskSchedule.seconds(1))
            .schedule();
});
```

An inverse is not necessarily ready to apply right away. Unless `unsafeApply` is set on it, calling `apply` blocks the current thread until it is. You can also check readiness yourself:

```java
// Returns true if ready
inverse.isReady();

// Blocks until ready
inverse.awaitReady();
```

`AbsoluteBlockBatch#setInverseOption` sets the `BatchOption` its inverse is created with, independently of the options of the batch itself.

::: note
An inverse is always ready inside the `apply` callback.
:::
