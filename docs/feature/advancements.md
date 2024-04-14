# Advancements

The advancement API is based around `AdvancementTab`s which represent a tree of `Advancement`s for one or more players. Each player viewing a single `AdvancementTab` will see the same progress as all of the others. If per player `Advancement`s are needed, individual `AdvancementTab`s will need to be created.

`Advancement`s represent a completable advancement in an `AdvancementTab`.

## AdvancementTab

`AdvancementTab`s can be created and retrieved from the `AdvancementManager`.

```java
// Create
AdvancementManager#createTab(String /* namespaced id */, AdvancementRoot);

// Retrieve
AdvancementManager#getTab(String /* namespaced id */);
```

> Namespaced IDs follow the format of `namespace:id`, and may not have any upper case letters.

An `AdvancementRoot` is the origin `Advancement` for a tab, and has the same creation method as a regular `Advancement` (see below) with the exception of the background. A background is a reference to a texture file on the client, for example `minecraft:textures/block/stone.png` for stone block.

```java
AdvancementRoot#<init>(Component, Component, Material, FrameType, int, int, String /* background */);
```

Once created, an `AdvancementTab` may be added and removed from players as follows:

```java
AdvancementTab#addViewer(Player);
AdvancementTab#removeViewer(Player);
```

## Advancement

`Advancement`s can be created with their constructor and added to an `AdvancementTab` with an associated parent.

```java
Advancement#<init>(Component /* title */, Component /* description */, Material, FrameType, int /* x */, int /* y */);

AdvancementTab#createAdvancement(String /* namespaced id */, Advancement /* to add */, Advancement /* parent */);
```

> The parent of an `Advancement` may not be null, and it must have been added to the tab already. The `AdvancementRoot` is a valid parent.

Once an `Advancement` is registered, it can be completed.

```java
Advancement#setAchieved(Boolean);
```

> To make an advancement show a toast, use `Advancement#showToast(Boolean)` before setting it to achieved.
