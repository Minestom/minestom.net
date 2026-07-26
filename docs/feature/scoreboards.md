# Scoreboards

A `Sidebar` displays up to 15 lines on the right side of the player's screen. It is created with a title:

```java
Sidebar#<init>(Component /* title */);
```

The title is sent as a full component, so colors, hover and click events, and translations all work. See [Text components](/docs/adventure/components) for how they are built.

Once created, a sidebar can be added to and removed from players:

```java
Sidebar#addViewer(Player);
Sidebar#removeViewer(Player);
```

## Lines

Lines are `Sidebar.ScoreboardLine`s. They are ordered by score, highest at the top. Lines with equal scores fall back to creation order, with the first created appearing first; their content has no effect on position.

```java
Sidebar.ScoreboardLine#<init>(String /* unique id */, Component /* content */, int /* line */);

// For example
Sidebar.ScoreboardLine line = new Sidebar.ScoreboardLine(
        "some_line_0",
        Component.text("Hello, Sidebar!", NamedTextColor.RED),
        0
);
```

Lines are added with `createLine` and indexed by their unique id:

```java
Sidebar#createLine(Sidebar.ScoreboardLine);

Sidebar#getLine(String /* unique id */);
Sidebar#updateLineContent(String /* unique id */, Component /* new content */);
Sidebar#updateLineScore(String /* unique id */, int /* new score */);
```
