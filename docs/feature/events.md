# Events

## Overview

Events are organized in a tree structure where events flow down from parent nodes to child nodes. When you call an event, it first processes on the node you fired it on, then passes down to all matching children (sorted by priority). Each child node can filter events based on the event's type and fields.

Each node contains an event class filter (only events of this type can enter, e.g. `PlayerEvent` or `InstanceEvent`), a condition for additional filtering (e.g. `player.getGameMode() == GameMode.CREATIVE`), a list of listeners, a name for identification, and a priority.

![Event tree with all nodes being executed](/docs/feature/events/event-tree.gif)

## API

### Node

```java
// Can listen to any Event, without any condition
EventNode<Event> node = EventNode.all("demo");
// Can only listen to entity events
EventNode<EntityEvent> entityNode = EventNode.type("entity-listener", EventFilter.ENTITY);
// Can only listen to player events
EventNode<PlayerEvent> playerNode = EventNode.type("player-listener", EventFilter.PLAYER);
// Listen to player events with the player in creative mode
EventNode<PlayerEvent> creativeNode = EventNode.value("creative-listener", EventFilter.PLAYER, player -> player.getGameMode().equals(GameMode.CREATIVE));
```

Each node needs a name to be debuggable and be retrieved later on, an `EventFilter` containing the event type target and a way to retrieve its actor (i.e. a `Player` from a `PlayerEvent`). All factory methods accept a predicate to provide an additional condition for filtering purposes.

### Listener

There are several ways to register event listeners, depending on your needs.

#### Simple inline listener

The most common way is to pass a lambda directly to `addListener`:

```java
EventNode<Event> node = EventNode.all("demo");
node.addListener(PlayerChatEvent.class, event -> {
    event.getPlayer().sendMessage("You sent a message!");
});
```

#### Using EventListener.of

You can create a reusable listener with `EventListener.of`:

```java
EventListener<PlayerChatEvent> chatListener = EventListener.of(PlayerChatEvent.class, event -> {
    event.getPlayer().sendMessage("You sent a message!");
});

node.addListener(chatListener);
// Can be removed later
node.removeListener(chatListener);
```

#### Implementing EventListener

For more complex listeners, you can implement the `EventListener` interface:

```java
public class MyChatListener implements EventListener<PlayerChatEvent> {
    @Override
    public Class<PlayerChatEvent> eventType() {
        return PlayerChatEvent.class;
    }

    @Override
    public Result run(PlayerChatEvent event) {
        event.getPlayer().sendMessage("You sent a message!");
        return Result.SUCCESS;
    }
}

node.addListener(new MyChatListener());
```

#### Using the builder

For advanced features like expiration and filtering, use the builder:

```java
node.addListener(EventListener.builder(EntityTickEvent.class)
    .expireCount(50) // Automatically remove after 50 executions
    .expireWhen(event -> event.getEntity().isGlowing()) // Remove when condition is true
    .filter(event -> event.getEntity().getVelocity().length() > 0) // Only call if moving
    .handler(event -> System.out.println("Entity tick!"))
    .build());
```

The builder supports:
- `expireCount(int)`: Remove the listener after N calls
- `expireWhen(Predicate)`: Remove the listener when a condition becomes true
- `filter(Predicate)`: Only call the handler if the predicate passes
- `ignoreCancelled(boolean)`: Whether to skip cancelled events (default: true)

#### Type safety

Listeners are type-checked based on the node's event filter:

```java
EventNode<PlayerEvent> playerNode = EventNode.type("player-listener", EventFilter.PLAYER);
playerNode.addListener(PlayerTickEvent.class, event -> {}); // Works
// playerNode.addListener(EntityTickEvent.class, event -> {}); // Doesn't compile
```

### Child

Child nodes inherit their parent's filters and can add additional filtering. A child node must accept either the same type or a more specific subtype of an event than its parent. Events pass from parent to child, with each level potentially adding more filtering.

```java
EventNode<Event> globalNode = EventNode.all("global");
EventNode<PlayerEvent> playerNode = EventNode.type("player-listener", EventFilter.PLAYER);
EventNode<PlayerEvent> creativeNode = EventNode.value("creative-listener", EventFilter.PLAYER,
    player -> player.getGameMode().equals(GameMode.CREATIVE));

globalNode.addChild(playerNode);      // Works: PlayerEvent is a subtype of Event
playerNode.addChild(creativeNode);    // Works: both are PlayerEvent, creative only adds an extra condition

// playerNode.addChild(globalNode); -> Doesn't compile: the parent cannot be more general than the child
```

