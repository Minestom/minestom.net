---
description: Describes how to add Minestom as a dependency in your project.
---

<script setup>
import axios from "axios";
import { ref, onMounted } from 'vue'

const version = ref("<--version-->");

const fetchVersion = async () => {
  try {
    const response = await axios.get("/api/latest-version");
    const ver = response.data.latestVersion;
    if (ver != null) {
      version.value = ver;
    }
  } catch (error) {
    console.error("Error fetching libraries:", error);
  }
}

onMounted(() => {
  fetchVersion();
});
</script>

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

```groovy-vue
dependencies {
    implementation 'net.minestom:minestom-snapshots:{{ version }}'
}
```

== Gradle (Kotlin)

```kotlin-vue
dependencies {
    implementation("net.minestom:minestom-snapshots:{{version}}")
}
```

== Maven

```xml-vue
<dependencies>
    <!-- ... -->
    <dependency>
        <groupId>net.minestom</groupId>
        <artifactId>minestom-snapshots</artifactId>
        <version>{{version}}</version>
    </dependency>
</dependencies>
```

:::

When using Maven it is recommended to exclude the artifact `shrinkwrap-resolver-depchain` from the group `org.jboss.shrinkwrap.resolver` as otherwise resolving the dependencies will fail. Shrinkwrap can be added as a separate dependency if needed without issues to restore its functionality.

A list of versions can be found at [https://jitpack.io/#Minestom/Minestom](https://jitpack.io/#Minestom/Minestom).
