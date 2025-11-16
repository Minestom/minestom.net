# Locator Bar
The [locator bar](https://minecraft.wiki/w/Locator_bar) is a new UI element added in Minecraft version 1.21.6. In Minestom, it can be accessed by sending the related waypoint packet.

```java
// A waypoint can be identified by a UUID or a string
UUID uuid = UUID.randomUUID();

// Let's make it point to the center of the map
BlockVec center = new BlockVec(0, 0, 0);
TrackedWaypointPacket.Target target = new TrackedWaypointPacket.Target.Vec3i(center);

// Set the icon to be a green circle/square
TrackedWaypointPacket.Icon icon = new TrackedWaypointPacket.Icon(TrackedWaypointPacket.Icon.DEFAULT_STYLE, NamedTextColor.GREEN);

// Put it all together to start tracking the waypoint
TrackedWaypointPacket.Waypoint waypoint = new TrackedWaypointPacket.Waypoint(Either.left(uuid), icon, target);
player.sendPacket(new TrackedWaypointPacket(TrackedWaypointPacket.Operation.TRACK, waypoint));

// If you wanted a string ID instead
// TrackedWaypointPacket.Waypoint waypoint = new TrackedWaypointPacket.Waypoint(Either.right("emerald_generator"), icon, target);

// Create a new waypoint with the same ID to update its properties
TrackedWaypointPacket.Waypoint updatedWaypoint = new TrackedWaypointPacket.Waypoint(...);
player.sendPacket(new TrackedWaypointPacket(TrackedWaypointPacket.Operation.UPDATE, updatedWaypoint));

// Stop tracking the waypoint
player.sendPacket(new TrackedWaypointPacket(TrackedWaypointPacket.Operation.UNTRACK, waypoint));
```

## Targets
- `Empty`: The waypoint will be positioned in the center of the locator bar and use the small circle texture (which appears when the target is too far away).
- `Vec3i`: Points to an X, Y, Z [world position](/docs/world/coordinates.md).
- `Chunk`: Points to the coordinates of a chunk.
- `Azimuth`: Points to an angle (in radians) without revealing the precise coordinates.

## Icon
An icon can have a key to a style (defined in the resource pack), as well as an optional RGB color. The below image shows the default texture (`minecraft:default`).

![The default style of a waypoint.](/docs/feature/locator-bar/example.png)

See the [Minecraft Wiki](https://minecraft.wiki/w/Waypoint_style) for more info on how to add a custom waypoint texture.
