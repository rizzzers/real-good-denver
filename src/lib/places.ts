import type { Post } from "@/data/posts";

export interface Place {
  name: string;
  streetAddress: string;
  addressLocality: string;
  postalCode: string;
  neighborhood?: string;
  priceRange?: string;
  url?: string;
}

// "<street>, <City>, CO 80211" with optional junk like a stray "CO" after the street.
const ADDRESS = /(\d[^|()\n]*?),\s*([A-Za-z .]+?),\s*(?:CO|Colorado)\.?\s*(\d{5})/;
const HEADING = /^#{2,3}\s+(.+)$/;
const BOLD_LINE = /^\*\*(.+?)\*\*\s*$/;
const LEADING_BOLD = /^\*\*(.+?)\*\*\s*\|/;
const MD_LINK = /\[([^\]]+)\]\(([^)]+)\)/;
const HTML_LINK = /href="([^"]+)"/;

const linkUrl = (text: string) => text.match(MD_LINK)?.[2] ?? text.match(HTML_LINK)?.[1];

// Headings carry extras: "1. ", emoji, "Name: tagline", "Name (LoHi)",
// "Name, Tagline", "Honorable Mention: Name". Returns the bare name plus any neighborhood.
const parseName = (raw: string): { name: string; neighborhood?: string } => {
  let name = raw
    .replace(MD_LINK, "$1")
    .replace(/\*\*/g, "")
    .replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE0F}]/gu, "")
    .trim()
    .replace(/^\d+\.\s*/, "");
  const mention = name.match(/^Honorable Mentions?:\s*(.+)$/i);
  if (mention) name = mention[1];
  else if (name.includes(": ")) name = name.split(": ")[0];
  // "Mizuna, The Best in the City" style taglines; keeps "Snooze, an A.M. Eatery".
  name = name.split(/,\s+(?=(?:The|A|For|Fast|South)[\s,])/)[0];
  const paren = name.match(/^(.+?)\s*\(([^)]+)\)$/);
  return paren ? { name: paren[1].trim(), neighborhood: paren[2].trim() } : { name: name.trim() };
};

const normalizeUrl = (url?: string) => {
  if (!url) return undefined;
  const u = url.trim().replace(/[).,]+$/, "");
  if (/^https?:\/\//.test(u)) return u;
  if (/^www\.|^[a-z0-9-]+\.[a-z]{2,}/i.test(u)) return `https://${u}`;
  return undefined;
};

export function extractPlaces(post: Post): Place[] {
  const lines = post.fullContent.split("\n");
  const places: Place[] = [];
  const seen = new Set<string>();

  lines.forEach((line, i) => {
    const plain = line.replace(MD_LINK, "$1");
    const addr = plain.match(ADDRESS);
    if (!addr) return;

    // Name: a bold name at the start of the address line, else the nearest
    // heading or standalone bold line above it within the same section.
    let nameLine: string | undefined;
    const leading = line.trim().match(LEADING_BOLD);
    if (leading) nameLine = leading[1];
    for (let j = i - 1; !nameLine && j >= 0 && j >= i - 15; j--) {
      const t = lines[j].trim();
      if (t === "---") break;
      const m = t.match(HEADING) ?? t.match(BOLD_LINE);
      if (m && !/:\s*$/.test(m[1])) nameLine = m[1];
    }
    if (!nameLine) return;

    const parsed = parseName(nameLine);
    const name = parsed.name;
    if (!name || name.length > 80) return;
    const key = `${name}|${addr[1]}`;
    if (seen.has(key)) return;
    seen.add(key);

    // Website: link on the name, else a Website line or bare link just below.
    let url = linkUrl(nameLine);
    for (let j = i; !url && j <= i + 3 && j < lines.length; j++) {
      const t = lines[j];
      const w = t.match(/Website:?\**\s*(.+)$/i);
      if (w) url = linkUrl(w[1]) ?? w[1].replace(/<[^>]+>/g, "").trim();
      else if (j > i && /^<a href=/.test(t.trim())) url = linkUrl(t);
    }

    // Neighborhood: "(LoHi)" after the ZIP, else a Neighborhood label nearby.
    let neighborhood = plain.slice(plain.indexOf(addr[0]) + addr[0].length).match(/^\s*\(([^)]+)\)/)?.[1];
    for (let j = i - 3; !neighborhood && j <= i + 1; j++) {
      const n = lines[j]?.match(/(?:^|\|)\s*\**Neighborhood:\**\s*([^|*\n]+)/i);
      if (n) neighborhood = n[1].trim();
    }
    neighborhood ??= parsed.neighborhood;
    if (neighborhood && neighborhood.length > 40) neighborhood = undefined;

    const price = plain.match(/\|\s*(?:Price Range:\s*)?(\$[$–-]*)\s*(?:\||$)/)?.[1];

    places.push({
      name,
      streetAddress: addr[1].replace(/\s+CO$/, "").replace(/^\*\*Address[^*]*\*\*\s*/i, "").trim(),
      addressLocality: addr[2].trim(),
      postalCode: addr[3],
      neighborhood,
      priceRange: price,
      url: normalizeUrl(url),
    });
  });

  return places;
}

const businessType = (post: Post) =>
  post.category === "food" ? "FoodEstablishment" : post.category === "nightlife" ? "BarOrPub" : "LocalBusiness";

export const placesSchema = (post: Post, pageUrl: string) => {
  const places = extractPlaces(post);
  if (places.length === 0) return null;
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: post.title,
    url: pageUrl,
    numberOfItems: places.length,
    itemListElement: places.map((place, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": businessType(post),
        name: place.name,
        ...(place.url && { url: place.url }),
        ...(place.priceRange && { priceRange: place.priceRange }),
        address: {
          "@type": "PostalAddress",
          streetAddress: place.streetAddress,
          addressLocality: place.addressLocality,
          addressRegion: "CO",
          postalCode: place.postalCode,
          addressCountry: "US",
        },
        ...(place.neighborhood && {
          containedInPlace: { "@type": "Place", name: `${place.neighborhood}, Denver` },
        }),
      },
    })),
  };
};
