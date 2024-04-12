# Scripting

## Project

Scripts are an alternative to [Extensions](../extensions.md), powerful and short but still with fewer features.

The scripting engine is open-source available [here](https://github.com/ReWrite-Media/MineScript), built on top of [GraalVM Polyglot API](https://www.graalvm.org/reference-manual/embed-languages/), there are multiple supported languages, for now, Javascript & Python.

## Overview

Reddox is a command-based API, the only way to interact with the Minecraft server is to trigger commands and retrieve their data when needed. `Signals` are also available to execute code at specific moments.

```javascript
// 'executor' is a global object, used to execute commands and listen to signals.
executor.run("tellraw Notch Hey");

// Commands can be registered using the command string syntax. 
// Each command gets a callback with the sender and command metadata.
executor.registerCommand("entity Literal<get> Player<target>", (sender, context) => {
    console.log("Retrieving " + context.target);
    // let somePlayer = ...;
    return somePlayer;
});

// Each command can return data, members are specified in documentation.
let player = executor.run("entity get Notch").entity;
console.log("You retrieved the player " + player.username + "!");

// Commands can be aliases for ease of use multiple times or shortening.
// {n} can be used to reference the nth argument during execution.
let getEntity = executor.make("entity get {0}", data => data.entity);
let entity = getEntity("Notch");

// 'signals' are general purpose listenable event,
// they can be game events, called with the '/signal' command,
// or from another script
executor.onSignal("move", (properties) => {
   // Listen to player movement
   // 'properties' contains data specific to the signal
   let player = properties.player
   let username = player.username
   let position = properties.position
   console.log("the player " + username + " moved to " + position)
});

// Signals can also be used to send data
executor.onSignal("my_signal", (properties, output) => {
   output.value = "I am a text"
});

// ... and be retrieved back
let output = executor.signal("my_signal")
console.log("Value: " + output.value) // -> "I am a text"
```

## Setup

All scripts should be available in the scripts/ folder. They can either be contained within a single file or in a folder, the structure is as follow:

```javascript
scripts/
 - randomscript.js // Individual file can have the name you want
 - myscript.js
 - Essentials/ // The folder name will be used in the '/script' command
    - main.js // -> "main.js" is the main file used to initialize the script
    - Config.js
 - WorldGuard/
    - main.js
    - Config.js
    - Regions.js
```

In Java, loading scripts is as simple as calling a single method:

```java
ScriptManager.load();
```

`ScriptManager` contains everything you would need to interacts with scripts, learn more about it [here](wip-java-interoperability.md).
