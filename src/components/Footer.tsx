import Link from "next/link";
import { Youtube, Instagram, ArrowUpRight } from "lucide-react";

const navigation = {
  main: [
    { name: "Newsletter", href: "/newsletter" },
    { name: "Podcast", href: "/podcast" },
    { name: "Best of Denver", href: "/best-of-denver" },
    { name: "Events", href: "/events" },
    { name: "Book Club", href: "/book-club" },
    { name: "Jobs", href: "/jobs" },
    { name: "Resources", href: "/resources" },
  ],
  company: [
    { name: "About", href: "/about" },
    { name: "Work With Us", href: "/work-with-us" },
    { name: "Terms & Privacy", href: "/terms-and-privacy" },
  ],
  social: [
    { name: "YouTube", href: "https://www.youtube.com/@RealGoodDenver", icon: Youtube },
    { name: "Instagram", href: "https://www.instagram.com/real_good_denver/", icon: Instagram },
    {
      name: "TikTok",
      href: "https://www.tiktok.com/@realgooddenver",
      icon: () => (
        <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
        </svg>
      ),
    },
  ],
  podcast: [
    { name: "Apple Podcasts", href: "https://podcasts.apple.com/us/podcast/real-good-denver/id602890961" },
    { name: "Spotify", href: "https://open.spotify.com/show/27VuIWVn2CfSGliuKNXkt7" },
  ],
};

const Footer = () => {
  return (
    <footer className="relative bg-foreground overflow-hidden">
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full bg-primary/5 blur-[150px] pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto px-6 pt-20 pb-10">
        <div className="flex flex-col md:flex-row items-start justify-between gap-10 mb-16">
          <div className="max-w-sm">
            <Link href="/" className="inline-block mb-5">
              <img
                src="/real-good-denver-logo.png"
                alt="Real Good Denver"
                className="h-14 opacity-90"
              />
            </Link>
            <p className="text-background/50 text-sm leading-relaxed">
              Your weekly guide to Denver events, local news, and the good stuff worth knowing.
            </p>
          </div>

          <div className="flex gap-3">
            {navigation.social.map((item) => {
              const Icon = item.icon;
              return (
                <a
                  key={item.name}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full border border-background/10 flex items-center justify-center text-background/50 hover:text-primary hover:border-primary/40 transition-all duration-300"
                  aria-label={item.name}
                >
                  <Icon className="h-4 w-4" />
                </a>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-10 mb-16">
          <div>
            <p className="text-xs font-medium uppercase tracking-widest text-background/30 mb-5">Explore</p>
            <ul className="space-y-3">
              {navigation.main.map((item) => (
                <li key={item.name}>
                  <Link href={item.href} className="text-sm text-background/60 hover:text-background transition-colors duration-200">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-widest text-background/30 mb-5">Company</p>
            <ul className="space-y-3">
              {navigation.company.map((item) => (
                <li key={item.name}>
                  <Link href={item.href} className="text-sm text-background/60 hover:text-background transition-colors duration-200">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-widest text-background/30 mb-5">Listen</p>
            <ul className="space-y-3">
              {navigation.podcast.map((item) => (
                <li key={item.name}>
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm text-background/60 hover:text-background transition-colors duration-200 group"
                  >
                    {item.name}
                    <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-background/8 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-background/30 text-xs">
            © {new Date().getFullYear()} Real Good Denver. All rights reserved.
          </p>
          <p className="text-background/30 text-xs">Made with ❤️ in Denver, CO</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
