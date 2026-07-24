---
description: Minestom is an open-source library for writing your own Minecraft server software.
---

# What is Minestom?

---

Minestom is an open-source library that lets you write your own Minecraft server software, without any code from Mojang.

It is a library, not a server JAR. There is nothing to download and run. You add Minestom as a dependency, write your server in Java or Kotlin, and compile it yourself.

Minestom implements the Minecraft protocol and the parts every server needs, such as networking, chunks, entities, and inventories. It does not implement vanilla gameplay. A chest is a block like any other until you tell it to open an inventory, and hitting a player does nothing by default. Everything your server does is code you wrote.

Because Minestom has its own API, it is not a drop-in replacement for Paper, Spigot, or vanilla, and plugins and mods written for Bukkit, Forge, or Fabric will not run on it.