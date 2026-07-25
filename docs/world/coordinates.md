# Coordinates

Anything with a place in the world is a `Point`. It is a sealed interface with three implementations:

| Type       | Stores                                   | Use it for                                           |
| ---------- | ---------------------------------------- | ---------------------------------------------------- |
| `Vec`      | x, y, z as doubles                       | Any point in 3D space, and the default when in doubt |
| `Pos`      | x, y, z as doubles, plus a yaw and pitch | A point that also faces a direction                  |
| `BlockVec` | x, y, z as integers                      | A point snapped to the block grid                    |

Yaw and pitch are the angles describing where something looks, both in degrees. Yaw turns left and right, pitch tilts up and down.

## Axes

| Axis | Increases toward | Decreases toward |
| ---- | ---------------- | ---------------- |
| X    | East             | West             |
| Y    | Up               | Down             |
| Z    | South            | North            |

## Creating points

```java
Vec vec = new Vec(3, 64, 1);
Vec flat = new Vec(3, 1); // y is 0
Vec uniform = new Vec(5); // 5, 5, 5

Pos spawn = new Pos(0, 64, 0); // yaw and pitch default to 0
Pos facing = new Pos(0, 64, 0, 90, 0);

BlockVec block = new BlockVec(3, 64, 1);
```

`Vec` and `BlockVec` expose `ZERO`, `ONE`, `SECTION`, `CHUNK`, and `REGION`, and `Pos` has `ZERO`. `CHUNK` and `REGION` leave Y at zero, since they describe a horizontal grid.

Conversions are explicit, so precision is never lost by accident:

```java
Vec vec = point.asVec();
Pos pos = point.asPos(); // yaw and pitch default to 0
Pos aimed = point.asPos(90, 0);
BlockVec block = point.asBlockVec(); // floors x/y/z
```

Converting a type to itself is deprecated, as a hint that the call does nothing.

## Method reference

Every operation returns a new instance of the type it was called on, so `Pos#add` keeps the original yaw and pitch. `BlockVec` is the exception, widening to a `Vec` when a result would land off the grid.

### Coordinates

| Method                                            | Result                           |
| ------------------------------------------------- | -------------------------------- |
| `x()`, `y()`, `z()`                               | The exact coordinates            |
| `blockX()`, `blockY()`, `blockZ()`                | The block the point falls in     |
| `sectionX()`, `sectionY()`, `sectionZ()`          | The 16-block section it falls in |
| `chunkX()`, `chunkZ()`                            | The chunk it falls in            |
| `regionX()`, `regionZ()`                          | The 512-block region it falls in |
| `withX(double)`, `withY(double)`, `withZ(double)` | Replaces a single axis           |
| `withX(DoubleUnaryOperator)` and friends          | Transforms a single axis         |

Chunks and sections share a horizontal grid, so `chunkX()` and `chunkZ()` are aliases for `sectionX()` and `sectionZ()`. All of these floor rather than truncate, so `new Vec(-0.5, 0, 0).blockX()` is `-1`.

### Arithmetic

| Method                     | Result                                                    |
| -------------------------- | --------------------------------------------------------- |
| `add`, `sub`, `mul`, `div` | Takes three doubles, a `Point`, or one value for all axes |
| `neg()`                    | Negates every coordinate                                  |
| `abs()`                    | Absolute value of every coordinate                        |
| `min(...)`, `max(...)`     | Component-wise minimum and maximum                        |
| `relative(BlockFace)`      | Steps one block along the given face                      |

::: warning
`div` does not guard against division by zero, which yields infinity or `NaN` rather than throwing.
:::

### Geometry

| Method                                      | Result                             |
| ------------------------------------------- | ---------------------------------- |
| `length()`, `lengthSquared()`               | Magnitude from the origin          |
| `distance(Point)`, `distanceSquared(Point)` | Distance to another point          |
| `normalize()`                               | Scales to a length of 1            |
| `isNormalized()`                            | Whether the length is already 1    |
| `dot(Point)`                                | Dot product                        |
| `cross(Point)`                              | Cross product                      |
| `angle(Point)`                              | Angle between the two, in radians  |
| `lerp(Point, double)`                       | Linear interpolation, alpha 0 to 1 |

Prefer the squared variants when comparing distances, since they skip the square root.

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
Do not compare points with `equals`. A record only equals another instance of its own class, so `new Vec(1, 2, 3).equals(new BlockVec(1, 2, 3))` is `false`. Use `samePoint` instead.
:::

