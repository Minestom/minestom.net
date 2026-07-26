---
title: Text components
---

# Text components

A `Component` is a tree of styled nodes. Each node has its own color, decorations, font, hover event, and click event, and children inherit the style of their parent.

```java
Component message = Component.text("Hello, ", NamedTextColor.GRAY)
        .append(Component.text(player.getUsername(), NamedTextColor.GOLD))
        .hoverEvent(HoverEvent.showText(Component.text("Click to greet back")))
        .clickEvent(ClickEvent.runCommand("/greet"));

player.sendMessage(message);
```

Component construction is documented in the [Adventure text guide](https://docs.papermc.io/adventure/text). Conversion to and from other formats is covered in [Component serialization](serialization).

## Colors

`Color` is an RGB color implementing Adventure's `RGBLike`. `mixWith` mixes it with other colors the way vanilla mixes dyes:

```java
Color purple = new Color(255, 0, 0).mixWith(new Color(0, 0, 255));
```

`RGBLike` is not a `TextColor`, so a `Color` has to be converted before it can style text:

```java
Component text = Component.text("Hello", TextColor.color(purple));
```

`AlphaColor` extends `Color` with an alpha channel and implements `ARGBLike`, the type `ShadowColor.shadowColor` takes.

`DyeColor` is the enum of the sixteen vanilla dyes. Vanilla uses a different color per dye depending on context, and each value exposes all of them:

```java
DyeColor.LIME.color();          // the dye's own color
DyeColor.LIME.textColor();      // the color used when rendering text, e.g. on signs
DyeColor.LIME.fireworkColor();  // the color of a firework star made with this dye
DyeColor.LIME.mapColorId();     // the map palette index
```

## Click callbacks

`ClickEvent.callback` runs server-side code when a player clicks a component, without registering a command for it. Minestom implements this with `ClickCallbackManager`:

```java
Component component = Component.text("Click me")
        .clickEvent(ClickEvent.callback(audience -> {
            audience.sendMessage(Component.text("Clicked!"));
        }, ClickCallback.Options.builder()
                .uses(1)
                .lifetime(Duration.ofMinutes(5))
                .build()));
```

::: warning
Always set `uses`. A callback with unlimited uses and a finite lifetime is registered in neither the permanent nor the temporary map, so the component is still sent and clicking it does nothing, with no error. Unlimited uses only works when the lifetime is effectively infinite, and such callbacks are stored permanently and never released.
:::
