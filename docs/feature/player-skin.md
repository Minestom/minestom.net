# Player skin

There are three ways of defining a player skin:

* Setting your player UUID (see [here](player-uuid.md)) to their Mojang UUID, clients by default retrieve the skin based on this value. This is done automatically by `MojangAuth.init()`
* Changing it in the `PlayerSkinInitEvent` event
* Using the method `Player#setSkin(PlayerSkin)`

## How to retrieve skin data from Mojang

### Using PlayerSkin methods

`PlayerSkin` offers some utils methods to retrieve a skin using simple information such as a Mojang UUID or a Minecraft username

```java
PlayerSkin skinFromUUID = PlayerSkin.fromUuid(MOJANG_UUID_AS_STRING);

PlayerSkin skinFromUsername = PlayerSkin.fromUsername("Notch");
```

{% hint style="warning" %}
Those methods make direct requests to the Mojang API, it is recommended to cache the values.
{% endhint %}

### Retrieve texture value & signature manually

Most of what I will say is described here: [https://wiki.vg/Mojang_API#Username\_-.3E_UUID_at_time](https://wiki.vg/Mojang_API#Username\_-.3E_UUID_at_time)

You firstly need to get your Mojang UUID, which can be done by a request based on your username:

```
 GET https://api.mojang.com/users/profiles/minecraft/<username>
```

Then, after getting your UUID:

```
 GET https://sessionserver.mojang.com/session/minecraft/profile/<uuid>?unsigned=false
```

You'll get here both the texture value and the signature. Those values are used to create a `PlayerSkin`.

### PlayerSkinInitEvent

The event is called at the player connection and is used to define the skin to send to the player the first time. It is as simple as

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
