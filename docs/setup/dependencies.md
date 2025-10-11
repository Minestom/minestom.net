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

:::alert info
Minestom needs Java 25 or newer in order to run. If you are using Gradle, you must use version 9.1 or higher. If you are using IntelliJ IDEA, you must use 2025.2 or higher.
:::

Adding Minestom to your Java project is done just like a normal library.

## Repositories

:::tabs
== Gradle (Groovy)

```groovy
repositories {
    mavenCentral()
}
```

== Gradle (Kotlin)

```kotlin
repositories {
    mavenCentral()
}
```

:::

## Dependencies

:::tabs
== Gradle (Groovy)

```groovy-vue
dependencies {
    implementation 'net.minestom:minestom:{{ version }}'
}
```

== Gradle (Kotlin)

```kotlin-vue
dependencies {
    implementation("net.minestom:minestom:{{version}}")
}
```

== Maven

```xml-vue
<dependencies>
    <!-- ... -->
    <dependency>
        <groupId>net.minestom</groupId>
        <artifactId>minestom</artifactId>
        <version>{{version}}</version>
    </dependency>
</dependencies>
```

:::

The version string for the master branches are always the latest github release name.

Minestom PR branches are also published and can be used to preview upcoming features. You can enable them with

:::tabs

== Gradle (Kotlin)

```kotlin-vue
repositories {
    maven(url = "https://central.sonatype.com/repository/maven-snapshots/") {
        content { // This filtering is optional, but recommended
            includeModule("net.minestom", "minestom")
            includeModule("net.minestom", "testing")
        }
    }
    mavenCentral()
}

dependencies {
    implementation("net.minestom:minestom:<branch>-SNAPSHOT")
    testImplementation("net.minestom:testing:<branch>-SNAPSHOT")
}
```

:::
