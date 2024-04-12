# Player capabilities

Minestom features a number of interaction methods for players. Many of them are described below, however this list is not exhaustive.

It is worth reviewing the [Adventure API](adventure.md) before this, because these systems depend heavily on `Component`.

## Sidebars (Scoreboards)

`Sidebar`s can be used to display up to 16 lines on a scoreboard for the player. They are created given a title as follows:

```java
Sidebar#<init>(Component /* title */)
```

> Sidebar titles do not support JSON chat components, however the provided component will be serialized using Adventure's legacy serializer.

Once created, a scoreboard can be added and removed from players as follows:

```java
Sidebar#addViewer(Player);
Sidebar#removeViewer(Player);
```

### Sidebar Line

Lines on a sidebar are made up of `ScoreboardLine`s. They render on the scoreboard in order of their line number (score), where the vertically highest line represents the highest line number (score). If two lines have the same line number (score), they will be sorted alphabetically.

`ScoreboardLine`s can be created using their constructor:

```java
Sidebar.ScoreboardLine#<init>(String /* unique id*/, Component /* content */, int /* line */);

// For example
Sidebar.ScoreboardLine line = new Sidebar.ScoreboardLine(
        "some_line_0",
        Component.text("Hello, Sidebar!", NamedTextColor.RED),
        0
);
```

Once created, scoreboard lines may be added to `Sidebar`s as follows:

```java
Sidebar#createLine(Sidebar.ScoreboardLine);
```

Lines are indexed by their unique id, and can be modified with it:

```java
Sidebar#getLine(String /* unique id */);
Sidebar#updateLineContent(String /* unique id */, Component /* new content */);
Sidebar#updateLineScore(String /* unique id */, Int /* new score */);
```

## Notifications

`Notification`s are a system to send advancement completion toasts to a player as a form of communication.

They are a wrapper around `Advancement`, so you do not need to create any advancements to use them, just a `Notification`. See the [Advancements](advancements.md) page for more information on advancements.

```java
Notification#<init>(Component /* title */, FrameType, ItemStack /* icon */);

// For example
Notification notification = new Notification(
        Component.text("Hello, Notifications!", NamedTextColor.GREEN),
        FrameType.GOAL,
        ItemStack.of(Material.GOLD_INGOT)
);
```

To send the notification, use one of the static methods on `NotificationCenter`:

```java
NotificationCenter.send(Notification, Player);
NotificationCenter.send(Notification, Collection<Player>);
```

The example renders as the following:

![](../.gitbook/assets/notification.png)
