# Player capabilities

Minestom features a number of interaction methods for players. Many of them are described below, however this list is not exhaustive.

It is worth reviewing the [Adventure API](adventure) before this, because these systems depend heavily on `Component`.

## Scoreboards

### Sidebars

`Sidebar`s display up to 15 lines of text on the right side of the screen. They are created with a title, and lines are replaced in bulk with `update`:

```java
Sidebar sidebar = Sidebar.create(Component.text("MY SERVER"));
sidebar.update(
        Component.text("Kills: 5"),
        Component.text("Deaths: 2")
);
sidebar.addViewer(player);
```

Lines are ordered top to bottom and their scores are hidden. Only lines whose content changed are sent to viewers, so repeatedly calling `update` with a full list is cheap. A single line can also be changed with its index:

```java
Sidebar#setLine(int /* index, 0 at the top */, Component /* content */);
```

How a line's score is displayed can be customized per index with `Sidebar#setNumberFormat(int, NumberFormat)`; formats are kept across `update` calls. Showing a sidebar to a player replaces whatever they previously had in the sidebar slot, and viewers are removed automatically when they disconnect.

### Objectives

`Sidebar` covers the common case; `Objective` is the full vanilla scoreboard objective for everything else. An objective tracks a `ScoreEntry` (an integer score with an optional display name and number format) per score holder, and can be displayed in any `DisplaySlot`: the player list, the sidebar, below name tags, or one of the 16 team color slots.

```java
Objective objective = Objective.create("health", Component.text("Health"));
objective.setRenderType(RenderType.HEARTS);
objective.updateScore(target, 20);

player.setDisplayedObjective(DisplaySlot.PLAYER_LIST, objective);
player.setDisplayedObjective(DisplaySlot.BELOW_NAME, objective);
```

Score holder names are arbitrary strings. The vanilla convention, usernames for players and UUIDs for other entities, is available through `Objective#scoreHolder(Entity)` and the `Entity` overloads of the update methods.

Binding an objective to an occupied slot replaces the previous objective, and all of a player's bindings are removed when they disconnect. A sidebar's backing objective is accessible with `Sidebar#getObjective()` for advanced customization such as displaying it in a team color slot.

## Notifications

`Notification`s are a system to send advancement completion toasts to a player as a form of communication.

They are a wrapper around `Advancement`, so you do not need to create any advancements to use them, just a `Notification`. See the [Advancements](advancements) page for more information on advancements.

```java
Notification#<init>(Component /* title */, FrameType, ItemStack /* icon */);

// For example
Notification notification = new Notification(
        Component.text("Hello, Notifications!", NamedTextColor.GREEN),
        FrameType.GOAL,
        ItemStack.of(Material.GOLD_INGOT)
);
```

To send the notification, use `Player#sendNotification` or `PacketGroupingAudience#sendNotification`

```java
Player#sendNotification(Notification);
PacketGroupingAudience#sendNotification(Notification);
```

The example renders as the following:

![](/docs/feature/player-capabilities/notification.png)
