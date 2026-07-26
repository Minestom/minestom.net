---
title: What is Adventure?
---

# What is Adventure?

[Adventure](https://github.com/KyoriPowered/adventure) is Kyori's serverside user interface library for Minecraft: Java Edition. It defines the types for chat components, boss bars, titles, sounds, books, and resource packs, and the serializers for their formats.

Minestom uses those types directly rather than wrapping them. Displayed text is a `Component` rather than a `String`, and `Player` implements `Audience`. Paper, Velocity, and Sponge use the same library.

Adventure is exposed transitively, so it does not need to be declared as a dependency.

::: info
MiniMessage is not among the bundled modules. Its tag-based format (`<red>Hello <bold>there`) requires adding `net.kyori:adventure-text-minimessage`.
:::

The [Adventure documentation](https://docs.papermc.io/adventure/) documents the library. The pages here document Minestom's additions and its specific behavior.
