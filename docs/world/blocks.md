# Blocks

## Overview

A `Block` is an **immutable** object containing:

* Namespace & protocol id
* `Map<String, String>` containing properties (e.g. waterlogged)
* State id which is the numerical id defining the block visual used in chunk packets and a few others
* Optional nbt
* A `BlockHandler`

The immutability allows block references to be cached and reused.

## Usage

```java
Instance instance = ...;
// Each vanilla block has a constant visible from the `Block` interface
instance.setBlock(0, 40, 0, Block.STONE);

// Retrieve the tnt block and create a new block with the `unstable`
// property sets to "true".
// Property names are defined by Mojang and usable in various commands
Block tnt = Block.TNT.withProperty("unstable", "true");
instance.setBlock(0, 41, 0, tnt);
```

## Registry

Each block has unique data which can be retrieved with `Block#registry()`.

```java
Block block = Block.GRASS;
// Some fields have their own dedicated method
boolean solid = block.registry().isSolid();
// ... you can however retrieve them from string
double hardness = block.registry().getDouble("hardness");
hardness = block.registry().hardness();
```

## Tags

`Block` implements `TagReadable` meaning that they can contain all kinds of data. (see [Tags](../feature/tags.md))

```java
Tag<String> tag = Tag.String("my-key");
Block tnt = Block.TNT;
// Create a new block with the tag sets to "my-value"
tnt = tnt.withTag(tag, "my-value");
// Retrieve the value from the newly created block
String value = tnt.getTag(tag);

// Block can also expose a convenient view of their nbt
NBTCompound nbt = tnt.nbt();
```

Tags data can be serialized and will be saved on disk automatically.

{% hint style="warning" %}
Tags `id`, `x`, `y`, `z `and `keepPacked`are used by the anvil loader and may cause unexpected behavior when added to blocks.
{% endhint %}

## Handlers

The `BlockHandler` interface allows blocks to have behavior by listening to some events like placement or interaction. And can be serialized to disk thanks to their namespace.

```java
public class DemoHandler implements BlockHandler {
    @Override
    public void onPlace(@NotNull Placement placement) {
        if (placement instanceof PlayerPlacement) {
            // A player placed the block
        }
        Block block = placement.getBlock();
        System.out.println("The block " + block.name() + " has been placed");
    }

    @Override
    public @NotNull NamespaceID getNamespaceId() {
        // Namespace required for serialization purpose
        return NamespaceID.from("minestom:demo");
    }
}
```

You can then decide to use one handler per block, or share it with several.

```java
Block tnt = Block.TNT;
// Create a new block with the specified handler.
// Be aware that block objects can be reused, handlers should
// therefore never assume to be assigned to a single block.
tnt = tnt.withHandler(new DemoHandler());

// Share the same handler reference with multiple blocks
BlockHandler handler = new DemoHandler();
Block stone = Block.STONE.withHandler(handler);
Block grass = Block.GRASS.withHandler(handler);
```
