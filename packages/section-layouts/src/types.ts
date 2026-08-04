import type { ReactElement } from 'react';

export type HeroContent = {
  title: string;
  body: string;
  ctaPrimary?: string;
  ctaSecondary?: string;
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
};

export type TestimonialsContent = {
  title: string;
  body?: string;
  items?: TestimonialItem[];
};

export type SectionContent =
  | HeroContent
  | AboutContent
  | DoctorsContent
  | ServicesContent
  | GalleryContent
  | FaqContent
  | TestimonialsContent;

export type LayoutProps = { content: Record<string, unknown> };

export type LayoutComponent = (props: LayoutProps) => ReactElement;
