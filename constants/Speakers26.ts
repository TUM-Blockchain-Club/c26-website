import type {
  ProfilePicture,
  Speaker,
} from "@/components/service/contentStrapi";

const profilePhoto = (url: string): ProfilePicture =>
  ({
    url,
  }) as ProfilePicture;

/**
 * This year's confirmed speakers. Name, role, company and photo come from each
 * speaker's own submission in the Tally form ("C'26 Speaker Information
 * Submission"); the photos are the files they uploaded, square-cropped and
 * scaled to 800px, nothing else changed.
 *
 * The profile links were checked one by one against the person's employer page
 * or an independently indexed profile, because three of the submitted links
 * did not work: one had text pasted in front of it, and two pointed at a
 * vanity URL that no source outside the form associates with that person.
 * Where a link here differs from the form, the reason is in a comment on the
 * entry.
 *
 * Academic titles: each of the fourteen was checked for a doctorate against
 * their employer page and public profiles. Only Dr. Hagen Weiss holds one, and
 * it is in his name here. Notably not doctors: Alireza Siadat (M.J.I. per
 * Deloitte Legal), Marie Christin Rinke (M.Sc. per her firm) and Christoph
 * Jentzsch, who left his physics PhD for Ethereum. If someone earns or starts
 * using a title later, add it to `name`.
 */
