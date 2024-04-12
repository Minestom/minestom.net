# Entities

## Overview

In Minestom all entities must extend `Entity` directly or from their subclasses. The Entity class mainly provides developers with a serverside API that doesn't have much of an effect on the client. Similarly to `ItemStack` there is a thing named `EntityMeta` that allows you to change what the client sees. This article will talk in detail about the implementations of `EntityMeta`.

## Entity Classes

Entity creation starts with an entity class selection. Regardless of the type of entity being created, you can instantiate it as any of the following classes:

* `Entity` is the most barebones version of an entity. It provides you with a minimal API (and minimal overhead), including spawning packet handling, metadata support, default physics.
* `LivingEntity` extends `Entity` and also allows you to grant your entity liveliness. The type of entity doesn't matter, minestom doesn't restrict you to what Mojang intends. If you give it health, it will have health. This subclass also provides an API to modify the entity's equipment and attributes.
* `EntityCreature` extends `LivingEntity` and also provides you with the navigation and AI API.

If none of the above fits your requirements, you are free to use any of these classes as an ancestor for your own entity class implementation. It could be viable in cases when you need to handle physics or overwrite already presented methods. There are several examples in Minestom repository itself: `Player` that extends `LivingEntity` and handles equipment and a bunch of other things; `EntityProjectile` that extends `Entity` and has its own physics and collision code.

### Examples

Barebones horse creation and spawn:

```java
Instance instance = ...; // instance to spawn a horse in
Pos spawnPosition = new Pos(0D, 42D, 0D);
Entity horse = new Entity(EntityType.HORSE);
horse.setInstance(instance, spawnPosition); // actually spawning a horse
```

Creating a boat with liveness and the possibility to manipulate the AI and navigation. For example, we can add some goals to it to make it aggressive and attacking players.

```java
Instance instance = ...; // instance to spawn a boat in
Pos spawnPosition = new Pos(0D, 42D, 0D);
EntityCreature boat = new EntityCreature(EntityType.BOAT);
// modify AI so that the boat is aggressive
boat.setInstance(instance, spawnPosition); // actually spawning a boat
```

## Entity Meta

Once you have selected a class for an entity and instantiated it, you can retrieve it's metadata using `Entity#getEntityMeta()`. Casting this to the proper type, depending on the entity type you specified on instantiation, allows you to change the way your entity will be displayed on clients.

### Examples

Setting color to a horse from the first example:

```java
HorseMeta meta = (HorseMeta) horse.getEntityMeta();
meta.setVariant(new HorseMeta.Variant(HorseMeta.Marking.WHITE_DOTS, HorseMeta.Color.CREAMY));
```

Making a boat look menacing:

```java
BoatMeta meta = (BoatMeta) boat.getEntityMeta();
meta.setOnFire(true);
meta.setCustomNameVisible(true);
meta.setCustomName(Component.text("Dangerous boat", NamedTextColor.RED));
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

For example, we can take the code that updates boat metadata: if we execute it after a boat has been spawned, it will result in 3 metadata packets being sent to each of the boat's viewers. To avoid this, all we need is to add two simple lines:

```java
BoatMeta meta = (BoatMeta) boat.getEntityMeta();
meta.setNotifyAboutChanges(false); // this
meta.setOnFire(true);
meta.setCustomNameVisible(true);
meta.setCustomName(Component.text("Dangerous boat", NamedTextColor.RED));
meta.setNotifyAboutChanges(true); // and this
```
