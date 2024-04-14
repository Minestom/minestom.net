# Schedulers

A `Scheduler` is an object able to schedule tasks based on a condition (time, tick rate, future, etc...) with a precision linked to its ticking rate. It is therefore important to remember that Minestom scheduling API does not aim to replace JDK's executor services which should still be used if you do not need our scheduling guarantee (execution in the caller thread, execution based on tick, less overhead).

Those tasks scheduling can be configured using a `TaskSchedule` object, defining when the task is supposed to execute.

```java
Scheduler scheduler = MinecraftServer.getSchedulerManager();
scheduler.scheduleNextTick(() -> System.out.println("Hey!"));
scheduler.submitTask(() -> {
    System.out.println("Running directly and then every second!");
    return TaskSchedule.seconds(1);
});
```

Tasks are by default executed synchronously (in the object ticking thread). Async execution is possible, but you may consider using a third party solution.

Scheduling will give you a `Task` object, giving you an overview of the task state, and allow some modification such as cancelling.

```java
Scheduler scheduler = player.scheduler();
Task task = scheduler.scheduleNextTick(() -> System.out.println("Hey!"));
task.cancel();
```