export const speakers26: Speaker[] = [
  {
    id: 1,
    documentId: "c26-alireza-siadat",
    name: "Alireza Siadat",
    position: "Lead Blockchain & Digital Assets EMEA",
    company_name: "Deloitte Legal",
    // Confirmed: Deloitte Legal's own profile page links this one.
    url: "https://www.linkedin.com/in/alireza-siadat/",
    priority: 1,
    createdAt: "",
    updatedAt: "",
    publishedAt: "",
    profile_photo: profilePhoto("/speakers26/alireza-siadat.jpg"),
  },
  {
    id: 2,
    documentId: "c26-christian-million",
    name: "Christian Million",
    position: "Managing Partner",
    company_name: "Convista Consulting AG",
    url: "https://www.linkedin.com/in/christian-million-8053351/",
    priority: 2,
    createdAt: "",
    updatedAt: "",
    publishedAt: "",
    profile_photo: profilePhoto("/speakers26/christian-million.jpg"),
  },
  {
    id: 3,
    documentId: "c26-christoph-jentzsch",
    name: "Christoph Jentzsch",
    position: "Founder",
    company_name: "beel",
    url: "https://www.linkedin.com/in/cjentzsch/",
    priority: 3,
    createdAt: "",
    updatedAt: "",
    publishedAt: "",
    profile_photo: profilePhoto("/speakers26/christoph-jentzsch.jpg"),
  },
  {
    id: 4,
    documentId: "c26-florian-wimmer",
    name: "Florian Wimmer",
    position: "Co-Founder & CEO",
    company_name: "Blockpit AG",
    url: "https://at.linkedin.com/in/florian-wimmer",
    priority: 4,
    createdAt: "",
    updatedAt: "",
    publishedAt: "",
    profile_photo: profilePhoto("/speakers26/florian-wimmer.jpg"),
  },
  {
    id: 5,
    documentId: "c26-franziska-huber",
    name: "Franziska Huber",
    position: "Economist / Expert CBDC",
    company_name: "Deutsche Bundesbank",
    url: "https://www.linkedin.com/in/franziska-huber-35ab65234/",
    priority: 5,
    createdAt: "",
    updatedAt: "",
    publishedAt: "",
    profile_photo: profilePhoto("/speakers26/franziska-huber.jpg"),
  },
  {
    id: 6,
    documentId: "c26-hagen-weiss",
    name: "Dr. Hagen Weiss",
    position: "Digital Assets Lead",
    company_name: "PwC Legal",
    // Confirmed: PwC Legal's own lawyer page links exactly this profile.
    url: "https://www.linkedin.com/in/dr-hagen-weiss-432149104/",
    priority: 6,
    createdAt: "",
    updatedAt: "",
    publishedAt: "",
    profile_photo: profilePhoto("/speakers26/hagen-weiss.jpg"),
  },
  {
    id: 7,
    documentId: "c26-jessica-kreysar",
    name: "Jessica Kreysar",
    position: "Founder, Financial Educator",
    company_name: "Turn the Curve",
    // The form said /in/jessicakreysar/, which nothing outside the form
    // points to. This one is indexed as "Jessica Kreysar – Turn the Curve".
    url: "https://www.linkedin.com/in/jessica-kreysar-73806338/",
    priority: 7,
    createdAt: "",
    updatedAt: "",
    publishedAt: "",
    profile_photo: profilePhoto("/speakers26/jessica-kreysar.jpg"),
  },
  {
    id: 8,
    documentId: "c26-jessica-wright",
    name: "Jessica Wright",
    position: "Growth and Account Management",
    // She wrote "Will be freelance at that time as I'm working on an
    // unannounced project" in the company field — a note, not a company.
    company_name: "Stealth Mode",
    // The only profile she gave is on X; no LinkedIn profile of hers could be
    // confirmed. The card shows an X icon for this.
    url: "https://x.com/yesjess",
    priority: 8,
    createdAt: "",
    updatedAt: "",
    publishedAt: "",
    profile_photo: profilePhoto("/speakers26/jessica-wright.jpg"),
  },
  {
    id: 9,
    documentId: "c26-marie-christin-rinke",
    name: "Marie Christin Rinke",
    // Written "Partner // Tax Advisor" in the form; her firm's own page says
    // "Partner, Tax Advisor".
    position: "Partner, Tax Advisor",
    company_name: "Möhrle Happ Luther",
    // The form said /in/marie-christin-rinke. Her firm's own profile page
    // links this one instead.
    url: "https://www.linkedin.com/in/marie-christin-rinke-a1388b237/",
    priority: 9,
    createdAt: "",
    updatedAt: "",
    publishedAt: "",
    profile_photo: profilePhoto("/speakers26/marie-christin-rinke.jpg"),
  },
  {
    id: 10,
    documentId: "c26-patricia-albrecht",
    name: "Patricia Albrecht",
    position: "Country Lead",
    company_name: "Solana Germany",
    // The form said /in/patriciaalbrecht/. This profile is the one that posts
    // as "leading Solana Germany", which matches her role here.
    url: "https://www.linkedin.com/in/pattiruss",
    priority: 10,
    createdAt: "",
    updatedAt: "",
    publishedAt: "",
    profile_photo: profilePhoto("/speakers26/patricia-albrecht.jpg"),
  },
  {
    id: 11,
    documentId: "c26-radoslav-albrecht",
    name: "Radoslav Albrecht",
    position: "Founder & CEO",
    company_name: "Bitbond",
    url: "https://www.linkedin.com/in/radoslavalbrecht/",
    priority: 11,
    createdAt: "",
    updatedAt: "",
    publishedAt: "",
    profile_photo: profilePhoto("/speakers26/radoslav-albrecht.jpg"),
  },
  {
    id: 12,
    documentId: "c26-ralf-kubli",
    name: "Ralf Kubli",
    position: "Board Member",
    company_name: "Validation Cloud",
    url: "https://www.linkedin.com/in/ralf-kubli-644393/",
    priority: 12,
    createdAt: "",
    updatedAt: "",
    publishedAt: "",
    profile_photo: profilePhoto("/speakers26/ralf-kubli.jpg"),
  },
  {
    id: 13,
    documentId: "c26-ramin-ghafari",
    name: "Ramin Ghafari",
    position: "Head of Financial Technologies",
    company_name: "Siemens AG",
    url: "https://www.linkedin.com/in/ramin-ghafari/",
    priority: 13,
    createdAt: "",
    updatedAt: "",
    publishedAt: "",
    profile_photo: profilePhoto("/speakers26/ramin-ghafari.jpg"),
  },
  {
    id: 14,
    documentId: "c26-sebastian-becker",
    name: "Sebastian Becker",
    position: "Managing Director",
    company_name: "Bundesblock",
    // The form had "li.so" pasted in front of the URL; removed.
    url: "https://www.linkedin.com/in/sebastianbecker2/",
    priority: 14,
    createdAt: "",
    updatedAt: "",
    publishedAt: "",
    profile_photo: profilePhoto("/speakers26/sebastian-becker.jpg"),
  },
];
