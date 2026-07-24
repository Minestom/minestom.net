# Batch

A batch caches a list of block changes and applies them all at once. This is faster than calling `Instance#setBlock` in a loop: each affected chunk is locked once rather than once per block, and viewers are only notified after every block has been placed.

There are three implementations, each fitting a different use case:

| Type                 | Coordinates                          | Scope                                |
| -------------------- | ------------------------------------ | ------------------------------------ |
| `ChunkBatch`         | Chunk-relative X/Z, absolute Y       | A single chunk, applied to any chunk |
| `AbsoluteBlockBatch` | World                                | Any number of chunks, fixed position |
| `RelativeBlockBatch` | Origin-relative, translated on apply | Any number of chunks, translatable   |

::: tip
Batches are for modifying an already-loaded world. If you are producing terrain, write a [`Generator`](./generation) instead, which runs before the chunk is ever sent to a player.
:::

## Setting blocks

Every batch implements `Block.Setter`, so they share the same methods as `Instance` and `GenerationUnit#modifier`:

```java
AbsoluteBlockBatch batch = new AbsoluteBlockBatch();
batch.setBlock(0, 40, 0, Block.STONE);
batch.setBlock(new BlockVec(1, 40, 0), Block.OAK_LOG);

// Areas are experimental, but convenient for bulk fills
batch.setBlockArea(Area.cuboid(new BlockVec(0, 41, 0), new BlockVec(15, 45, 15)), Block.GLASS);
```

Setting the same coordinate twice overwrites the previous entry, and `Batch#clear` empties the batch.

## Applying

All batches expose `apply(Instance, callback)`, which applies the batch at its default position. The callback runs on the instance's next tick after the batch is applied.

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

X and Z are chunk-relative (0-15) rather than world coordinates; values outside that range are masked down to it. **Y is an absolute world coordinate**, so it must fall within the dimension's build limits.

The default `apply` position is chunk (0, 0), but any chunk works:

```java
ChunkBatch batch = new ChunkBatch();
batch.setBlock(0, 64, 0, Block.STONE);

// Applies at chunk (1, 2), so block (16, 64, 32)
batch.apply(instance, 1, 2, chunk -> { /* ... */ });

// Or against a chunk you already have a reference to
batch.apply(instance, chunk, null);
```

::: warning
The target chunk must be loaded. If it is not, the batch logs a warning, places nothing, and never runs the callback. The `apply(Instance, int, int, ChunkCallback)` overload additionally returns `null`.
:::

## AbsoluteBlockBatch

Each affected chunk is applied independently, so the batch is not atomic across chunk borders. A player standing near a boundary can briefly see one chunk updated before the next. The callback runs once every chunk has finished.

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

`setInverseOption` controls the `BatchOption` used for the inverse batch, which is independent of the options of the batch itself.

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

Every apply rebuilds an `AbsoluteBlockBatch` from scratch, re-inserting each block into a fresh per-chunk map. If you apply the same batch to the same position repeatedly, convert it once and cache the result:

```java
AbsoluteBlockBatch absolute = batch.toAbsoluteBatch(100, 64, 100);
```

`toAbsoluteBatch()` without arguments converts at the origin (0, 0, 0).

## Inverses

An inverse undoes a batch after it has been applied. With `setCalculateInverse(true)`, `apply` returns a new batch containing the previous state of every block it overwrote. The inverse of a `RelativeBlockBatch` is an `AbsoluteBlockBatch`, pinned to the position it was applied at.

```java
RelativeBlockBatch batch = new RelativeBlockBatch(new BatchOption().setCalculateInverse(true));
batch.setBlock(0, 0, 0, Block.TNT);

batch.apply(instance, player.getPosition(), inverse -> {
    // Undo the batch one second later
    instance.scheduler().scheduleTask(() -> inverse.apply(instance, null), TaskSchedule.seconds(1));
});
```

A returned inverse is not necessarily ready to apply right away. Unless the `unsafeApply` option is set, calling `apply` on it blocks the current thread until it is. You can also check readiness yourself:

```java
// Returns true if ready
batch.isReady();

// Blocks until ready
batch.awaitReady();
```

::: note
An inverse is always ready inside the `apply` callback, which is the simplest place to use it.
:::
