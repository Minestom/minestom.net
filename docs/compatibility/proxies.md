---
description: Connecting a Minestom server to a proxy
---

# Proxies

Minestom supports the following proxies and their derivatives:
- [Velocity](https://github.com/PaperMC/Velocity)
- [Gate](https://github.com/minekube/gate)
- [BungeeCord](https://github.com/SpigotMC/BungeeCord)

## Connecting via the proxy

Connecting via a proxy *replaces* any use of `MojangAuth#init`.

### Velocity or Gate

```java
VelocityProxy.enable("secret_here")
```

#### Velocity
```diff
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
-player-info-forwarding-mode = "NONE"
+player-info-forwarding-mode = "MODERN"
```

#### Gate
```diff
# This allows you to customize how player information such as IPs and UUIDs are forwarded to your server.
# See the documentation for more information.
forwarding:
  # Options: legacy, none, bungeeguard, velocity
-  mode: legacy
+  mode: velocity
  # The secret used if the mode is velocity.
-  #velocitySecret: secret_here
+  velocitySecret: secret_here
  # The secret used if the mode is bungeeguard.
  #bungeeGuardSecret: secret_here
```

### BungeeCord

Vanilla BungeeCord does not support tokens, so is ill-advised to use stock. Secret exchanges can be implemented using [BungeeGuard](https://github.com/lucko/BungeeGuard), you should **never** use BungeeCord without it. The following enables BungeeCord and BungeeGuard support:

```java
BungeeCordProxy.enable()
BungeeCordProxy.setBungeeGuardTokens(Set.of("tokens", "here"))
```

```diff
-ip_forward: false
+ip_forward: true
```

## Transferring between servers

To transfer players, you need inform the proxy to do so. You can either do this via the [BungeeCord plugin message channel](https://www.spigotmc.org/wiki/bukkit-bungee-plugin-messaging-channel/) or through your own means via your own plugin message channel or a message queue.

### Enabling the BungeeCord plugin message channel
All supported proxies should have the BungeeCord plugin message channel enabled by default.

#### Velocity
```toml
# Enables BungeeCord plugin messaging channel support on Velocity.
bungee-plugin-message-channel = true
```

#### Gate
```yaml
# Whether the proxy should support bungee plugin channels.
# (Disable this if your backend servers are untrusted.)
bungeePluginChannelEnabled: true
```

### Transferring a player
```java
final String server = "lobby"
player.sendPluginMessage("bungeecord:main", NetworkBuffer.makeArray(buffer -> {
    buffer.write(NetworkBuffer.STRING_IO_UTF8, "Connect");
    buffer.write(NetworkBuffer.STRING_IO_UTF8, server);
}));
```
