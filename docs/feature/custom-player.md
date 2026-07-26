---
title: Custom player class
---

# Custom player class

`ConnectionManager#setPlayerProvider` sets which object is constructed for each connecting player. A subclass of `Player` can override default behavior or hold additional state:

```java
public class CustomPlayer extends Player {
    public CustomPlayer(@NotNull PlayerConnection playerConnection, @NotNull GameProfile gameProfile) {
        super(playerConnection, gameProfile);
    }
}
```

```java
MinecraftServer.getConnectionManager().setPlayerProvider(CustomPlayer::new);
```

## Assigning your own UUID

The provider also sets the player's UUID. Constructing a new `GameProfile` replaces the one Minestom generated, allowing a UUID from your own database or registration system:

```java
MinecraftServer.getConnectionManager().setPlayerProvider((connection, gameProfile) -> {
    UUID uuid = ...; // look up your own identifier for gameProfile.name()
    return new Player(connection, new GameProfile(uuid, gameProfile.name(), gameProfile.properties()));
});
```

::: warning
The client has already been sent its UUID by the time the provider runs, in every auth mode. Minestom uses the overridden one from here on, but the two no longer agree. To change the UUID the client is told, use `AsyncPlayerPreLoginEvent#setGameProfile`, which fires early enough.
:::
