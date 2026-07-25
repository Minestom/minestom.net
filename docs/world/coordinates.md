# Coordinates

Anything with a place in the world is a `Point`. It is a sealed interface with three record implementations, each carrying a different amount of information:

| Type       | Components                               | Field size | Use for                                               |
| ---------- | ---------------------------------------- | ---------- | ----------------------------------------------------- |
| `Vec`      | `double x, y, z`                         | 24 bytes   | Offsets, directions, velocities, and general math     |
| `Pos`      | `double x, y, z` plus `float yaw, pitch` | 32 bytes   | Anything that also faces somewhere, such as an entity |
| `BlockVec` | `int blockX, blockY, blockZ`             | 12 bytes   | Grid-aligned positions: blocks, chunks, and regions   |

The API asks for the narrowest type it actually needs, and so should you:

```java
instance.setBlock(point, Block.STONE); // Point, any implementation works
entity.teleport(pos);                  // Pos, the view matters
entity.setVelocity(vec);               // Vec, a direction and a magnitude
event.getBlockPosition();              // BlockVec, always grid-aligned
```

Accepting `Point` in your own methods when you only read x/y/z saves callers a conversion.

## Axes and scale

| Axis | Increases toward | Decreases toward |
| ---- | ---------------- | ---------------- |
| X    | East             | West             |
| Y    | Up               | Down             |
| Z    | South            | North            |

Every point can also report where it sits on a coarser grid, whichever implementation it is:

| Scale   | Size                                             | Accessors                                |
| ------- | ------------------------------------------------ | ---------------------------------------- |
| Block   | 1 block                                          | `blockX()`, `blockY()`, `blockZ()`       |
| Section | 16 blocks on each axis (`Point.SECTION_SIZE`)    | `sectionX()`, `sectionY()`, `sectionZ()` |
| Chunk   | A full column of sections                        | `chunkX()`, `chunkZ()`                   |
| Region  | 512 blocks, or 32 sections (`Point.REGION_SIZE`) | `regionX()`, `regionZ()`                 |

Chunks and sections share the same horizontal grid, so `chunkX()` and `chunkZ()` are aliases for `sectionX()` and `sectionZ()`.

Every one of these floors rather than truncates, which keeps negative coordinates sensible: `new Vec(-0.5, 0, 0).blockX()` is `-1`, not `0`.

## Creating points

```java
Vec vec = new Vec(3, 64, 1);
Vec flat = new Vec(3, 1); // y is 0, handy for horizontal offsets
Vec uniform = new Vec(5); // 5, 5, 5

Pos spawn = new Pos(0, 64, 0); // yaw and pitch default to 0
Pos facing = new Pos(0, 64, 0, 90, 0);

BlockVec block = new BlockVec(3, 64, 1);
```

`Vec` and `BlockVec` both expose `ZERO`, `ONE`, `SECTION`, `CHUNK`, and `REGION` constants, and `Pos` has `ZERO`. `SECTION` is 16 on all three axes, while `CHUNK` and `REGION` leave Y at zero because they describe a horizontal grid.

Conversions are always explicit, so precision is never lost by accident:

```java
Vec vec = point.asVec();
Pos pos = point.asPos(); // yaw and pitch default to 0
Pos aimed = point.asPos(90, 0);
BlockVec block = point.asBlockVec(); // floors x/y/z
```

Converting a point to its own type is deprecated rather than removed, so the compiler flags a redundant `vec.asVec()` instead of rejecting it.

## Point reference

Every operation returns a new instance of the type it was called on. `Vec#add` gives a `Vec`, and `Pos#add` gives a `Pos` carrying the original yaw and pitch. `BlockVec` is the one exception, since it widens to a `Vec` whenever a result would not be grid-aligned.

### Components

| Method                                            | Result                                  |
| ------------------------------------------------- | --------------------------------------- |
| `x()`, `y()`, `z()`                               | The coordinates as doubles              |
| `blockX()`, `blockY()`, `blockZ()`                | The same coordinates floored to a block |
| `withX(double)`, `withY(double)`, `withZ(double)` | Replaces a single axis                  |
| `withX(DoubleUnaryOperator)` and friends          | Transforms a single axis                |

### Arithmetic

| Method                     | Result                                                                      |
| -------------------------- | --------------------------------------------------------------------------- |
| `add`, `sub`, `mul`, `div` | Each takes three doubles, another `Point`, or one value applied to all axes |
| `neg()`                    | Negates every coordinate                                                    |
| `abs()`                    | Takes the absolute value of every coordinate                                |
| `min(...)`, `max(...)`     | Component-wise minimum and maximum                                          |
| `relative(BlockFace)`      | Steps one block along the given face                                        |

::: warning
`div` does not guard against division by zero. Dividing by `0` yields infinity or `NaN` rather than an exception.
:::

### Geometry

| Method                                      | Result                                       |
| ------------------------------------------- | -------------------------------------------- |
| `length()`, `lengthSquared()`               | Magnitude, measured from the origin          |
| `distance(Point)`, `distanceSquared(Point)` | Distance to another point                    |
| `normalize()`                               | Scales the point to a length of 1            |
| `isNormalized()`                            | Whether the length is already 1              |
| `dot(Point)`                                | Dot product                                  |
| `cross(Point)`                              | Cross product                                |
| `angle(Point)`                              | Angle between the two points, in radians     |
| `lerp(Point, double)`                       | Linear interpolation, with alpha from 0 to 1 |

Reach for the squared variants when you only need to compare distances, since they skip the square root.

### Comparison

