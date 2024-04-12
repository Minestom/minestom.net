import { NavbarProps } from "~/components/nav/navbar";
import { FaBrandsGithub, FaBrandsJava, FaBrandsDiscord } from "solid-icons/fa";

const NavbarConfig: Omit<NavbarProps, "logo"> = {
  items: [
    {
      href: "/libraries",
      display: "Libraries",
    },
    {
      href: "/implementations",
      display: "Implementations",
    },
    {
      href: "/docs",
      display: "Docs",
    },
  ],
  socials: [
    {
      tooltip: "JavaDoc",
      href: "https://javadoc.minestom.net",
      display: () => <FaBrandsJava size={22} />,
    },
    {
      tooltip: "GitHub",
      href: "/github",
      display: () => <FaBrandsGithub size={22} />,
    },
    {
      tooltip: "Discord",
      href: "/discord",
      display: () => <FaBrandsDiscord size={22} />,
    },
  ],
};

export { NavbarConfig };
