# Titles

A `Title` is a large line of text across the middle of the screen, with an optional subtitle beneath it. Any [audience](audiences) can show one:

```java
audience.showTitle(Title.title(
        Component.text("Round 3", NamedTextColor.GOLD),
        Component.text("Survive for 60 seconds")
));
```

## Timing

The two-argument `Title.title` fills in Adventure's defaults and sends them: half a second to fade in, three and a half seconds held, one second to fade out. Any times set earlier by `sendTitlePart` are overwritten.

```java
Title.Times times = Title.Times.times(
        Duration.ofMillis(500),   // fade in
        Duration.ofSeconds(5),    // stay
        Duration.ofSeconds(1)     // fade out
);

audience.showTitle(Title.title(title, subtitle, times));
```

Durations are truncated to whole 50ms ticks. A sub-tick remainder is discarded, and anything under 50ms becomes zero.

## Updating one part at a time

`sendTitlePart` sends one part without the others:

```java
audience.sendTitlePart(TitlePart.TIMES, times);
audience.sendTitlePart(TitlePart.TITLE, Component.text("10"));
audience.sendTitlePart(TitlePart.SUBTITLE, Component.text("seconds left"));
```

Setting `TitlePart.TITLE` restarts the fade from zero alpha, exactly as `showTitle` does, so a per-second countdown in the title flashes. `TitlePart.SUBTITLE` is assigned without touching the timer, so put changing text there and leave the title alone.

## Clearing

```java
audience.clearTitle();  // hide what is currently displayed
audience.resetTitle();  // hide it and restore the client's default times
```
