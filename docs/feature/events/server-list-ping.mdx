---
description: Responding to all types of server list ping in one place.
---

# Server list ping

Minestom provides the ability to customise responses to five different server list ping types all in one place. Put simply, to listen to every type of server list ping event you just need to listen to the `ServerListPingEvent` and modify the `ResponseData` in the event. Regardless of the source of the ping, the response data will be formatted in the correct way for the corrosponding source.

## Ping types

The different types of pings can be found in the `ServerListPingType` enum. The type can be obtained from the `ServerListPingEvent` using the `getPingType()` method. This allows you to change your responses based on the incoming ping, allowing you to only fill in the information that is needed or customise the response based on the type of ping.

The different types of pings that are responded to with the `ServerListPingEvent` can be broken down into three different categories.

### Modern

Covered by the `MODERN_FULL_RGB` and `MODERN_NAMED_COLORS` constants, this category represents the most common type of response and is used on Minecraft versions 1.7 and higher. This includes the name, protocol, version, description, favicon, number of players online, max number of players online and a sample of the online players.

The description supports color and styles in addition to some more complex component types. Minecraft versions on 1.16 or higher can utilise full RGB color codes. For older versions, the colors are downsampled into named colors automatically.

The player sample is represented as a list of UUID to name mappings and do not have to be players that are on the server. The `NamedAndIdentified` interface is used to hold this mapping and allow both players and custom mappings to be used interchangeably in the `ResponseData` class. For an example on how to use this interface, see the code block below.

```java
// you can add players directly
responseData.addEntry(somePlayer);
responseData.addEntries(MinecraftServer.getConnectionManager().getOnlinePlayers());

// or using the named and identified interface
responseData.addEntry(NamedAndIdentified.named("Bob"))
responseData.addEntry(NamedAndIdentified.named(Component.text("Sally", TextColor.of(0x123412))));
```

The methods that do not take a UUID will use a random UUID, allowing you to create any number of players without the risk of a conflicting UUID being used. Additionally, each entry can use components or strings. Using components allows you to use colour and styling for each entry. The player list displayed in the vanilla Minecraft client supports the legacy section sign color coding and the names of each entry are automatically converted to this format.

In the modern category, the player sample, along with the online and maximum players, may be hidden completely as well:

```java
responseData.setPlayersHidden(true);
```

In the Vanilla client, the online / maximum player count will be replaced with `???`

### Legacy

Covered by the `LEGACY_VERSIONED` and `LEGACY_UNVERSIONED` constants, this category represents server list pings that are sent by clients on version 1.6 or lower. These ping types only support the description and the current/max number of players. The `LEGACY_VERSIONED` type additionally supports the version of the server.

The description is formatted using legacy section sign color coding and is automatically converted to this format.

### Open to LAN

Covered by the `OPEN_TO_LAN` constant, this category represents server list pings that are sent _from_ the server when it is mimicking being a single player world that is opened to LAN. This type only supports the description. As with the legacy type, the description is formatted using legacy section sign color coding and is automatically converted to this format.

For more information on opening a server to LAN, see the [Open to LAN](../open-to-lan.md) page.

## Ping

After receiving the server list ping response, modern clients send an additional packet intended to calculate latency. Minestom provides the `ClientPingServerEvent` for this.

The event may be cancelled, in which case a response packet will not be sent. However, various delay methods can affect the apparant latency:

```java
event.setDelay(new UpdateOption(5, TimeUnit.SECOND));
event.addDelay(new UpdateOption(200, TimeUnit.MILLISECOND));

// Of course, there is still some latency between the client and the server
event.noDelay();
```

Finally, just as the `ServerListPingEvent`, the underlying `PlayerConnection` is accessible.
