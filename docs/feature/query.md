---
description: Minestom's implementation of the GameSpy4 protocol.
---

# Query system

## Overview

Just like Vanilla servers, Minestom supports the GameSpy4 protocol server listener. This can be used to obtain information from the server using query software like [https://mcsrvstat.us/](https://mcsrvstat.us/) or Dinnerbone's [mcstatus](https://github.com/Dinnerbone/mcstatus) program.

For more information about the query system, see [https://wiki.vg/Query](https://wiki.vg/Query).

## Setup

To start the query system, simply run one of the `start` methods in the `Query` class. If the query port isn't already open, it will start listening for queries on the specified port.

To stop the query system, you can call the `stop` method.

## Modifying responses

By default, this system will act as close to Vanilla and other server implementation's responses as possible. This includes filling in the plugin system with information about the currently installed extensions.

If you wish to customise the responses, you can listen to the two query events that are called when each response is being created. Both of these events allow you to access the `SocketAddress` of the sender in addition to the session ID that they initiated the request with. This information can be used to identify who is sending a request. Additionally, each event is cancellable, meaning that if you don't want to send a response you can simply cancel the event. This is a powerful system that enables you to keep a query system open for obtaining arbitrary information from your server without letting everybody access the query system.

### Basic queries

The `BasicQueryEvent` is called when the requester is asking for basic information about the server. This event uses the `BasicQueryResponse` class to write a fixed set of data, each of which needs to be filled in so that responses can be parsed correctly.

### Full queries

The `FullQueryEvent` is called when the requester is asking for full information about the server. This event uses the `FullQueryResponse` class to write an arbitrary set of data in a key-value format in addition to a list of online players. There are some keys that should be filled in as standard. These are set by default and can be edited using the `put` method that accepts a `QueryKey`, this being an enum containing the default key-value mappings. Other arbitrary mappings can be inserted using the other `put` method.
