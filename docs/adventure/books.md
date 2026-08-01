# Books

A `Book` is a title, an author, and a list of pages, each page a `Component`. `Player#openBook` displays one without the player holding or owning a book item:

```java
player.openBook(Book.book(
        Component.text("How to Play"),  // title
        Component.text("Steve"),        // author
        Component.text("Page one"),     // page 1
        Component.text("Page two")      // page 2
));
```

Pages are components, so they can contain colors, hover tooltips, and click events.

::: warning
The title and author are sent as plain strings, so their components are flattened by the plain text serializer and their styling is discarded. Page components are sent unchanged.
:::

## Book items

`openBook` does not create an item. A book item can be built by setting the same data component:

```java
ItemStack book = ItemStack.builder(Material.WRITTEN_BOOK)
        .set(DataComponents.WRITTEN_BOOK_CONTENT, new WrittenBookContent(...))
        .build();
```