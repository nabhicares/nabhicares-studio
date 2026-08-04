import type {
  AboutContent,
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
  const doctors = arr<Record<string, unknown>>(raw.doctors).map((d) => ({
    name: str(d.name, 'Doctor'),
    specialty: str(d.specialty, 'General medicine'),
    bio: str(d.bio) || undefined,
    image: str(d.image) || undefined,
  }));
  return {
    title: str(raw.title, 'Our doctors'),
    body: str(raw.body) || undefined,
    doctors: doctors.length
      ? doctors
      : [
          { name: 'Dr. Asha Patel', specialty: 'Internal medicine' },
          { name: 'Dr. James Okonkwo', specialty: 'Cardiology' },
          { name: 'Dr. Mei Chen', specialty: 'Pediatrics' },
        ],
  };
}

export function normalizeServices(raw: Record<string, unknown>): ServicesContent {
  const rawItems = arr<unknown>(raw.items);
  const items: ServiceItem[] = rawItems.map((item) => {
    if (typeof item === 'string') return { title: item };
    const o = (item ?? {}) as Record<string, unknown>;
    return {
      title: str(o.title, 'Service'),
      description: str(o.description) || undefined,
      icon: str(o.icon) || undefined,
    };
  });
  return {
    title: str(raw.title, 'Our services'),
    body: str(raw.body) || undefined,
    items: items.length
      ? items
      : [
          { title: 'Emergency care', description: '24/7 trauma and urgent care.' },
          { title: 'Diagnostics', description: 'Imaging and lab services.' },
          { title: 'Outpatient clinics', description: 'Specialist consultations.' },
        ],
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
    images: images.length
      ? images
      : [{ src: '' }, { src: '' }, { src: '' }, { src: '' }],
  };
}

export function normalizeFaq(raw: Record<string, unknown>): FaqContent {
  const items = arr<Record<string, unknown>>(raw.items).map((i) => ({
    question: str(i.question, 'Question'),
    answer: str(i.answer, 'Answer coming soon.'),
  }));
  return {
    title: str(raw.title, 'Frequently asked questions'),
    body: str(raw.body) || undefined,
    items: items.length
      ? items
      : [
          { question: 'Do I need an appointment?', answer: 'Walk-ins are welcome; appointments reduce wait time.' },
          { question: 'What insurance do you accept?', answer: 'We work with most major plans — call to confirm yours.' },
          { question: 'Where can I park?', answer: 'Visitor parking is available in Lot B next to the main entrance.' },
        ],
  };
}

export function normalizeTestimonials(raw: Record<string, unknown>): TestimonialsContent {
  const items = arr<Record<string, unknown>>(raw.items).map((i) => ({
    quote: str(i.quote, 'Excellent care from start to finish.'),
    author: str(i.author, 'Patient'),
    role: str(i.role) || undefined,
    image: str(i.image) || undefined,
  }));
  return {
    title: str(raw.title, 'Patient stories'),
    body: str(raw.body) || undefined,
    items: items.length
      ? items
      : [
          { quote: 'The team made a stressful visit feel calm and clear.', author: 'R. Mehta', role: 'Outpatient' },
          { quote: 'Doctors explained every step and followed up after discharge.', author: 'S. Alvarez', role: 'Surgery' },
          { quote: 'Clean facilities and kind staff — we felt looked after.', author: 'K. Singh', role: 'Maternity' },
        ],
  };
}