### Event execution

Events can be called from any node in the tree, not just the root. When you call an event on a node, it processes on that node and passes down to all children. Events never propagate upward to parent nodes.

```java
EventNode<Event> globalNode = EventNode.all("global");
EventNode<PlayerEvent> playerNode = EventNode.type("player-listener", EventFilter.PLAYER);
globalNode.addChild(playerNode);

// Calling from the root: affects globalNode and all children (including playerNode)
globalNode.call(new PlayerMoveEvent(...));

// Calling from a child: only affects playerNode and its children (globalNode is skipped)
playerNode.call(new PlayerMoveEvent(...));
```

## In practice

### Node to use

The root node of the server can be retrieved using `MinecraftServer#getGlobalEventHandler()`.

```java
var handler = MinecraftServer.getGlobalEventHandler();
handler.addListener(PlayerChatEvent.class,
        event -> event.getPlayer().sendMessage("You sent a message!"));
var node = EventNode.all("demo");
node.addListener(PlayerMoveEvent.class,
        event -> event.getPlayer().sendMessage("You moved!"));
handler.addChild(node);
```

### Structure

Having an image of your tree is highly recommended, for documentation purposes and ensuring an optimal filtering path. It is then possible to use packages for major nodes, and classes for minor filtering.

```java
server/
   Global.java
   lobby/
      rank/
         - AdminRank.java
         - VipRank.java
      - DefaultRank.java
   game/
      bedwars/
         kit/
            PvpKit.java
            BuildKit.java
         Bedwars.java
      skywars/
         kit/
            PvpKit.java
            BuildKit.java
         Skywars.java
```

### Custom events

You can freely implement the `Event` interface to model custom events. Traits like `CancellableEvent` (to stop the execution after a certain point) and `EntityEvent` (provides a `getEntity` method) are also present to ensure your code will work with existing logic. You can then choose to run your custom event from an arbitrary node (see an [example](#event-execution)), or from the root with `EventDispatcher#call(Event)`.

## Event traits

### Cancellable events

Some events implement `CancellableEvent`, which allows listeners to cancel the event and prevent further processing.

```java
node.addListener(PlayerMoveEvent.class, event -> {
    if (event.getNewPosition().y() > 100) {
        event.setCancelled(true); // Prevent the player from moving above y=100
    }
});
```

Listeners skip cancelled events by default. To run a listener anyway, set `ignoreCancelled(false)`:

```java
node.addListener(EventListener.builder(PlayerMoveEvent.class)
    .ignoreCancelled(false) // This listener runs even if the event was cancelled
    .handler(event -> {
        System.out.println("This runs even for cancelled moves");
    })
    .build());
```

### Recursive events

Events that implement `RecursiveEvent` are also dispatched to listeners registered on their parent type:

```java
public class CustomEvent implements RecursiveEvent {
}

public final class CustomChildEvent extends CustomEvent {
}

node.addListener(CustomEvent.class, event -> {
    // Called for both CustomEvent and CustomChildEvent.
});
```

## Implementation

This section will describe what happens when an event is called or when a new node is added, which can help you optimize for performance.

### Listener handle

A `ListenerHandle` represents direct access to an event type listener. Handles are stored inside the node and must be retrieved for the listeners to be executed.

`EventNode#call(Event)` is as simple as retrieving the handle (through a map lookup) and executing `ListenerHandle#call(Event)`. You can completely avoid the map lookup by directly using the handle, which is why `EventNode#getHandle(Class<Event>)` exists.

Keeping the handle in a field instead of doing map lookups for every event call may also help avoid object allocation in cases where nothing is listening to the event.

### Registration

All registration methods (and methods touching the tree) are synchronized. This is not considered a major flaw since event calling is much more important. However, this means you should avoid temporary nodes and listeners as much as possible.

### Event calling

Event calling is straightforward. It first checks if the listeners inside the handle are up-to-date. If not, it loops through all of them to create the consumer. Then it runs the consumer.

This is why you should avoid adding listeners after server initialization, as it will invalidate the associated handles.

### Conclusion

The event implementation has been heavily optimized for calling events rather than for registration utilities. This is a reasonable tradeoff, but must be well understood when building a high-performance server.

For those interested, the code is available [here](https://github.com/Minestom/Minestom/blob/master/src/main/java/net/minestom/server/event/EventNodeImpl.java).
