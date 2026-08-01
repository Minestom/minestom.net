---
title: Changing the player skin
---

# Changing the player skin

::: info
If you only want players to appear with their own skin, you do not need this page. [Enabling Mojang authentication](/docs/authentication/mojang) applies each player's real skin for you.
:::

A `PlayerSkin` is a texture value and its signature. It can be set in two places:

- `PlayerSkinInitEvent`, fired at connection, which defines the skin the player joins with
- `Player#setSkin(PlayerSkin)`, at any point afterwards

## Retrieving skin data from Mojang

### Using PlayerSkin methods

`PlayerSkin` offers some utils methods to retrieve a skin using simple information such as a Mojang UUID or a Minecraft username

```java
PlayerSkin skinFromUUID = PlayerSkin.fromUuid(MOJANG_UUID_AS_STRING);

PlayerSkin skinFromUsername = PlayerSkin.fromUsername("Notch");
```

::: warning
Those methods make direct requests to the Mojang API, it is recommended to cache the values.
:::

### Retrieving the texture value and signature manually

The endpoints are documented on the [Mojang API page](https://minecraft.wiki/w/Mojang_API). First resolve the username to a UUID:

```
 GET https://api.minecraftservices.com/minecraft/profile/lookup/name/<username>
```

Then, after getting your UUID:

```
 GET https://sessionserver.mojang.com/session/minecraft/profile/<uuid>?unsigned=false
```

The response contains both the texture value and the signature, which are the two arguments to `PlayerSkin`.

## Applying a skin

### PlayerSkinInitEvent

Fired at connection, before the player spawns. The skin set here is the one the player joins with.

```java
GlobalEventHandler globalEventHandler = MinecraftServer.getGlobalEventHandler();
globalEventHandler.addListener(PlayerSkinInitEvent.class, event -> {
   PlayerSkin skin = new PlayerSkin(textureValue, signature);
   event.setSkin(skin);
});
```

### Player#setSkin

```java
PlayerSkin skin = new PlayerSkin(textureValue, signature);
player.setSkin(skin);
```
