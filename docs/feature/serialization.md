# Serialization
Minestom provides two systems for serializing data:

- **[Codecs](/docs/feature/serialization/codecs)**: Map-like serialization (JSON, NBT, etc.). Use it for configuration files or data persistence.
- **[Network Buffers](/docs/feature/serialization/network-buffers)**: Binary serialization designed for the Minecraft protocol. Use it when your storage needs to be compact, like block data or packets sent over the network.