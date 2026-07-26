# Localization

A `TranslatableComponent` carries a key instead of text. The vanilla client resolves keys it knows against its own language files, so `Component.translatable("block.minecraft.stone")` requires no server-side configuration.

Keys the client does not know are resolved server-side. Adventure's `GlobalTranslator` does this from a `ResourceBundle` per locale:

```java
ResourceBundle bundle = ResourceBundle.getBundle("messages", Locale.US);
TranslationStore.StringBased<MessageFormat> store = TranslationStore.messageFormat(Key.key("myserver:messages"));
store.registerAll(Locale.US, bundle, true);
GlobalTranslator.translator().addSource(store);

player.sendMessage(Component.translatable("myserver.welcome"));
```

## Automatic translation

Minestom can render every outgoing component against the receiving player's locale. This is disabled by default and controlled by `ServerFlag#AUTOMATIC_COMPONENT_TRANSLATION`, read from the `minestom.automatic-component-translation` system property:

```
-Dminestom.automatic-component-translation=true
```

::: warning
The flag is read once and cannot be changed at runtime. Setting the system property from code has no effect unless it happens before the server is initialized.
:::

When enabled, components in outgoing packets are passed through `MinestomAdventure#COMPONENT_TRANSLATOR`, a `BiFunction<Component, Locale, Component>` defaulting to `GlobalTranslator::render`. Replace it to translate through something other than Adventure's registry:

```java
MinestomAdventure.COMPONENT_TRANSLATOR = (component, locale) -> myTranslator.render(component, locale);
```

Players that have not sent a locale use `MinestomAdventure#getDefaultLocale()`, which is the JVM default until changed:

```java
MinestomAdventure.setDefaultLocale(Locale.US);
```

## Serializing translated text

The plain text, legacy, and ANSI serializers use Minestom's component flattener, which resolves translation keys through `COMPONENT_TRANSLATOR` at the default locale.

::: warning
The flattener only does this when automatic translation is enabled. With the flag off, which is the default, a `TranslatableComponent` contributes nothing at all to the flattened string: not the translation, not the key, not the fallback. Enable the flag, or resolve the component yourself before serializing it.
:::
