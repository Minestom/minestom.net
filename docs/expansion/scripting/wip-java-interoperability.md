# WIP Java Interoperability

All scripts features are available through the `ScriptManager` class

```java
// Called on startup to find all scripts and load them
ScriptManager.load();
// Retrieve all currently loaded scripts
ScriptManager.getScripts();
// Unload all scripts
ScriptManager.shutdown()
// Reload scripts
ScriptManager.reload();
// Change the permission to executor MineScript commands
ScriptManager.setCommandPermission(player -> player.getGameMode()==GameMode.CREATIVE);
// Access the features API
ScriptManager.API;
```

`ScriptManager#API` gives you access to all the scripting components (directly linked to commands, eg region), and also `ScriptAPI#getExecutor` giving you the methods needed to run commands & signals.
