module.exports = {
  siteMetadata: {
    siteUrl: "https://minestom.net",
    title: "Minestom",
  },
  plugins: [
    "gatsby-plugin-advanced-sitemap",
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
    {
      resolve: 'gatsby-plugin-robots-txt',
      options: {
        host: 'https://minestom.net',
        sitemap: 'https://minestom.net/sitemap.xml',
        policy: [{ userAgent: '*', allow: '/' }]
      }
    },
  ],
};
