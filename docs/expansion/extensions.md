# Extensions

Summary:

* [Writing your own extension for Minestom](extensions.md#writing-your-own-extension-for-minestom)
* [How extensions are loaded](extensions.md#how-extensions-are-loaded)
* [Dependencies](extensions.md#dependencies)
* [Callback order](extensions.md#callback-order)
* [Extension Isolation](extensions.md#extension-isolation)
* [Testing in a dev environment](extensions.md#testing-in-a-dev-environment)

## Writing your own extension for Minestom

_To test in a dev environment, see last section._

Start by creating a new extension class:

```java
package testextension;

import net.minestom.server.extensions.Extension;

public class TestExtension extends Extension {
    @Override
    public void initialize() {
        System.out.println("Hello from extension!");
    }

    @Override
    public void terminate() {

    }
}
```

Then, create a `extension.json` at the root of the resources folder (`src/main/resources` for instance) and fill it up:

```javascript
{
  "entrypoint": "testextension.TestExtension",
  "name": "TestExtension",
  "version": "1.0.0",
  "dependencies": [
    "DependentExtension",
    "Extension2"
  ],
  "externalDependencies": {
    "repositories": [
      {"name": "Central", "url": "https://repo1.maven.org/maven2/"}
    ],
    "artifacts": [
      "com.squareup:javapoet:1.13.0"
    ]
  }
}
```

* `entrypoint`: Fully qualified name of your extension class
* `name`: Name to use to represent the extension to users. Must match regex `[A-Za-z][_A-Za-z0-9]+`
* `version`: Version of your extension
* `dependencies (optional)`: List of extension names required for this extension to work.
* `externalDependencies (optional)`: List of external libraries used for this extension (see Dependencies)

## How extensions are loaded

This section is purely informational and not required to work on extensions, but it is a good thing to know how extensions are loaded inside Minestom.

#### 1. Discovery

At launch, Minestom inspects the `extensions` folder (resolved from the current working folder) for jar files. For each file found, it then checks if there is an `extension.json` file and attempts to parse it. If the file exists, and parsing succeeds, the extension is considered discovered.

Discovery can also be forced when using `ExtensionManager#loadDynamicExtension(File)` but works the same.

#### 2. Load order generation / Dependency solving

Then, Minestom ensures all required dependencies for the extension are found. For external dependencies, it will download them if necessary. For extension dependencies, it simply checks if they are already loaded, or about to be loaded (because discovered in the current load-cycle).

#### 4. Instanciation and callbacks

The extension is then instanciated from the class provided inside `entrypoint`, and the `preInitialize`, `initialize` and `postInitialize` callbacks are called. (see [Callback order](extensions.md#callback-order) for more information)

## Dependencies

Minestom extensions can have two types of dependencies:

1. Extension dependencies
2. External dependencies

### Extension dependencies

Extensions can require other extensions to be present at runtime in order to be loaded. This is done via the `dependencies` array inside `extension.json`.

Extensions and their dependencies will be loaded in parent-first order: the root extensions of the dependency graph will always be loaded first, then extensions with one dependency, then extensions with two, and so on. If an extension is a dependency of at least two other, it is guaranteed that it will be loaded only once.

### External dependencies

Your extension is free to depend on external libraries. For the moment, only maven-accessible libraries are supported.

To declare external dependencies, use the `externalDependencies` object inside `extension.json`:

```javascript
"externalDependencies": {
    "repositories": [
      {"name": "Central", "url": "https://repo1.maven.org/maven2/"}
    ],
    "artifacts": [
      "com.squareup:javapoet:1.13.0"
    ]
  }
```

* `repositories` is the list of repositories to contact to get the artifacts
  * `name`: Name of the repository, used to recognize the repository inside logs
  * `url`: URL of the repository to contact
* `artifacts` is the list of Maven coordinates from the dependencies you want to use

Minestom will download and cache the libraries inside `extensions/.libs/`, so that it does not require to redownload them at each launch.

## Callback order

During `MinecraftServer#start`, Minestom calls `preInitialize` on all extensions, then `initialize` on all extensions, and finally `postInitialize` on all extensions. Minestom does **NOT** guarantee the loading order of extensions, but it should be deterministic.

## Extension Isolation

All extensions are completely isolated from each other by default, this means that you may not load a class from another dependency (without shading it, which has other concerns). If your extension depends on another, it must be specified in the `extension.json`, and then it will have access to the relevant classes.

Currently, if two extensions depend on the same library they will not share the same instance.

## Testing in a dev environment

You may set the following vm arguments to load an extension from the classes and resources on disk (eg in your build directory), as opposed to a packaged jar file.

* `-Dminestom.extension.indevfolder.classes=<folder to compiled classes of your extension>` Specifies the folder in which compiled classes of your extension are. With a default Gradle setup, `build/classes/java/main/` should work.
* `-Dminestom.extension.indevfolder.resources=<folder to resources of your extension>` Specifies the folder in which resources of your extension are. With a default Gradle setup, `build/resources/main/` should work.
