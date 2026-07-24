---
description: The kinds of projects Minestom suits, and the ones it does not.
---

# When should I use Minestom?

---

Minecraft has evolved a lot since its release, but many servers today overlook the built-in mechanics in favor of custom gameplay, leading to wasted performance. Our target audience is developers who want to make a server that benefits little from vanilla features, such as minigames or KitPVP.

The goal is to offer more performance to those who need it. In other words, it makes sense to use Minestom when it will take less time implementing every missing feature you want, rather than removing every vanilla feature that will slow you down.

Minestom does not suit every use case, and while our choices make it better for some, they make it worse for others.

## Advantages

- **High performance.** Designed for efficiency, offering high performance with minimal overhead.
- **Lightweight.** Comes with little to no functionality, allowing the server to be easily extended.
- **Modern API.** Written in the latest LTS version of Java, using best practices and standards.
- **Multi-threaded.** Uses a thread pool to manage chunks independently from instances.
- **Instances instead of worlds.** They are cheap to create and discard at runtime, which suits per-match maps far better than loading worlds from disk.
- **No legacy NMS.** Obfuscation is a thing of the past, and the protocol is fully implemented and exposed to developers.

## Disadvantages

- **Traditional plugins and mods do not work.** Nothing written for Bukkit, Spigot, Paper, Forge, or Fabric will run.
- **Unsuitable for a vanilla experience.** Minestom implements almost none of it, so you would be rebuilding survival from scratch.
- **It takes longer to reach something playable.** Minestom is aimed at developers, and writing a server takes real development time.
- **Older clients are not supported.** See [Unsupported Versions](/docs/compatibility/unsupported-versions) for ways around this.
- **A smaller ecosystem.** There are fewer users and third-party libraries than Spigot has.