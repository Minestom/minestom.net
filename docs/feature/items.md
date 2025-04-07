# Items

## Overview

Items in Minestom are **immutable**, meaning that an `ItemStack` cannot change after being built. This provides us many benefits:

- Thread safety, as you cannot change the same object from multiple threads.
- No side effects where a change to an item would modify all inventories where the same object is present.
- Ability to reuse `ItemStack` in multiple places. For example, if all your players start with the same set of items, you could just store those as constants and add them to each player inventory to avoid a lot of allocation.
- Related to the second point, it allows us to internally cache items packet (eg: window packet) to keep improving performance

## ItemStack

```java
// Constant air item, should be used instead of 'null
ItemStack air = ItemStack.AIR;
// Item with amount set to 1
ItemStack stone = ItemStack.of(Material.STONE);
// Item with custom amount
ItemStack stoneStack = ItemStack.of(Material.STONE, 64);
```

Items are configured using `DataComponent`s, the whole list of components can be found [on the Wiki](https://minecraft.wiki/w/Data_component_format). Components can be added to items using `with`, or removed using `without`.

```java
ItemStack item = ItemStack.of(Material.STONE)
        .with(DataComponent.CUSTOM_NAME, Component.text("Item name!", NamedTextColor.GREEN));
```

However, as items are immutable, creating complex objects is simpler using a builder:

```java
item = ItemStack.builder(Material.STONE)
        .set(DataComponent.CUSTOM_NAME, Component.text("Item name!", NamedTextColor.GREEN))
        .set(DataComponent.LORE, List.of(Component.text("Line 1"), Component.text("Line 2")))
        .build();

// We also provide some utility methods for common components
item = ItemStack.builder(Material.STONE)
        .customName(Component.text("Item name!", NamedTextColor.GREEN))
        .build();
item = ItemStack.of(Material.STONE)
        .withCustomName(Component.text("Item name!", NamedTextColor.GREEN))
```

Methods exist for creating copies of items as well:

```java
// Set the amount to 5
item = item.withAmount(5);
// Set the amount based on the current one
item = item.withAmount(amount -> amount * 2);
// Same with various other fields
item = item.with(DataComponent.CUSTOM_NAME, Component.text("New item name!"));

// Start rebuilding the item
// More performant than the above if you need to modify multiple fields
item = item.with(builder -> {
        builder.amount(32)
                .set(DataComponent.CUSTOM_NAME, Component.text("Again..."));
        });
```

## Serialization

Items can be serialized to and from various formats using its `Codec`:

```java
BinaryTag nbt = ItemStack.CODEC.encode(Transcoder.NBT, item).orElseThrow();
item = ItemStack.CODEC.decode(Transcoder.NBT, nbt).orElseThrow();

JsonElement json = ItemStack.CODEC.encode(Transcoder.JSON, item).orElseThrow();
item = ItemStack.CODEC.decode(Transcoder.JSON, json).orElseThrow();
```
