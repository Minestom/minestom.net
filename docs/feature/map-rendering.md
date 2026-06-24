# Map rendering

## Introduction

Minecraft maps usually hold a 128x128 image representing an aerial view of an area. This is done by saving a 128x128 image inside the map data and rendering it.

The thing is... the server decides the contents, and there is no requirement to show an aerial view. This means that maps can serve as arbitrary 128x128 textures which can then be used for custom blocks, graphics and more.

## Writing map data - Low level API

Minestom does not save map data for you, but it will send it for you. At the most basic level, map framebuffers (the 128x128 pixel area the server draws on) hold the 1-byte indices of colors in a pre-determined color palette, but not RGB.

A `MapDataPacket` is an immutable record. You build one with the map ID you want to update and a `ColorContent` describing the pixels to write:

```java
byte[] pixels = YOUR_PIXELS; // length columns * rows, palette indices

MapDataPacket mapData = new MapDataPacket(
        YOUR_MAP_ID, // mapId
        (byte) 0,    // scale
        false,       // locked
        false,       // trackingPosition (send icons?)
        List.of(),   // icons
        new MapDataPacket.ColorContent(
                (byte) COLUMN_COUNT, // columns (width of the updated area)
                (byte) ROW_COUNT,    // rows (height of the updated area)
                (byte) X_START,      // x offset of the top-left pixel
                (byte) Z_START,      // z offset of the top-left pixel
                pixels));
```

- `mapId` is an `int` used to reference which map to change.
- `scale` is a `byte` for the map scale. Use `0` for a 1:1 custom texture.
- `locked` is a `boolean`. When `true` the client cannot modify the map in a cartography table.
- `trackingPosition` is a `boolean` controlling whether the `icons` list is sent. Set it to `false` for a plain image.
- `icons` is a `List<MapDataPacket.Icon>` of map decorations (player markers, banners, etc.). Use `List.of()` for none.
- `colorContent` is a `@Nullable ColorContent` holding the pixels to update. Pass `null` to send only metadata/icons without touching the pixels.

The `ColorContent` record carries the pixel update:

- `columns` is an unsigned byte (stored inside a `byte`) for the number of columns (width) to update. Ranges from 1 to 128.
- `rows` is an unsigned byte for the number of rows (height) to update. Ranges from 1 to 128.
- `x` is an unsigned byte for the X coordinate of the left-most pixel to write. Ranges from 0 to 127 (inclusive).
- `z` is an unsigned byte for the Z (vertical) coordinate of the top-most pixel to write. Ranges from 0 to 127 (inclusive).
- `data` is a `byte[]` array which holds the indices inside the color palette. Its size should be at least `columns * rows`.

Pixels are stored in a row-major configuration (ie index is defined by `x + columns * z`). Attempting to write pixels outside the 128x128 area WILL crash and/or disconnect the client, so be careful. Minestom does not check which area you are writing to.

You can then send the packet to players through `Player#sendPacket(SendablePacket)`:

```java
player.sendPacket(mapData);
```

## Displaying a map

To make a player actually see your map, give them a filled map item pointing at the same map ID via the `MAP_ID` data component:

```java
ItemStack map = ItemStack.builder(Material.FILLED_MAP)
        .set(DataComponents.MAP_ID, YOUR_MAP_ID)
        .build();
player.getInventory().addItemStack(map);
```

The map ID is just an arbitrary `int` you pick to identify the map. Use the same value when sending `MapDataPacket` and when setting `MAP_ID` so the item and the pixel data line up.

## Framebuffers - High level API

While directly writing to the pixel buffer is fast and easy for simple graphics, it is rapidly cumbersome to write each pixel individually. For this reason, Minestom provides framebuffers: a high-level API for rendering onto maps.

Framebuffers are split into 2 categories: `Framebuffer` and `LargeFramebuffer`. The difference is that `Framebuffer` is meant to render to a single map (so resolution limited to 128x128), while `LargeFramebuffer` can render to any framebuffer size, by rendering over multiple maps. Large framebuffers offer a method to create `Framebuffer` views to help with rendering onto a map.

Once you have finished rendering on your framebuffer, you can ask it to prepare the `MapDataPacket` for you by passing the map ID:

```java
Framebuffer fb = //...
// some render code
MapDataPacket mapData = fb.preparePacket(YOUR_MAP_ID);
player.sendPacket(mapData);
```

For a `LargeFramebuffer`, `preparePacket(mapId, left, top)` prepares a 128x128 sub-view starting at the given top-left corner, so you send one packet (and use one map ID) per map in the wall.

Framebuffers have 2 default flavors provided by Minestom: Direct and Graphics2D.

### `DirectFramebuffer` / `LargeDirectFramebuffer`

Direct framebuffers are very close to writing directly the pixel buffer inside `MapDataPacket`. They hold an internal `byte[]` representing the colors on the map, which can be accessed and modified through `get` and `set` respectively. The entire internal buffer is also exposed via `getColors()` (you can modify it from the returned value).

Example use:

```java
DirectFramebuffer fb = new DirectFramebuffer();
byte[] colors = fb.getColors();
for (int i = 0; i < colors.length; i++) {
    colors[i] = MapColors.COLOR_CYAN.baseColor();
}
fb.set(0, 0, MapColors.DIRT.baseColor());
```

### `Graphics2DFramebuffer` / `LargeGraphics2DFramebuffer`

_These framebuffers require a conversion from RGB to MapColors. This is done automatically by Minestom but can seriously impact rendering performance when the resolution increases._

As the name suggests, these framebuffers allow usage of the Graphics2D API from the AWT library included in the Java standard library. Access the `Graphics2D` object through `getRenderer()` and render your content on it.

Example use:

```java
Graphics2DFramebuffer framebuffer = new Graphics2DFramebuffer();
Graphics2D renderer = framebuffer.getRenderer();
renderer.setColor(Color.BLACK);
renderer.clearRect(0, 0, 128, 128);
renderer.setColor(Color.WHITE);
renderer.drawString("Hello from", 0, 10);
renderer.drawString("Graphics2D!", 0, 20);
```

Graphics2D framebuffers also support getting/setting pixels individually if necessary.
