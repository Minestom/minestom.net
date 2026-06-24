# Network Buffers
Network buffers read and write binary data sequentially. They maintain separate read and write positions and provide type-safe serialization.

```java
NetworkBuffer buffer = NetworkBuffer.resizableBuffer();

// Writing
buffer.write(NetworkBuffer.STRING, "Hello");
buffer.write(NetworkBuffer.VAR_INT, 42);
buffer.write(NetworkBuffer.UUID, playerId);

// Reading
String message = buffer.read(NetworkBuffer.STRING);
int value = buffer.read(NetworkBuffer.VAR_INT);
UUID id = buffer.read(NetworkBuffer.UUID);
```

## Creating Buffers
```java
// Resizable buffer that grows automatically (default 256 bytes initial)
NetworkBuffer buffer = NetworkBuffer.resizableBuffer();

// Resizable with custom initial size
NetworkBuffer buffer = NetworkBuffer.resizableBuffer(1024);

// Fixed-size buffer
NetworkBuffer buffer = NetworkBuffer.staticBuffer(512);

// Create a fixed-size buffer initialized from a byte array
byte[] data = new byte[]{1, 2, 3, 4};
NetworkBuffer buffer = NetworkBuffer.wrap(data, 0, data.length);
```

`NetworkBuffer.wrap(...)` copies the provided bytes into the buffer; it does not share the original `byte[]`.

## Built-in Types
### Primitives
| Type               | Java Type           | Size       | Description                                       |
| ------------------ | ------------------- | ---------- | ------------------------------------------------- |
| `BOOLEAN`          | `Boolean`           | 1 byte     | Boolean value                                     |
| `BYTE`             | `Byte`              | 1 byte     | Signed 8-bit integer                              |
| `UNSIGNED_BYTE`    | `Short`             | 1 byte     | Unsigned 8-bit integer (0-255)                    |
| `SHORT`            | `Short`             | 2 bytes    | Signed 16-bit integer                             |
| `UNSIGNED_SHORT`   | `Integer`           | 2 bytes    | Unsigned 16-bit integer (0-65535)                 |
| `INT`              | `Integer`           | 4 bytes    | Signed 32-bit integer                             |
| `UNSIGNED_INT`     | `Long`              | 4 bytes    | Unsigned 32-bit integer                           |
| `LONG`             | `Long`              | 8 bytes    | Signed 64-bit integer                             |
| `FLOAT`            | `Float`             | 4 bytes    | 32-bit floating point                             |
| `DOUBLE`           | `Double`            | 8 bytes    | 64-bit floating point                             |
| `VAR_INT`          | `Integer`           | 1-5 bytes  | Variable-length integer                           |
| `VAR_LONG`         | `Long`              | 1-10 bytes | Variable-length long                              |
| `OPTIONAL_VAR_INT` | `@Nullable Integer` | 1-5 bytes  | Nullable VAR_INT; encodes 0 for absent, n+1 for n |
| `VAR_INT_3`        | `Integer`           | 3 bytes    | Fixed 3-byte VarInt, range 0–2²¹-1                |
| `UNIT`             | `Unit`              | 0 bytes    | Represents the absence of a value                 |

VAR_INT and VAR_LONG encode small values in fewer bytes. Values 0-127 use 1 byte, larger values use up to 5 bytes (VAR_INT) or 10 bytes (VAR_LONG).

### Strings and Text
| Type                | Java Type           | Description                                                                                               |
| ------------------- | ------------------- | --------------------------------------------------------------------------------------------------------- |
| `STRING`            | `String`            | UTF-8 string with VAR_INT length prefix                                                                   |
| `KEY`               | `Key`               | Namespaced key (e.g., `minecraft:stone`)                                                                  |
| `COMPONENT`         | `Component`         | Adventure text component in the standard network format                                                   |
| `NBT`               | `BinaryTag`         | NBT tag                                                                                                   |
| `NBT_COMPOUND`      | `CompoundBinaryTag` | NBT compound tag                                                                                          |
| `JSON_COMPONENT`    | `Component`         | Adventure text component as JSON string                                                                   |
| `STRING_TERMINATED` | `String`            | Null-terminated UTF-8 string                                                                              |
| `STRING_IO_UTF8`    | `String`            | Modified UTF-8 string for stream I/O with a 2-byte length prefix (`DataOutputStream.writeUTF` compatible) |

