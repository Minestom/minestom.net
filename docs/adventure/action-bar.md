---
title: Action bar
---

# Action bar

The action bar is a single line of text near the bottom of the screen, drawn just above the held-item name that appears when a player switches hotbar slots. The two are separate and can be on screen at once.

```java
audience.sendActionBar(Component.text("Ammo: 24"));
```

It has no timing controls. The client fades each message out after a few seconds, and a new message replaces the previous one immediately. Keeping text on screen requires re-sending it:

```java
MinecraftServer.getSchedulerManager().buildTask(() -> {
    for (Player player : instance.getPlayers()) {
        player.sendActionBar(Component.text("Time left: " + remaining(player)));
    }
}).repeat(TaskSchedule.tick(20)).schedule();
```

::: warning
The action bar is one line and does not wrap. The client draws it centered with no maximum width, so text longer than the screen runs off both edges. How much stays readable depends on window size and GUI scale.
:::
