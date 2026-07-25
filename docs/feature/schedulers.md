# Schedulers

A `Scheduler` runs a task later: next tick, after a delay, on a repeat, or once a future completes. Tasks run on the thread that ticks the scheduler, so they can read and modify game state directly.

Resolution is limited by how often the scheduler is processed. One ticked with the server fires at best once every 50ms, at the default 20 ticks per second. See [when to use a JVM executor](#when-to-use-a-jvm-executor) if you need finer timing than that.

## Built-in schedulers

| Scheduler                               | Processed                                  | Use it for                             |
| --------------------------------------- | ------------------------------------------ | -------------------------------------- |
| `MinecraftServer.getSchedulerManager()` | Once per server tick, before anything else | Work not attached to a world or entity |
| `instance.scheduler()`                  | With the instance                          | Logic scoped to one world              |
| `entity.scheduler()`                    | With the entity                            | Logic scoped to one entity             |
| `player.scheduler()`                    | With the player                            | Logic scoped to one player             |
| `Scheduler.newScheduler()`              | Whenever you call `process` yourself       | A scheduler you process yourself       |

`Instance` and `Entity` both implement `Schedulable`, so anything that accepts a `Schedulable` accepts either. `Player` is an `Entity`.

::: warning
An entity is only ticked while it has an instance, has not been removed, and sits in a loaded chunk. Its scheduler stops with it, so tasks on `player.scheduler()` stop when the player disconnects. Use the global scheduler for work that must outlive the entity.
:::

## Scheduling tasks

Every scheduling method returns a `Task`, which reports state and lets you cancel.

```java
Scheduler scheduler = MinecraftServer.getSchedulerManager();

// Once, on the next tick
scheduler.scheduleNextTick(() -> System.out.println("Next tick!"));

// Once, the next time this scheduler is processed, without waiting for a tick boundary
scheduler.scheduleNextProcess(() -> System.out.println("Very soon!"));

// After five seconds, then every second
scheduler.buildTask(() -> System.out.println("Tick!"))
    .delay(TaskSchedule.seconds(5))
    .repeat(TaskSchedule.tick(20))
    .schedule();

// The same thing in one call
scheduler.scheduleTask(runnable, TaskSchedule.seconds(5), TaskSchedule.tick(20));
```

The delay defaults to `TaskSchedule.immediate()` and the repeat to `TaskSchedule.stop()`, so a task with neither runs once, as soon as the scheduler is next processed. Both also accept a `Duration` directly. Whichever you use, the task never runs in the thread that scheduled it, even with no delay: the first run always waits for the owning scheduler.

`Scheduler` also implements `Executor`, where `execute` is a shortcut for `scheduleNextTick`, so any API that takes an `Executor` can run its callback on the tick thread.

## Schedule types

A `TaskSchedule` describes when a task should next run. It is what `delay` and `repeat` take, and what a [self-scheduling task](#tasks-that-schedule-themselves) returns.

| Factory                                 | Runs the task                                     |
| --------------------------------------- | ------------------------------------------------- |
| `nextTick()`                            | On the next tick of the owning scheduler          |
| `tick(int)`                             | After that many ticks of the owning scheduler     |
| `duration(Duration)`                    | After that much wall clock time                   |
| `millis`, `seconds`, `minutes`, `hours` | Shortcuts for `duration`                          |
| `immediate()`                           | The next time the scheduler is processed          |
| `future(CompletableFuture<?>)`          | Once the future completes                         |
| `park()`                                | Never, until something calls `unpark` on the task |
| `stop()`                                | Never again, canceling the task                   |

Tick schedules count ticks of the owning scheduler, so `tick(20)` is one second on the global scheduler but 20 ticks of an entity on that entity's scheduler. Durations are timed on a shared timer thread, but the task still runs on the scheduler's thread at its next processing pass, so delays shorter than a tick round up to that pass.

## Tick start and tick end

Every task runs either at the start or the end of its scheduler's tick, set with `ExecutionType.TICK_START` (the default) or `ExecutionType.TICK_END`. A task at tick end sees the finished state of the tick, such as entity positions after movement has been applied.

```java
// Shortcut for a one-off task at the end of the current tick
scheduler.scheduleEndOfTick(runnable);

scheduler.scheduleNextTick(runnable, ExecutionType.TICK_END);
scheduler.buildTask(runnable).executionType(ExecutionType.TICK_END).schedule();
```

## Tasks that schedule/cancel themselves

`submitTask` is the method every other one is built on. It takes a `Supplier<TaskSchedule>` and reschedules the task with whatever the supplier returns, so each run decides when the next one happens. Returning `TaskSchedule.stop()` cancels it, which is how a task ends itself:

```java
scheduler.submitTask(new Supplier<>() {
    int secondsLeft = 5;

    @Override
    public TaskSchedule get() {
        if (secondsLeft == 0) {
            instance.sendMessage(Component.text("Go!"));
            return TaskSchedule.stop();
        }

        instance.sendMessage(Component.text(secondsLeft-- + "..."));
        return TaskSchedule.seconds(1);
    }
});
```

Returning `TaskSchedule.park()` instead suspends the task with no wake up time. It stays alive and idle until `Task#unpark` is called on it, which queues it for the next processing pass. Use it when a task waits on an external signal rather than on time.

A task built with `buildTask(...).repeat(...)` ignores the return value of its body, since the repeat schedule already decides when it runs next. Those tasks can only be stopped with `cancel`.

::: warning
`submitTask` runs the supplier immediately, in the calling thread, to find out when to schedule it. Every other method defers the first run. If the body touches state that is not safe to touch yet, return `TaskSchedule.nextTick()` on the first pass, or use `buildTask` instead.
:::

## Canceling tasks

```java
Task task = scheduler.scheduleNextTick(() -> System.out.println("Hey!"));
task.cancel();
task.isAlive(); // false
```

`cancel` can be called from any thread, and more than once. A canceled task never runs again, even if it was already queued for this tick. An uncaught exception also stops a task: it is passed to the exception manager and the task is canceled.

## When to use a JVM executor

Minestom's scheduler does not replace `ScheduledExecutorService` or virtual threads. Use those for:

- Timing finer than a tick.
- Blocking work such as database queries, HTTP calls, or file IO, which would stall the tick.
- Work that never touches game state.

There is no asynchronous execution type. Run that work on your own executor and come back to the tick thread with `TaskSchedule.future`, or by passing the scheduler as an `Executor`:

```java
CompletableFuture<Stats> stats = CompletableFuture.supplyAsync(() -> database.load(player.getUuid()));

player.scheduler().buildTask(() -> player.sendMessage(Component.text("Kills: " + stats.join().kills())))
    .delay(TaskSchedule.future(stats))
    .schedule();
```

The lookup runs off the tick thread, and the message is sent from it. For what can be accessed from where, see [thread safety](/docs/thread-architecture/thread-safety).

## Running tasks on shutdown

The global scheduler also holds tasks that run while the server shuts down, after the last tick:

```java
MinecraftServer.getSchedulerManager().buildShutdownTask(() -> database.close());
```

These run once, in the order they were added. An exception in one of them stops the rest from running.