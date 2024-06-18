# Coordinates

## Overview

All coordinates classes in Minestom are immutables (like a lot of others), `Point` being the common interface, and the implementations `Pos` and `Vec`.

`Vec` is a containing for the x, y & z coordinates, adding a few vector methods. `Pos` contains the 3 coordinates + yaw/pitch for the view. `Point` should be used when the type does not matter.

## Immutability performance

Some may express concern about the performance penalty of using immutable classes for math. Here is our reasoning:

* Immutability give us the guarantee that coordinate objects can be reused, reducing allocation
* [Scalar replacement](https://shipilev.net/jvm/anatomy-quarks/18-scalar-replacement/) may happen in some specific situation (builder mode)
* [Primitive objects](https://openjdk.java.net/jeps/401) will ultimately arrive, removing the concern altogether and improving performance compared to the mutable equivalent

## API

### Initialization

All coordinates can be created using their respective constructors

```java
Vec vec1 = new Vec(3, 0, 1); // [3;0;1] -> x;y;z
Vec vec2 = new Vec(1, 1); // [1;0;1]
Vec vec3 = new Vec(5); // [5;5;5]

Pos pos1 = new Pos(1,2,3,4,5); // [1;2;3;4;5] -> x;y;z;yaw;pitch
Pos pos2 = new Pos(1,2,3); // [1;2;3;0;0]
Pos pos3 = new Pos(new Vec(1)); // [1;1;1;0;0]
Pos pos4 = new Pos(new Vec(1),2,3); // [1;1;1;2;3]
```

### Vec

```java
Vec vec = new Vec(1, 2, 1);
vec = vec.add(0, 5, 0) // add 5 y
   .apply(Vec.Operator.FLOOR) // floor all coordinates
   .neg() // -x -y -z
   .withX(x -> x * 2); // double x
```

### Pos

Very similar to `Vec`.

```java
Pos pos = new Pos(0, 0, 0);
pos = pos.withView(50, 90)
        .add(0, 5, 0)
        .mul(5);
```

### Block coordinates

```java
Point point = new Vec(1);
final int blockX = point.blockX();
final int blockY = point.blockY();
final int blockZ = point.blockZ();
```
