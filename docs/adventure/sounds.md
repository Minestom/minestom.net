# Sounds

A `Sound` is a sound event, a category, a volume, and a pitch. Minestom's `SoundEvent` implements Adventure's `Sound.Type`, so the vanilla constants can be passed directly:

```java
Sound sound = Sound.sound(
        SoundEvent.ENTITY_PLAYER_LEVELUP,
        Sound.Source.PLAYER,
        1.0F,  // volume
        1.0F   // pitch
);

audience.playSound(sound);
```

Volume above `1.0F` does not increase loudness, only the distance at which the sound is audible. Pitch ranges from `0.5F` to `2.0F`.

## Sources

Each `Sound.Source` has its own volume slider in the client's sound options, and `MASTER` scales all of the others.

| Source    | Vanilla sounds routed through it                   |
|-----------|----------------------------------------------------|
| `MASTER`  | Nothing directly; its slider scales every category |
| `PLAYER`  | Damage, leveling up, eating, and other player acts |
| `HOSTILE` | Hostile mobs                                       |
| `NEUTRAL` | Passive and neutral mobs, including villagers      |
| `BLOCK`   | Block placement, breaking, and block interactions  |
| `AMBIENT` | Cave ambience and other environmental sounds       |
| `WEATHER` | Rain and thunder                                   |
| `MUSIC`   | Background music                                   |
| `RECORD`  | Jukeboxes and note blocks                          |
| `UI`      | Menu and interface sounds such as button clicks    |
| `VOICE`   | The narrator; no world sounds use it               |

## Sound position

`playSound(Sound)` plays at the audience's own position. The other overloads set a fixed position or attach the sound to an entity:

```java
player.playSound(sound);                              // at the player
player.playSound(sound, new Vec(0, 64, 0));           // at a fixed point
player.playSound(sound, 0.0, 64.0, 0.0);              // the same, as coordinates
player.playSound(sound, Sound.Emitter.self());        // attached to the player
player.playSound(sound, someEntity);                  // attached to another entity
```

An attached sound moves with the entity. Only `Entity` and `Sound.Emitter.self()` are accepted as emitters; any other implementation throws.

`Instance#playSoundExcept` plays a sound to everyone in the instance except one player.

## Stopping sounds

`SoundStop` selects which sounds to stop.

```java
audience.stopSound(SoundStop.named(SoundEvent.MUSIC_DISC_CAT));  // one sound
audience.stopSound(SoundStop.source(Sound.Source.MUSIC));        // a whole category
audience.stopSound(SoundStop.all());                             // everything
```

## Resource pack sounds

`SoundEvent.of` creates a sound event for a sound defined in a [resource pack](resource-packs):

```java
SoundEvent custom = SoundEvent.of("minestom:ambient.cave_wind", 16.0F);
audience.playSound(Sound.sound(custom, Sound.Source.AMBIENT, 1.0F, 1.0F));
```

The second argument is a fixed broadcast range in blocks. A vanilla server uses it to decide which players receive the sound; Minestom only serializes the field and does no such filtering, and the client ignores it when computing attenuation. Audible distance comes from the pack's `attenuation_distance` instead.

::: warning
The key must match an entry in the pack's `sounds.json`. A client without the pack plays nothing, logging a line to its own log and showing the player no error.
:::
