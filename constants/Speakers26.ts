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
 * Submission"); the photos are the files they uploaded, square-cropped to
 * 800px, nothing else changed.
 *
 * Order is editorial, not alphabetical: roughly how widely known each speaker
 * is beyond this conference, so the strongest names lead. It leads with the
 * NIST post-quantum co-author, the MEP who shadowed MiCA and the author of
 * TheDAO, then founders and partners of well-known companies, then the
 * remaining specialists, and closes with the club's own host. Rendering
 * follows this array, so move an entry to move it on the page.
 *
 * Profile links were checked one by one against the person's employer page or
 * an independently indexed profile, because several submitted links did not
 * work as given. Where a link differs from the form, the reason is in a
 * comment on the entry. Links with no comment are as submitted.
 *
 * Academic titles: everyone was checked for a doctorate against employer pages
 * and public profiles; the three carrying one have it in `name`.
 */
export const speakers26: Speaker[] = [
  {
    id: 1,
    documentId: "c26-vadim-lyubashevsky",
    name: "Vadim Lyubashevsky",
    position: "Research Scientist",
    company_name: "IBM Research Europe",
    // Co-creator of CRYSTALS-Kyber and CRYSTALS-Dilithium, the post-quantum
    // standards NIST selected. He gave his own homepage, not a LinkedIn.
    url: "https://vadimlyubash.github.io/",
    priority: 1,
    createdAt: "",
    updatedAt: "",
    publishedAt: "",
    profile_photo: profilePhoto("/speakers26/vadim-lyubashevsky.jpg"),
  },
  {
    id: 2,
    documentId: "c26-ondrej-kovarik",
    name: "Ondřej Kovařík",
    position: "Senior Advisor",
    company_name: "European Ethereum Institute",
    // Member of the European Parliament 2019-2025 and Renew Europe's shadow
    // rapporteur on MiCA. Profile indexed as "Ondřej Kovařík - European
    // Parliament".
    url: "https://www.linkedin.com/in/okovarik/",
    priority: 2,
    createdAt: "",
    updatedAt: "",
    publishedAt: "",
    profile_photo: profilePhoto("/speakers26/ondrej-kovarik.jpg"),
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
    documentId: "c26-nina-luisa-siedler",
    name: "Dr. Nina-Luisa Siedler",
    position: "Lawyer, Board Member",
    company_name: "siedler legal, DAAvern, Bundesblock",
    // Co-founder of Bundesblock, thinkBLOCKtank and INATBA. Profile confirms
    // both the doctorate in the name field and DAAvern as current experience.
    url: "https://www.linkedin.com/in/dr-nina-luisa-siedler/",
    priority: 4,
    createdAt: "",
    updatedAt: "",
    publishedAt: "",
    profile_photo: profilePhoto("/speakers26/nina-luisa-siedler.jpg"),
  },
  {
    id: 5,
    documentId: "c26-radoslav-albrecht",
    name: "Radoslav Albrecht",
    position: "Founder & CEO",
    company_name: "Bitbond",
    url: "https://www.linkedin.com/in/radoslavalbrecht/",
    priority: 5,
    createdAt: "",
    updatedAt: "",
    publishedAt: "",
    profile_photo: profilePhoto("/speakers26/radoslav-albrecht.jpg"),
  },
  {
    id: 6,
    documentId: "c26-florian-wimmer",
    name: "Florian Wimmer",
    position: "Co-Founder & CEO",
    company_name: "Blockpit AG",
    url: "https://at.linkedin.com/in/florian-wimmer",
    priority: 6,
    createdAt: "",
    updatedAt: "",
    publishedAt: "",
    profile_photo: profilePhoto("/speakers26/florian-wimmer.jpg"),
  },
  {
    id: 7,
    documentId: "c26-alireza-siadat",
    name: "Alireza Siadat",
    position: "Lead Blockchain & Digital Assets EMEA",
    company_name: "Deloitte Legal",
    // Confirmed: Deloitte Legal's own profile page links this one.
    url: "https://www.linkedin.com/in/alireza-siadat/",
    priority: 7,
    createdAt: "",
    updatedAt: "",
    publishedAt: "",
    profile_photo: profilePhoto("/speakers26/alireza-siadat.jpg"),
  },
  {
    id: 8,
    documentId: "c26-hagen-weiss",
    name: "Dr. Hagen Weiss",
    position: "Digital Assets Lead",
    company_name: "PwC Legal",
    // Confirmed: PwC Legal's own lawyer page links exactly this profile.
    url: "https://www.linkedin.com/in/dr-hagen-weiss-432149104/",
    priority: 8,
    createdAt: "",
    updatedAt: "",
    publishedAt: "",
    profile_photo: profilePhoto("/speakers26/hagen-weiss.jpg"),
  },
  {
    id: 9,
    documentId: "c26-ramin-ghafari",
    name: "Ramin Ghafari",
    position: "Head of Financial Technologies",
    company_name: "Siemens AG",
    url: "https://www.linkedin.com/in/ramin-ghafari/",
    priority: 9,
    createdAt: "",
    updatedAt: "",
    publishedAt: "",
    profile_photo: profilePhoto("/speakers26/ramin-ghafari.jpg"),
  },
  {
    id: 10,
    documentId: "c26-henri-de-jong",
    name: "Henri de Jong",
    position: "Chief Business Development Officer",
    company_name: "Quantoz Payments",
    // Company given as "quantoz.com" in the form; Quantoz Payments is the
    // company behind the EURQ and USDQ stablecoins. Profile confirmed through
    // his indexed posts about them.
    url: "https://www.linkedin.com/in/henrijcldejong/",
    priority: 10,
    createdAt: "",
    updatedAt: "",
    publishedAt: "",
    profile_photo: profilePhoto("/speakers26/henri-de-jong.jpg"),
  },
  {
    id: 11,
    documentId: "c26-sebastian-becker",
    name: "Sebastian Becker",
    position: "Managing Director",
    company_name: "Bundesblock",
    // The form had "li.so" pasted in front of the URL; removed.
    url: "https://www.linkedin.com/in/sebastianbecker2/",
    priority: 11,
    createdAt: "",
    updatedAt: "",
    publishedAt: "",
    profile_photo: profilePhoto("/speakers26/sebastian-becker.jpg"),
  },
  {
    id: 12,
    documentId: "c26-patricia-albrecht",
    name: "Patricia Albrecht",
    position: "Country Lead",
    company_name: "Solana Germany",
    // The form said /in/patriciaalbrecht/. This profile is the one that posts
    // as "leading Solana Germany", which matches her role here.
    url: "https://www.linkedin.com/in/pattiruss",
    priority: 12,
    createdAt: "",
    updatedAt: "",
    publishedAt: "",
    profile_photo: profilePhoto("/speakers26/patricia-albrecht.jpg"),
  },
  {
    id: 13,
    documentId: "c26-stefan-grasmann",
    name: "Stefan Grasmann",
    position: "Curator and connector in digital finance",
    company_name: "Independent",
    // Long-time Partner and Chief of Blockchain at Zühlke, co-founder of
    // Blockchain:Circle; now independent, as he put it in the form.
    url: "https://www.linkedin.com/in/sgrasmann/",
    priority: 13,
    createdAt: "",
    updatedAt: "",
    publishedAt: "",
    profile_photo: profilePhoto("/speakers26/stefan-grasmann.jpg"),
  },
  {
    id: 14,
    documentId: "c26-ralf-kubli",
    name: "Ralf Kubli",
    position: "Board Member",
    company_name: "Validation Cloud",
    url: "https://www.linkedin.com/in/ralf-kubli-644393/",
    priority: 14,
    createdAt: "",
    updatedAt: "",
    publishedAt: "",
    profile_photo: profilePhoto("/speakers26/ralf-kubli.jpg"),
  },
  {
    id: 15,
    documentId: "c26-david-kurz",
    name: "David Kurz",
    position: "Business Development",
    company_name: "Bitvavo",
    url: "https://www.linkedin.com/in/itsdavid-kurz/",
    priority: 15,
    createdAt: "",
    updatedAt: "",
    publishedAt: "",
    profile_photo: profilePhoto("/speakers26/david-kurz.jpg"),
  },
  {
    id: 16,
    documentId: "c26-franziska-huber",
    name: "Franziska Huber",
    position: "Economist / Expert CBDC",
    company_name: "Deutsche Bundesbank",
    url: "https://www.linkedin.com/in/franziska-huber-35ab65234/",
    priority: 16,
    createdAt: "",
    updatedAt: "",
    publishedAt: "",
    profile_photo: profilePhoto("/speakers26/franziska-huber.jpg"),
  },
  {
    id: 17,
    documentId: "c26-anies-khan",
    name: "Anies Khan",
    position: "Investment Associate",
    company_name: "Greenfield Capital",
    // The form gives only the first name; Greenfield's own team page and this
    // profile both use "Anies Khan".
    url: "https://www.linkedin.com/in/anies-khan/",
    priority: 17,
    createdAt: "",
    updatedAt: "",
    publishedAt: "",
    profile_photo: profilePhoto("/speakers26/anies-khan.jpg"),
  },
  {
    id: 18,
    documentId: "c26-sarah-gottwald",
    name: "Sarah Gottwald",
    position: "CSO",
    company_name: "deAI Labs GmbH",
    // Profile confirmed (name, Munich); no doctorate in the name field. A
    // "Dr. Sarah Gottwald" at Leuphana is a different person.
    url: "https://www.linkedin.com/in/sarahgottwald/",
    priority: 18,
    createdAt: "",
    updatedAt: "",
    publishedAt: "",
    profile_photo: profilePhoto("/speakers26/sarah-gottwald.jpg"),
  },
  {
    id: 19,
    documentId: "c26-daniela-boback",
    name: "Daniela Boback",
    position: "Head of Ecosystem & Strategic Partnerships",
    company_name: "Bundesblock",
    url: "https://www.linkedin.com/in/daniela-boback-82681a80/",
    priority: 19,
    createdAt: "",
    updatedAt: "",
    publishedAt: "",
    profile_photo: profilePhoto("/speakers26/daniela-boback.jpg"),
  },
  {
    id: 20,
    documentId: "c26-andi-schmitt",
    name: "Andi Schmitt",
    position: "Crypto-YouTuber",
    company_name: "LIGHT UP",
    // He gave his channel rather than a LinkedIn; the card shows a website icon.
    url: "https://www.youtube.com/c/lightupkryptos",
    priority: 20,
    createdAt: "",
    updatedAt: "",
    publishedAt: "",
    profile_photo: profilePhoto("/speakers26/andi-schmitt.jpg"),
  },
  {
    id: 21,
    documentId: "c26-birgit-hass",
    name: "Birgit Hass",
    position: "Founder",
    company_name: "The Finfluencer Circle",
    url: "https://www.linkedin.com/in/birgit-hass/",
    priority: 21,
    createdAt: "",
    updatedAt: "",
    publishedAt: "",
    profile_photo: profilePhoto("/speakers26/birgit-hass.jpg"),
  },
  {
    id: 22,
    documentId: "c26-slobodan-sudaric-hefner",
    name: "Dr. Slobodan Sudaric-Hefner",
    position: "Chief Economist",
    company_name: "Optimum",
    url: "https://www.linkedin.com/in/sudarics/",
    priority: 22,
    createdAt: "",
    updatedAt: "",
    publishedAt: "",
    profile_photo: profilePhoto("/speakers26/slobodan-sudaric-hefner.jpg"),
  },
  {
    id: 23,
    documentId: "c26-marie-christin-rinke",
    name: "Marie Christin Rinke",
    position: "Partner, Tax Advisor",
    company_name: "Möhrle Happ Luther",
    // Written "Partner // Tax Advisor" in the form; her firm's own page says
    // "Partner, Tax Advisor" and links this profile, not the one submitted.
    url: "https://www.linkedin.com/in/marie-christin-rinke-a1388b237/",
    priority: 23,
    createdAt: "",
    updatedAt: "",
    publishedAt: "",
    profile_photo: profilePhoto("/speakers26/marie-christin-rinke.jpg"),
  },
  {
    id: 24,
    documentId: "c26-christian-million",
    name: "Christian Million",
    position: "Managing Partner",
    company_name: "Convista Consulting AG",
    url: "https://www.linkedin.com/in/christian-million-8053351/",
    priority: 24,
    createdAt: "",
    updatedAt: "",
    publishedAt: "",
    profile_photo: profilePhoto("/speakers26/christian-million.jpg"),
  },
  {
    id: 25,
    documentId: "c26-david-an",
    name: "Dr. David An",
    position: "Partner & Co-Founder",
    company_name: "Dracoon Ventures",
    url: "https://www.linkedin.com/in/davidan/",
    priority: 25,
    createdAt: "",
    updatedAt: "",
    publishedAt: "",
    profile_photo: profilePhoto("/speakers26/david-an.jpg"),
  },
  {
    id: 26,
    documentId: "c26-jessica-wright",
    name: "Jessica Wright",
    position: "Growth and Account Management",
    company_name: "Stealth Mode",
    // Her company field held a sentence about being freelance on an unannounced
    // project. Only profile given is on X; the card shows an X icon.
    url: "https://x.com/yesjess",
    priority: 26,
    createdAt: "",
    updatedAt: "",
    publishedAt: "",
    profile_photo: profilePhoto("/speakers26/jessica-wright.jpg"),
  },
  {
    id: 27,
    documentId: "c26-jessica-kreysar",
    name: "Jessica Kreysar",
    position: "Founder, Financial Educator",
    company_name: "Turn the Curve",
    // The form said /in/jessicakreysar/, which nothing outside the form points
    // to. This one is indexed as "Jessica Kreysar - Turn the Curve".
    url: "https://www.linkedin.com/in/jessica-kreysar-73806338/",
    priority: 27,
    createdAt: "",
    updatedAt: "",
    publishedAt: "",
    profile_photo: profilePhoto("/speakers26/jessica-kreysar.jpg"),
  },
  {
    id: 28,
    documentId: "c26-jan-gero-hannemann",
    name: "Jan-Gero Alexander Hannemann",
    position: "PhD Researcher (AI, Blockchain & IP)",
    company_name: "University of Cambridge",
    // He uploaded the same photo twice; the first file is used.
    url: "https://www.linkedin.com/in/j-g-a-hannemann/",
    priority: 28,
    createdAt: "",
    updatedAt: "",
    publishedAt: "",
    profile_photo: profilePhoto("/speakers26/jan-gero-hannemann.jpg"),
  },
  {
    id: 29,
    documentId: "c26-ivan-von-greiff",
    name: "Ivan von Greiff",
    position: "Portfolio Manager",
    company_name: "TUM CryptoFund",
    url: "https://www.linkedin.com/in/ivan-von-greiff/",
    priority: 29,
    createdAt: "",
    updatedAt: "",
    publishedAt: "",
    profile_photo: profilePhoto("/speakers26/ivan-von-greiff.jpg"),
  },
  {
    id: 30,
    documentId: "c26-daniel-heinen",
    name: "Daniel Heinen",
    position: "Managing Director",
    company_name: "HEINI",
    // Two things as submitted: the picture is the HEINI logo rather than a
    // portrait, and the link goes to the company page, not a personal profile.
    // "GF" in the form is the German abbreviation for Managing Director.
    url: "https://www.linkedin.com/company/129804110/",
    priority: 30,
    createdAt: "",
    updatedAt: "",
    publishedAt: "",
    profile_photo: profilePhoto("/speakers26/daniel-heinen.jpg"),
  },
  {
    id: 31,
    documentId: "c26-felix-rihacek",
    name: "Felix Rihacek",
    position: "President & Head of Industry",
    company_name: "TUM Blockchain Club",
    // Host rather than guest — he opens the conference — so he closes the list.
    url: "https://www.linkedin.com/in/felix-rihacek/",
    priority: 31,
    createdAt: "",
    updatedAt: "",
    publishedAt: "",
    profile_photo: profilePhoto("/speakers26/felix-rihacek.jpg"),
  },
];
