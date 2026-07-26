---
title: Enabling Mojang authentication
---

# Enabling Mojang authentication

A server starts in offline mode. Connecting clients are not verified, and a player's UUID is whatever their client sends in the login packet. It is stable across reconnects, but it is also trivially spoofable, so it cannot be used to identify anyone.

Passing `new Auth.Online()` to `MinecraftServer#init` enables Mojang authentication. The client's session token is validated, its skin is applied, and the player keeps the same Mojang UUID across reconnects and restarts.

```java
void main() {
    MinecraftServer server = MinecraftServer.init(new Auth.Online());
    server.start("0.0.0.0", 25565);
}
```

::: warning
Do not enable this on a server behind a proxy. The proxy authenticates the player and forwards the result. See [Velocity/BungeeCord](proxies).
:::

To assign UUIDs from your own registration system rather than Mojang's, see [Custom player class](/docs/feature/custom-player).
