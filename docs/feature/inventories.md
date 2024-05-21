# Inventories

Minestom has an improved inventory system! This includes vanilla accurate click behaviour (except in cases like crafting), an improved inventory event API, and a few other changes.

## Usage

In order to create an inventory, you can simply call its constructor by specifying an InventoryType and the title.

```java
// Create the inventory
ContainerInventory inventory = new ContainerInventory(InventoryType.CHEST_1_ROW, Component.text("Title"));

// Open the inventory for the player
// (Opening the same inventory for multiple players would result in a shared interface)
player.openInventory(inventory);

// Close the current player inventory
player.closeInventory();
```

Adding callbacks are as simple as registering a listener to an EventNode

```java
EventNode.type("click", EventFilter.INVENTORY, (event, inv) -> inventory == inv)
.addListener(InventoryClickEvent.class, event -> {
	event.getPlayer().sendMessage("Clicked!");
})
```

## Recent Changes

- Inventory classes have been renamed. `AbstractInventory` is now `Inventory`, and what was `Inventory` is now `ContainerInventory`. This makes the hierarchy a bit clearer. To be clear, `ContainerInventory` represents all named inventories (e.g. chest inventories, anvil inventories, crafting inventories).

- Click events with `#getClickedItem()`, `#getClickType()`, `#getSlot()`, etc. have been replaced with the `Click.Info` type. This is an interface permitting a bunch of subclasses, including `Left`, `Right`, `RightShift`, etc, each storing the relevant slots. When listening to an event, you can simply check the click type:
  `if (event.getClickInfo() instanceof Click.Info.Left left) { /* logic */ }`

- Inventory click events have been refactored to the following structure:

  - InventoryPreClickEvent
    - Allows modification of the raw information about the click (e.g. clicked slots, click type, which button was used, etc) via `event.getClickInfo()`.
    - This occurs before the click is processed.
  - InventoryClickEvent
    - Allows modification of the slot changes and side effects that occur as result of the click via `event.getChanges()` instead of just the click info.
    - This occurs before the click is processed.
  - InventoryPostClickEvent
    - Allows viewing the click info and results for the click, but cannot modify them.
    - This occurs after the click is processed.

- When the player clicks while their own inventory is open, the `event.getInventory()` in each event is now the player's inventory. Previously, it was `null`.

- `InventorySwapItemEvent` is now considered a click, so you can listen to click events that have `event.getClickInfo() instanceof OffhandSwap`.

- `InventoryCloseEvent` no longer has `#setNewInventory(Inventory)`. Instead, use `event.getPlayer().openInventory` or `event.setCancelled(true)` when needed.

- `PlayerInventoryItemChangeEvent` is now under `InventoryItemChangeEvent`. Filter the event if you want only `PlayerInventory` instances.

- `InventoryClickEvent` has been renamed to `InventoryPostClickEvent`
- `InventoryCondition` has been converted into an event.

  ```Java
  // Old
  inventory.addInventoryCondition((player, slot, clickType, inventoryConditionResult) -> {
  	player.sendMessage("Clicked!");
  });

  // New
  EventNode.type("click", EventFilter.INVENTORY, (event, inv) -> inventory == inv)
  .addListener(InventoryClickEvent.class, event -> {
  	event.getPlayer().sendMessage("Clicked!");
  })
  ```

## Click.Info

Click slots in `Click.Info` are stored in an unintuitive manner. The slot IDs represent both clicked inventory slots and player inventory slots. To get an item from a slot ID, you can use this code:

```Java
Inventory inventory = event.getInventory();
if (slot < inventory.getSize()) {
    return inventory.getItemStack(slot);
} else {
    int converted = PlayerInventoryUtils.protocolToMinestom(slot, inventory.getSize());
    return event.getPlayerInventory().getItemStack(converted);
}
```

Let [@GoldenStack](https://github.com/GoldenStack) know if you have a better idea for handling this.
