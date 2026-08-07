export type PrivacyProps = {
  hospitalName: string;
  title: string;
  /** Empty = built-in DPDP intro */
  intro: string;
  formsNote: string;
  rightsNote: string;
  homeHref: string;
  contactPhone?: string;
  contactEmail?: string;
  layoutVersion?: number;
};
