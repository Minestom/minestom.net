# Schedulers

A `Scheduler` executes a task later. The task can be scheduled for the next tick, after a delay, on a repeat, or once a future completes. Tasks run on the thread that ticks the scheduler, so they can read and modify game state directly.

Resolution is limited by how often the scheduler is processed. A scheduler ticked with the server is processed at most once every 50ms, at the default 20 ticks per second. See [when to use a JVM executor](#when-to-use-a-jvm-executor) if you need finer timing than that.

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
An entity is only ticked while it has an instance, has not been removed, and is in a loaded chunk. The entity's scheduler stops when the entity is removed, so tasks on `player.scheduler()` stop when the player disconnects. Use the global scheduler for work that must continue after the entity is removed.
:::

## Scheduling tasks

Every scheduling method returns a `Task`, whose state can be queried and which can be canceled.

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

The delay defaults to `TaskSchedule.immediate()` and the repeat to `TaskSchedule.stop()`. A task with neither runs once, as soon as the scheduler is next processed. Both also accept a `Duration` directly. Whichever you use, the task does not run in the thread that scheduled it, even with no delay. The first run waits for the owning scheduler.

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

Every task runs either at the start or the end of its scheduler's tick, set with `ExecutionType.TICK_START` (the default) or `ExecutionType.TICK_END`. Tasks at tick end run after the tick's state has been updated, such as entity positions after movement has been applied.

```java
// Shortcut for a one-off task at the end of the current tick
scheduler.scheduleEndOfTick(runnable);

scheduler.scheduleNextTick(runnable, ExecutionType.TICK_END);
scheduler.buildTask(runnable).executionType(ExecutionType.TICK_END).schedule();
```

## Tasks that schedule/cancel themselves

`submitTask` is the method every other one is built on. It takes a `Supplier<TaskSchedule>` and reschedules the task with whatever the supplier returns, so the supplier's return value determines when the task runs next. Returning `TaskSchedule.stop()` cancels the task:

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

Returning `TaskSchedule.park()` instead suspends the task with no wake up time. The task remains scheduled but does not run until `Task#unpark` is called on it, which queues it for the next processing pass. Use it when the next run depends on an external signal rather than on time.

The return value of the body is not used by a task built with `buildTask(...).repeat(...)`, since the repeat schedule already determines when it runs next. Those tasks can only be stopped with `cancel`.

::: warning
`submitTask` calls the supplier immediately on the calling thread to obtain the next schedule. Methods other than `submitTask` defer the first run to the scheduler. If the task needs state that is only safe to access on the tick thread, return `TaskSchedule.nextTick()` from the first call, or use `buildTask`.
:::

## Canceling tasks

```java
Task task = scheduler.scheduleNextTick(() -> System.out.println("Hey!"));
task.cancel();
task.isAlive(); // false
```

`cancel` can be called from any thread and more than once. Once canceled, a task is not run again, even if it was already queued for the current tick. An uncaught exception also stops a task. The exception is passed to the exception manager and the task is canceled.

## When to use a JVM executor

Minestom's scheduler does not replace `ScheduledExecutorService` or virtual threads. Use those for:

- Timing finer than a tick.
- Blocking work such as database queries, HTTP calls, or file IO, which would stall the tick.
- Work that does not touch game state.

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