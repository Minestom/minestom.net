---
description: Everything you need to know about thread-safe code and how to make it so
---

# Thread safety in the JVM

First of all, this page's goal is to only be an overview of how to achieve thread-safety. The reader will be provided with keywords for further documentation, but the document here should be enough to understand everything that follows.

As for its usage in Minestom, you do not have to remember everything you will read here. But it will teach you good practice and allow you to understand the internals to make better decisions.

## What is thread-safety?

A code is called "thread-safe" if and only if this code can be called from multiple threads without unexpected behavior. Therefore the term does not say anything about performance or design, it is simply a way to denote how the code can be accessed.

## What does it cost?

Transforming a single-threaded code to a multi-threaded one is not as easy as creating multiple threads. The main issue you will encounter is about memory visibility, you can imagine that 2 threads cannot access the same variable in memory at the exact same time without any drawback. Synchronization requires having the thread check if it has the right to access the X method and has therefore a cost, mostly in the order of nano or microseconds, but could lead to an unusable program if too repetitive. Common issues in multithreaded applications are:

1. Race-condition: when the same method is called by two threads at the same time, which generally lead to undebuggable issues
2. Deadlock: when two locks are waiting for each other, meaning that those will never be freed

## What to use?

A lot of tools/features exist to make developing thread-safe and efficient code easier.

### Fields

Fields need to have some sort of synchronization mechanism. The JVM comes with the `volatile` access flag which forces the field to be always on the main memory instead of in the cache (with some other details that I will not describe) so every thread reads the value from the exact same place. Depending on your application, a `ThreadLocal<T>` object could be enough, you could think of it as a `Map<Thread, T>` where Thread is always the current thread. The easiest way to make a field thread-safe is to make it immutable with the `final` keyword, if you cannot change a field, you do not risk multiple threads to change it at the same time.

{% hint style="warning" %}
Making a field thread-safe does not mean that the object itself is. But only that accessing the field will always return you the correct instance.
{% endhint %}

### Methods

Additionally to the fields, you need to way to manage your flow control so two methods are not called at the exact time which is likely to break every non-thread-safe program (race-condition). Thread synchronization happens thanks to the help of locks, those are mechanisms that will make the current thread waits until someone tells him that he can now open the door and close behind him.

The JVM is again here to the rescue with the `synchronized` flag or the low-level `Object#wait/notify()` methods. There are also higher-level tools such as `CountDownLatch`, `Phaser`, and even some handy safe collections to replace your non-thread-safe ones! `ConcurrentHashMap`, `CopyOnWriteArrayList`, `ConcurrentLinkedQueue`, and a lot of other ones available in your [JDK](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/util/concurrent/package-summary.html).
