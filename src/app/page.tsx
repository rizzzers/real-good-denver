import { Metadata } from "next";
import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import StoriesGrid from "@/components/StoriesGrid";
import StatementSection from "@/components/StatementSection";
import ChannelsSection from "@/components/ChannelsSection";
import PullQuote from "@/components/PullQuote";
import LatestIssues from "@/components/LatestIssues";
import NewsletterCTA from "@/components/NewsletterCTA";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Real Good Denver — Denver's Newsletter & Podcast",
  description: "Denver events, local news, jobs, and the stuff worth knowing, delivered to your inbox every week. Denver's fastest growing newsletter.",
};

export default function Home() {
  return (
    <div className="relative min-h-screen">
      <Navigation />
      <HeroSection />
      <StoriesGrid />
      <StatementSection />
      <ChannelsSection />
      <PullQuote />
      <LatestIssues />
      <NewsletterCTA />
      <Footer />
    </div>
  );
}
