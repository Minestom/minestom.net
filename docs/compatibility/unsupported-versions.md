---
description: Allowing clients using unsupported versions to join a Minestom server.
---

# Unsupported versions

Minestom only aims to keep up-to-date with the latest version of Minecraft. If your server needs to support players on an older or snapshot version, consider using these below methods.

## ViaVersion

If you are using a [proxy](/docs/authentication/proxies) such as Velocity or BungeeCord, you can use the [plugin](https://github.com/ViaVersion/ViaVersion) developed by the [ViaVersion](https://github.com/ViaVersion) project. If you don't already have one, you'll need to use [ViaProxy](https://github.com/ViaVersion/ViaProxy), which is a standalone proxy that acts as a protocol translator.

Please do not seek support if you are experiencing unintended behavior or crashes related to ViaVersion.

## Commit History

::: danger
You **will not** receive support when using this method.
:::

If you decide that protocol translation is too jank or you only need a single version for your server, using an older commit is an option. Going back in the Minestom commit history will allow you to find the last commit that supported the version you need.

Doing so will mean missing out on improved APIs, bug fixes, and community support.