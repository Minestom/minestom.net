# Codecs
Codecs encode and decode data to multiple formats (JSON, NBT, etc.) using the same definition. This allows you to write your serialization logic once and use it with any supported format.

```java
record PlayerData(String name, int level, @Nullable String nickname) {
    static final StructCodec<PlayerData> CODEC = StructCodec.struct(
            "name", Codec.STRING, PlayerData::name,
            "level", Codec.INT, PlayerData::level,
            "nickname", Codec.STRING.optional(), PlayerData::nickname,
            PlayerData::new
    );
}

PlayerData data = new PlayerData("Steve", 67, null);
JsonElement json = PlayerData.CODEC.encode(Transcoder.JSON, data).orElseThrow();
BinaryTag nbt = PlayerData.CODEC.encode(Transcoder.NBT, data).orElseThrow();
PlayerData decodedData = PlayerData.CODEC.decode(Transcoder.JSON, json).orElseThrow();
```

## Primitive Codecs
| Codec                   | Java Type           | Description                                                                               |
| ----------------------- | ------------------- | ----------------------------------------------------------------------------------------- |
| `Codec.BOOLEAN`         | `Boolean`           | Boolean value                                                                             |
| `Codec.BYTE`            | `Byte`              | 8-bit integer                                                                             |
| `Codec.SHORT`           | `Short`             | 16-bit integer                                                                            |
| `Codec.INT`             | `Integer`           | 32-bit integer                                                                            |
| `Codec.LONG`            | `Long`              | 64-bit integer                                                                            |
| `Codec.FLOAT`           | `Float`             | 32-bit floating point                                                                     |
| `Codec.DOUBLE`          | `Double`            | 64-bit floating point                                                                     |
| `Codec.STRING`          | `String`            | UTF-8 string                                                                              |
| `Codec.KEY`             | `Key`               | Namespaced key (e.g., `minecraft:stone`)                                                  |
| `Codec.UUID`            | `UUID`              | UUID stored as an integer array                                                           |
| `Codec.UUID_STRING`     | `UUID`              | UUID stored as string                                                                     |
| `Codec.COMPONENT`       | `Component`         | Adventure text component                                                                  |
| `Codec.NBT`             | `BinaryTag`         | Any NBT tag                                                                               |
| `Codec.NBT_COMPOUND`    | `CompoundBinaryTag` | NBT compound tag                                                                          |
| `Codec.BYTE_ARRAY`      | `byte[]`            | Byte array                                                                                |
| `Codec.INT_ARRAY`       | `int[]`             | Integer array                                                                             |
| `Codec.LONG_ARRAY`      | `long[]`            | Long array                                                                                |
| `Codec.BLOCK_POSITION`  | `Point`             | Block coordinates                                                                         |
| `Codec.VECTOR3D`        | `Point`             | Double precision coordinates                                                              |
| `Codec.UNIT`            | `Unit`              | Represents the absence of a value (encodes to an empty object)                            |
| `Codec.TRI_STATE`       | `TriState`          | Three-state boolean: true, false, or absent                                               |
| `Codec.UUID_COERCED`    | `UUID`              | UUID as integer array, falling back to string                                             |
| `Codec.COMPONENT_STYLE` | `Style`             | Adventure text style                                                                      |
| `Codec.RAW_VALUE`       | `RawValue`          | Format-agnostic raw value (see [Converting Between Formats](#converting-between-formats)) |

:::note
Codecs for game types are often defined on their respective classes rather than on `Codec` directly, such as `ItemStack.CODEC`.
:::

## Transforming Types
The `.transform()` method converts between types during encoding and decoding. This is useful for custom types that can be represented as a simpler type.

```java
record GameMode(String mode) {}
Codec<GameMode> MODE_CODEC = Codec.STRING.transform(GameMode::new, GameMode::mode);
```

`Codec.Enum()` is a shorthand that serializes an enum as its lowercase name (e.g., `NORTH` → `"north"`):

```java
Codec<Direction> DIRECTION = Codec.Enum(Direction.class);
```

## Optional Fields
Fields marked with `.optional()` can be missing from the encoded data and will decode to `null`. You can also provide a default value.

```java
record ItemData(String name, @Nullable String description) {
    static final StructCodec<ItemData> CODEC = StructCodec.struct(
            "name", Codec.STRING, ItemData::name,
            "description", Codec.STRING.optional(), ItemData::description,
            ItemData::new
    );
}

ItemData itemData = ItemData.CODEC.decode(Transcoder.JSON, JsonParser.parseString("{\"name\": \"test\"}")).orElseThrow();
```

Default values are used when the field is missing from the data:

```java
StructCodec.struct(
    "max_players", Codec.INT.optional(20), Config::maxPlayers,
    // ...
)
```

## Lists and Collections
Use `.list()` for lists, `.set()` for sets, and `.listOrSingle()` for flexible decoding that accepts either a single value or an array.

```java
Codec<List<String>> tags = Codec.STRING.list(100);
Codec<Set<UUID>> players = Codec.UUID.set();
Codec<List<String>> flexible = Codec.STRING.listOrSingle();
```

Example with a quest that has multiple objectives:

```java
record Quest(String name, List<QuestObjective> objectives) {
    static final StructCodec<Quest> CODEC = StructCodec.struct(
            "name", Codec.STRING, Quest::name,
            "objectives", QuestObjective.CODEC.list(), Quest::objectives,
            Quest::new
    );
}
```

## Maps
Use `.mapValue()` to create a codec for maps with string keys.

```java
record Leaderboard(Map<String, Integer> scores) {
    static final StructCodec<Leaderboard> CODEC = StructCodec.struct(
            "scores", Codec.STRING.mapValue(Codec.INT), Leaderboard::scores,
            Leaderboard::new
    );
}
```

## Nested Structures
StructCodecs can be nested to create complex hierarchies.

```java
record Position(double x, double y, double z) {
    static final StructCodec<Position> CODEC = StructCodec.struct(
            "x", Codec.DOUBLE, Position::x,
            "y", Codec.DOUBLE, Position::y,
            "z", Codec.DOUBLE, Position::z,
            Position::new
    );
}

record BedwarsMap(String name, Position spawnPosition) {
    static final StructCodec<BedwarsMap> CODEC = StructCodec.struct(
            "name", Codec.STRING, BedwarsMap::name,
            "spawn_position", Position.CODEC, BedwarsMap::spawnPosition,
            BedwarsMap::new
    );
}
```

## Inlined Structures
Use `StructCodec.INLINE` to flatten nested fields into the parent object instead of creating a nested map.

```java
record Inner(String innerValue) {
    static final StructCodec<Inner> CODEC = StructCodec.struct(
            "inner_value", Codec.STRING, Inner::innerValue,
            Inner::new
    );
}

record Outer(String outerValue, Inner inner) {
    static final StructCodec<Outer> CODEC = StructCodec.struct(
            "outer_value", Codec.STRING, Outer::outerValue,
            StructCodec.INLINE, Inner.CODEC, Outer::inner,
            Outer::new
    );
}
```

This produces `{"outer_value": "test", "inner_value": "innerValue"}` instead of `{"outer_value": "test", "inner": {"inner_value": "innerValue"}}`.

## Error Handling
Codec operations return a `Result<T>` type that represents either success or failure. Use pattern matching to handle both cases, or helper methods like `orElseThrow()` and `orElse()`.

```java
Result<PlayerData> result = PlayerData.CODEC.decode(Transcoder.JSON, json);

if (result instanceof Result.Ok<PlayerData> ok) {
    PlayerData data = ok.value();
} else if (result instanceof Result.Error<PlayerData> error) {
    player.sendMessage("Failed to decode your player data: " + error.message());
}

// If the data cannot be decoded successfully, throw a runtime exception
PlayerData data = result.orElseThrow();

// If the data cannot be decoded successfully, fallback to the default value
PlayerData data = result.orElse(defaultData);
```

## Transcoders
A transcoder bridges a codec to a specific file format. The two built-in ones are:
- `Transcoder.NBT`: Serializing to Minecraft NBT using the [Adventure](https://github.com/PaperMC/adventure) library
- `Transcoder.JSON`: Serializing to JSON files using the [GSON](https://github.com/google/gson) library

Both of these libraries are built-in, so you don't have to worry about adding any dependencies to start using them.

```java
PlayerData playerData = new PlayerData("Steve", 67, null);
JsonElement json = PlayerData.CODEC.encode(Transcoder.JSON, playerData).orElseThrow();
BinaryTag nbt = PlayerData.CODEC.encode(Transcoder.NBT, playerData).orElseThrow();
```

:::tip
You can create your own transcoder, for example, one for reading YAML configuration files.
:::

<!-- [ TODO: SnakeYAML example, probably link to a Gist ] -->

## Saving to Files
### JSON
```java
void saveJson(PlayerData data, Path path) throws IOException {
    JsonElement json = PlayerData.CODEC.encode(Transcoder.JSON, data).orElseThrow();
    String jsonString = new GsonBuilder().setPrettyPrinting().create().toJson(json);
    Files.writeString(path, jsonString);
}

PlayerData loadJson(Path path) throws IOException {
    String jsonString = Files.readString(path);
    JsonElement json = JsonParser.parseString(jsonString);
    return PlayerData.CODEC.decode(Transcoder.JSON, json).orElseThrow();
}
```

### NBT
```java
void saveNbt(PlayerData data, Path path) throws IOException {
    CompoundBinaryTag nbt = (CompoundBinaryTag) PlayerData.CODEC
        .encode(Transcoder.NBT, data)
        .orElseThrow();

    try (var output = Files.newOutputStream(path)) {
        BinaryTagIO.writer().write(nbt, output);
    }
}

PlayerData loadNbt(Path path) throws IOException {
    try (var input = Files.newInputStream(path)) {
        CompoundBinaryTag nbt = BinaryTagIO.reader().read(input);
        return PlayerData.CODEC.decode(Transcoder.NBT, nbt).orElseThrow();
    }
}
```

## Converting Between Formats
You can convert between formats using `RawValue` for direct conversion, or by decoding then encoding.

```java
Codec.RawValue rawValue = Codec.RawValue.of(Transcoder.JSON, jsonElement);
BinaryTag nbt = rawValue.convertTo(Transcoder.NBT).orElseThrow();

PlayerData data = PlayerData.CODEC.decode(Transcoder.JSON, json).orElseThrow();
BinaryTag nbt = PlayerData.CODEC.encode(Transcoder.NBT, data).orElseThrow();
```