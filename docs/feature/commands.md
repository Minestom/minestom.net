# Commands

Commands are the main communication between the server and the players. In contrary to current alternatives, Minestom takes full advantage of auto-completion/suggestion and has therefore a fairly strict API.

## Overview

All auto-completable commands should extend `Command`, each command is composed of zero or multiple syntaxes, and each syntax is composed of one or more arguments.

If you find it confusing, here are a few examples:

```java
/health // This is a command
/health set 50; // This is a command and its syntax
set // This is a literal argument
~ ~ ~ // This is a position argument  
```

## Create your first command

First of all, create your command class!

```java
package demo.commands;

import net.minestom.server.command.builder.Command;

public class TestCommand extends Command {

    public TestCommand() {
        super("my-command", "hey");
        // "my-command" is the main name of the command
        // "hey" is an alias, you can have an unlimited number of those
    }
}
```

After this is done, you need to register the command.

```java
MinecraftServer.getCommandManager().register(new TestCommand());
```

Nothing crazy so far, let's create a callback once the command is run without any argument and another for our custom syntax.

```java
package demo.commands;

import net.minestom.server.command.builder.Command;
import net.minestom.server.command.builder.arguments.ArgumentType;

public class TestCommand extends Command {

    public TestCommand() {
        super("command", "alias");

        // Executed if no other executor can be used
        setDefaultExecutor((sender, context) -> {
            sender.sendMessage("You executed the command");
        });

        // All default arguments are available in the ArgumentType class
        // Each argument has an identifier which should be unique. It is used internally to create the nodes
        var numberArgument = ArgumentType.Integer("my-number");

        // Finally, create the syntax with the callback, and an infinite number of arguments
        addSyntax((sender, context) -> {
            final int number = context.get(numberArgument);
            sender.sendMessage("You typed the number " + number);
        }, numberArgument);

    }
}
```

![The command in action](../.gitbook/assets/screenshot-2021-02-12-at-04.57.33.png)

## Argument callback

Let's say you have the command "/set \<number>" and the player types "/set text", you would probably like to warn the player that the argument requires a number and not text. This is where argument callbacks come in!

When the command parser detects a wrongly typed argument, it will first check if the given argument has an error callback to execute, if not, the default executor is used.

Here an example checking the correctness of an integer argument:

```java
package demo.commands;

import net.minestom.server.command.builder.Command;
import net.minestom.server.command.builder.arguments.ArgumentType;

public class TestCommand extends Command {

    public TestCommand() {
        super("command");

        setDefaultExecutor((sender, context) -> {
            sender.sendMessage("Usage: /command <number>");
        });

        var numberArgument = ArgumentType.Integer("my-number");

        // Callback executed if the argument has been wrongly used
        numberArgument.setCallback((sender, exception) -> {
            final String input = exception.getInput();
            sender.sendMessage("The number " + input + " is invalid!");
        });

        addSyntax((sender, context) -> {
            final int number = context.get(numberArgument);
            sender.sendMessage("You typed the number " + number);
        }, numberArgument);

    }
}
```

![Argument callback detecting an invalid number](../.gitbook/assets/screenshot-2021-02-12-at-05.27.21.png)

## Command data

One of the very important features of the command API is the fact that every syntax can return optional data. This data is presented in a structure similar to a Map (in fact, it is only a small wrapper around it).

```java
addSyntax((sender, context) -> {
    final int number = context.get("number");
    sender.sendMessage("You typed the number " + number);

    // Put the argument data into the returned command data
    context.setReturnData(new CommandData().set("value", number));
}, Integer("number"));
```

The data will be created and returned every time the syntax is called. It can then be retrieved from the `CommandResult`. `CommandManager#executeServerCommand(String)` allows you to execute a command as a `ServerSender` (which has the benefit of not printing anything on `CommandSender#sendMessage(String)`, and permit to differentiate this sender from a player or the console).

```java
CommandResult result = MinecraftServer.getCommandManager().executeServerCommand("command 5");
if (result.getType() == CommandResult.Type.SUCCESS) {
    final CommandData data = result.getCommandData();
    if (data != null && data.has("value")) {
        System.out.println("The command gave us the value " + data.get("value"));
    } else {
        System.out.println("The command didn't give us any value!");
    }
} else {
    System.out.println("The command didn't work out!");
}
```

This tool opens a lot of possibilities, including powerful scripts, remote calls, and an overall easy-to-use interface for all your APIs.
