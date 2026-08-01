---
title: Tab list
---

# Tab list

The tab list is the player overlay shown while the tab key is held. Adventure controls the text above and below it.

## Header and footer

```java
audience.sendPlayerListHeaderAndFooter(
        Component.text("My Server", NamedTextColor.GOLD),
        Component.text("play.example.com")
);
```

`sendPlayerListHeader` and `sendPlayerListFooter` set one part on its own:

```java
audience.sendPlayerListHeader(Component.text("My Server", NamedTextColor.GOLD));
```

::: warning
Both parts travel in one packet, and the single-part methods fill the other with `Component.empty()`. `sendPlayerListHeader` therefore erases the footer rather than leaving it in place. To keep both, always send them together.
:::