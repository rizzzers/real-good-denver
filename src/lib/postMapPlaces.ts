// Matches a "<City>, CO/Colorado" address fragment within a single segment
// (no pipe between city and state). Used to locate the address line AND, when
// name + address share one line, the specific pipe-segment that is the address.
const CITY_CO =
  /\b(Denver|Lakewood|Aurora|Westminster|Englewood|Littleton|Edgewater|Arvada|Wheat Ridge|Boulder|Golden|Commerce City|Thornton|Northglenn|Centennial|Glendale|Greenwood Village)\b[^|]*?\b(CO|Colorado)\b/;

// Colorado bounding box (lng/lat) for Nominatim, so an ambiguously-named place
// can never resolve to a same-named bar in another state. viewbox is
// left,top,right,bottom; bounded=1 discards anything outside it.
export const CO_VIEWBOX = "-109.06,41.003,-102.04,36.99";

// An address segment is short; anything longer is a prose paragraph.
const MAX_ADDRESS_LINE = 160;

// "Address: 123 Main St" / "Address Example: ..." / "Location: ..."
const stripLabel = (s: string) => s.replace(/^\s*(?:Address(?: Example)?|Location)\s*:\s*/i, "").trim();

// Geocoders choke on unit designators ("#150", "Ste 100", "Unit M", a trailing
// "C" or "b1" after the street), so drop them before lookup. Display keeps them.
export function geocodeQuery(address: string): string {
  return address
    .replace(/,?\s*(?:#|\b(?:Unit|Ste|Suite|Apt|Bldg|Space)\b\.?)\s*[\w-]+(?=\s*,)/gi, "")
    .replace(/(\s(?:St|Ave|Blvd|Rd|Pl|Pkwy|Dr|Way|Ln|Ct|Street|Avenue|Road))\s+[A-Za-z]\d*(?=\s*,)/, "$1")
    .replace(/\s+/g, " ")
    .trim();
}

// Extract restaurant name + address from markdown content
export function parseRestaurants(markdown: string): { name: string; address: string; isTop: boolean }[] {
  // Older (Lovable-era) posts have no ## headings; each place starts with a
  // standalone "**Name**" line instead. Promote those to headings.
  if (!/^#{2,3}\s/m.test(markdown)) {
    markdown = markdown.replace(/\n*^\*\*([^*\n]+)\*\*[ \t]*$/gm, "\n\n### $1");
  }

  const SEP = "\n\n---\n\n";
  const sections = markdown.includes(SEP)
    ? markdown.split(SEP)
    : markdown.split(/\n\n(?=#{2,3}[\s*])/);

  const results: { name: string; address: string; isTop: boolean }[] = [];
  let firstRestaurant = true;

  for (const section of sections) {
    const lines = section.split("\n").map(l => l.trim()).filter(Boolean);
    if (!lines.length) continue;

    // Find heading line with ### or ##
    const headingLine = lines.find(l => /^#{2,3}\s/.test(l));
    if (!headingLine) continue;

    // Extract name, handles all observed heading formats:
    //   ### **[Name](url)**
    //   ### 6. **[Name](url)**
    //   ### 1. Name
    //   ### 🥇 1. Name
    //   ### Name
    const nameMatch =
      headingLine.match(/^#{2,3}\s+(?:\d+\.\s*)?(?:🥇\s*)?\*?\*?\[([^\]]+)\]/) ||
      headingLine.match(/^#{2,3}\s+\*?\*?(?:\d+\.\s*)?(?:🥇\s*)?([^*\n[(]+)/);
    if (!nameMatch) continue;
    const name = nameMatch[1].replace(/\*/g, "").replace(/^\d+\.\s*/, "").replace(/^Honorable Mention:\s*/i, "").trim();
    if (!name || name.toLowerCase().includes("verdict") || name.toLowerCase().includes("conclusion")) continue;

    // Find address line: contains a "<City>, CO" fragment.
    // Prefer a line that reads like a street address; prose paragraphs that
    // merely mention "Denver ... Colorado" must never be sent to the geocoder.
    const addressPart = (l: string) =>
      (l.split("|").find(seg => CITY_CO.test(seg)) ?? "").replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");
    const candidates = lines.filter(l => CITY_CO.test(l) && addressPart(l).length <= MAX_ADDRESS_LINE);
    const addrLine = candidates.find(l => /^\d/.test(stripLabel(l.replace(/\*+/g, "")))) ?? candidates[0];
    if (!addrLine) continue;

    // The address line may be just the address, OR "Name | Street, City, CO ZIP
    // (Hood) | $ | ...". Pick the pipe-segment that actually holds the address,
    // not blindly the first segment (which would be the bar name).
    const segments = addrLine.split("|");
    const addrSegment = segments.find(s => CITY_CO.test(s)) ?? segments[0];

    // Clean: unwrap markdown links, drop the (Neighborhood) parens, strip bold.
    let address = addrSegment
      .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
      .replace(/\([^)]*\)/g, "")
      .replace(/\*+/g, "")
      .trim();
    address = stripLabel(address);

    if (address.length < 8) continue;
    results.push({ name, address, isTop: firstRestaurant });
    firstRestaurant = false;
  }

  return results;
}
