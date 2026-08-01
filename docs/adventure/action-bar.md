---
title: Action bar
---

# Action bar

The action bar is a single line of text near the bottom of the screen, drawn just above the held-item name that appears when a player switches hotbar slots. The two are separate and can be on screen at once.

```java
audience.sendActionBar(Component.text("Ammo: 24"));
```

It has no timing controls. The client fades each message out after a few seconds, and a new message replaces the previous one immediately.