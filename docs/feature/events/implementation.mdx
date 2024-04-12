---
description: Explains how event nodes works under the hood
---

# Implementation

Understanding what happens when an event is called or when a new node is added can help you to make better decisions, especially when desiring great performance.

## Listener handle

A `ListenerHandle` represents a direct access to an event type listeners, they are stored inside the node and must be retrieved for the listeners to be executed

`EventNode#call(Event)` is as simple as retrieving the handle (through a map lookup) and executing `ListenerHandle#call(Event)`. As you may have realize, you could completely avoid the map lookup by directly using the handle, hence why `EventNode#getHandle(Class<Event>)` exists!

Keeping the handle in a field instead of doing map lookups for every event call may also help the JIT to entirely avoid the event object allocation in case where there are no listener.

## Registration

First and foremost, it is important to note that all registration (and methods touching the tree) are synchronized, it is not considered as a huge flaw since event calling is much more important. This however means that you should try to avoid temporary nodes/listeners as much as possible.

## Event calling

Event calling is very simple to understand, it will first check if the listeners inside the handle are up-to-date (if not, loop through all of them to create the consumer) and run the said consumer.

It is the reason why you should avoid adding listeners other than in your server init, because it will invalidate the associated handles.

## Conclusion

The event implementation has been heavily optimized for calling instead of utilities, which seems fair but must be well understood before attacking a high-performance server.

For those interested, the code is available [here](https://github.com/Minestom/Minestom/blob/master/src/main/java/net/minestom/server/event/EventNodeImpl.java).
