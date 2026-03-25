import type { Metadata } from "next";
import { supabase } from "@/lib/supabase";
import { slugify } from "@/lib/slugify";
import PodcastEpisodeClient from "./PodcastEpisodeClient";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  try {
    const { data: episodes } = await supabase
      .from("podcast_episodes")
      .select("title, description, imageUrl");

    const episode = episodes?.find(
      (ep: { title: string; description: string; imageUrl?: string }) =>
        slugify(ep.title) === slug
    );

    if (!episode) {
      return {
        title: "Episode Not Found",
        robots: { index: false, follow: false },
      };
    }

    const ogImage = episode.imageUrl ?? "/og-image.jpg";

    return {
      title: episode.title,
      description: episode.description,
      alternates: {
        canonical: `https://realgooddenver.com/podcast/${slug}`,
      },
      openGraph: {
        title: episode.title,
        description: episode.description,
        url: `https://realgooddenver.com/podcast/${slug}`,
        images: [{ url: ogImage, width: 1200, height: 630 }],
      },
      twitter: {
        card: "summary_large_image",
        site: "@realgooddenver",
        title: episode.title,
        description: episode.description,
        images: [ogImage],
      },
    };
  } catch {
    return {
      title: "Real Good Denver Podcast Episode",
      description: "Listen to this episode of the Real Good Denver podcast.",
    };
  }
}

export default function EpisodeDetailPage() {
  return <PodcastEpisodeClient />;
}
