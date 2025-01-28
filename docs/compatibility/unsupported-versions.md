---
description: Allowing clients using unsupported versions to join a Minestom server.
---

# Unsupported Versions

> [!WARNING]
> Using unsupported Minecraft versions is, well, unsupported. You are unlikely to receive help when using these versions.

Minestom aims to keep up-to-date with the latest version of Minecraft. However, this may not be beneficial for all servers. Sometimes there may be the case where:
- Minestom is behind the latest version of Minecraft.
- The server wants to support older clients.

## ViaVersion

To support a multiple versions on your server, you can use [ViaVersion](https://github.com/ViaVersion). If you have an existing [proxy](/docs/compatibility/proxies), you can install their [plugin](https://github.com/ViaVersion/ViaVersion). If you do not have one, you'll need to use [ViaProxy](https://github.com/ViaVersion/ViaProxy).

## Commit History

> [!CAUTION]
> You **will not** receive support when using this method.

In the case where you either decide that protocol translation is too jank or you only need a specific version for your server, using an older commit hash is an option. Going back in the Minestom commit history will allow you to find commits where the latest version was the one you need.

Doing this will mean you miss out on new features, bug fixes and community support.