# Resource packs

A `ResourcePackRequest` instructs a client to download and apply one or more packs. The client fetches each URL itself, so the URL must be reachable from the player's machine rather than only from the server.

```java
ResourcePackRequest request = ResourcePackRequest.resourcePackRequest()
        .packs(ResourcePackInfo.resourcePackInfo(id, uri, hash))
        .prompt(Component.text("Please accept the resource pack"))
        .required(true)
        .build();

audience.sendResourcePacks(request);
```

The `id` is a UUID you choose, and identifies the pack in later calls. The `hash` is the hex-encoded SHA-1 of the pack file, which the client compares against its cached copy. An incorrect hash causes the pack to be re-downloaded on every join.

Removing packs uses the same id:

```java
audience.removeResourcePacks(id);
audience.clearResourcePacks();
```

Building the request with `.replace(true)` clears the applied packs before pushing the new ones.

## Required packs

With `.required(true)`, a client that declines or fails to load the pack is kicked. The prompt is still displayed, and its decline button disconnects the player.

## Reacting to the result

A callback receives every status update for the pack. Intermediate statuses such as `ACCEPTED` and `DOWNLOADED` report progress, and one terminal status ends the exchange.

```java
ResourcePackRequest request = ResourcePackRequest.resourcePackRequest()
        .packs(ResourcePackInfo.resourcePackInfo(id, uri, hash))
        .callback((packId, status, audience) -> {
            if (status == ResourcePackStatus.SUCCESSFULLY_LOADED) {
                audience.sendMessage(Component.text("Pack applied"));
            } else if (!status.intermediate()) {
                audience.sendMessage(Component.text("Pack failed: " + status));
            }
        })
        .build();
```

## Sending during configuration

`ResourcePackPushPacket` is valid in the configuration phase, so a pack can be sent from `AsyncPlayerConfigurationEvent`. Configuration does not finish until every pending pack has a terminal status, so the player remains on the connecting screen until the pack is applied.

```java
globalEventHandler.addListener(AsyncPlayerConfigurationEvent.class, event -> {
    event.getPlayer().sendResourcePacks(request);
    event.setSpawningInstance(instance);
});
```