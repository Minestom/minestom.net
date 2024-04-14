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
* `Scoreboard`, and
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

The `Audiences` class also provides a `players(Predicate)` function that allows you to collect an audience of players that match a specific predicate. For example, this could be used to check permissions before sending a broadcast. Additionally, if you would like access to each audience as an iterable, you can instead use the `IterableAudienceProvider`, an instance of which can be obtained using `Audiences#iterable()`.

#### Custom audiences

The `Audiences` class also provides the ability to add custom audience members identified by a `Key`. This could be used to add an audience for file logging or a `ForwardingAudience` representing a custom collection of players. Audiences can be registered using the `AudienceRegistry`, an instance of which can be obtained using `Audiences#registry()`. For example, if you wanted to share a collection of staff members to send alerts to between plugins, this could be done using the following code:

```java
// create the custom audience
Audiences.registry().register(Key.key("myplugin:staff"), staffMembers);

// later, anyone can access the audience using the key
Audiences.custom(Key.key("myplugin:staff")).sendMessage(Component.text("Hello, staff!"));
```

You can also create your own `Audience`, use the Adventure method `Audience.audience(Iterable)` or the Minestom `PacketGroupingAudience.of()` method to create an audience backed on an iterable object. This means that you could register a custom audience backed by a collection that you continue to update and the changes will be reflected when anyone uses the custom methods.

```java
// create the custom audience
Audiences.registry().register(Key.key("myplugin:staff"), PacketGroupingAudience.of(staffMembers));

// at any time, you can update the audience by changing the collection
staffMembers.add(newStaffMember);
```

The `all()` and `of(Predicate)` methods will collect every custom audience using streams, and combine this with the server audience. Such an operation is relatively costly, so should be avoided where possible.

### Packet grouping

Minestom also provides a new `ForwardingAudience` implementation called `PacketGroupingAudience`. This is implemented by every audience in Minestom that has multiple players. Instead of the normal `ForwardingAudience` implementation that iterates through the audience members, this implementation uses `PacketUtils#sendGroupedPacket(Collection, ServerPacket)` to attempt to send a grouped packet to all of the players in this audience.

To create your own `PacketGroupingAudience`, you can use the static `of(Collection)` and `of(Iterable)` methods in the class which return an instance of `PacketGroupingAudience` when provided a group of players.

### Viewable

In addition, the `Viewable` class includes two methods to obtain the viewers of the viewable object as an audience. This means that you can use the full Adventure API on the viewers of a viewable object. For example, to send a message to everyone who can view a player in the old API you would do:

```java
for (Player player : viewable.getViewers()) {
    player.sendMessage(someMessage);
}
```

With the Adventure API you can simply do:

```java
viewable.getViewersAsAudience().sendMessage(someMessage);
```

The added benefit of using the audience provided by the `Viewable` Class is that it implements `PacketGroupingAudience` which means the outgoing packets are grouped where possible, reducing networking overhead when compared to the looping method of sending messages.

## Color

Alongside the deprecation of the Minestom `ChatColor` class, a new `color` package has been created to replace all existing usage of the `ChatColor` class. These new classes are an accurate representation of how Minecraft stores colors for certain objects and allows for proper validation, preventing developers from applying styles to colorable objects at compile-time.

The base class is the `Color` class is a general purpose class for representing RGB colors, similar to `java.awt.Color`. As this class implements Adventure's `RGBLike` interface, it can be used anywhere in the Adventure API that requires coloring (e.g. component text). A new addition to this class is the `mixWith` method which mixes this color with a series of other `RGBLike` colors to create a new color using the same method that vanilla Minecraft uses to mix dyes and colors.

There is also one additional color class; `DyeColor`. This enum represents the different colors of the dyes within Minecraft and provides values for each of the different vanilla dye types. This class includes a method to get the RGB color of the dye and the equivalent firework color. As with the `Color` class, this class also implements `RGBLike` so it can also be used throughout the Adventure API.

## Translation

The Adventure update in Minestom adds the `SerializationManager` class, a powerful and feature-rich way to control the flow of component translation. Adventure provides the concept of a `GlobalTranslator`. By supplying sources, a collection of key-value pairs, you can perform server-side translations without any additional code or complicated localization libraries.

To enable automatic component translation, you need to set the constant `SerializationManager#AUTOMATIC_COMPONENT_TRANSLATION` to `true`. With this set, any components that are being sent to players will be translated using their locale automatically.

Additionally, the `SerializationManager` provides access to the serializer used to convert all components to JSON strings. By default, the serializer is a `Function<Component, String>` that uses Adventure's `GsonComponentSerializer` to serialize a component into a JSON string using the GSON library. However, you can mutate this serializer or change it completely.

For example, if you wanted to replace all instances of the word "dog" with "cat" every single time a component is serialized, you could use the following code:

```java
// get the manager and the current serializer
SerializationManager manager = MinecraftServer.getSerializationManager();
Function<Component, String> oldSerializer = manager.getSerializer();

// create a text replacement config and turn this into a function
TextReplacementConfig config = TextReplacementConfig.builder()
        .matchLiteral("dog")
        .replacement("cat")
        .build();
Function<Component, Component> dogRemover = component -> component.replaceText(config);

// mutate the old serializer with the dog remover
manager.setSerializer(component.andThen(oldSerializer));
```

