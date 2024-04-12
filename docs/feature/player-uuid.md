# Player UUID

As UUID implies, it has to be a unique identifier. By default, this identifier is generated randomly at the connection so unique but not persistent.

What you normally want is a unique identifier that will stay the same even after a disconnection or a server shutdown, which could be obtained by getting the Mojang UUID of the player using their API, or having your custom UUID linked to the registration system on your website, we do not implement that by default so you are free to choose what you prefer.

Here how to register your own UUID provider:

```java
connectionManager.setUuidProvider((playerConnection, username) -> {
   // This method will be called at players connection to set their UUID
   return UUID.randomUUID(); /* Set here your custom UUID registration system */
});
```

{% hint style="info" %}
The UUID provider is unnecessary and will not work if you have IP forwarding enabled (Velocity/Bungee)
{% endhint %}
