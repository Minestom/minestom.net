---
description: How to add Minestom as a dependency in your project.
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

::: note
Minestom requires Java 25 or newer. Gradle users need 9.1 or higher, and IntelliJ IDEA users need 2025.2 or higher.
:::

Minestom is published to Maven Central, so you add it the same way as any other Java library.

:::tabs
== Gradle (Kotlin)

```kotlin-vue
repositories {
    mavenCentral()
}

dependencies {
    implementation("net.minestom:minestom:{{version}}")
}
```

== Gradle (Groovy)

```groovy-vue
repositories {
    mavenCentral()
}

dependencies {
    implementation 'net.minestom:minestom:{{ version }}'
}
```

== Maven

```xml-vue
<dependencies>
    <dependency>
        <groupId>net.minestom</groupId>
        <artifactId>minestom</artifactId>
        <version>{{version}}</version>
    </dependency>
</dependencies>
```

:::

Release versions are named after the matching GitHub release. A `net.minestom:testing` artifact is published alongside each release, which provides helpers for integration testing your server.

## Snapshots

Some pull request branches are published as snapshots, so you can try upcoming features before they are released. The version is `<branch>-SNAPSHOT`, and the master branch is published as `master-SNAPSHOT`.

:::tabs
== Gradle (Kotlin)

```kotlin
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
    implementation("net.minestom:minestom:master-SNAPSHOT")
    testImplementation("net.minestom:testing:master-SNAPSHOT")
}
```

== Gradle (Groovy)

```groovy
repositories {
    maven {
        url = 'https://central.sonatype.com/repository/maven-snapshots/'
        content { // This filtering is optional, but recommended
            includeModule('net.minestom', 'minestom')
            includeModule('net.minestom', 'testing')
        }
    }

    mavenCentral()
}

dependencies {
    implementation 'net.minestom:minestom:master-SNAPSHOT'
    testImplementation 'net.minestom:testing:master-SNAPSHOT'
}
```

== Maven

```xml
<repositories>
    <repository>
        <id>central-snapshots</id>
        <url>https://central.sonatype.com/repository/maven-snapshots/</url>
        <releases>
            <enabled>false</enabled>
        </releases>
        <snapshots>
            <enabled>true</enabled>
        </snapshots>
    </repository>
</repositories>

<dependencies>
    <dependency>
        <groupId>net.minestom</groupId>
        <artifactId>minestom</artifactId>
        <version>master-SNAPSHOT</version>
    </dependency>
    <dependency>
        <groupId>net.minestom</groupId>
        <artifactId>testing</artifactId>
        <version>master-SNAPSHOT</version>
        <scope>test</scope>
    </dependency>
</dependencies>
```

:::