### Positions and Vectors
| Type                 | Java Type         | Description                                                |
| -------------------- | ----------------- | ---------------------------------------------------------- |
| `BLOCK_POSITION`     | `Point`           | Block coordinates packed into a long                       |
| `OPT_BLOCK_POSITION` | `@Nullable Point` | Optional block coordinates                                 |
| `POS`                | `Pos`             | Position (double x, y, z) with rotation (float yaw, pitch) |
| `VECTOR3`            | `Point`           | Three floats (x, y, z)                                     |
| `VECTOR3D`           | `Point`           | Three doubles (x, y, z)                                    |
| `VECTOR3I`           | `Point`           | Three VAR_INTs (x, y, z)                                   |
| `VECTOR3B`           | `Point`           | Three signed bytes (x, y, z)                               |
| `LP_VECTOR3`         | `Vec`             | Lossy-precision quantized vector                           |
| `QUATERNION`         | `float[]`         | Rotation as four floats (x, y, z, w)                       |

### Arrays and Collections
| Type             | Java Type | Description                            |
| ---------------- | --------- | -------------------------------------- |
| `BYTE_ARRAY`     | `byte[]`  | VAR_INT length, then bytes             |
| `LONG_ARRAY`     | `long[]`  | VAR_INT length, then longs             |
| `VAR_INT_ARRAY`  | `int[]`   | VAR_INT length, then VAR_INT elements  |
| `VAR_LONG_ARRAY` | `long[]`  | VAR_INT length, then VAR_LONG elements |
| `RAW_BYTES`      | `byte[]`  | All remaining readable bytes           |

### Other Types
| Type         | Java Type             | Description                                    |
| ------------ | --------------------- | ---------------------------------------------- |
| `UUID`       | `UUID`                | UUID stored as two longs                       |
| `BITSET`     | `BitSet`              | Java BitSet                                    |
| `INSTANT_MS` | `Instant`             | Instant as milliseconds since epoch            |
| `OPT_CHAT`   | `@Nullable Component` | Optional Adventure text component              |
| `DIRECTION`  | `Direction`           | Direction enum (including up/down, by ordinal) |
| `POSE`       | `EntityPose`          | Entity pose (by ordinal)                       |
| `PUBLIC_KEY` | `PublicKey`           | RSA public key as byte array                   |

## Transforming Types
`.transform()` converts between a network type and your custom type.

```java
NetworkBuffer.Type<PotionType> POTION_TYPE =
    NetworkBuffer.VAR_INT.transform(
        PotionType::fromId,
        PotionType::id
    );

buffer.write(POTION_TYPE, potionType);
PotionType type = buffer.read(POTION_TYPE);
```

## Enums
Enums can be serialized by ordinal using `NetworkBuffer.Enum()`. Unlike `Codec.Enum()`, which encodes by name, this uses the enum's numeric ordinal as a `VAR_INT`.

```java
NetworkBuffer.Type<Direction> DIRECTION = NetworkBuffer.Enum(Direction.class);

buffer.write(DIRECTION, Direction.NORTH);
Direction dir = buffer.read(DIRECTION);
```

For EnumSets, use `NetworkBuffer.EnumSet()`:

```java
NetworkBuffer.Type<EnumSet<Feature>> FEATURES = NetworkBuffer.EnumSet(Feature.class);
```

## Optional Types
`.optional()` wraps a type to allow null values. Writes a boolean (present/absent) followed by the value if present.

```java
NetworkBuffer.Type<@Nullable Component> OPT_COMPONENT =
    NetworkBuffer.COMPONENT.optional();

buffer.write(OPT_COMPONENT, null);
buffer.write(OPT_COMPONENT, someComponent);

@Nullable Component component = buffer.read(OPT_COMPONENT);
```

## Collections
`.list()` creates a list type. `.mapValue()` creates a map type whose keys use the receiver type and whose values use the provided type. Both accept a maximum size used during reads to reject oversized payloads.

