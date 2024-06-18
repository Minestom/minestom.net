# Batch

When manipulating a lot of blocks, it is wiser to make use of a Batch to update all of the chunks at once. There are 3 types of batches: `ChunkBatch`, `AbsoluteBlockBatch`, `RelativeBlockBatch`.

All batches have a similar set of methods to set blocks, however the coordinate systems are not all the same. See the individual batch for specifics.

```java
Batch#setBlockStateId(int /* x */, int /* y */, int /* z */, short /* block id */, Data);
Batch#setCustomBlock(int /* x */, int /* y */, int /* z */, short /* custom block id */, Data);
Batch#setSeparateBlocks(int /* x */, int /* y */, int /* z */, short /* block id */, short /* custom block id */, Data);
```

Applying a batch can be always done with `Batch#apply(Instance, Callback)`. This will apply the batch in the "default" position (dependent on the batch). See the individual `apply` variants on each batch for alternative application options.

`BatchOption` provides some configuration related to how the batch will behave. The options are:

*   Full Chunk: If set, every chunk modified by this batch will assume that the batch is responsible

    for the entire chunk, so any existing blocks will be removed.
* Calculate Inverse: If set, the `apply` methods will return an inverse of the batch. See Inverses below.
* Unsafe Apply: If set, the batch will not wait for itself to be ready when applying. See Inverses below.

> Each batch fits a different use case, however it is wise to use the most specific batch possible for the use case. For example, setting a set of blocks all inside one chunk _can_ be done with all 3 batches. It should, however, be done with a ChunkBatch because it is the most efficient of the 3.

## ChunkBatch

Contains changes completely contained within 1 chunk, the changes can be applied to any chunk.

Coordinates are given in relative chunk coordinates (ie 0-15), not world coordinates.

The default `apply` location is chunk (0, 0), however it may be applied to any chunk.

```java
ChunkBatch#apply(Instance, int /* chunkX */, int /* chunkZ */, ChunkCallback);
ChunkBatch#apply(Instance, Chunk, ChunkCallback);

// For example
// Will apply at chunk 1, 2 (ie block 16, 32)
chunkBatch.apply(instance, 1, 2, null);
```

## AbsoluteBlockBatch

Represents a set of block changes relative to the origin (0, 0, 0). All changes will be made to the coordinates given to `Batch#set*`, thus coordinates are given in world coordinates.

`AbsoluteBlockBatch` does not have any batch-specific `apply` options.

## RelativeBlockBatch

Represents a set of block changes with no specified position. Coordinates are given in world coordinates, however they will be translated to any position given to `apply`.

The default `apply` location is the instance origin (0, 0, 0), however it may be applied to any position

```java
RelativeBlockBatch#apply(Instance, BlockPosition, Runnable);
RelativeBlockBatch#apply(Instance, int /* x */, int /* y */, int /* z */, Runnable);
```

`RelativeBlockbatch` has a significant performance difference from the other two options, and they should be used over `RelativeBlockBatch` if possible. It is possible to convert a relative batch to an `AbsoluteBlockBatch` using the following methods. This should be used (and cached) if the batch will be applied several times to the same location.

```java
RelativeBlockBatch#toAbsoluteBatch();
RelativeBlockBatch#toAbsoluteBatch(int /* x */, int /* y */, int /* z */);
```

## Inverses

Inverses exist to undo a batch operation after applying it. If Calculate Inverse is set in the `BatchOption`s, `apply` will return a new back containing the opposite of every action performed during application.

When an inverse is returned from `apply`, it will not necessarily be ready for application. If the Unsafe Apply option is set, no checks will be made. Otherwise, `apply` on the inverse will block the current thread until it is ready.

It is possible to check if a batch is ready and wait for it to be ready regardless of the Unsafe Apply option.

```java
// Returns true if ready
Batch#isReady()

// Block until ready
Batch#awaitReady()
```

> An inverse will always be ready to apply in the `apply` callback.
