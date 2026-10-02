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
 * NIST post-quantum co-author, the co-author of Poseidon, the MEP who shadowed
 * MiCA and the author of TheDAO, then founders and partners of well-known companies, then the
 * remaining specialists, and closes with the club's own host. Rendering
 * follows this array, so move an entry to move it on the page.
 *
 * Profile links were checked one by one against the person's employer page or
 * an independently indexed profile, because several submitted links did not
 * work as given. Where a link differs from the form, the reason is in a
 * comment on the entry. Links with no comment are as submitted.
 *
 * Academic titles: everyone was checked for a doctorate against employer pages
 * and public profiles; the five carrying one have it in `name`, each as they
 * submitted it.
 *
 * One photo is cropped tighter than the square rule: William Wang uploaded a
 * wide shot in which his face sat far right and filled a sixth of the frame,
 * against a quarter to a third everywhere else, so it was the one picture that
 * broke the grid.
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
    documentId: "c26-markus-schofnegger",
    name: "Markus Schofnegger",
    position: "Cryptography Researcher",
    company_name: "[[alloc] init]",
    // Co-author of Poseidon and Poseidon2, the hash functions most zero-knowledge
    // proof systems are built on, so his work sits underneath a large part of the
    // industry. He submitted the form twice; the later one carries his talk title.
    url: "https://x.com/mschofnegger",
    priority: 2,
    createdAt: "",
    updatedAt: "",
    publishedAt: "",
    profile_photo: profilePhoto("/speakers26/markus-schofnegger.jpg"),
  },
  {
    id: 3,
    documentId: "c26-ondrej-kovarik",
    name: "Ondřej Kovařík",
    position: "Senior Advisor",
    company_name: "European Ethereum Institute",
    // Member of the European Parliament 2019-2025 and Renew Europe's shadow
    // rapporteur on MiCA. Profile indexed as "Ondřej Kovařík - European
    // Parliament".
    url: "https://www.linkedin.com/in/okovarik/",
    priority: 3,
    createdAt: "",
    updatedAt: "",
    publishedAt: "",
    profile_photo: profilePhoto("/speakers26/ondrej-kovarik.jpg"),
  },
  {
    id: 4,
    documentId: "c26-alexander-hoeptner",
    name: "Alexander Höptner",
    position: "CEO",
    company_name: "AllUnity GmbH",
    // Ran Börse Stuttgart as CEO and then 100x Group, the BitMEX holding;
    // now heads AllUnity, the BaFin-licensed euro stablecoin venture of DWS,
    // Galaxy and Flow Traders. Link as submitted, with the scheme added.
    url: "https://www.linkedin.com/in/alexander-hoeptner-0a00962/",
    priority: 4,
    createdAt: "",
    updatedAt: "",
    publishedAt: "",
    profile_photo: profilePhoto("/speakers26/alexander-hoeptner.jpg"),
  },
  {
    id: 5,
    documentId: "c26-christoph-jentzsch",
    name: "Christoph Jentzsch",
    position: "Founder",
    company_name: "beel",
    url: "https://www.linkedin.com/in/cjentzsch/",
    priority: 5,
    createdAt: "",
    updatedAt: "",
    publishedAt: "",
    profile_photo: profilePhoto("/speakers26/christoph-jentzsch.jpg"),
  },
  {
    id: 6,
    documentId: "c26-nina-luisa-siedler",
    name: "Dr. Nina-Luisa Siedler",
    position: "Lawyer, Board Member",
    company_name: "siedler legal, DAAvern, Bundesblock",
    // Co-founder of Bundesblock, thinkBLOCKtank and INATBA. Profile confirms
    // both the doctorate in the name field and DAAvern as current experience.
    url: "https://www.linkedin.com/in/dr-nina-luisa-siedler/",
    priority: 6,
    createdAt: "",
    updatedAt: "",
    publishedAt: "",
    profile_photo: profilePhoto("/speakers26/nina-luisa-siedler.jpg"),
  },
  {
    id: 7,
    documentId: "c26-lewin-boehnke",
    name: "Dr. Lewin Boehnke",
    position: "Chief Strategy Officer",
    company_name: "Crypto Finance | Deutsche Börse Group",
    // One of Crypto Finance's first hires in 2017, first as CTO of the crypto
    // infrastructure arm, now Chief Strategy Officer of the Deutsche Börse
    // Group company. Doctorate in theoretical physics, as submitted.
    url: "https://www.linkedin.com/in/lewinboehnke/",
    priority: 7,
    createdAt: "",
    updatedAt: "",
    publishedAt: "",
    profile_photo: profilePhoto("/speakers26/lewin-boehnke.jpg"),
  },
  {
    id: 8,
    documentId: "c26-radoslav-albrecht",
    name: "Radoslav Albrecht",
    position: "Founder & CEO",
    company_name: "Bitbond",
    url: "https://www.linkedin.com/in/radoslavalbrecht/",
    priority: 8,
    createdAt: "",
    updatedAt: "",
    publishedAt: "",
    profile_photo: profilePhoto("/speakers26/radoslav-albrecht.jpg"),
  },
  {
    id: 9,
    documentId: "c26-florian-wimmer",
    name: "Florian Wimmer",
    position: "Co-Founder & CEO",
    company_name: "Blockpit AG",
    url: "https://at.linkedin.com/in/florian-wimmer",
    priority: 9,
    createdAt: "",
    updatedAt: "",
    publishedAt: "",
    profile_photo: profilePhoto("/speakers26/florian-wimmer.jpg"),
  },
  {
    id: 10,
    documentId: "c26-matthias-kroener",
    name: "Matthias Kröner",
    position: "Managing Partner",
    company_name: "GFTN Europe",
    // Co-founded Fidor Bank and led it for over a decade, one of the first banks in
    // Europe to open its core systems to third parties, and ran DAB Bank before
    // that. He moderates a panel on Digital Assets Day. The form gave
    // "www.gftn.co" with no scheme and no personal profile, so the company site is
    // used with https:// added.
    url: "https://www.gftn.co",
    priority: 10,
    createdAt: "",
    updatedAt: "",
    publishedAt: "",
    profile_photo: profilePhoto("/speakers26/matthias-kroener.jpg"),
  },
  {
    id: 11,
    documentId: "c26-manfred-richels",
    name: "Manfred Richels",
    position: "Head of Corporate Payments",
    company_name: "Deutscher Sparkassen- und Giroverband",
    // The association of the German savings banks; he worked on payments at
    // the ECB and the European Payments Council before. Company spelling
    // corrected from the form ("Gioroverband") — his profile is indexed under
    // the correct spelling — and the link unwrapped from the Google redirect
    // it was pasted as.
    url: "https://www.linkedin.com/in/manfred-richels-8a15a342/",
    priority: 11,
    createdAt: "",
    updatedAt: "",
    publishedAt: "",
    profile_photo: profilePhoto("/speakers26/manfred-richels.jpg"),
  },
  {
    id: 12,
    documentId: "c26-martin-kreitmair",
    name: "Martin Kreitmair",
    position: "CEO",
    company_name: "Tangany GmbH",
    // CEO and co-founder of the BaFin-regulated custodian (founded 2018), a
    // Bronze sponsor of this edition. Link as submitted, confirmed by the
    // Tangany team page.
    url: "https://www.linkedin.com/in/martin-kreitmair/",
    priority: 12,
    createdAt: "",
    updatedAt: "",
    publishedAt: "",
    profile_photo: profilePhoto("/speakers26/martin-kreitmair.jpg"),
  },
  {
    id: 13,
    documentId: "c26-alireza-siadat",
    name: "Alireza Siadat",
    position: "Lead Blockchain & Digital Assets EMEA",
    company_name: "Deloitte Legal",
    // Confirmed: Deloitte Legal's own profile page links this one.
    url: "https://www.linkedin.com/in/alireza-siadat/",
    priority: 13,
    createdAt: "",
    updatedAt: "",
    publishedAt: "",
    profile_photo: profilePhoto("/speakers26/alireza-siadat.jpg"),
  },
  {
    id: 14,
    documentId: "c26-hagen-weiss",
    name: "Dr. Hagen Weiss",
    position: "Digital Assets Lead",
    company_name: "PwC Legal",
    // Confirmed: PwC Legal's own lawyer page links exactly this profile.
    url: "https://www.linkedin.com/in/dr-hagen-weiss-432149104/",
    priority: 14,
    createdAt: "",
    updatedAt: "",
    publishedAt: "",
    profile_photo: profilePhoto("/speakers26/hagen-weiss.jpg"),
  },
  {
    id: 15,
    documentId: "c26-ramin-ghafari",
    name: "Ramin Ghafari",
    position: "Head of Financial Technologies",
    company_name: "Siemens AG",
    url: "https://www.linkedin.com/in/ramin-ghafari/",
    priority: 15,
    createdAt: "",
    updatedAt: "",
    publishedAt: "",
    profile_photo: profilePhoto("/speakers26/ramin-ghafari.jpg"),
  },
  {
    id: 16,
    documentId: "c26-niclas-voigt",
    name: "Niclas Voigt",
    position: "VP Digital Assets",
    company_name: "Commerzbank AG",
    // Part of the Commerzbank team that obtained the BaFin crypto custody
    // licence. Submitted link stripped of its sharing parameters.
    url: "https://www.linkedin.com/in/niclas-g-voigt-870097181/",
    priority: 16,
    createdAt: "",
    updatedAt: "",
    publishedAt: "",
    profile_photo: profilePhoto("/speakers26/niclas-voigt.jpg"),
  },
  {
    id: 17,
    documentId: "c26-simone-cortese",
    name: "Simone Cortese",
    position: "Chief Product Officer",
    company_name: "Fnality",
    // Owns the product of the bank-owned wholesale payment system that settles in a
    // digital representation of central bank money, backed by a Series C with Bank
    // of America, Citi, Goldman Sachs, Barclays and UBS.
    url: "https://www.linkedin.com/in/simone-cortese/",
    priority: 17,
    createdAt: "",
    updatedAt: "",
    publishedAt: "",
    profile_photo: profilePhoto("/speakers26/simone-cortese.jpg"),
  },
  {
    id: 18,
    documentId: "c26-henri-de-jong",
    name: "Henri de Jong",
    position: "Chief Business Development Officer",
    company_name: "Quantoz Payments",
    // Company given as "quantoz.com" in the form; Quantoz Payments is the
    // company behind the EURQ and USDQ stablecoins. Profile confirmed through
    // his indexed posts about them.
    url: "https://www.linkedin.com/in/henrijcldejong/",
    priority: 18,
    createdAt: "",
    updatedAt: "",
    publishedAt: "",
    profile_photo: profilePhoto("/speakers26/henri-de-jong.jpg"),
  },
  {
    id: 19,
    documentId: "c26-raphael-neuberger",
    name: "Raphael Neuberger",
    position: "COO & CFO",
    company_name: "Cashlink",
    // COO and CFO since February 2026, before that Head of Digital Assets at
    // V-Bank. The form carried a long vanity URL that does not resolve; this is
    // the profile Cashlink's own team page links to.
    url: "https://www.linkedin.com/in/raphael-neuberger-21btc/",
    priority: 19,
    createdAt: "",
    updatedAt: "",
    publishedAt: "",
    profile_photo: profilePhoto("/speakers26/raphael-neuberger.jpg"),
  },
  {
    id: 20,
    documentId: "c26-daniel-wernicke",
    name: "Daniel Wernicke",
    position: "Co-CEO",
    company_name: "NYALA",
    // NYALA registers and issues tokenised securities under the German eWpG
    // and is one of the few doing it week in, week out; he is a lawyer and a
    // former BCG consultant, and sits on the association of crypto securities
    // registrars. Next to Cashlink, its closest peer.
    url: "https://www.linkedin.com/in/dwernicke/",
    priority: 20,
    createdAt: "",
    updatedAt: "",
    publishedAt: "",
    profile_photo: profilePhoto("/speakers26/daniel-wernicke.jpg"),
  },
  {
    id: 21,
    documentId: "c26-sebastian-becker",
    name: "Sebastian Becker",
    position: "Managing Director",
    company_name: "Bundesblock",
    // The form had "li.so" pasted in front of the URL; removed.
    url: "https://www.linkedin.com/in/sebastianbecker2/",
    priority: 21,
    createdAt: "",
    updatedAt: "",
    publishedAt: "",
    profile_photo: profilePhoto("/speakers26/sebastian-becker.jpg"),
  },
  {
    id: 22,
    documentId: "c26-patricia-albrecht",
    name: "Patricia Albrecht",
    position: "Country Lead",
    company_name: "Solana Germany",
    // The form said /in/patriciaalbrecht/. This profile is the one that posts
    // as "leading Solana Germany", which matches her role here.
    url: "https://www.linkedin.com/in/pattiruss",
    priority: 22,
    createdAt: "",
    updatedAt: "",
    publishedAt: "",
    profile_photo: profilePhoto("/speakers26/patricia-albrecht.jpg"),
  },
  {
    id: 23,
    documentId: "c26-stefan-grasmann",
    name: "Stefan Grasmann",
    position: "Curator and connector in digital finance",
    company_name: "Independent",
    // Long-time Partner and Chief of Blockchain at Zühlke, co-founder of
    // Blockchain:Circle; now independent, as he put it in the form.
    url: "https://www.linkedin.com/in/sgrasmann/",
    priority: 23,
    createdAt: "",
    updatedAt: "",
    publishedAt: "",
    profile_photo: profilePhoto("/speakers26/stefan-grasmann.jpg"),
  },
  {
    id: 24,
    documentId: "c26-ralf-kubli",
    name: "Ralf Kubli",
    position: "Board Member",
    company_name: "Validation Cloud",
    url: "https://www.linkedin.com/in/ralf-kubli-644393/",
    priority: 24,
    createdAt: "",
    updatedAt: "",
    publishedAt: "",
    profile_photo: profilePhoto("/speakers26/ralf-kubli.jpg"),
  },
  {
    id: 25,
    documentId: "c26-david-kurz",
    name: "David Kurz",
    position: "Business Development",
    company_name: "Bitvavo",
    url: "https://www.linkedin.com/in/itsdavid-kurz/",
    priority: 25,
    createdAt: "",
    updatedAt: "",
    publishedAt: "",
    profile_photo: profilePhoto("/speakers26/david-kurz.jpg"),
  },
  {
    id: 26,
    documentId: "c26-christian-bock",
    name: "Christian Bock",
    position: "Sales Director",
    company_name: "Talos",
    // Sales Director EMEA at the institutional trading-technology provider,
    // based in Zurich. He gave only talos.com; this is his profile as indexed
    // ("Christian Bock - Talos").
    url: "https://www.linkedin.com/in/christian-bock-a3659b8/",
    priority: 26,
    createdAt: "",
    updatedAt: "",
    publishedAt: "",
    profile_photo: profilePhoto("/speakers26/christian-bock.jpg"),
  },
  {
    id: 27,
    documentId: "c26-franziska-huber",
    name: "Franziska Huber",
    position: "Economist / Expert CBDC",
    company_name: "Deutsche Bundesbank",
    url: "https://www.linkedin.com/in/franziska-huber-35ab65234/",
    priority: 27,
    createdAt: "",
    updatedAt: "",
    publishedAt: "",
    profile_photo: profilePhoto("/speakers26/franziska-huber.jpg"),
  },
  {
    id: 28,
    documentId: "c26-sergey-shemyakov",
    name: "Sergey Shemyakov",
    position: "ZK Researcher",
    company_name: "L2BEAT",
    // Back after last year's edition; doctorate in mathematics from
    // Aix-Marseille, which he does not use in his name. The profile he gave
    // is still indexed under Lightcurve, the Lisk studio he worked at before
    // L2BEAT.
    url: "https://www.linkedin.com/in/sergey-shemyakov/",
    priority: 28,
    createdAt: "",
    updatedAt: "",
    publishedAt: "",
    profile_photo: profilePhoto("/speakers26/sergey-shemyakov.jpg"),
  },
  {
    id: 29,
    documentId: "c26-pavlina-pavlova",
    name: "Pavlina Pavlova",
    position: "CEO",
    company_name: "ChainComply",
    // Co-founder and CEO of the crypto compliance startup, which came out of
    // the Blockchain Founders Group programme.
    url: "https://www.linkedin.com/in/pavlina-pavlova/",
    priority: 29,
    createdAt: "",
    updatedAt: "",
    publishedAt: "",
    profile_photo: profilePhoto("/speakers26/pavlina-pavlova.jpg"),
  },
  {
    id: 30,
    documentId: "c26-anies-khan",
    name: "Anies Khan",
    position: "Investment Associate",
    company_name: "Greenfield Capital",
    // The form gives only the first name; Greenfield's own team page and this
    // profile both use "Anies Khan".
    url: "https://www.linkedin.com/in/anies-khan/",
    priority: 30,
    createdAt: "",
    updatedAt: "",
    publishedAt: "",
    profile_photo: profilePhoto("/speakers26/anies-khan.jpg"),
  },
  {
    id: 31,
    documentId: "c26-lukas-beckenbauer",
    name: "Lukas Beckenbauer",
    position: "CEO",
    company_name: "deAI Labs",
    // Runs deAI Labs, so he sits directly above his own CSO. Doctoral
    // researcher at TUM on decentralised AI and multi-agent systems; the
    // profile he gave is indexed under TUM School of Management.
    url: "https://www.linkedin.com/in/lukas-beckenbauer/",
    priority: 31,
    createdAt: "",
    updatedAt: "",
    publishedAt: "",
    profile_photo: profilePhoto("/speakers26/lukas-beckenbauer.jpg"),
  },
  {
    id: 32,
    documentId: "c26-sarah-gottwald",
    name: "Sarah Gottwald",
    position: "CSO",
    company_name: "deAI Labs GmbH",
    // Profile confirmed (name, Munich); no doctorate in the name field. A
    // "Dr. Sarah Gottwald" at Leuphana is a different person.
    url: "https://www.linkedin.com/in/sarahgottwald/",
    priority: 32,
    createdAt: "",
    updatedAt: "",
    publishedAt: "",
    profile_photo: profilePhoto("/speakers26/sarah-gottwald.jpg"),
  },
  {
    id: 33,
    documentId: "c26-daniela-boback",
    name: "Daniela Boback",
    position: "Head of Ecosystem & Strategic Partnerships",
    company_name: "Bundesblock",
    url: "https://www.linkedin.com/in/daniela-boback-82681a80/",
    priority: 33,
    createdAt: "",
    updatedAt: "",
    publishedAt: "",
    profile_photo: profilePhoto("/speakers26/daniela-boback.jpg"),
  },
  {
    id: 34,
    documentId: "c26-andi-schmitt",
    name: "Andi Schmitt",
    position: "Crypto-YouTuber",
    company_name: "LIGHT UP",
    // He gave his channel rather than a LinkedIn; the card shows a website icon.
    url: "https://www.youtube.com/c/lightupkryptos",
    priority: 34,
    createdAt: "",
    updatedAt: "",
    publishedAt: "",
    profile_photo: profilePhoto("/speakers26/andi-schmitt.jpg"),
  },
  {
    id: 35,
    documentId: "c26-birgit-hass",
    name: "Birgit Hass",
    position: "Founder",
    company_name: "The Finfluencer Circle",
    url: "https://www.linkedin.com/in/birgit-hass/",
    priority: 35,
    createdAt: "",
    updatedAt: "",
    publishedAt: "",
    profile_photo: profilePhoto("/speakers26/birgit-hass.jpg"),
  },
  {
    id: 36,
    documentId: "c26-slobodan-sudaric-hefner",
    name: "Dr. Slobodan Sudaric-Hefner",
    position: "Chief Economist",
    company_name: "Optimum",
    url: "https://www.linkedin.com/in/sudarics/",
    priority: 36,
    createdAt: "",
    updatedAt: "",
    publishedAt: "",
    profile_photo: profilePhoto("/speakers26/slobodan-sudaric-hefner.jpg"),
  },
  {
    id: 37,
    documentId: "c26-afra-stoehr",
    name: "Afra Stöhr",
    position: "Founder",
    company_name: "0xcounting",
    // Certified tax adviser working only with crypto clients and co-chair of
    // Bundesblock's tax working group. Her profile is still headlined with
    // her firm SWTax; 0xcounting is the venture she submitted.
    url: "https://www.linkedin.com/in/afra-st%C3%B6hr-bb850110a/",
    priority: 37,
    createdAt: "",
    updatedAt: "",
    publishedAt: "",
    profile_photo: profilePhoto("/speakers26/afra-stoehr.jpg"),
  },
  {
    id: 38,
    documentId: "c26-marie-christin-rinke",
    name: "Marie Christin Rinke",
    position: "Partner, Tax Advisor",
    company_name: "Möhrle Happ Luther",
    // Written "Partner // Tax Advisor" in the form; her firm's own page says
    // "Partner, Tax Advisor" and links this profile, not the one submitted.
    url: "https://www.linkedin.com/in/marie-christin-rinke-a1388b237/",
    priority: 38,
    createdAt: "",
    updatedAt: "",
    publishedAt: "",
    profile_photo: profilePhoto("/speakers26/marie-christin-rinke.jpg"),
  },
  {
    id: 39,
    documentId: "c26-matthias-steger",
    name: "Matthias Steger",
    position: "Steuerberater, Vizepräsident StB Verband Berlin-Brandenburg",
    company_name: "Bitcoin Steuerberater",
    // Tax adviser specialised in crypto and deputy president of the Berlin-
    // Brandenburg tax advisers' association, so he joins the tax and audit group.
    url: "https://www.linkedin.com/in/matthias-steger-a55165153/",
    priority: 39,
    createdAt: "",
    updatedAt: "",
    publishedAt: "",
    profile_photo: profilePhoto("/speakers26/matthias-steger.jpg"),
  },
  {
    id: 40,
    documentId: "c26-hannes-claut",
    name: "Hannes Claut",
    position: "Manager",
    company_name: "PwC GmbH",
    // The audit and advisory arm, alongside Hagen Weiss of PwC Legal further
    // up the list.
    url: "https://www.linkedin.com/in/hannesclaut/",
    priority: 40,
    createdAt: "",
    updatedAt: "",
    publishedAt: "",
    profile_photo: profilePhoto("/speakers26/hannes-claut.jpg"),
  },
  {
    id: 41,
    documentId: "c26-christian-million",
    name: "Christian Million",
    position: "Managing Partner",
    company_name: "Convista Consulting AG",
    url: "https://www.linkedin.com/in/christian-million-8053351/",
    priority: 41,
    createdAt: "",
    updatedAt: "",
    publishedAt: "",
    profile_photo: profilePhoto("/speakers26/christian-million.jpg"),
  },
  {
    id: 42,
    documentId: "c26-david-an",
    name: "Dr. David An",
    position: "Partner & Co-Founder",
    company_name: "Dracoon Ventures",
    url: "https://www.linkedin.com/in/davidan/",
    priority: 42,
    createdAt: "",
    updatedAt: "",
    publishedAt: "",
    profile_photo: profilePhoto("/speakers26/david-an.jpg"),
  },
  {
    id: 43,
    documentId: "c26-jessica-wright",
    name: "Jessica Wright",
    position: "Growth and Account Management",
    company_name: "Stealth Mode",
    // Her company field held a sentence about being freelance on an unannounced
    // project. Only profile given is on X; the card shows an X icon.
    url: "https://x.com/yesjess",
    priority: 43,
    createdAt: "",
    updatedAt: "",
    publishedAt: "",
    profile_photo: profilePhoto("/speakers26/jessica-wright.jpg"),
  },
  {
    id: 44,
    documentId: "c26-jessica-kreysar",
    name: "Jessica Kreysar",
    position: "Founder, Financial Educator",
    company_name: "Turn the Curve",
    // The form said /in/jessicakreysar/, which nothing outside the form points
    // to. This one is indexed as "Jessica Kreysar - Turn the Curve".
    url: "https://www.linkedin.com/in/jessica-kreysar-73806338/",
    priority: 44,
    createdAt: "",
    updatedAt: "",
    publishedAt: "",
    profile_photo: profilePhoto("/speakers26/jessica-kreysar.jpg"),
  },
  {
    id: 45,
    documentId: "c26-jork-leonhardt",
    name: "Jork Leonhardt",
    position: "Co-Founder & Co-CEO",
    company_name: "corpus.core GmbH",
    // Co-founded corpus.core with Simon Jentzsch, where he runs strategy and
    // partnerships for the colibri client. Twenty years in technical consulting
    // before that.
    url: "https://www.linkedin.com/in/jorkleonhardt",
    priority: 45,
    createdAt: "",
    updatedAt: "",
    publishedAt: "",
    profile_photo: profilePhoto("/speakers26/jork-leonhardt.jpg"),
  },
  {
    id: 46,
    documentId: "c26-felix-hoops",
    name: "Felix Hoops",
    position: "CEO",
    company_name: "Haven",
    // Wrote his doctorate at TUM's chair for Software Engineering for Business
    // Information Systems on self-sovereign identity in a business setting, and now
    // builds on it at Haven. He submitted no academic title, so none is shown.
    url: "https://x.com/felixhoops_",
    priority: 46,
    createdAt: "",
    updatedAt: "",
    publishedAt: "",
    profile_photo: profilePhoto("/speakers26/felix-hoops.jpg"),
  },
  {
    id: 47,
    documentId: "c26-jan-gero-hannemann",
    name: "Jan-Gero Alexander Hannemann",
    position: "PhD Researcher (AI, Blockchain & IP)",
    company_name: "University of Cambridge",
    // He uploaded the same photo twice; the first file is used.
    url: "https://www.linkedin.com/in/j-g-a-hannemann/",
    priority: 47,
    createdAt: "",
    updatedAt: "",
    publishedAt: "",
    profile_photo: profilePhoto("/speakers26/jan-gero-hannemann.jpg"),
  },
  {
    id: 48,
    documentId: "c26-marek-sefranek",
    name: "Marek Sefranek",
    position: "PhD Researcher (ZK proofs, SNARKs)",
    company_name: "TU Wien",
    // PreDoc in TU Wien's security and privacy unit and co-author of "Plonk
    // Without Random Oracles" with Georg Fuchsbauer, presented at ZKProof 8.
    // He gave the institute page, not a LinkedIn.
    url: "https://secpriv.wien/team/310340-marek-sefranek/",
    priority: 48,
    createdAt: "",
    updatedAt: "",
    publishedAt: "",
    profile_photo: profilePhoto("/speakers26/marek-sefranek.jpg"),
  },
  {
    id: 49,
    documentId: "c26-william-wang",
    name: "William Wang",
    position: "PhD Student",
    company_name: "New York University",
    // Third-year PhD at NYU Courant and co-author of Flock, the batched
    // Boolean SNARK built with Benedikt Bünz and Ron Rothblum. He gave his X
    // account, not a LinkedIn.
    url: "https://x.com/kleptographic",
    priority: 49,
    createdAt: "",
    updatedAt: "",
    publishedAt: "",
    profile_photo: profilePhoto("/speakers26/william-wang.jpg"),
  },
  {
    id: 50,
    documentId: "c26-arman-kolozyan",
    name: "Arman Kolozyan",
    position: "Predoctoral Researcher",
    company_name: "CISPA",
    // CISPA is the Helmholtz Center for Information Security. His talk,
    // "Language-Agnostic Detection of Bugs in ZKP Programs", puts him with
    // the other zero-knowledge researchers. He gave his own site, not a
    // LinkedIn.
    url: "https://armankolozyan.com",
    priority: 50,
    createdAt: "",
    updatedAt: "",
    publishedAt: "",
    profile_photo: profilePhoto("/speakers26/arman-kolozyan.jpg"),
  },
  {
    id: 51,
    documentId: "c26-francois-xavier-wicht",
    name: "François-Xavier Wicht",
    position: "Researcher",
    company_name: "University of Bern",
    // PhD student in Bern's Cryptology and Data Security group, working on privacy
    // in digital currencies, which places him with the other researchers.
    url: "https://wichtfx.github.io",
    priority: 51,
    createdAt: "",
    updatedAt: "",
    publishedAt: "",
    profile_photo: profilePhoto("/speakers26/francois-xavier-wicht.jpg"),
  },
  {
    id: 52,
    documentId: "c26-ivan-von-greiff",
    name: "Ivan von Greiff",
    position: "Portfolio Manager",
    company_name: "TUM CryptoFund",
    url: "https://www.linkedin.com/in/ivan-von-greiff/",
    priority: 52,
    createdAt: "",
    updatedAt: "",
    publishedAt: "",
    profile_photo: profilePhoto("/speakers26/ivan-von-greiff.jpg"),
  },
  {
    id: 53,
    documentId: "c26-daniel-heinen",
    name: "Daniel Heinen",
    position: "Managing Director",
    company_name: "HEINI",
    // The form gave the HEINI logo instead of a portrait; he sent a real one
    // afterwards, which is what is used here. The link still goes to the
    // company page rather than a personal profile, as submitted. "GF" in the
    // form is the German abbreviation for Managing Director.
    url: "https://www.linkedin.com/company/129804110/",
    priority: 53,
    createdAt: "",
    updatedAt: "",
    publishedAt: "",
    profile_photo: profilePhoto("/speakers26/daniel-heinen.jpg"),
  },
  {
    id: 54,
    documentId: "c26-gerhard-wimmer",
    name: "Gerhard Wimmer",
    position: "CEO",
    company_name: "Skygate Network GmbH",
    // Salzburg flight-school group with its own aviation token. He gave the
    // company site; this is his profile as indexed ("CEO bei Skygate Network").
    url: "https://www.linkedin.com/in/gerhard-wimmer-ba76a92a3/",
    priority: 54,
    createdAt: "",
    updatedAt: "",
    publishedAt: "",
    profile_photo: profilePhoto("/speakers26/gerhard-wimmer.jpg"),
  },
  {
    id: 55,
    documentId: "c26-felix-rihacek",
    name: "Felix Rihacek",
    position: "President & Head of Industry",
    company_name: "TUM Blockchain Club",
    // Host rather than guest — he opens the conference — so he closes the list.
    url: "https://www.linkedin.com/in/felix-rihacek/",
    priority: 55,
    createdAt: "",
    updatedAt: "",
    publishedAt: "",
    profile_photo: profilePhoto("/speakers26/felix-rihacek.jpg"),
  },
];
