# AI

## Overview

Entity AI is done by giving an entity an ordered list of goals to do if a condition is validated. Once an action is found, the entity will be affected by it until asked to stop.

For example, a very simple aggressive creature could have:

1. Attack target
2. Walk randomly around
3. Do nothing

Every tick, the entity will find the goal to follow based on its priority. If the entity has a target the first goal will be used, and the rest be ignored.

## Groups

You might find yourself wanting to have multiple goals being executed at the same time. For example, having an entity attacking its target while swimming to avoid dying. This is done by adding multiple `EntityAIGroup` to the entity, each group contains a list of goals to be executed independently. 

## Example

In this example, instances of ZombieCreature will attack nearby players or walk around based on if a player is nearby.

```java
package demo.entity;

import net.minestom.server.entity.ai.EntityAIGroupBuilder;
import net.minestom.server.entity.ai.goal.RandomLookAroundGoal;
import net.minestom.server.entity.type.monster.EntityZombie;
import net.minestom.server.entity.EntityType;

public class ZombieCreature extends EntityCreature {

    public ZombieCreature() {
        super(EntityType.ZOMBIE);
        addAIGroup(
            List.of(
                new MeleeAttackGoal(this, 1.6, 20, TimeUnit.SERVER_TICK), // Attack the target
                new RandomStrollGoal(this, 20) // Walk around
            ),
            List.of(
                new LastEntityDamagerTarget(this, 32), // First target the last entity which attacked you
                new ClosestEntityTarget(this, 32, entity -> entity instanceof Player) // If there is none, target the nearest player
            )
        );
    }
}
```
