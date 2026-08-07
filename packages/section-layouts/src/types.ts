import type { ReactElement } from 'react';

export type SiteLinks = {
  home?: string;
  contact?: string;
  doctors?: string;
  services?: string;
};

export type HeroContent = {
  title: string;
  body: string;
  ctaPrimary?: string;
  ctaSecondary?: string;
  ctaPrimaryHref?: string;
  ctaSecondaryHref?: string;
  image?: string;
};

export type AboutHighlight = { label: string; text: string };

export type AboutContent = {
  title: string;
  body: string;
  image?: string;
  highlights?: AboutHighlight[];
};

export type DoctorItem = {
  name: string;
  specialty: string;
  bio?: string;
  image?: string;
};

export type DoctorsContent = {
  title: string;
  body?: string;
  doctors?: DoctorItem[];
};

export type ServiceItem = {
  title: string;
  description?: string;
  icon?: string;
};

export type ServicesContent = {
  title: string;
  body?: string;
  items?: ServiceItem[] | string[];
};

export type GalleryImage = {
  src: string;
  caption?: string;
};

export type GalleryContent = {
  title: string;
  body?: string;
  images?: GalleryImage[];
  /** Studio may store URLs as string[] under items */
  items?: string[] | GalleryImage[];
};

export type FaqItem = {
  question: string;
  answer: string;
};

export type FaqContent = {
  title: string;
  body?: string;
  items?: FaqItem[];
};

export type TestimonialItem = {
  quote: string;
  author: string;
  role?: string;
  image?: string;
  /**
   * Optional patient rating (0–5).
   * Gemini import / Studio paste may provide it as a string; normalization parses it.
   */
  rating?: number;
};

export type TestimonialsContent = {
  title: string;
  body?: string;
  items?: TestimonialItem[];
};

export type ContactContent = {
  title: string;
  body?: string;
  phone?: string;
  email?: string;
  address?: string;
  hours?: string;
  mapUrl?: string;
  ctaPrimary?: string;
  /** Teaser on home; full detail lives on /contact */
  variant?: 'full' | 'teaser';
  ctaSecondary?: string;
  ctaSecondaryHref?: string;
};

export type MapContent = {
  title: string;
  body?: string;
  mapUrl?: string;
  address?: string;
};

export type AppointmentsContent = {
  title: string;
  body?: string;
  successMessage?: string;
  submitLabel?: string;
};

export type SectionContent =
  | HeroContent
  | AboutContent
  | DoctorsContent
  | ServicesContent
  | GalleryContent
  | FaqContent
  | TestimonialsContent
  | ContactContent
  | MapContent
  | AppointmentsContent;

export type LayoutProps = {
  content: Record<string, unknown>;
  siteLinks?: SiteLinks;
  /** Hospital slug — used by appointment forms to POST to Studio public API */
  hospitalSlug?: string;
  /** Studio origin for live forms, e.g. https://studio.example.com */
  studioApiUrl?: string;
};

export type LayoutComponent = (props: LayoutProps) => ReactElement;
