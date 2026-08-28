import axios from "axios";
import fs from "fs";
import fsPromises from "fs/promises";
import path from "path";
import { detectLogoBackground, LogoBackground } from "@/util/logoTone";

//  {
//     title: "AI, Privacy & DePin in Web3",
//     url: "pre-event",
//     subpage: false,
//     description:
//       'Ready to kick off the TUM Blockchain Conference 2024 with a bang? Join us at our lively pre-event, "AI, Privacy & DePin in Web3" September 11th at Wayra Germany in the heart of Munich for an evening filled with insightful discussions, networking, and a whole lot of heartfelt welcome vibes.',
//     link: "https://lu.ma/v24yqx2q",
//     date: "Wednesday, September 11 | 18:00 - 21:00",
//     backgroundImg: "/side-events/pre-event.jpg",
//   },

export interface SpeakerItem {
  name: string;
  profile_photo: string;
  description: string;
  company_name: string;
  url: string;
  priority: number;
}

export interface ImageFormat {
  name: string;
  hash: string;
  ext: string;
  mime: string;
  path: string | null;
  width: number;
  height: number;
  size: number;
  sizeInBytes: number;
  url: string;
}

export interface ProfilePicture {
  id: number;
  documentId: string;
  name: string;
  alternativeText: string | null;
  caption: string | null;
  width: number;
  height: number;
  formats: {
    thumbnail: ImageFormat;
    large: ImageFormat;
    medium: ImageFormat;
    small: ImageFormat;
    [key: string]: ImageFormat;
  };
  hash: string;
  ext: string;
  mime: string;
  size: number;
  url: string;
  previewUrl: string | null;
  provider: string;
  provider_metadata: never | null;
  createdat: string;
  updatedat: string;
  publishedat: string;
}

export interface Speaker {
  id: number;
  documentId: string;
  name: string;
  company_name: string;
  url: string;
  priority: number;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  position: string;
  profile_photo?: ProfilePicture | null;
}

// New: SideEvent typing aligned with Strapi and UI needs
export interface SideEvent {
  id: number;
  documentId: string;
  title: string;
  description: string;
  link: string;
  startTime: string;
  endTime: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  image?: ProfilePicture | null;
}

