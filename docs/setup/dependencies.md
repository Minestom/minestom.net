---
description: Describes how to add Minestom as a dependency in your project.
---

# Dependencies

::: info
Minestom needs Java 21 or newer in order to run. If you are using Gradle, you must use version 7.2 or higher.
:::

Adding Minestom to your Java project is really simple, you only need to add a few repositories:

## Repositories

:::tabs
== Gradle (Groovy)

```groovy
repositories {
    // ...
    mavenCentral()
    maven { url 'https://jitpack.io' }
}
```

== Gradle (Kotlin)

```kotlin
repositories {
    // ...
    mavenCentral()
    maven(url = "https://jitpack.io")
}
```

== Maven

```xml
<repositories>
    <!-- ... -->
    <repository>
        <id>jitpack</id>
        <url>https://jitpack.io</url>
    </repository>
</repositories>
```

:::

When using Maven it is recommended to exclude the artifact `shrinkwrap-resolver-depchain` from the group `org.jboss.shrinkwrap.resolver` as otherwise resolving the dependencies will fail. Shrinkwrap can be added as a separate dependency if needed without issues to restore its functionality.

A list of versions can be found at [https://jitpack.io/#Minestom/Minestom](https://jitpack.io/#Minestom/Minestom).
