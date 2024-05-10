# Inventories

In modern Minecraft servers, inventories have evolved to become more than storage. Minestom makes it easy to create Inventories and listen to inventory events.

In order to create one, you can simply call its constructor by specifying an InventoryType and the title.

```java
// Create the inventory
ContainerInventory inventory = new ContainerInventory(InventoryType.CHEST_1_ROW, "The inventory name");

// Open the inventory for the player
// (Opening the same inventory for multiple players would result in a shared interface)
player.openInventory(inventory);

// Close the current player inventory
player.closeInventory();
```

Sometimes you will want to add callbacks to your inventory actions (clicks). There are currently 2 ways of interacting with them.

::: warning
Previously, in versions 1.20.4 and earlier of Minestom, it was possible to create InventoryConditions. This functionality has since been removed.
:::

### InventoryPreClickEvent (see [the events page](events))

InventoryPreClickEvent is a cancellable event, which can be used to prevent an item from being picked up by the Player.

```java
ContainerInventory inventory = ; // create inventory

// You probably wouldn't want to use the GlobalEventHandler for this.
GlobalEventHandler globalEventHandler = MinecraftServer.getGlobalEventHandler();

// Register event
globalEventHandler.registerListener(InventoryPreClickEvent.class, (event) -> {
    if (event.getInventory() != inventory) return;
    // Cancel event
    event.setCancelled(true);
});
```

### InventoryClickEvent (see [the events page](events))

This event only listens to successful actions (not cancelled) and is fired after setting the items in the inventory.

```java
ContainerInventory inventory = ; // create inventory

// You probably wouldn't want to use the GlobalEventHandler for this.
GlobalEventHandler globalEventHandler = MinecraftServer.getGlobalEventHandler();

// Register event
globalEventHandler.registerListener(InventoryClickEvent.class, (event) -> {
    if (event.getInventory() != inventory) return;
    // This event can't be cancelled
});
```
