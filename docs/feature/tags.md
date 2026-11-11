---
title: Storing custom data
---

# Storing custom data

A `Tag` represents a key, and a way to read/write a specific type of data. Generally exposed as a constant, you can use it to apply or read data from any `TagReadable` (e.g. `Entity`, `ItemStack`, and soon `Block`). They are implemented using NBT, meaning that applying a tag to an `ItemStack` will modify its NBT, same for `Block`, and can therefore be sent to the client.

```java
Tag<String> myTag = Tag.String("key");
Entity entity = ...;
String data = entity.getTag(myTag);
```

The benefits of tags are:

* Control writability and readability independently with `TagReadable`/`TagWritable`, ideal for immutable classes.
* Tag serialization converts values such as `List<ItemStack>` to and from NBT.
* Automatic serialization support (as backed by NBT), easing data persistence and debuggability.

## API

Expose tags as constants and reuse them. All `Tag` methods should be pure and take the additional information needed to handle the data.

All tags are available as static factory methods inside the `Tag` class.

#### Map

Tag mapping transforms the retrieved value.

```java
Tag<String> stringTag = Tag.String("my-string");
// You should also ensure that the string is a valid uuid!
Tag<UUID> mappedTag = stringTag.map(UUID::fromString, UUID::toString);
UUID uuid = instance.getTag(mappedTag);
```

#### Default value

```java
Tag<String> stringTag = Tag.String("my-string");
instance.getTag(stringTag.defaultValue("default"));
```

#### TagSerializer

`TagSerializer` is similar to the `#map` method, except that you can interact with multiple tags.

#### Structure

A structure tag is a wrapper around a nbt compound (map) independent of all the other tags.

#### View

A view can access every tag and is unsafe. Prefer a narrower tag type.
