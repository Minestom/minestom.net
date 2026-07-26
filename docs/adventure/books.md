# Books

A `Book` is a title, an author, and a list of pages, each page a `Component`. `Player#openBook` displays one without the player holding or owning a book item:

```java
player.openBook(Book.book(
        Component.text("Field Guide"),
        Component.text("Server Staff"),
        Component.text("Page one"),
        Component.text("Page two")
));
```

Pages are components, so they can contain colors, hover tooltips, and click events.

Minestom displays the book by writing a `WRITTEN_BOOK_CONTENT` item into the player's offhand, sending the open packet, then restoring the original item. Any open inventory is closed first. The player's offhand item is unchanged afterwards.

::: warning
The title and author are sent as plain strings, so their components are flattened by the plain text serializer and their styling is discarded. Page components are sent unchanged.
:::

## Book items

`openBook` does not create an item. A book item is built by setting the same data component:

```java
ItemStack book = ItemStack.builder(Material.WRITTEN_BOOK)
        .set(DataComponents.WRITTEN_BOOK_CONTENT, new WrittenBookContent(
                "Field Guide",
                "Server Staff",
                List.of(Component.text("Page one"), Component.text("Page two"))
        ))
        .build();
```

The longer constructor also takes a generation and a `resolved` flag marking the pages as already processed. Generation runs `0` to `3`: original, copy, copy of a copy, and tattered. Minestom does not validate it, so a value outside that range reaches the client.

A book holds at most 100 pages.
