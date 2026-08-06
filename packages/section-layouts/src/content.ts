import type {
  AboutContent,
  ContactContent,
  DoctorsContent,
  FaqContent,
  GalleryContent,
  GalleryImage,
  HeroContent,
  ServiceItem,
  ServicesContent,
  TestimonialsContent,
} from './types';

function str(v: unknown, fallback = ''): string {
  return typeof v === 'string' ? v : fallback;
}

function arr<T>(v: unknown): T[] {
  return Array.isArray(v) ? (v as T[]) : [];
}

export function normalizeHero(raw: Record<string, unknown>): HeroContent {
  return {
    title: str(raw.title, 'Care close to home'),
    body: str(raw.body, 'Compassionate, modern care for every patient.'),
    ctaPrimary: str(raw.ctaPrimary) || undefined,
    ctaSecondary: str(raw.ctaSecondary) || undefined,
    ctaPrimaryHref: str(raw.ctaPrimaryHref) || undefined,
    ctaSecondaryHref: str(raw.ctaSecondaryHref) || undefined,
    image: str(raw.image) || undefined,
  };
}

export function normalizeAbout(raw: Record<string, unknown>): AboutContent {
  const highlights = arr<Record<string, unknown>>(raw.highlights)
    .map((h) => ({ label: str(h.label, 'Highlight'), text: str(h.text) }))
    .filter((h) => h.text);
  return {
    title: str(raw.title, 'About us'),
    body: str(raw.body, 'We provide compassionate, modern care for every patient.'),
    image: str(raw.image) || undefined,
    highlights: highlights.length ? highlights : undefined,
  };
}

export function normalizeDoctors(raw: Record<string, unknown>): DoctorsContent {
  const doctors = arr<Record<string, unknown>>(raw.doctors)
    .map((d) => ({
      name: str(d.name),
      specialty: str(d.specialty),
      bio: str(d.bio) || undefined,
      image: str(d.image) || undefined,
    }))
    .filter((d) => d.name.trim());
  return {
    title: str(raw.title, 'Our doctors'),
    body: str(raw.body) || undefined,
    doctors,
  };
}

export function normalizeServices(raw: Record<string, unknown>): ServicesContent {
  const rawItems = arr<unknown>(raw.items);
  const items: ServiceItem[] = rawItems
    .map((item) => {
      if (typeof item === 'string') return { title: item };
      const o = (item ?? {}) as Record<string, unknown>;
      return {
        title: str(o.title),
        description: str(o.description) || undefined,
        icon: str(o.icon) || undefined,
      };
    })
    .filter((item) => item.title.trim());
  return {
    title: str(raw.title, 'Our services'),
    body: str(raw.body) || undefined,
    items,
  };
}

export function normalizeGallery(raw: Record<string, unknown>): GalleryContent {
  const fromImages = arr<Record<string, unknown>>(raw.images).map((img) => ({
    src: str(img.src),
    caption: str(img.caption) || undefined,
  }));
  const fromItems = arr<unknown>(raw.items).map((item): GalleryImage => {
    if (typeof item === 'string') return { src: item };
    const o = (item ?? {}) as Record<string, unknown>;
    return { src: str(o.src), caption: str(o.caption) || undefined };
  });
  const images = (fromImages.length ? fromImages : fromItems).filter((i) => i.src);
  return {
    title: str(raw.title, 'Gallery'),
    body: str(raw.body) || undefined,
    images,
  };
}

export function normalizeFaq(raw: Record<string, unknown>): FaqContent {
  const items = arr<Record<string, unknown>>(raw.items)
    .map((i) => ({
      question: str(i.question),
      answer: str(i.answer),
    }))
    .filter((i) => i.question.trim());
  return {
    title: str(raw.title, 'Frequently asked questions'),
    body: str(raw.body) || undefined,
    items,
  };
}

export function normalizeTestimonials(raw: Record<string, unknown>): TestimonialsContent {
  const items = arr<Record<string, unknown>>(raw.items)
    .map((i) => ({
      quote: str(i.quote),
      author: str(i.author),
      role: str(i.role) || undefined,
      image: str(i.image) || undefined,
    }))
    .filter((i) => i.quote.trim());
  return {
    title: str(raw.title, 'Patient stories'),
    body: str(raw.body) || undefined,
    items,
  };
}

export function normalizeContact(raw: Record<string, unknown>): ContactContent {
  const variantRaw = str(raw.variant);
  const variant = variantRaw === 'teaser' ? 'teaser' : 'full';
  return {
    title: str(raw.title, 'Visit us'),
    body: str(raw.body) || undefined,
    phone: str(raw.phone) || undefined,
    email: str(raw.email) || undefined,
    address: str(raw.address) || undefined,
    hours: str(raw.hours) || undefined,
    mapUrl: str(raw.mapUrl) || undefined,
    ctaPrimary: str(raw.ctaPrimary) || undefined,
    variant,
    ctaSecondary: str(raw.ctaSecondary) || undefined,
    ctaSecondaryHref: str(raw.ctaSecondaryHref) || undefined,
  };
}