### Vec

`Vec` adds the math that only makes sense on continuous coordinates. `apply` runs a function across all three components at once:

```java
Vec vec = new Vec(1.7, 2.2, -3.5)
        .apply(Vec.Operator.FLOOR) // 1, 2, -4
        .withX(x -> x * 2)         // 2, 2, -4
        .neg();                    // -2, -2, 4
```

`Vec.Operator` has `FLOOR`, `CEIL`, `ROUND`, `SIGNUM`, and `EPSILON`, which snaps components below `1e-6` to zero. `Vec.Operator.operator(DoubleUnaryOperator)` wraps anything else.

The rotations all take radians:

| Method                                                | Effect                                                           |
| ----------------------------------------------------- | ---------------------------------------------------------------- |
| `rotateAroundX`, `rotateAroundY`, `rotateAroundZ`     | Rotates around a single axis                                     |
| `rotate(double, double, double)`                      | Rotates around X, then Y, then Z                                 |
| `rotateAroundAxis(Vec, double)`                       | Rotates around an arbitrary axis, normalizing it first           |
| `rotateAroundNonUnitAxis(Vec, double)`                | The same without normalizing, so the length scales with the axis |
| `rotateFromView(float, float)`, `rotateFromView(Pos)` | Reorients a vector from a yaw and pitch                          |

`rotateFromView` turns an offset relative to something's facing into a world offset, such as spawning a projectile to a player's right.

### Pos

Arithmetic leaves yaw and pitch alone, so `pos.add(0, 1, 0)` lifts an entity without turning it. The constructor normalizes the view: yaw wraps into `(-180, 180]` and pitch clamps to `[-90, 90]`, so `new Pos(0, 64, 0, 225, 120)` stores a yaw of `-135` and a pitch of `90`.

| Method                                    | Result                                                               |
| ----------------------------------------- | -------------------------------------------------------------------- |
| `withCoord(...)`                          | Replaces the coordinates, keeping the view                           |
| `withView(float, float)`, `withView(Pos)` | Replaces the view, keeping the coordinates                           |
| `withYaw(...)`, `withPitch(...)`          | Replaces one angle, by value or through an operator                  |
| `withLookAt(Point)`                       | Turns to face an absolute position                                   |
| `withDirection(Point)`                    | Turns to face along a direction, wherever the position happens to be |
| `direction()`                             | The unit `Vec` the view points along                                 |
| `facing()`                                | The nearest `Direction`, including up and down                       |
| `lerpView(Pos, float)`                    | Interpolates the view alone                                          |
| `sameView(...)`, `similarView(...)`       | Compares yaw and pitch exactly, or within `Pos.VIEW_EPSILON`         |
| `negView()`, `absView()`                  | Negates or takes the absolute value of the view                      |

`withLookAt` takes a target to look at, `withDirection` takes the direction to look along:

```java
Pos pos = new Pos(0, 64, 0);
pos.withLookAt(player.getPosition()); // watches the player
pos.withDirection(new Vec(0, 0, 1));  // always faces south
```

### BlockVec

`BlockVec` can never sit between blocks, and block events hand you one. Its methods come in pairs, and the return type tells you whether the result is still on the grid:

```java
BlockVec block = new BlockVec(4, 64, 4);
BlockVec above = block.add(0, 1, 0);   // int overload, still a BlockVec
Vec center = block.add(0.5, 0.5, 0.5); // double overload, widens to a Vec
```

`withBlockX`, `withBlockY`, and `withBlockZ` are the integer counterparts to `withX` and friends. Building a `BlockVec` from doubles floors each coordinate:

```java
new BlockVec(1.9, 64.5, -0.1); // 1, 64, -1
```

## Why are the types immutable?

Coordinates are records with final fields, and none of them can be mutated after construction. That sounds like it would be inefficient, but in practice it rarely is:

- A point can be shared, cached, and handed to another thread without any defense copying needed.
- [Scalar replacement](https://shipilev.net/jvm/anatomy-quarks/18-scalar-replacement/) lets HotSpot skip the allocation altogether when a point never escapes the method that created it.
- [JEP 401](https://openjdk.org/jeps/401), value classes and objects, targets Java 28 as a preview feature. A value class declares that its instances have no identity, which lets the JVM flatten them into fields, arrays, and registers instead of allocating on the heap. `Point` is documented as a candidate, so the remaining overhead could disappear soon without the API changing at all.
