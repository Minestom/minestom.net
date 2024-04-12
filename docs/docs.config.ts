import { DocsConfig } from "types";

const Config: DocsConfig = {
  sections: [
    {
      links: [
        {
          name: "Presentation",
          href: "/docs",
        },
      ],
    },
    {
      name: "Setup",
      links: [
        {
          name: "Dependencies",
          href: "/docs/setup/dependencies",
        },
        {
          name: "Your First Server",
          href: "/docs/setup/your-first-server",
        },
      ],
    },
  ],
};

export default Config;