| Method                     | True when                                  |
| -------------------------- | ------------------------------------------ |
| `samePoint(Point)`         | The coordinates match exactly              |
| `samePoint(Point, double)` | They match within the epsilon you provide  |
| `similarPoint(Point)`      | They match within `Point.EPSILON` (`1e-6`) |
| `sameBlock(Point)`         | Both land in the same block                |
| `sameChunk(Point)`         | Both land in the same chunk                |
| `isZero()`                 | All three coordinates are 0                |

::: warning
Do not compare points with `equals`. Records only ever equal another instance of the same class, so `new Vec(1, 2, 3).equals(new BlockVec(1, 2, 3))` is `false` despite both describing the same spot. Use `samePoint` instead.
:::

## Vec

`Vec` is the plain three-double vector, and it adds the math that only makes sense on continuous coordinates.

`apply` runs a function across all three components at once:

```java
Vec vec = new Vec(1.7, 2.2, -3.5)
        .apply(Vec.Operator.FLOOR) // 1, 2, -4
        .withX(x -> x * 2)         // 2, 2, -4
        .neg();                    // -2, -2, 4
```

`Vec.Operator` ships with `FLOOR`, `CEIL`, `ROUND`, `SIGNUM`, and `EPSILON`, the last of which snaps components below `1e-6` to zero. Wrap any other function with `Vec.Operator.operator(DoubleUnaryOperator)`.

The rotations all take radians and return a new vector:

| Method                                                | Effect                                                           |
| ----------------------------------------------------- | ---------------------------------------------------------------- |
| `rotateAroundX`, `rotateAroundY`, `rotateAroundZ`     | Rotates around a single axis                                     |
| `rotate(double, double, double)`                      | Rotates around X, then Y, then Z                                 |
| `rotateAroundAxis(Vec, double)`                       | Rotates around an arbitrary axis, normalizing it first           |
| `rotateAroundNonUnitAxis(Vec, double)`                | The same without normalizing, so the length scales with the axis |
| `rotateFromView(float, float)`, `rotateFromView(Pos)` | Reorients a vector from a yaw and pitch                          |

`rotateFromView` is the one to use when turning an offset that is relative to something's facing into a world offset, such as placing a projectile slightly to the right of where a player is looking.

## Pos

`Pos` is a `Vec` with a view attached. Arithmetic leaves yaw and pitch alone, so `pos.add(0, 1, 0)` lifts an entity without turning it.

The constructor normalizes the view: yaw wraps into `(-180, 180]` and pitch clamps to `[-90, 90]`. `new Pos(0, 64, 0, 225, 120)` therefore stores a yaw of `-135` and a pitch of `90`.

| Method                                    | Result                                                               |
| ----------------------------------------- | -------------------------------------------------------------------- |
| `withCoord(...)`                          | Replaces the coordinates, keeping the view                           |
| `withView(float, float)`, `withView(Pos)` | Replaces the view, keeping the coordinates                           |
| `withYaw(...)`, `withPitch(...)`          | Replaces one angle, by value or through an operator                  |
| `withLookAt(Point)`                       | Turns to face an absolute position                                   |
| `withDirection(Point)`                    | Turns to face along a direction, wherever the position happens to be |
| `direction()`                             | The unit `Vec` the view points along                                 |
| `facing()`                                | The nearest `Direction`, including up and down                       |
| `lerpView(Pos, float)`                    | Interpolates the view alone, leaving the coordinates untouched       |
| `sameView(...)`, `similarView(...)`       | Compares yaw and pitch exactly, or within `Pos.VIEW_EPSILON`         |
| `negView()`, `absView()`                  | Negates or takes the absolute value of the view                      |

`withLookAt` and `withDirection` are easy to mix up. The first takes a target to look at, the second takes the direction to look along:

```java
Pos pos = new Pos(0, 64, 0);
pos.withLookAt(player.getPosition()); // watches the player
pos.withDirection(new Vec(0, 0, 1));  // always faces south
```

## BlockVec

`BlockVec` stores three ints, half the footprint of a `Vec`, and it can never sit between blocks. Block events hand you one, and it is the right type for anything that lives on the grid.

Because it is integer-backed, its methods come in pairs, and the return type tells you whether the result is still grid-aligned:

```java
BlockVec block = new BlockVec(4, 64, 4);
BlockVec above = block.add(0, 1, 0);      // int overload, still a BlockVec
Vec center = block.add(0.5, 0.5, 0.5);    // double overload, widens to a Vec
```

| Call                                                                                       | Returns    |
| ------------------------------------------------------------------------------------------ | ---------- |
| `add`, `sub`, `mul`, `div`, `min`, `max` on ints, `cross(BlockVec)`, `relative(BlockFace)` | `BlockVec` |
| `withBlockX`, `withBlockY`, `withBlockZ`                                                   | `BlockVec` |
| The same arithmetic taking doubles or a plain `Point`                                      | `Vec`      |
| `withX(double)` and friends, `normalize()`, `lerp(...)`                                    | `Vec`      |

Building one from doubles floors each coordinate, so it is deliberately lossy:

```java
new BlockVec(1.9, 64.5, -0.1); // 1, 64, -1
```

## Immutability

Coordinates are records with final fields, and none of them can be mutated after construction. That sounds like it should cost allocations, but in practice it rarely does:

- A point can be shared, cached, and handed to another thread without anyone copying it defensively.
- [Scalar replacement](https://shipilev.net/jvm/anatomy-quarks/18-scalar-replacement/) lets HotSpot skip the allocation altogether when a point never escapes the method that created it.
- [JEP 401](https://openjdk.org/jeps/401), value classes and objects, is targeted at Java 28 as a preview feature. A value class declares that its instances have no identity, which lets the JVM flatten them into fields, arrays, and registers instead of allocating on the heap. `Point` is documented as a candidate, so the remaining overhead should disappear without the API changing at all.
