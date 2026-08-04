export type SiteSection = {
  id: string;
  type: string;
  /** Template.version — layout variant 1–10 */
  layoutVersion: number;
  order: number;
  content: Record<string, unknown>;
};

export type SitePage = {
  slug: string;
  sections: SiteSection[];
};

export type SiteData = {
  hospitalId: string;
  hospitalName: string;
  hospitalSlug: string;
  seoTitle?: string | null;
  seoDescription?: string | null;
  pages: SitePage[];
};
