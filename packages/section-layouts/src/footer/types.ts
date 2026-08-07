import type { ReactElement } from 'react';

export type FooterNavLink = { slug: string; label: string; href: string };

export type FooterContact = {
  phone?: string;
  phoneHref?: string;
  email?: string;
  address?: string;
  hours?: string;
  directionsHref?: string;
};

export type FooterProps = {
  hospitalName: string;
  year: number;
  privacyHref: string;
  pages: FooterNavLink[];
  contact: FooterContact;
  tagline?: string;
};

export type FooterLayoutComponent = (props: FooterProps) => ReactElement;