```java
NetworkBuffer.Type<List<String>> STRING_LIST =
    NetworkBuffer.STRING.list(Short.MAX_VALUE);

buffer.write(STRING_LIST, List.of("a", "b", "c"));
List<String> strings = buffer.read(STRING_LIST);

NetworkBuffer.Type<Map<String, Integer>> STRING_INT_MAP =
    NetworkBuffer.STRING.mapValue(NetworkBuffer.INT, Short.MAX_VALUE);

buffer.write(STRING_INT_MAP, Map.of("health", 20, "armor", 5));
```

## Templates
Templates serialize structured objects such as records. Alternate between type and getter pairs, ending with a constructor or factory function. Overloads are provided for up to 20 fields.

```java
record Particle(Point position, int id, float scale) {
    static final NetworkBuffer.Type<Particle> NETWORK_TYPE =
        NetworkBufferTemplate.template(
            NetworkBuffer.BLOCK_POSITION, Particle::position,
            NetworkBuffer.VAR_INT, Particle::id,
            NetworkBuffer.FLOAT, Particle::scale,
            Particle::new
        );
}

buffer.write(Particle.NETWORK_TYPE, particle);
Particle particle = buffer.read(Particle.NETWORK_TYPE);
```

Templates support optional and nested types:

```java
record PlayerInfo(
    UUID uuid,
    String name,
    List<Property> properties,
    @Nullable Component displayName,
    int ping
) {
    static final NetworkBuffer.Type<PlayerInfo> NETWORK_TYPE =
        NetworkBufferTemplate.template(
            NetworkBuffer.UUID, PlayerInfo::uuid,
            NetworkBuffer.STRING, PlayerInfo::name,
            Property.NETWORK_TYPE.list(16), PlayerInfo::properties,
            NetworkBuffer.COMPONENT.optional(), PlayerInfo::displayName,
            NetworkBuffer.VAR_INT, PlayerInfo::ping,
            PlayerInfo::new
        );
}
```

## Buffer Management
Query and modify read/write positions:

```java
long writePos = buffer.writeIndex();
long readPos = buffer.readIndex();
buffer.writeIndex(100);
buffer.readIndex(50);

buffer.advanceWrite(10);
buffer.advanceRead(5);

long readable = buffer.readableBytes();
long writable = buffer.writableBytes();

buffer.clear();
```

## Read/Write at Position
Read or write at a specific index without moving the current read/write positions:

```java
buffer.writeAt(100, NetworkBuffer.INT, 42);
int value = buffer.readAt(100, NetworkBuffer.INT);
```

## Extract Bytes
Extract the bytes consumed while a callback advances the read index:

```java
byte[] bytes = buffer.extractBytes(buf -> {
    buf.read(NetworkBuffer.VAR_INT);
    buf.read(NetworkBuffer.STRING);
});
```

To serialize writes into a new byte array, use `NetworkBuffer.makeArray(...)` instead:

```java
byte[] bytes = NetworkBuffer.makeArray(buf -> {
    buf.write(NetworkBuffer.VAR_INT, 42);
    buf.write(NetworkBuffer.STRING, "test");
});
```

## Fixed-Length Bytes and Bounded BitSets
Create fixed-length byte-array types and bitset types with a maximum logical size:

```java
NetworkBuffer.Type<byte[]> BYTES_16 = NetworkBuffer.FixedRawBytes(16);
NetworkBuffer.Type<BitSet> BITSET_64 = NetworkBuffer.FixedBitSet(64);
```

`FixedBitSet(length)` limits the highest set bit and reads up to `(length + 7) / 8` bytes; it does not pad writes to a fixed-width byte array.

## Either Types
Serialize one of two types. Prefixed by a boolean: `true` for the left variant, `false` for the right variant.

```java
NetworkBuffer.Type<Either<String, Integer>> STRING_OR_INT = NetworkBuffer.Either(NetworkBuffer.STRING, NetworkBuffer.INT);
buffer.write(STRING_OR_INT, Either.left("hello"));
buffer.write(STRING_OR_INT, Either.right(67));
```