## Migrating to Adventure

The Adventure update in Minestom replaces and deprecates a lot of old functionality existing in Minestom. This section of the wiki will explain how to migrate your code to use the new Adventure API.

### Boss Bar

The `net.minestom.server.bossbar` package has been entirely deprecated. To create a boss bar you should instead use the static builder methods in the Adventure `BossBar` class. For example, with the old API you might do:

```java
BossBar bar = new BossBar(text, BarColor.RED, BarDivision.SOLID);
bar.setProgress(0.6f);
bar.setFlag(0x1);
bar.addViewer(player);
```

With the Adventure API you would instead do:

```java
BossBar bar = BossBar.bossBar(text, 0.6f, Color.PINK, Division.PROGRESS);
bar.addFlag(Flag.DARKEN_SCREEN);
player.showBossBar(bar);
```

As before, any changes made to the boss bar will be automatically propagated to all those who have been added to a boss bar.

### Books

With the old API you would display a `WrittenBookMeta` to a player using `Player#openBook(WrittenBookMeta)`. This has been replaced with `Player#openBook(Book)`. The `Book` component can be constructed using the builder methods as described in the [documentation](https://docs.adventure.kyori.net/book.html).

### Sound

In order to prevent name clashes and to more accurately represent the contents of the enum, the generated `Sound` enum has been renamed to `SoundEvent`. This is because the values for the enum do not represent specific sounds, rather representing events that are linked to one or more specific sounds. For more information about sound events, see the Minecraft Wiki page on [sound events](https://minecraft.fandom.com/wiki/Sounds.json#Sound\_events).

The Minestom `SoundCategory` has been deprecated in favor of Adventure's `Sound.Source` enum. To play a sound, you need to construct a `Sound` object. This can be done using the methods described in the [documentation](https://docs.adventure.kyori.net/sound.html). In addition, instead of using an Adventure `Key` you can instead pass a `SoundEvent` into any places in the Adventure sound API that accept a supplier of `Sound.Type`. Sound objects can also be stored and used multiple times.

For example, in the old API you would use the following code:

```java
player.playSound(SoundEvent.MUSIC_DISC_11, SoundCategory.RECORDS, 1f, 1f);
```

With Adventure you would use the following code:

```java
player.playSound(Sound.sound(SoundEvent.MUSIC_DISC_11, Source.RECORD, 1f, 1f));
```

Additionally, you can now stop specific sounds constructing a `SoundStop` object and passing that to a player using `Player#stopSound`. This `StopSound` object can be used to stop all sounds, using`SoundStop#all()`, in addition to specific sounds, using `SoundStop#named(SoundEvent)` or `SoundStop#named(Key)`, or specific sounds in specific sources, using the previous methods with an additional `Sound.Source` argument.

### Text

The biggest difference between the old chat API and Adventure is that in Adventure, chat components are **immutable**. This means that any methods used on components do not change the component and instead return a new component. This is explained more on the Adventure documentation.

The `net.minestom.server.chat` package has been entirely deprecated. To construct message you should instead use the `Component` class and its builder methods as discussed in the Adventure documentation. However, `JsonMessage` does implement the Adventure interface `ComponentLike`. This means that you can use `JsonMessage` and all its subtypes throughout the Adventure API within Minestom. You can also use `JsonMessage#fromComponent(Component)` to convert an Adventure component to a `JsonMessage`, allowing you to use new Adventure components with the old Minestom chat API.

Another difference between the old chat API and Adventure is that you cannot use colors inside a string to create messages. In the old API you could do `ChatColor.RED + "some text"`. This is not possible with Adventure as it does not properly represent how text is stored in Minecraft. Instead, you can set the style of components using the methods found in the `Component` class, such as `Component.text(String, TextColor)`, or by setting the style using the `Style` method.

Adventure also splits the old API's `ChatColor` class into classes for `TextColor` and `TextDecoration`. `TextDecoration` can also be negated, meaning you can remove styles from nested components whilst not impacting components that may follow this one. The old `ChatColor` class has been deprecated and replaced with new classes for `Color` and `DyeColor` across the Minestom codebase. Both of these implement `RgbLike` and can be used to color Adventure components.

Hover and click events can be added to any `Component` using `.hoverEvent()` and `.clickEvent`. Instead of using `ChatHoverEvent.showItem(ItemStack)` you can instead put an `ItemStack` directly into the argument of a hover event. For example, in the old chat API you would do:

```java
RichMessage message = RichMessage.of(ColoredText.of("Some Text", ChatColor.RED));
message.setHoverEvent(HoverEvent.showItem(item));
```

However, with the Adventure API you can simply do:

```java
Component message = Component.text("Some Text", NamedTextColor.RED).hoverEvent(item);
```

### Title

The methods used to send titles to players have been deprecated and replaced with Adventure methods. The multiple different messages have been replaced with the two Adventure methods `#sendTitle(Title)` and `#showActionBar(Component)`.

Titles can be constructed using the methods documented in the Adventure [documentation](https://docs.adventure.kyori.net/title.html).

For example, with the old API you would do:

```java
player.sendTitleSubtitleMessage(title, subtitle);
player.sendTitleTile(100, 150, 25);
```

However, with the Adventure API you would do:

```java
player.showTitle(Title.title(title, subtitles, Times.of(100, 150, 25)));
```
