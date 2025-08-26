# Player UUID

As UUID implies, it has to be a unique identifier. By default, this identifier is generated randomly at the connection so unique but not persistent.

What you normally want is a unique identifier that will stay the same even after a disconnection or a server shutdown, which could be obtained by getting the Mojang UUID of the player using their API, or having your custom UUID linked to the registration system on your website, we do not implement that by default, so you are free to choose what you prefer.

To change a player's UUID:

```java
MinecraftServer.getConnectionManager().setPlayerProvider((connection, gameProfile) -> {
    // This method will be called at players connection to change the player's provider
    return new Player(connection, new GameProfile(UUID.randomUUID() /* Set here your custom UUID registration system */, gameProfile.name(), gameProfile.properties()));
});
```

## Custom Player class

Setting the Player Provider allows you to create a custom `Player` class, this is useful if you want to override default behaviour.

For example:

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

:::alert warning
The UUID provider is unnecessary and will not work if you have IP forwarding enabled (Velocity/Bungee)
:::

## Enabling Mojang Authentication

If you want to enable Mojang authentication after the server has been started, you can use the following code:
Enabling Mojang Authentication will validate the session token, set the player's skin, and provide a "trusted" UUID.
You can enable this by passing `new Auth.Online()` to `MinecraftServer#init()`.

```java
public static void main(String[] args) {

    // new Auth.Online() enables mojang auth
    MinecraftServer minecraftServer = MinecraftServer.init(new Auth.Online());

    minecraftServer.start("0.0.0.0", 25565);
}
```
