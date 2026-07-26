---
title: Tab list
---

# Tab list

The tab list is the player overlay shown while the tab key is held. Adventure controls the text above and below it. The entries are properties of each `Player`.

## Header and footer

```java
audience.sendPlayerListHeaderAndFooter(
        Component.text("My Server", NamedTextColor.GOLD),
        Component.text("play.example.com")
);
```

Both parts are sent in one packet, so changing one requires re-sending the other. Pass `Component.empty()` for an unused part.

## Entries

An entry displays the player's username. `setDisplayName` replaces it, and `null` restores the username:

```java
player.setDisplayName(Component.text("[Admin] " + player.getUsername(), NamedTextColor.RED));
player.setDisplayName(null);
```

This applies to the tab list only. The name above the player's head is set through [teams](/docs/feature/scoreboards), and the name in chat is separate from both.

`setListed(false)` removes the entry while the player stays connected and visible in the world:

```java
player.setListed(false);
```

`setListOrder` sets a sorting priority, with higher values placed further up. The client also sorts on spectator status, team name, and username.

```java
player.setListOrder(10);
```

Each of these broadcasts an update to all online players, but only once the player is active. Setting them earlier stores the value and sends nothing; it ships with the player's initial tab list entry.
