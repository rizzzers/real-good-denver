export function generateMapsUrl(name: string, neighborhood?: string): string {
  const query = neighborhood
    ? `${name} ${neighborhood} Denver CO`
    : `${name} Denver CO`;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}
