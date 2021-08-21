module.exports = {
  siteMetadata: {
    siteUrl: "https://minestom.net",
    title: "Minestom",
  },
  plugins: [
    "gatsby-plugin-sass",
    "gatsby-plugin-mdx",
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "pages",
        path: "./src/pages/",
      },
      __key: "pages",
    },
  ],
};
