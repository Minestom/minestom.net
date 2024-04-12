# Items

## Overview

Items in Minestom are **immutables**, meaning that an `ItemStack` cannot change after being built. This provides us many benefits:

* Thread safety, as you cannot change the same object from multiple threads.
* No side effects where a change to an item would modify all inventories where the same object is present.
* Reuse `ItemStack` in multiple places. For example, if all your players start with the same set of items, you could just store those as constants and add them to each player inventory to avoid a lot of allocation.
* Related to the second point, it allows us to internally cache items packet (eg: window packet) to keep improving performance

## API

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
        .displayName(Component.text("Display name!", NamedTextColor.GREEN))
        .lore(Component.text("Line 1"), Component.text("Line 2"))
        .meta(metaBuilder ->
                metaBuilder.enchantment(Enchantment.EFFICIENCY, (short) 10)
                        .hideFlag(ItemHideFlag.HIDE_ENCHANTS))
        .build();
```

And some special methods have been made to modify an existing item easily:

```java
// Set the amount to 5
item = item.withAmount(5);
// Set the amount based on the current one
item = item.withAmount(amount -> amount * 2);
// Same with various other fields
item = item.withDisplayName(Component.text("New display name!"));

// Start rebuilding the item
// More performant than the above if you need to modify multiple fields
item = item.with(builder -> {
        builder.amount(32)
                .displayName(Component.text("Again..."));
        });
```
