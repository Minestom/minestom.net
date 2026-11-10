---
description: Responding to all types of server list ping in one place.
---

# Changing the MOTD

Responses to five server list ping types can be customized in one place with `ServerListPingEvent`. Listen to the event and modify its `Status`. The response is encoded in the format required by the ping type.

## Ping types

The different types of pings are in the `ServerListPingType` enum. `ServerListPingEvent#getPingType()` returns the type. Use it to change the response, filling in only the fields that ping type supports.

The different types of pings that are responded to with the `ServerListPingEvent` can be broken down into three different categories.

### Modern

Covered by the `MODERN_FULL_RGB` and `MODERN_NAMED_COLORS` constants, this category represents the most common type of response and is used on Minecraft versions 1.7 and higher. This includes the name, protocol, version, description, favicon, number of players online, max number of players online and a sample of the online players.

Color and styles can be applied to the description, along with more complex component types. Minecraft versions on 1.16 or higher can use full RGB color codes. For older versions, the colors are downsampled into named colors automatically.

The player sample is represented as a list of UUID to name mappings and do not have to be players that are on the server. The `NamedAndIdentified` interface is used to hold this mapping and allow both players and custom mappings to be used interchangeably in the `Status` class. For an example on how to use this interface, see the code block below.

```java
byte[] favicon; // a byte array of raw PNG data; could be loaded from a file
int onlinePlayers = MinecraftServer.getConnectionManager().getOnlinePlayerCount();

event.setStatus(Status.builder()
        .description(Component.text("Welcome to my Minecraft server!", NamedTextColor.GOLD))
        .favicon(favicon)
        .playerInfo(Status.PlayerInfo.builder()
                .onlinePlayers(onlinePlayers)
                .maxPlayers(500)
                .sample(somePlayer)
                .sample(NamedAndIdentified.named("Notch"))
                .sample(NamedAndIdentified.named(Component.text("Herobrine", NamedTextColor.AQUA)))
                .build())
        .playerInfo(onlinePlayers, 500) // simpler alternative to set player count only
        .versionInfo(new Status.VersionInfo("1.8.9", 47)) // set some fake version info
        .build());
```

Methods that do not take a UUID generate a random UUID. Each entry can use components or strings. Components allow color and styling for each entry. The player list displayed in the vanilla Minecraft client supports the legacy section sign color coding and the names of each entry are automatically converted to this format.

In the modern category, the player sample, along with the online and maximum players, may be hidden completely as well by setting `playerInfo` to `null`. In the vanilla client, the online / maximum player count will be replaced with `???`

### Legacy

Covered by the `LEGACY_VERSIONED` and `LEGACY_UNVERSIONED` constants, this category represents server list pings that are sent by clients on version 1.6 or lower. These ping types include only the description and the current/max number of players. The `LEGACY_VERSIONED` type also includes the server version.

The description is formatted using legacy section sign color coding and is automatically converted to this format.

### Open to LAN

Covered by the `OPEN_TO_LAN` constant, this category represents server list pings that are sent _from_ the server when it is mimicking being a single player world that is opened to LAN. This type includes only the description. As with the legacy type, the description is formatted using legacy section sign color coding and is automatically converted to this format.

For more information on opening a server to LAN, see the [Open to LAN](./open-to-lan) page.

## Ping

After receiving the server list ping response, modern clients send an additional packet to calculate latency. `ClientPingServerEvent` is fired for this packet.

The event may be cancelled, in which case a response packet will not be sent. However, various delay methods can affect the apparent latency:

```java
event.setDelay(new UpdateOption(5, TimeUnit.SECOND));
event.addDelay(new UpdateOption(200, TimeUnit.MILLISECOND));

// Of course, there is still some latency between the client and the server
event.noDelay();
```

Finally, just as the `ServerListPingEvent`, the underlying `PlayerConnection` is accessible.
