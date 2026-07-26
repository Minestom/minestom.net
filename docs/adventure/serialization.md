---
title: Component serialization
---

# Component serialization

A serializer converts between `Component` and a text or binary format. Minestom registers service providers for Adventure's serializers, so the static accessors return instances configured for Minestom rather than the defaults. `NbtComponentSerializer` is Minestom's; the rest come from Adventure.

## Plain text

`PlainTextComponentSerializer.plainText()` produces unformatted text, discarding all styling.

```java
String plain = PlainTextComponentSerializer.plainText().serialize(component);
```

## Legacy

`LegacyComponentSerializer` reads and writes the color code format that predates components. `legacySection()` uses `§`, `legacyAmpersand()` uses `&`, and they are otherwise identical.

```java
Component parsed = LegacyComponentSerializer.legacyAmpersand().deserialize("&cDanger");
```

::: warning
Legacy codes predate most of what a component can carry. Round-tripping through this serializer downsamples RGB colors to the nearest of the sixteen named colors, and discards fonts, shadow colors, and hover and click events.
:::

## JSON

`GsonComponentSerializer.gson()` produces the chat JSON the vanilla client uses. Minestom configures it with an NBT-backed legacy hover event serializer, so pre-1.16 hover events deserialize correctly.

`gsonLegacy()` is the same with RGB output disabled, downsampling colors to the nearest named one, for clients and tools that predate 1.16.

Components are sent to the client as NBT rather than JSON. Use JSON for storage and for tools that read it.

## NBT

`NbtComponentSerializer.nbt()` produces the NBT form components are sent in over the wire, and the form used in item and block NBT.

## ANSI

`ANSIComponentSerializer.ansi()` produces terminal escape codes, for writing colored components to console output.

## The flattener

The plain text, legacy, and ANSI serializers use Minestom's flattener to reduce a component tree to a flat string.

::: warning
A `TranslatableComponent` flattens to nothing unless automatic translation is enabled, which it is not by default. Minestom's flattener replaces Adventure's handler for translatable components, and its own only runs behind that flag, so the key is not emitted as a fallback. See [Localization](localization).
:::

## MiniMessage

`ComponentSerializer<Component, Component, T>` is the interface to implement for a custom format. MiniMessage already provides a tag-based one:

```java
Component component = MiniMessage.miniMessage().deserialize("<red>Hello <bold>there");
```

It is not bundled with Minestom. Add `net.kyori:adventure-text-minimessage` at the same version as the Adventure that Minestom pulls in.
