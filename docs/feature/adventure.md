# Adventure

Adventure is a library for server-controllable user interface elements in Minecraft. For a guide on how to use Adventure, check out the [Adventure documentation](https://docs.adventure.kyori.net/).

## Audiences

### What is an Audience?

The following, taken from the Adventure documentation, describes the concept of an `Audience`:

> As an API, `Audience` is designed to be a universal interface for any player, command sender, console, or otherwise who can receive text, titles, boss bars, and other Minecraft media. This allows extending audiences to cover more than one individual receiver - possible “audiences” could include a team, server, world, or all players that satisfy some predicate (such as having a certain permission). The universal interface also allows reducing boilerplate by gracefully degrading functionality if it is not applicable.

Put simply, every class that implements `Audience`, or one of the subtypes, provides access to the full Adventure API.

In Minestom, the following classes are audiences:

* `CommandSender`,
* `Player`,
* `Instance`,
* `Objective`, and
* `Team`.

This means that if you have an instance of any one of these classes, you can use the full Adventure API to, for example, show a title to every member of the audience. This allows for more powerful and direct control over how you communicate with players.

### Obtaining Audiences

As mentioned in the previous section, some Minestom classes implement `Audience` directly. This means that if you have a reference to, for example, an `Instance`, you can simply use the Adventure API on that instance. As an example, the following code would be used to send a message to all players in an instance:

```java
instance.sendMessage(Component.text("Hello, instance!"));
```

Minestom also provides a way to obtain audiences through the `Audiences` class. The following code provides an example of how this class would be used in your project:

```java
Audiences.console().sendMessage(Component.text("Hello, console!"));
Audiences.players().sendMessage(Component.text("Hello, players!"));
Audiences.server().sendMessage(Component.text("Hello, console and players!"));
```

The `Audiences` class also provides a `players(Predicate)` method that allows you to collect an audience of players that match a specific predicate. For example, this could be used to check permissions before sending a broadcast. Additionally, if you would like access to each audience as an iterable of its members rather than as a single combined `Audience`, use the provider returned by `Audiences#iterable()`. It exposes the same set of methods, but each one returns an `Iterable<? extends Audience>`. The equivalent provider returning single audiences is available through `Audiences#single()`.

#### Custom audiences

The `Audiences` class also provides the ability to add custom audience members identified by a `Key`. This could be used to add an audience for file logging or a `ForwardingAudience` representing a custom collection of players. Audiences can be registered using the `AudienceRegistry`, an instance of which can be obtained using `Audiences#registry()`. For example, if you wanted to share a collection of staff members to send alerts to between plugins, this could be done using the following code:

```java
// create the custom audience
Audiences.registry().register(Key.key("myplugin:staff"), staffMembers);

// later, anyone can access the audience using the key
Audiences.custom(Key.key("myplugin:staff")).sendMessage(Component.text("Hello, staff!"));
```

You can also create your own `Audience`, use the Adventure method `Audience.audience(Iterable)` or the Minestom `PacketGroupingAudience.of(Collection)` method to create an audience backed by a collection of players. The collection is not copied, so you could register a custom audience backed by a collection that you continue to update and the changes will be reflected when anyone uses the custom methods.

```java
// create the custom audience
Audiences.registry().register(Key.key("myplugin:staff"), PacketGroupingAudience.of(staffMembers));

// at any time, you can update the audience by changing the collection
staffMembers.add(newStaffMember);
```

Every custom audience can be reached at once with `Audiences#customs()`, or narrowed with `Audiences#customs(Predicate)`. A single key can be narrowed the same way using `Audiences#custom(Key, Predicate)`. Going further, `Audiences#all()` combines the server audience with every custom audience, and `Audiences#all(Predicate)` filters that combined set. All of these collect the registered custom audiences using streams every time they are called, which is relatively costly, so `Audiences#server()` should be preferred when the custom audiences are not needed.

### Packet grouping

Minestom also provides a `ForwardingAudience` implementation called `PacketGroupingAudience`. This is implemented by every audience in Minestom that has multiple players. Instead of the normal `ForwardingAudience` implementation that iterates through the audience members, this implementation uses `PacketSendingUtils#sendGroupedPacket(Collection, ServerPacket)` from `net.minestom.server.utils` to attempt to send a grouped packet to all the players in this audience.

To create your own `PacketGroupingAudience`, you can use the static `of(Collection)` method in the interface, which returns an instance of `PacketGroupingAudience` when provided a collection of players.

Any class of your own that holds a group of players can also implement the interface directly to get the methods for free: `Collection<? extends Player> getPlayers()` is the only method you have to write.

```java
public class Game implements PacketGroupingAudience {
    private final Set<Player> players = new HashSet<>();

    @Override
    public Set<Player> getPlayers() {
        return this.players;
    }
}
```

The game can now be used anywhere an `Audience` is expected:

```java
game.sendMessage(Component.text("Hello!"));
game.showTitle(Title.title(Component.text("Round over"), Component.empty()));
```

### Viewable

In addition, the `Viewable` interface includes two methods to obtain the viewers of the viewable object as an audience. This means that you can use the full Adventure API on the viewers of a viewable object. For example, sending a message to everyone who can view a player can be done by looping over the viewers:

```java
for (Player player : viewable.getViewers()) {
    player.sendMessage(someMessage);
}
```

With `getViewersAsAudience()` you can simply do:

```java
viewable.getViewersAsAudience().sendMessage(someMessage);
```

The added benefit of using the audience provided by `Viewable` is that it implements `PacketGroupingAudience` which means the outgoing packets are grouped where possible, reducing networking overhead when compared to the looping method of sending messages.

The second method, `getViewersAsAudiences()`, returns the viewers as an `Iterable<? extends Audience>` instead of a single combined audience.

## Color

The base class is `Color`, a general purpose class for representing RGB colors, similar to `java.awt.Color`. As this class implements Adventure's `RGBLike` interface, it can be used anywhere in the Adventure API that requires coloring (e.g. component text). Its `mixWith` method mixes this color with a series of other `RGBLike` colors to create a new color using the same method that vanilla Minecraft uses to mix dyes and colors.

Building on top of `Color`, `AlphaColor` represents an ARGB color (with alpha channel). This class also implements Adventure's `ARGBLike`
for use with `ShadowColor` in text components.

There is also one additional color class; `DyeColor`. This enum represents the different colors of the dyes within Minecraft and provides values for each of the different vanilla dye types. Each value exposes the dye color through `color()`, the color used when rendering text through `textColor()`, the equivalent firework color through `fireworkColor()`, and the map color identifier through `mapColorId()`. As with the `Color` class, this class also implements `RGBLike` so it can also be used throughout the Adventure API.

## Translation

The `MinestomAdventure` class controls the flow of component translation. Adventure provides the concept of a `GlobalTranslator`. By supplying sources, and a collection of key-value pairs, you can perform server-side translations without any additional code or complicated localization libraries.

Automatic component translation is enabled with `ServerFlag#AUTOMATIC_COMPONENT_TRANSLATION`, which is read from the `minestom.automatic-component-translation` system property and defaults to `false`. Pass it to the JVM when you start the server:

```
-Dminestom.automatic-component-translation=true
```

::: warning
`ServerFlag#AUTOMATIC_COMPONENT_TRANSLATION` cannot be changed at runtime, and setting the system property from code only takes effect if it happens before the server is initialized.
:::

With the flag enabled, components in packets sent to a player are translated using that player's locale automatically. The translation itself goes through `MinestomAdventure#COMPONENT_TRANSLATOR`, a `BiFunction<Component, Locale, Component>` that defaults to `GlobalTranslator::render` and can be replaced to use a different translation mechanism. When a player has no locale, the locale returned by `MinestomAdventure#getDefaultLocale()` is used instead, which can be changed using `MinestomAdventure#setDefaultLocale(Locale)`.

## Resource Packs

Adventure exposes methods on an Audience for pushing, popping, and clearing resource packs.

```java
ResourcePackRequest request = ResourcePackRequest.resourcePackRequest()
        .packs(ResourcePackInfo.resourcePackInfo(myUuid, myUrl, myHash))
        .prompt(Component.text("Please accept the resource pack"))
        .required(true)
        .build();
audience.sendResourcePacks(request);

audience.removeResourcePacks(myUuid);

audience.clearResourcePacks();
```

It is also possible to listen for resource pack statuses when applying a resource pack via adventure:

```java
ResourcePackRequest request = ResourcePackRequest.resourcePackRequest()
        .packs(ResourcePackInfo.resourcePackInfo(myUuid, myUrl, myHash))
        .callback((uuid, status, theAudience) -> {
            theAudience.sendMessage(Component.text("Resource pack " + uuid + " status: " + status));
        })
        .build();
```
