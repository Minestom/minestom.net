# Boss bars

A `BossBar` is the bar across the top of the screen. It has a name, a fill fraction from `0.0F` to `1.0F`, a color, and an overlay style:

```java
BossBar bar = BossBar.bossBar(
        Component.text("Boss fight"),
        1.0F,
        BossBar.Color.RED,
        BossBar.Overlay.NOTCHED_10
);

audience.showBossBar(bar);
audience.hideBossBar(bar);
```

`Overlay.PROGRESS` draws a solid bar:

![A boss bar using the progress overlay](/docs/adventure/boss-bars/progress-overlay.png)

The `NOTCHED_` variants divide it into 6, 10, 12, or 20 segments:

![A boss bar using a notched overlay](/docs/adventure/boss-bars/notched-overlay.png)

## Updating a bar

A `BossBar` is mutable and tracks its viewers. Changes are sent to every current viewer, so the bar does not need to be shown again:

```java
bar.progress(0.5F);
bar.color(BossBar.Color.YELLOW);
bar.name(Component.text("Boss fight (half health)"));
```

Flags enable the vanilla boss effects, all disabled by default:

```java
bar.addFlag(BossBar.Flag.DARKEN_SCREEN);
bar.addFlag(BossBar.Flag.PLAY_BOSS_MUSIC);
bar.addFlag(BossBar.Flag.CREATE_WORLD_FOG);
```

## The manager

`MinecraftServer#getBossBarManager()` holds the mapping from bars to viewers. `showBossBar` and `hideBossBar` on an audience go through it. The manager provides two operations the audience API does not:

```java
// remove a bar from all of its viewers
MinecraftServer.getBossBarManager().destroyBossBar(bar);

// the bars a player is currently shown
Collection<BossBar> bars = MinecraftServer.getBossBarManager().getPlayerBossBars(player);
```

A bar is registered on first display and tracked until destroyed. Disconnecting players are removed automatically.
