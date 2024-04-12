# GLFWMapRendering

_**This article requires being comfortable with**_ [_**Map Rendering**_](./)

_Access to GLFW capable framebuffers requires using LWJGL, and Minestom LWJGL-related code. For more information, see_ [_Minestom LWJGL Example_](https://github.com/Minestom/LWJGL-Example)

_GLFW capable framebuffers require access to an API supported by GLFW: OpenGL, OpenGL ES, Vulkan, or EGL. Software-based drivers **should** work out-of-box but no guarantee._

_These framebuffers can require conversion from RGB to MapColors, but options are provided to accelerate the process, see the end of the article (Color Mapping)._

GLFW (and its LWJGL bindings) provide access to a window onto which a program can render. By making the window invisible, it is possible to render to an offscreen buffer, grab its contents and send it as a map.

Which means you can use OpenGL to render onto maps! ![Partially-textured 3D block on a 4x4 wall map.](https://cdn.discordapp.com/attachments/706186241288306798/742862333046554624/2020-08-11\_23.47.49.png)

## Setup

Start by creating a `GLFWFramebuffer` or a `LargeGLFWFramebuffer`.

```java
LargeGLFWFramebuffer framebuffer = new LargeGLFWFramebuffer(512, 512); // set up a 512x512 framebuffer
```

You must be aware that this creates a new GLFW context and a new window. It is possible to change the used API via an overloaded constructor in both `GLFWFramebuffer` and `LargeGLFWFramebuffer`. It defaults to OpenGL, and creation via native API (OSMesa is an option via LWJGL).

### Instantaneous rendering

_This type of rendering should be done if you plan on rarely updating the map._

Start by calling `GLFWCapableBuffer#changeRenderingThreadToCurrent()` to bind the rendering context to the current thread. Then call `GLFWCapableBuffer#render(Runnable)` to render your content. This will call the `Runnable` argument, swap the invisible window buffer, extract the framebuffer pixels and convert to map colors. The map colors are available via `Framebuffer#toMapColors()` if you do not use `Framebuffer#preparePacket`. Using `render` is highly recommended to ensure Minestom grab the contents of the framebuffer and converts the pixels to map colors.

### Continuous rendering

In the case that you want to render continuously, it is advised to use `setupRenderLoop(long period, TimeUnit unit, Runnable renderCode)`.

* `period` is a long, representing the period between two render calls. Expressed in `unit` units.
* `unit` unit in which the period is expressed
* `renderCode` your render code.

This sets up a repeating task through the SchedulerManager to automatically render contents every `period`. It also binds to the correct thread before rendering for the first time.

## Color mapping

Maps do not use RGB, but an index into a color palette. By default, Minestom will convert the RGB pixels from the framebuffer on the CPU after each rendering. While this works and gives appreciable results, this conversion is not done in parallel, and the higher the resolution, the longer it takes.

Although Graphics2D framebuffers are not able to accelerate this process, GLFW capable buffers provide a way to quickly convert. There are two ways of doing this conversion.

### Manual conversion

Calling `GLFWCapableBuffer#useMapColors()` will tell the framebuffer that you are not rendering with RGB directly, but with map colors. The map color is in this case encoded in the RED channel of the framebuffer. When grabbing the pixels from the framebuffer for processing, Minestom will only query the red channel and interpret the red intensity as the index inside the color palette. If you want to use this mode manually, you can always convert a color index to a color intensity by simply dividing the index by `255f`.

### Automatic/Post-processing conversion

_Requires to use OpenGL or OpenGL-ES that understand OpenGL calls_

_You probably need modern OpenGL code for this to work, but you should be using modern OpenGL code in $currentYear anyway._

Adapting existing code, or thinking in map colors is not particularly convenient for complex/big/massive projects. For this reason, Minestom provides a post-processing shader that automatically converts from RGB to map colors for you. Enter `MapColorRenderer`.

Example code to set it up:

```java
LargeGLFWFramebuffer glfwFramebuffer = new LargeGLFWFramebuffer(512, 512);
glfwFramebuffer.changeRenderingThreadToCurrent(); // required for OpenGL resource creation
// init your rendering (order with MapColorRenderer not important)
MapColorRenderer renderer = new MapColorRenderer(glfwFramebuffer, YOUR_RENDER_RUNNABLE);
glfwFramebuffer.unbindContextFromThread();

glfwFramebuffer.setupRenderLoop(15, TimeUnit.MILLISECOND, renderer); // by replacing your rendercode with renderer, the conversion will be automatic.
```

As you can see, this requires only one more line to initialize the map color auto-conversion and modifying one line to use it.

Required files for this to work (all inside classpath, src/_something_/resources during dev). All already inside Minestom LWJGL code:

* `/shaders/mapcolorconvert.vertex.glsl` a simple vertex shader to render a full-screen quad
* `/shaders/mapcolorconvert.fragment.glsl` fragment shader responsible for converting RGB to map colors
* `/textures/palette.png` the color palette used by maps. Can be autogenerated via `net.minestom.server.map.PaletteGenerator`, outputs to `src/lwjgl/resources/textures/palette.png`.

This renderer works by rendering your content inside an OpenGL framebuffer for more control over the framebuffer format. By default, RGBA color texture, Depth 24 bits, and Stencil 8 bits render buffer), and then rendering a full-screen quad (with texture unit 0 containing your color result and texture unit 1 containing the palette) with the `mapcolorconvert` shader.
