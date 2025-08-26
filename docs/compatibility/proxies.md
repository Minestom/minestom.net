---
description: Connecting a Minestom server to a proxy
---

# Proxies

Minestom supports the following proxies and their derivatives:
- [Velocity](https://github.com/PaperMC/Velocity)
- [Gate](https://github.com/minekube/gate)
- [BungeeCord](https://github.com/SpigotMC/BungeeCord)

## Connecting via the proxy

Connecting via a proxy *replaces* the auth argument in `MinecraftServer.init()`.

:::tabs
== Velocity
```java
new Auth.Velocity("secret_here")

// example
MinecraftServer server = MinecraftServer.init(new Auth.Velocity("secret_here"));
```

```toml
# Should we forward IP addresses and other data to backend servers?
# Available options:
# - "none":        No forwarding will be done. All players will appear to be connecting
#                  from the proxy and will have offline-mode UUIDs.
# - "legacy":      Forward player IPs and UUIDs in a BungeeCord-compatible format. Use this
#                  if you run servers using Minecraft 1.12 or lower.
# - "bungeeguard": Forward player IPs and UUIDs in a format supported by the BungeeGuard
#                  plugin. Use this if you run servers using Minecraft 1.12 or lower, and are
#                  unable to implement network level firewalling (on a shared host).
# - "modern":      Forward player IPs and UUIDs as part of the login process using
#                  Velocity's native forwarding. Only applicable for Minecraft 1.13 or higher.
player-info-forwarding-mode = "NONE" // [!code --]
player-info-forwarding-mode = "MODERN" // [!code ++]
```

== Gate
```java
new Auth.Velocity("secret_here")

// example
MinecraftServer server = MinecraftServer.init(new Auth.Velocity("secret_here"));
```

```yaml
# This allows you to customize how player information such as IPs and UUIDs are forwarded to your server.
# See the documentation for more information.
forwarding:
  # Options: legacy, none, bungeeguard, velocity
  mode: legacy # [!code --]
  mode: velocity # [!code ++]
  # The secret used if the mode is velocity.
  #velocitySecret: secret_here // [!code --]
  velocitySecret: secret_here # [!code ++]
  # The secret used if the mode is bungeeguard.
  #bungeeGuardSecret: secret_here
```

== BungeeCord
Vanilla BungeeCord does not support tokens, so is ill-advised to use stock. Secret exchanges can be implemented using [BungeeGuard](https://github.com/lucko/BungeeGuard), you should **never** use BungeeCord without it. The following enables BungeeCord and BungeeGuard support:

```java
new Auth.Bungee(Set.of("secret", "here"))

// example
MinecraftServer server = MinecraftServer.init(new Auth.Bungee(Set.of("secret", "here")));
```

```yaml
ip_forward: false # [!code --]
ip_forward: true # [!code ++]
```
:::

## Transferring between servers

To transfer players, you need inform the proxy to do so. You can either do this via the [BungeeCord plugin message channel](https://www.spigotmc.org/wiki/bukkit-bungee-plugin-messaging-channel/) or through your own means via your own plugin message channel or a message queue.

### Using the BungeeCord plugin message channel
All supported proxies should have the BungeeCord plugin message channel enabled by default.

:::tabs
== Velocity
```toml
# Enables BungeeCord plugin messaging channel support on Velocity.
bungee-plugin-message-channel = true
```

== Gate
```yaml
# Whether the proxy should support bungee plugin channels.
# (Disable this if your backend servers are untrusted.)
bungeePluginChannelEnabled: true
```
:::

```java
final String server = "lobby"
player.sendPluginMessage("bungeecord:main", NetworkBuffer.makeArray(buffer -> {
    buffer.write(NetworkBuffer.STRING_IO_UTF8, "Connect");
    buffer.write(NetworkBuffer.STRING_IO_UTF8, server);
}));
```
