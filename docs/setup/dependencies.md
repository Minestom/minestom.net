---
description: Describes how to add Minestom as a dependency in your project.
---

# Dependencies

::: info
Minestom needs Java 21 or newer in order to run. If you are using Gradle, you must use version 8.5 or higher.
:::

Adding Minestom to your Java project is done just like a normal library.

## Repositories

:::tabs
== Gradle (Groovy)

```groovy
repositories {
    mavenCentral()
    maven { url 'https://jitpack.io' }
}
```

== Gradle (Kotlin)

```kotlin
repositories {
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

## Dependencies

:::tabs
== Gradle (Groovy)

```groovy
dependencies {
    implementation 'net.minestom:minestom-snapshots:{{<LatestVersion />}}'
}
```

== Gradle (Kotlin)

```kotlin
dependencies {
    implementation("net.minestom:minestom-snapshots:{{ <LatestVersion /> }}")
}
```

== Maven

```xml-vue
<dependencies>
    <!-- ... -->
    <dependency>
        <groupId>net.minestom</groupId>
        <artifactId>minestom-snapshots</artifactId>
        <version>{{<LatestVersion />}}</version>
    </dependency>
</dependencies>
```

:::
<LatestVersion />

When using Maven it is recommended to exclude the artifact `shrinkwrap-resolver-depchain` from the group `org.jboss.shrinkwrap.resolver` as otherwise resolving the dependencies will fail. Shrinkwrap can be added as a separate dependency if needed without issues to restore its functionality.

A list of versions can be found at [https://jitpack.io/#Minestom/Minestom](https://jitpack.io/#Minestom/Minestom).
