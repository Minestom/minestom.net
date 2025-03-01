# What is Minestom?

---

> Minestom is an open-source library that enables developers to create their own Minecraft server software, without any code from Mojang.

As Minecraft has evolved, many servers struggle to keep up with new features and work work around outdated legacy systems. Minestom addresses this by offering a clean, minimal starting point, enabling you to take full control of how your server functions.

In practical terms, this means that Minestom doesn’t include built-in vanilla behavior for things like chests, commands, or combat—you have to implement them all yourself. While this might seem like extra work at first, the benefit is a highly customizable and efficient server where you can implement only the features you need, and nothing else.

Minestom is the ideal choice for situations where flexibility and performance are more important than maintaining the out-of-the-box "vanilla" Minecraft experience. In other words: Use Minestom when it takes less time to implement **every missing vanilla feature you want** than remove **every vanilla feature you dont**.

---

### Advantages

- **Total Control**: You have full control over every aspect of your server’s functionality. 
  
- **Performance-Oriented**: Minestom is designed for performance, with a multi-threaded architecture that enables better scalability.

- **NMS Free**: Minestom comes with a modern, clean API that's designed with efficiency and ease of use in mind. No more legacy NMS code.

- **Open-Source**: Minestom is fully open-source, meaning you can inspect the code, contribute to its development, or customize it to meet your specific needs.

### Disadvantages

- **Incompatible with Bukkit/Forge/Sponge Plugins or Mods**: Minestom is not compatible with any existing plugin or mod-based server software such as Bukkit, Forge, Fabric, or Sponge. If you want to use pre-existing plugins or mods, Minestom is not the right choice.

- **No Support for Older Clients**: Minestom does not natively support older Minecraft clients. However, you can use a proxy like ViaBackwards to allow compatibility with older versions.

- **Not Ideal for a Vanilla Experience**: If you're seeking a server that mirrors the standard Minecraft experience closely, Minestom might not be for you. It’s a great tool for creating custom server setups, but it’s not intended for users who want the default, unaltered Minecraft gameplay.

- **Longer Development Time for Playable Servers**: Since Minestom doesn't provide built-in features like inventories or combat, you’ll need to implement these yourself. This means that while you can build exactly what you need, it will take more time to get a fully playable server.

- **Multi-Threading Requires Extra Consideration**: Minestom's multi-threaded design provides excellent performance but requires careful consideration by developers.