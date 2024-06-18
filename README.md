# [minestom.net](https://minestom.net)

This is the repository for the official Minestom website. Feel free to create PRs for submitting servers, updating documetation, or updating the website in general.

## Submitting a Server

### Requirements

- Must be using Minestom (obviously)
- Must be publicly available for review.

### Submitting a server

1. First, fork the website repository [here](https://github.com/Minestom/minestom.net).
2. Next, add your server markdown file under the `/showcase` directory. To store media, upload it to the `/public/showcase/(server)` directory. Please note that PRs with media too large may get rejected due to hosting constraints. If this is the case, you can use an alternate service such as Dropbox or Imgur to host the images. To use the images, use `![Image Alt](/showcase/(server)/(image)` in your markdown.
3. To add the server to the sidebar, edit `themeConfig.sidebar./showcase`, in `/.vitepress/config.mts`. An example can be seen in the config.
4. Finally, commit, push your changes, and make a pull request!
5. Wait for someone to review the PR and make any changes/updates.
