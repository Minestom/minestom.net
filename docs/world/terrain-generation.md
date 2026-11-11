---
title: Terrain generation
---

# Terrain generation

## Basics

Each `Instance` has an optional `Generator` that generates areas of various sizes.

The area size is abstracted as a `GenerationUnit` representing an aggregate of sections. The generator places blocks and biomes using relative and absolute coordinates. Because a `GenerationUnit` can cover several sections, the instance can generate a full chunk at once or one section at a time without changing the generator.

Generation tasks are currently forwarded to the common JDK pool. Virtual threads will be used once Project Loom is integrated into the mainline.

## Your first flat world

Here is the naive way of generating a flat world from y=0 to y=40

```java
Instance instance = ...;
instance.setGenerator(unit -> {
    final Point start = unit.absoluteStart();
    final Point size = unit.size();
    for (int x = 0; x < size.blockX(); x++) {
        for (int z = 0; z < size.blockZ(); z++) {
            for (int y = 0; y < Math.min(40 - start.blockY(), size.blockY()); y++) {
                unit.modifier().setBlock(start.add(x, y, z), Block.STONE);
            }
        }
    }
});
```

`GenerationUnit#absoluteStart` returns the lowest coordinate of the unit which is useful for absolute placements. Now, we can heavily simplify the code by using one of our hand-optimized methods:

```java
Instance instance = ...;
instance.setGenerator(unit -> unit.modifier().fillHeight(0, 40, Block.STONE));
```

## Modifying over unit borders

Modification over the border of a `GenerationUnit` cannot be done without extra steps. `GenerationUnit`s cannot be resized during generation, instead we need to create a new `GenerationUnit` that encloses the area around our target blocks. We can do this through the `GenerationUnit#fork` methods.

Forked units are designed to be placed into the instance whenever it is possible to do so. This avoids section bordering issues.

There are two fork methods. Here is a simple example of adding a structure (snowman):\

```java
Instance instance = ...;
instance.setGenerator(unit -> {
    Random random = ...;
    Point start = unit.absoluteStart();

    // Create a snow carpet for the snowmen
    unit.modifier().fillHeight(-64, -60, Block.SNOW);

    // Exit out if unit is not the bottom unit, and exit 5 in 6 times otherwise
    if (start.y() > -64 || random.nextInt(6) != 0) {
        return;
    }

    // Let's fork this section to add our tall snowman.
    // We add two extra sections worth of space to this fork to fit the snowman.
    GenerationUnit fork = unit.fork(start, start.add(16, 32, 16));

    // Now we add the snowman to the fork
    fork.modifier().fill(start, start.add(3, 19, 3), Block.POWDER_SNOW);
    fork.modifier().setBlock(start.add(1, 19, 1), Block.JACK_O_LANTERN);
});
```

Structures can be added with forks.\
However, for this `GenerationUnit#fork` method, you must know how large these structures are beforehand. The alternative `GenerationUnit#fork` overload passes a `Block.Setter` to a consumer. This `Block.Setter` automatically adjusts the fork's size depending on the blocks you set using it.\
\
Here is the same example written with the `Block.Setter` utility:

```java
Instance instance = ...;
instance.setGenerator(unit -> {
    Random random = ...;
    Point start = unit.absoluteStart();

    // Create a snow carpet for the snowmen
    unit.modifier().fillHeight(-64, -60, Block.SNOW);

    // Exit out if unit is not the bottom unit or 5 in 6 times
    if (start.y() > -64 || random.nextInt(6) != 0) {
        return;
    }

    // Add the snowman
    unit.fork(setter -> {
        for (int x = 0; x < 3; x++) {
            for (int y = 0; y < 19; y++) {
                for (int z = 0; z < 3; z++) {
                    setter.setBlock(start.add(x, y, z), Block.POWDER_SNOW);
                }
            }
        }
        setter.setBlock(start.add(1, 19, 1), Block.JACK_O_LANTERN);
    });
});
```

These examples will generate a flat snow world with chunky snowmen scattered throughout, cleanly applying the snowmen whenever it is possible to do so.

![](/docs/world/terrain-generation/snowmen-terrain.png)

Example with missing terrain for clarity:

![](/docs/world/terrain-generation/snowmen.png)

## Heightmaps with JNoise

This example shows a simple approach to building heightmaps using JNoise, this can be expanded to other noise implementations as well.

```java
// Noise used for the height
JNoise noise = JNoise.newBuilder()
        .fastSimplex(FastSimplexNoiseGenerator.newBuilder().build())
        .scale(0.005) // Low frequency for smooth terrain
        .build();

// Set the Generator
instance.setGenerator(unit -> {
    Point start = unit.absoluteStart();
    for (int x = 0; x < unit.size().x(); x++) {
        for (int z = 0; z < unit.size().z(); z++) {
            Point bottom = start.add(x, 0, z);

            synchronized (noise) { // Synchronization is necessary for JNoise
                double height = noise.evaluateNoise(bottom.x(), bottom.z()) * 16;
                // * 16 means the height will be between -16 and +16
                unit.modifier().fill(bottom, bottom.add(1, 0, 1).withY(height), Block.STONE);
            }
        }
    }
});
```

Here's an example of what that looks like:

![](/docs/world/terrain-generation/jnoise.png)
