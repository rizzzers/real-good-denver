import type { Post } from "@/data/posts";
import { extractPlaces } from "@/lib/places";

// Tags on most guides that say nothing about how two guides relate.
const GENERIC_TAGS = new Set([
  "best of", "denver", "denver restaurants", "denver bars", "food & drink",
  "restaurants", "local favorites", "local eats", "denver living",
]);

const specificTags = (post: Post) =>
  new Set(post.tags.map((t) => t.toLowerCase()).filter((t) => !GENERIC_TAGS.has(t)));

const placeKeys = (post: Post) =>
  new Set(extractPlaces(post).map((p) => `${p.streetAddress.toLowerCase()}|${p.postalCode}`));

export function relatedPosts(post: Post, all: Post[], count = 4): Post[] {
  const tags = specificTags(post);
  const places = placeKeys(post);

  return all
    .filter((other) => other.slug !== post.slug)
    .map((other) => {
      const sharedTags = [...specificTags(other)].filter((t) => tags.has(t)).length;
      const sharedPlaces = [...placeKeys(other)].filter((k) => places.has(k)).length;
      const score =
        sharedTags * 3 +
        Math.min(sharedPlaces, 3) +
        (other.category === post.category ? 1 : 0) +
        new Date(other.date).getTime() / 1e14; // tiebreak: newer first
      return { other, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, count)
    .map(({ other }) => other);
}
