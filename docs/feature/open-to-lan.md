---
description: Allowing the server to show up in the LAN section of the server list.
---

# Open to LAN

A series of packets sent to a multicast address makes the server appear as a single player world opened to LAN. This will make it show up in the server list of all open Minecraft instances running in your local network below the "_Scanning for games on your local network_" section.

This does **not** actually open the server to anywhere other than your local network and it is **not** a replacement for port forwarding or a proper network setup. It is mainly designed as a fun feature that can be useful during testing if you're spinning up a dynamic amount of servers and don't want to manually connect to each one of them.

## Setup

To start sending the required packets, you can simply run `OpenToLAN.open()` anywhere. This will send the ping every 1.5 seconds and call the `ServerListPingEvent` with the `OPEN_TO_LAN` ping type for each outgoing ping.

To modify how often the event is called and the pings are sent, pass in a `OpenToLANConfig` in the `open` method. `OpenToLANConfig` is a builder-style class for the port and ping delays.

## Modifying the description

The description is set using the `ServerListPingEvent`. For more information on this, see the [server list ping](./motd) page.
