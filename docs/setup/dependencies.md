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
Minestom needs Java 21 or newer in order to run. If you are using Gradle, you must use version 8.5 or higher.
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

The version string is always the first 10 characters of a commit hash. You can view commits 
[here](https://github.com/Minestom/Minestom/commits/master/).

Minestom PR branches are also published and can be used to preview upcoming features. For such branches, the version
string is `{branch}-{first 10 chars of commit}`. For example, the 1_20_5 branch was usable with the version string
`1_20_5-dd965f4bb8`.