export interface Workshop {
  id: number;
  documentId: string;
  title: string;
  description: string;
  url: string;
  backgroundImg: ProfilePicture | null;
  room: string;
  starttime: string;
  endtime: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

export default Speaker;

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const fetchSpeakers = async (): Promise<Speaker[]> => {
  const token = process.env.STRAPI_API_TOKEN;
  if (!token) {
    console.warn("STRAPI_API_TOKEN missing; returning empty speakers list");
    return [];
  }

  try {
    const speakers: Speaker[] = [];
    let hasMore = true;
    let page = 1;

    do {
      const res = await axios.get(
        `https://strapi.rbg.tum-blockchain.com/api/speakers25?sort=name:asc&pagination[page]=${page}&pagination[pageSize]=25&populate=profile_photo`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      speakers.push(...res.data.data);
      hasMore =
        res.data.meta.pagination.page < res.data.meta.pagination.pageCount;
      page = page + 1;

      for (const speaker of res.data.data) {
        await downloadProfilePicture(speaker);
        delay(500);
      }
      console.log(`Fetched ${speakers.length} speakers so far...`);
    } while (hasMore);

    return speakers;
  } catch (err) {
    console.error("Error fetching speakers from Strapi:", err);
    return [];
  }
};

const downloadProfilePicture = async (speaker: Speaker) => {
  if (!speaker.profile_photo || !speaker.profile_photo.url) {
    console.warn(`No profile photo for speaker: ${speaker.name}`);
    return;
  }

  try {
    const speakerDir = path.join(process.cwd(), "public", "speakers2");
    if (!fs.existsSync(speakerDir)) {
      fs.mkdirSync(speakerDir, { recursive: true });
    }

    const ext = speaker.profile_photo.ext || ".webp";
    const fileName = `${speaker.documentId}${ext}`;
    const filePath = path.join(speakerDir, fileName);

    if (!fs.existsSync(filePath)) {
      const res = await axios({
        url:
          "https://strapi.rbg.tum-blockchain.com" + speaker.profile_photo.url,
        method: "GET",
        responseType: "stream",
      });

      const writer = fs.createWriteStream(filePath);
      res.data.pipe(writer);

      await new Promise<void>((resolve, reject) => {
        writer.on("finish", () => resolve());
        writer.on("error", reject);
      });
      console.log(
        `Downloaded profile picture for ${speaker.name} to ${filePath}`,
      );

      const publicUrl = `/speakers2/${fileName}`;
      speaker.profile_photo.url = publicUrl;
    } else {
      // console.log(`Profile picture for ${speaker.name} already exists at ${filePath}`);
      speaker.profile_photo.url = `/speakers2/${fileName}`;
    }
  } catch (error) {
    console.error(
      `Error downloading profile picture for ${speaker.name}:`,
      error,
    );
  }
};

// New: fetch side events from Strapi and download images similarly to Speaker
export const fetchSideEvents = async (): Promise<SideEvent[]> => {
  const token = process.env.STRAPI_API_TOKEN;
  if (!token) {
    console.warn("STRAPI_API_TOKEN missing; returning empty side events list");
    return [];
  }

  try {
    const events: SideEvent[] = [];
    let hasMore = true;
    let page = 1;

    do {
      const res = await axios.get(
        `https://strapi.rbg.tum-blockchain.com/api/side-events-25?sort=startTime:asc&pagination[page]=${page}&pagination[pageSize]=25&populate=image`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const pageData: SideEvent[] = res.data.data;

      for (const event of pageData) {
        await downloadSideEventImage(event);
        delay(300);
      }

      events.push(...pageData);

      hasMore =
        res.data.meta.pagination.page < res.data.meta.pagination.pageCount;
      page = page + 1;
      console.log(`Fetched ${events.length} side events so far...`);
    } while (hasMore);

    return events;
  } catch (err) {
    console.error("Error fetching side events from Strapi:", err);
    return [];
  }
};

const downloadSideEventImage = async (event: SideEvent) => {
  if (!event.image || !event.image.url) {
    console.warn(`No image for side event: ${event.title}`);
    return;
  }

  try {
    const dir = path.join(process.cwd(), "public", "side-events25");
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    const ext = event.image.ext || ".webp";
    const fileName = `${event.documentId}${ext}`;
    const filePath = path.join(dir, fileName);

    if (!fs.existsSync(filePath)) {
      const res = await axios({
        url: "https://strapi.rbg.tum-blockchain.com" + event.image.url,
        method: "GET",
        responseType: "stream",
      });

      const writer = fs.createWriteStream(filePath);
      res.data.pipe(writer);

      await new Promise<void>((resolve, reject) => {
        writer.on("finish", () => resolve());
        writer.on("error", reject);
      });
      console.log(
        `Downloaded side event image for ${event.title} to ${filePath}`,
      );

      const publicUrl = `/side-events25/${fileName}`;
      event.image.url = publicUrl;
    } else {
      event.image.url = `/side-events25/${fileName}`;
    }
  } catch (error) {
    console.error(
      `Error downloading image for side event ${event.title}:`,
      error,
    );
  }
};

export const fetchWorkshops = async (): Promise<Workshop[]> => {
  const token = process.env.STRAPI_API_TOKEN;
  if (!token) {
    console.warn("STRAPI_API_TOKEN missing; returning empty workshops list");
    return [];
  }

  try {
    const workshops: Workshop[] = [];
    let hasMore = true;
    let page = 1;
    do {
      const res = await axios.get(
        `https://strapi.rbg.tum-blockchain.com/api/workshop-25s?sort=starttime:asc&pagination[page]=${page}&pagination[pageSize]=25&populate=backgroundImg`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      const pageData: Workshop[] = res.data.data;
      for (const workshop of pageData) {
        await downloadWorkshopImage(workshop);
        delay(300);
      }
      workshops.push(...pageData);
      hasMore =
        res.data.meta.pagination.page < res.data.meta.pagination.pageCount;
      page = page + 1;
      console.log(`Fetched ${workshops.length} workshops so far...`);
    } while (hasMore);
    return workshops;
  } catch (err) {
    console.error("Error fetching workshops from Strapi:", err);
    return [];
  }
};

const downloadWorkshopImage = async (workshop: Workshop) => {
  if (!workshop.backgroundImg || !workshop.backgroundImg.url) {
    console.warn(`No background image for workshop: ${workshop.title}`);
    return;
  }

  try {
    const dir = path.join(process.cwd(), "public", "workshops25");
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    const ext = workshop.backgroundImg.ext || ".webp";
    const fileName = `${workshop.documentId}${ext}`;
    const filePath = path.join(dir, fileName);
    if (!fs.existsSync(filePath)) {
      const res = await axios({
        url:
          "https://strapi.rbg.tum-blockchain.com" + workshop.backgroundImg.url,
        method: "GET",
        responseType: "stream",
      });
      const writer = fs.createWriteStream(filePath);
      res.data.pipe(writer);
      await new Promise<void>((resolve, reject) => {
        writer.on("finish", () => resolve());
        writer.on("error", reject);
      });
      console.log(
        `Downloaded workshop image for ${workshop.title} to ${filePath}`,
      );
      const publicUrl = `/workshops25/${fileName}`;
      workshop.backgroundImg.url = publicUrl;
    } else {
      workshop.backgroundImg.url = `/workshops25/${fileName}`;
    }
  } catch (error) {
    console.error(
      `Error downloading image for workshop ${workshop.title}:`,
      error,
    );
  }
};

// Community Partners of the 2026 edition. The Strapi collection type is
// expected to expose: name (text), logo (single media), website (text,
// optional) and priority (integer, optional — higher shows up first).
export interface CommunityPartner {
  id: number;
  documentId: string;
  name: string;
  website?: string | null;
  priority?: number | null;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  logo?: ProfilePicture | null;
  /** Derived from the logo pixels, not from Strapi. */
  logoBackground?: LogoBackground;
}

// Plural API ID of the collection type, as shown in the Content-Type Builder.
const COMMUNITY_PARTNER_ENDPOINT =
  process.env.STRAPI_COMMUNITY_PARTNER_ENDPOINT || "community-partner-26s";

export const fetchCommunityPartners = async (): Promise<CommunityPartner[]> => {
  const token = process.env.STRAPI_API_TOKEN;
  if (!token) {
    console.warn(
      "STRAPI_API_TOKEN missing; returning empty community partners list",
    );
    return [];
  }

  try {
    const partners: CommunityPartner[] = [];
    let hasMore = true;
    let page = 1;

    do {
      const res = await axios.get(
        `https://strapi.rbg.tum-blockchain.com/api/${COMMUNITY_PARTNER_ENDPOINT}?sort=name:asc&pagination[page]=${page}&pagination[pageSize]=50&populate=logo`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const pageData: CommunityPartner[] = res.data.data;

      for (const partner of pageData) {
        await prepareCommunityPartnerLogo(partner);
        delay(300);
      }

      partners.push(...pageData);

      hasMore =
        res.data.meta.pagination.page < res.data.meta.pagination.pageCount;
      page = page + 1;
      console.log(`Fetched ${partners.length} community partners so far...`);
    } while (hasMore);

    // Higher priority first, alphabetical within the same priority (the API
    // already sorted by name, and Array.sort is stable).
    return partners.sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0));
  } catch (err) {
    console.error("Error fetching community partners from Strapi:", err);
    return [];
  }
};

const STRAPI_BASE = "https://strapi.rbg.tum-blockchain.com";

/**
 * Makes a partner logo renderable and decides which card it belongs on.
 *
 * During a build the file is cached under /public so the live site does not
 * depend on Strapi being reachable. When the filesystem is read-only — which
 * is the case when a page is regenerated on Vercel, i.e. for partners added
 * after the last deploy — the logo is served straight from Strapi instead.
 * Either way the tone is measured from the same bytes.
 */
const prepareCommunityPartnerLogo = async (partner: CommunityPartner) => {
  if (!partner.logo || !partner.logo.url) {
    console.warn(`No logo for community partner: ${partner.name}`);
    return;
  }

  const remoteUrl = STRAPI_BASE + partner.logo.url;
  const ext = partner.logo.ext || ".png";
  const fileName = `${partner.documentId}${ext}`;
  const filePath = path.join(
    process.cwd(),
    "public",
    "community-partners26",
    fileName,
  );

  let buffer: Buffer | null = null;

  if (fs.existsSync(filePath)) {
    buffer = await fsPromises.readFile(filePath);
    partner.logo.url = `/community-partners26/${fileName}`;
  } else {
    try {
      const res = await axios.get<ArrayBuffer>(remoteUrl, {
        responseType: "arraybuffer",
        timeout: 15000,
      });
      buffer = Buffer.from(res.data);
    } catch (error) {
      console.error(`Could not load logo for ${partner.name}:`, error);
      partner.logo.url = remoteUrl;
      return;
    }

    try {
      await fsPromises.mkdir(path.dirname(filePath), { recursive: true });
      await fsPromises.writeFile(filePath, buffer);
      partner.logo.url = `/community-partners26/${fileName}`;
      console.log(`Cached logo for ${partner.name} at ${filePath}`);
    } catch {
      // Read-only filesystem (Vercel runtime): serve it from Strapi.
      partner.logo.url = remoteUrl;
      console.log(`Serving logo for ${partner.name} from Strapi`);
    }
  }

  partner.logoBackground = await detectLogoBackground(buffer);
};
