# Map rendering

## Introduction

Minecraft maps usually hold a 128x128 image representing an aerial view of an area. This is done by saving a 128x128 image inside the map data and rendering it.

The thing is... the server decides the contents, and there is no requirement to show an aerial view. This means that maps can serve as arbitrary 128x128 textures which can then be used for custom blocks, graphics and more.

## Writing map data - Low level API

Minestom does not save map data for you, but it will send it for you. At the most basic level, map framebuffers (the 128x128 pixel area the server draws on) hold the 1-byte indices of colors in a pre-determined color palette, but not RGB.

Once you have selected a map ID to write to (see [MapMeta](https://github.com/Minestom/Minestom/blob/master/src/main/java/net/minestom/server/item/metadata/MapMeta.java) for more information), you can write its contents via a `MapDataPacket`:

```java
MapDataPacket mapData = new MapDataPacket();
mapData.mapId = YOUR_MAP_ID;
mapData.data = YOUR_PIXELS;
mapData.x = X_START;
mapData.z = Z_START;
mapData.rows = ROW_COUNT;
mapData.columns = COLUMN_COUNT;
```

* `mapId` is an `int` to be able to reference which map to change.
* `data` is a `byte[]` array which holds the indices inside the color palette. Its size should be at least `rows*columns`.
* `x` is an unsigned byte (stored inside a `short`) which represents the X coordinate of the left-most pixel to write. Ranges from 0 to 127 (inclusive).
* `y` is an unsigned byte (stored inside a `short`) which represents the Y coordinate of the top-most pixel to write. Ranges from 0 to 127 (inclusive).
* `rows` is an unsigned byte (stored inside a `short`) which represents the number of rows to update.
* `columns` is an unsigned byte (stored inside a `short`) which represents the number of columns to update.

Pixels are stored in a row-major configuration (ie index is defined by `x+width*y`). Attempting to write pixels outside of the 128x128 area WILL crash and/or disconnect the client, so be careful. Minestom does not check which area you are writing to.

You can then send the packet to players through `PlayerConnection#sendPacket(ServerPacket)`

## Framebuffers - High level API

While directly writing to the pixel buffer is fast and easy for simple graphics, it is rapidly cumbersome to write each pixel individually. For this reason, Minestom provides framebuffers: a high-level API for rendering onto maps.

Framebuffers are split into 2 categories: `Framebuffer` and `LargeFramebuffer`. The difference is that `Framebuffer` is meant to render to a single map (so resolution limited to 128x128), while `LargeFramebuffer` can render to any framebuffer size, by rendering over multiple maps. Large framebuffers offer a method to create `Framebuffer` views to help with rendering onto a map.

Once you have finished rendering on your framebuffer, you can ask it to prepare the `MapDataPacket` for you.

```java
MapDataPacket mapData = new MapDataPacket();
mapData.mapId = YOUR_MAP_ID;
Framebuffer fb = //...
// some render code
fb.preparePacket(packet);
```

Framebuffers have 3 default flavors provided by Minestom: Direct, Graphics2D and GLFW-Capable.

### `DirectFramebuffer` / `LargeDirectFramebuffer`

Direct framebuffers are very close to writing directly the pixel buffer inside `MapDataPacket`. They hold an internal `byte[]` representing the colors on the map, which can be accessed and modified through `get` and `set` respectively. The entire internal buffer is also exposed via `getColors()` (you can modify it from the returned value).

Example use:

```java
DirectFramebuffer fb = new DirectFramebuffer();
byte[] colors = fb.getColors();
for (int i = 0; i < colors.length; i++) {
    colors[i] = MapColors.COLOR_CYAN.baseColor();
}
fb.set(0,0, MapColors.DIRT.baseColor());
```

### `Graphics2DFramebuffer` / `LargeGraphics2DFramebuffer`

_These framebuffers require a conversion from RGB to MapColors. This is done automatically by Minestom but can seriously impact rendering performance when the resolution increases._

As the name suggests, these framebuffers allow usage of the Graphics2D API from the AWT library included in the Java standard library. Access the `Graphics2D` object through `getRenderer()` and render your content on it.

Example use:

```java
Graphics2D renderer = framebuffer.getRenderer();
renderer.setColor(Color.BLACK);
renderer.clearRect(0, 0, 128, 128);
renderer.setColor(Color.WHITE);
renderer.drawString("Hello from", 0, 10);
renderer.drawString("Graphics2D!", 0, 20);
```

Graphics2D framebuffers also support getting/setting pixels individually if necessary.

### GLFW-Capable buffers

[This is an article all to itself.](glfwmaprendering.md)
