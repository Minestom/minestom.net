# Notifications

A `Notification` sends an advancement completion toast to a player. It sends a throwaway advancement with a completed criterion and immediately removes it again, so no advancement needs to be registered. The [Advancements](advancements) page covers the `FrameType` and icon it takes.

```java
Notification#<init>(Component /* title */, FrameType, ItemStack /* icon */);

// For example
Notification notification = new Notification(
        Component.text("Hello, Notifications!", NamedTextColor.GREEN),
        FrameType.GOAL,
        ItemStack.of(Material.GOLD_INGOT)
);
```

Send it to a player or an audience:

```java
Player#sendNotification(Notification);
PacketGroupingAudience#sendNotification(Notification);
```

The example renders as the following:

![](/docs/feature/notifications/notification.png)
