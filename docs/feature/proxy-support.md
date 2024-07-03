---
description: Connecting a Minestom server to a velocity proxy
---

# Proxy Support

Minestom by default supports [Velocity](https://papermc.io/software/velocity) and [Gate](https://gate.minekube.com/) proxys through Velocity's modern forwarding.

## Initialising modern forwarding

It is as simple as adding the below between `MinecraftServer.init()` and `MinecraftServer#start`

```java
String secret = "My really secret secret that is not hard coded"
VelocityProxy.enable(secret)
```

## Transferring between servers

You need to install [Guva](https://github.com/google/guava) to transfer players. Once doing that, just add the below to send the appropriate packet

```java
String connectTo = "The server you want to connect to"
ByteArrayDataOutput out = ByteStreams.newDataOutput();
out.writeUTF("Connect");
out.writeUTF(connectTo);
player.sendPacket(new PluginMessagePacket("BungeeCord", out.toByteArray()));
```
