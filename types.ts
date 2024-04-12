export type DocsLink = {
  href: string;
  name: string;
};

export type DocsSection = {
  name?: string;
  description?: string;
  links: DocsLink[];
};

export type DocsConfig = {
  sections: DocsSection[];
};
