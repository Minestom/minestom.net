# Inventories

Inventories take a large place in Minecraft, they are used both for items storage and client<->server communication.

In order to create one, you can simply call its constructor by specifying an InventoryType and its name

```java
// Create the inventory
Inventory inventory = new Inventory(InventoryType.CHEST_1_ROW, "The inventory name");

// Open the inventory for the player 
// (Opening the same inventory for multiple players would result in a shared interface)
player.openInventory(inventory);

// Close the current player inventory
player.closeInventory();
```

Sometimes you will want to add callbacks to your inventory actions (clicks). There are currently 3 ways of interacting with them.

### Adding an inventory condition

Inventory conditions are specific to only one inventory. You are able to cancel the interaction by using InventoryConditionResult#setCancel

```java
inventory.addInventoryCondition((player, slot, clickType, inventoryConditionResult) -> {
   player.sendMessage("click type inventory: " + clickType);
   System.out.println("slot inv: " + slot);
   inventoryConditionResult.setCancel(false);
});
```

### InventoryPreClickEvent (see [the events page](events/))

Really similar to inventory conditions except that it listens to every inventory (you can obviously add checks when needed, but its goal is to be more "general")

### InventoryClickEvent (see [the events page](events/))

This event only listens to successful actions (not canceled) and is fired after setting the items in the inventory.
