# Entities

## Overview

In Minestom all entities must extend `Entity` directly or from their subclasses. The Entity class mainly provides developers with a serverside API that doesn't have much of an effect on the client. Similarly to `ItemStack` there is a thing named `EntityMeta` that allows you to change what the client sees. This article will talk in detail about the implementations of `EntityMeta`.

## Entity Classes

Entity creation starts with an entity class selection. Regardless of the type of entity being created, you can instantiate it as any of the following classes:

* `Entity` is the most barebones version of an entity. It provides you with a minimal API (and minimal overhead), including spawning packet handling, metadata support, default physics.
* `LivingEntity` extends `Entity` and also allows you to grant your entity liveliness. While Minestom does not restrict you to how the vanilla server sets them, some entity types are unable to be a Living Entities as they will cause the client to be disconnected. This subclass also provides an API to modify the entity's equipment and attributes.
* `EntityCreature` extends `LivingEntity` and also provides you with the navigation and AI API.
* `ItemEntity` extends `Entity` and provides you with the ability to spawn items in the world.

If none of the above fits your requirements, you are free to use any of these classes as an ancestor for your own entity class implementation. It could be viable in cases when you need to handle physics or overwrite already presented methods. There are several examples in Minestom repository itself: `Player` that extends `LivingEntity` and handles equipment and a bunch of other things; `EntityProjectile` that extends `Entity` and has its own physics and collision code.

### Examples

Barebones horse creation and spawn:

```java
Instance instance = ...; // instance to spawn a horse in
Pos spawnPosition = new Pos(0D, 42D, 0D);
Entity horse = new Entity(EntityType.HORSE);
horse.setInstance(instance, spawnPosition); // actually spawning a horse
```

Creating a horse with liveness and the possibility to manipulate the AI and navigation. For example, we can add some goals to it to make it aggressive and attacking players.

```java
Instance instance = ...; // instance to spawn a boat in
Pos spawnPosition = new Pos(0D, 42D, 0D);
EntityCreature horse = new EntityCreature(EntityType.HORSE);
// modify AI so that the horse is aggressive
horse.addAIGroup(List.of(
    // adds a melee attack goal with the range of 4 and delay of 2 seconds
    new MeleeAttackGoal(horse, 4.0, Duration.ofSeconds(2))
), List.of(
    // adds a target for closest entity thats a Player within 10 blocks
    new ClosestEntityTarget(horse, 10.0, entity -> entity instanceof Player)
));
horse.setInstance(instance, spawnPosition); // actually spawning a horse
```

Creating an item entity:

```java
Instance instance = ...; // instance to spawn an item in
Pos spawnPosition = new Pos(0D, 42D, 0D);
ItemEntity item = new ItemEntity(ItemStack.of(Material.DIAMOND_SWORD));
item.setInstance(instance, spawnPosition); // actually spawning an item
```

> For more info on adding functionality to the item entity, view the [demo](https://github.com/Minestom/Minestom/blob/fb895cb89956e256f52f84d6abe267bd9233ca3f/demo/src/main/java/net/minestom/demo/PlayerInit.java#L75-L93).

## Entity Meta

Once you have selected a class for an entity and instantiated it, you can retrieve it's metadata using `Entity#getEntityMeta()`. Casting this to the proper type, depending on the entity type you specified on instantiation, allows you to change the way your entity will be displayed on clients.

### Examples

Setting color to a horse from the first example:

```java
HorseMeta meta = (HorseMeta) horse.getEntityMeta();
meta.setVariant(new HorseMeta.Variant(HorseMeta.Marking.WHITE_DOTS, HorseMeta.Color.CREAMY));
```

Making a horse look menacing:

```java
HorseMeta meta = (HorseMeta) horse.getEntityMeta();
meta.setOnFire(true);
meta.setCustomNameVisible(true);
meta.setCustomName(Component.text("Dangerous horse", NamedTextColor.RED));
```

## Useful methods

### Entity presence

Immediately after instantiation, an entity is not counted as active and is therefore not present in any of your instances. To actually spawn it you must call `Entity#setInstance(Instance, Position)`.

There's also a handy `Entity#setAutoViewable(boolean)` that will automatically track whether this entity is in the viewable range of the players of the instance it's in and send spawn/destruction packets to them. All entities are auto-viewable by default.

To remove the entity simply call `Entity#remove()`.

### Switching entity type

There's a possibility for you as a developer to switch the entity type of an already existing entity. Such an action can be performed using `Entity#switchEntityType(EntityType)` and will nullify all the metadata the entity previously had.

If you're wondering how it works internally, a destruction packet is being sent to all the viewers of that entity, then a new spawn packet takes its place. If you're changing the entity type of a player, all viewers except for himself will receive those packets, so it's impossible to render the player on his own client with a different entity type.

### Efficiently performing batch-update on metadata

There could be situations when you need to modify multiple attributes of `EntityMeta` at once. There is an issue here because every time you modify the meta, a packet is being sent to all its viewers. To reduce network bandwidth and send all updates at once there is a `EntityMeta#setNotifyAboutChanges(boolean)` method. Call it with `false` before your first metadata update and then with `true` right after the last one: all performed changes will be sent at once. If you need more on this subject, look into the associated method documentation: it's rich.

For example, we can take the code that updates horse metadata: if we execute it after a horse has been spawned, it will result in 3 metadata packets being sent to each of the horse's viewers. To avoid this, all we need is to add two simple lines:

```java
HorseMeta meta = (HorseMeta) horse.getEntityMeta();
meta.setNotifyAboutChanges(false); // this
meta.setOnFire(true);
meta.setCustomNameVisible(true);
meta.setCustomName(Component.text("Dangerous horse", NamedTextColor.RED));
meta.setNotifyAboutChanges(true); // and this
```

### Player Entities (NPCs)

When creating NPCs that look like players, it's important to implement them as an extention to the `Entity` class rather than using the `Player` class or creating "dummy connections". This approach prevents potential issues with custom `Player` class implementations and provides better control over the NPC's behavior.

A reference implementation can be found in [this gist](https://gist.github.com/mworzala/2c5da51204c45c70db771d0ce7fe9412) by **mworzala**, which demonstrates how to create a basic player NPC.

> **Important Notes:**
> - Usernames must be 16 characters or less. Longer usernames will result in a `DecoderException` with the message "Failed to decode packet 'clientbound/minecraft:player_info_update'"
> - This implementation is provided as a reference and starting point. You may need to extend it based on your specific requirements
