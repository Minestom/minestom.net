# Instances

## What is an instance

Instances are what replace "worlds" from Minecraft vanilla, those are lightweight and should offer similar properties. There are multiple instances implementation, currently `InstanceContainer` and `SharedInstance` (both are explained below)

All instances can be accessed by using the InstanceManager or by getting an entity instance

```java
InstanceManager instanceManager = MinecraftServer.getInstanceManager()
// Or
Entity#getInstance
```

Internally, the default Instance class have its own sets to store the entities in it, but all chunk based methods are abstract and meant to be implemented by a sub-class

## InstanceContainer

"Container" here means that this is an instance that can store chunks. And as every instance, have its own sets of entities

You can create an `InstanceContainer` by calling:

```java
InstanceContainer instanceContainer = instanceManager.createInstanceContainer();
```

In order to have a valid world generation, you need to specify which `ChunkGenerator` the instance should use, without it no chunk can be generated. (check [here](https://github.com/Minestom/Minestom/wiki/world/generation) to make your own)

```java
instance.setChunkGenerator(YOUR_GENERATOR);
```

## SharedInstance

A `SharedInstance` needs to have an `InstanceContainer` linked to it. The "Shared" means that this is an instance that takes all of its chunks from its parent instance container

What does it mean? That if you break or place a block to the instance container, the shared instance will also reflect the change (same if you place a block using the shared instance methods, changes will be reflected in the instance container and all of its shared instances)

You can create a `SharedInstance` using:

```java
SharedInstance sharedInstance = instanceManager.createSharedInstance(instanceContainer);
```

## Create your own Instance type

You are able to create your own class extending `Instance` and add entities to it.

In this case, the only thing you need to be aware of is that all instances need to be registered manually in the instance manager.

```java
instanceManager.registerInstance(YOUR_CUSTOM_INSTANCE);
```

This method is ONLY required if you instantiate your instance object manually, `InstanceManager#createInstanceContainer` and `InstanceManager#createSharedInstance` already register the instance internally.

