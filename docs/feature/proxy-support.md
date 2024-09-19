---
description: Connecting a Minestom server to a proxy
---

# Proxy Support

Minestom supports connecting to [Velocity](https://papermc.io/software/velocity), [Gate](https://gate.minekube.com/) and [Bungee](https://github.com/SpigotMC/BungeeCord) proxys, although Velocity or Gate are preferred as they support [modern forwarding](https://docs.papermc.io/velocity/security#velocity-modern-forwarding).

## Connecting to the proxy

### Velocity or Gate

To use Velocity or Gate (or any other modern forwarding proxy) you can add the below between `MinecraftServer#init` and `MinecraftServer#start`

```java
VelocityProxy.enable("My really secret secret that is not hard coded")
```

### Bungee

Bungee can be used in much a similar way to Velocity. Due to its age, it does not use modern forwarding and thus is insecure by default. A similar mechanism can be implemented with [BungeeGuard](https://www.spigotmc.org/resources/bungeeguard.79601/), and you should **never** use Bungee without it. The below code block enables Bungee and BungeeGuard

```java
BungeeCordProxy.enable()
BungeeCordProxy.setBungeeGuardTokens(Set.of("tokens", "here"))
```

## Transferring between servers

To transfer players, you need to send a [plugin message](https://docs.papermc.io/paper/dev/plugin-messaging#what-did-we-just-do) to the BungeeCord channel. Below is how this (or any other plugin message for that matter) can be achieved.

```java
String connectTo = "The server you want to connect to"

player.sendPluginMessage("BungeeCord", NetworkBuffer.makeArray(buffer -> {
  buffer.write(NetworkBuffer.STRING, "Connect");
  buffer.write(NetworkBuffer.STRING, connectTo);
}));
```
