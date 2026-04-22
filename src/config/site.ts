export const siteConfig = {
  name: "Velocity Framework",
  shortName: "Velocity",
  domain: "velocityframework.com",
  url: "https://velocityframework.com",
  tagline: "Less Chaos. More Profit. Real Growth.",
  description:
    "The public tools and resource library for Clay Vaughan's Velocity framework — Heart, Heading, Hustle.",
  contactEmail: "clay@velocityframework.com",
  author: {
    name: "Clay Vaughan",
    role: "Founder, Good Agency",
    bookTitle: "Velocity: Less Chaos. More Profit. Real Growth.",
  },
  social: {
    linkedin: "https://linkedin.com/in/clayvaughan",
  },
  /**
   * HubSpot Portal ID. Used for static references and any future HubSpot form
   * embeds (e.g. `//js.hsforms.net/forms/embed/v2.js` + `hbspt.forms.create`).
   * No form GUIDs or Private App Token yet — every <HubSpotFormSlot> remains a
   * placeholder until Abby provides the per-form GUIDs.
   */
  hubspotPortalId: "51279976",
  /**
   * Stripe Payment Link for the FRE Certification Workshop "Secure your seat"
   * button on /workshop. Pre-configured at $5,000 with the EARLYBIRD2026 promo
   * code active. Opens in a new tab — no Stripe.js / Elements integration
   * needed for this flow. (NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is stored as a
   * secret for future embedded checkout work.)
   */
  stripeWorkshopPaymentLink:
    "https://buy.stripe.com/28E5kC8nk8IU4Ixdxc9MY05",
} as const;

export type NavItem = {
  label: string;
  href: string;
};

/** Primary header nav — kept tight on purpose. */
export const primaryNav: NavItem[] = [
  { label: "The Book", href: "/book" },
  { label: "Heart", href: "/heart" },
  { label: "Heading", href: "/heading" },
  { label: "Hustle", href: "/hustle" },
  { label: "Toolbox", href: "/toolbox" },
  { label: "Workshop", href: "/workshop" },
  { label: "About", href: "/about" },
];

/** Secondary nav (footer column). */
export const secondaryNav: NavItem[] = [
  { label: "AI Tools", href: "/AI" },
  { label: "Insights", href: "/insights" },
  { label: "Conference", href: "/conference" },
  { label: "Culture Health Check", href: "/health-survey" },
  { label: "Contact", href: "/contact" },
];

export const legalNav: NavItem[] = [
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
];
