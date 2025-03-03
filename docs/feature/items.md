# Items

## Overview

Items in Minestom are **immutable**, meaning that an `ItemStack` cannot change after being built. This provides us many benefits:

- Thread safety, as you cannot change the same object from multiple threads.
- No side effects where a change to an item would modify all inventories where the same object is present.
- Ability to reuse `ItemStack` in multiple places. For example, if all your players start with the same set of items, you could just store those as constants and add them to each player inventory to avoid a lot of allocation.
- Related to the second point, it allows us to internally cache items packet (eg: window packet) to keep improving performance

## API

:::alert warning
In previous versions of Minestom, methods such as `displayName` existed, since they were part of item meta. In 1.20.5, Mojang switched to a component system, which now requires us to use ItemComponent along with a value.
:::

```java
// Constant air item, should be used instead of 'null
ItemStack air = ItemStack.AIR;
// Item with amount sets to 1
ItemStack stone = ItemStack.of(Material.STONE);
// Item with custom amount
ItemStack stoneStack = ItemStack.of(Material.STONE, 64);
```

However, as items are immutable, creating complex objects require using a builder:

```java
ItemStack item = ItemStack.builder(Material.STONE)
        .set(ItemComponent.ITEM_NAME, Component.text("Item name!", NamedTextColor.GREEN))
        .set(ItemComponent.LORE, Arrays.asList(Component.text("Line 1"), Component.text("Line 2")))
        .build();
```

Methods exist for creating copies of items as well:

```java
// Set the amount to 5
item = item.withAmount(5);
// Set the amount based on the current one
item = item.withAmount(amount -> amount * 2);
// Same with various other fields
item = item.with(ItemComponent.ITEM_NAME, Component.text("New item name!"));

// Start rebuilding the item
// More performant than the above if you need to modify multiple fields
item = item.with(builder -> {
        builder.amount(32)
                .set(ItemComponent.ITEM_NAME, Component.text("Again..."));
        });
```
