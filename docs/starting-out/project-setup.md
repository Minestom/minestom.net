---
description: Describes how to set up a Minestom project.
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

# Project Setup

## Adding the dependency

Minestom is available on Maven Central.
Get it by enabling Maven Central (on Gradle) and adding a version to your dependencies.

:::tabs

== Gradle (Groovy)

```groovy-vue
repositories {
    mavenCentral()
}
dependencies {
    implementation 'net.minestom:minestom-snapshots:{{ version }}'
}
```

== Gradle (Kotlin)

```kotlin-vue
repositories {
    mavenCentral()
}
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

## Setting up shading

For Gradle users, we will use [the "Shadow" plugin](https://imperceptiblethoughts.com/shadow/introduction/) to include Minestom in the JAR file.

 For Maven users, you will need [the "Shade" plugin](https://maven.apache.org/plugins/maven-shade-plugin/). If you use Maven and would like to contribute an example
it would be appreciated :)

::: warning
As of the time writing this, the original shadow plugin from johnrengelman has not been updated for Java 21 support, so we'll use a fork in this example.
:::

:::tabs

== Gradle (Groovy)

```groovy
plugins {
    id "io.github.goooler.shadow" version "8.1.7"
}
```

== Gradle (Kotlin)

```kts
plugins {
    id("io.github.goooler.shadow") version "8.1.7"
}
```

:::

## Finishing the configuration

Finally, to create a runnable JAR, set your main class to be run.

With all of this done, all we need to do is run the `shadowJar` task to create a working uber (fat) jar! (The jar will be put in `/build/libs/` by default)

Below is a complete `build.gradle`/`build.gradle.kts` file

:::tabs

== Gradle (Groovy)

```groovy
plugins {
    id 'java'
    id "io.github.goooler.shadow" version "8.1.7"
}

group 'org.example'
version '1.0-SNAPSHOT'

repositories {
    mavenCentral()
}

dependencies {
    // Change this to the latest version
    implementation 'net.minestom:minestom-snapshots:<version>'
}

jar {
    manifest {
        // Change this to your main class
        attributes 'Main-Class': 'org.example.Main'
    }
}
```

== Gradle (Kotlin)

```kts
plugins {
    id("java")
    // If you need Kotlin support, use the kotlin("jvm") plugin
    id("io.github.goooler.shadow") version "8.1.7"
}

group = "org.example"
version = "1.0-SNAPSHOT"

repositories {
    mavenCentral()
}

dependencies {
    // Change this to the latest version
    implementation("net.minestom:minestom-snapshots:<version>")
}

tasks.withType<Jar> {
    manifest {
        // Change this to your main class
        attributes["Main-Class"] = "org.example.Main"
    }
}
```

:::