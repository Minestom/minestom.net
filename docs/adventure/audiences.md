# Audiences

An `Audience` receives messages, titles, boss bars, sounds, and the rest of the Adventure API, whether it stands for one player or a group. Operations an audience does not support are ignored rather than throwing.

These Minestom types are audiences:

- `Player`
- `CommandSender`, and so `ConsoleSender`
- `Instance`
- `Scoreboard`
- `Team`

The Adventure methods are available on any of them:

```java
instance.sendMessage(Component.text("Hello, instance!"));
```

## The Audiences class

`Audiences` provides the server's built-in audiences as static methods:

```java
Audiences.console().sendMessage(Component.text("Hello, console!"));
Audiences.players().sendMessage(Component.text("Hello, players!"));
Audiences.server().sendMessage(Component.text("Hello, console and players!"));
```

`Audiences#players(Predicate)` narrows to the players matching a filter, for example to broadcast only to those with a permission.

## Custom audiences

An audience can be registered against a `Key` and looked up elsewhere:

```java
// register it once
Audiences.registry().register(Key.key("minestom:staff"), PacketGroupingAudience.of(staffMembers));

// anywhere else
Audiences.custom(Key.key("minestom:staff")).sendMessage(Component.text("Hello, staff!"));
```

The collection is not copied, so modifying `staffMembers` afterwards changes the audience's members.

`Audiences#customs()` combines every registered audience, and `Audiences#all()` combines those with the server audience. Both accept a `Predicate` to filter, as does `Audiences#custom(Key, Predicate)`.

::: warning
Once anything is registered, `customs()` and `all()` iterate the registry with streams on every call. Use `Audiences#server()` when the custom audiences are not needed.
:::

## Packet grouping

`PacketGroupingAudience` builds a packet once and sends it to every member through `PacketSendingUtils#sendGroupedPacket`, rather than serializing it per player. Every multi-player audience in Minestom implements it.

Any class holding a group of players can implement it. `getPlayers()` is the only method to write:

```java
public class Game implements PacketGroupingAudience {
    private final Set<Player> players = new HashSet<>();

    @Override
    public Set<Player> getPlayers() {
        return this.players;
    }
}
```

`PacketGroupingAudience.of(Collection)` wraps an existing collection instead.

## Viewers as an audience

`Viewable#getViewersAsAudience()` returns the object's viewers as a single `Audience`, backed by a `PacketGroupingAudience`, replacing a loop over `getViewers()`:

```java
viewable.getViewersAsAudience().sendMessage(someMessage);
```
