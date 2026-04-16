export interface NewsletterIssue {
  slug: string;
  title: string;
  date: string;
  description: string;
  htmlFile: string;
}

export const newsletterIssues: NewsletterIssue[] = [
  {
    slug: "denver-bookstore-brewery-lesbian-bar-snoop-420",
    title: "Denver lost a bookstore, its favorite brewery, and its only lesbian bar, then booked Snoop Dogg on 4/20 to cope.",
    date: "2026-04-16",
    description: "Copper Kettle pours its last pint, Petals & Pages closes, The Pearl is done, and somehow Snoop Dogg and Ice Cube at Red Rocks on 4/20 is the city's answer. Plus the Nuggets open playoffs, Messi comes to Commerce City, and all the Denver events worth knowing.",
    htmlFile: "/newsletter-issues/denver-bookstore-brewery-lesbian-bar-snoop-420.html",
  },
  {
    slug: "denver-turkeys-debt-pig-roast-cop",
    title: "Denver is being invaded by turkeys, debt, and a woman who tried to throw a pig roast for a cop.",
    date: "2026-04-09",
    description: "Wild turkeys taking over Denver neighborhoods, Burger Jim's new bun maker, a Denver content creator meetup, the Sloan's Lake bar crawl golf tournament, and all the front range tea.",
    htmlFile: "/newsletter-issues/denver-turkeys-debt-pig-roast-cop.html",
  },
  {
    slug: "denver-dia-blackout-flights-metal-show",
    title: "Denver's Friday from hell: The DIA blackout, 463 frozen flights, and the metal show that refused to die",
    date: "2026-04-01",
    description: "DIA lost power and froze 463 flights, the Nuggets and Avs are on fire, the Rockies are practicing, and a metal show played on anyway. Plus Rockies Opening Day and the Ramen Renaissance.",
    htmlFile: "/newsletter-issues/denver-dia-blackout-flights-metal-show.html",
  },
  {
    slug: "denver-went-dark-dia-lost-power-lamb-of-god-fillmore",
    title: "Denver went dark, DIA lost power, 463 flights froze, and somehow Lamb of God still played the Fillmore on Friday",
    date: "2026-03-27",
    description: "Denver's biggest power outage in years knocked out DIA, froze hundreds of flights, and plunged neighborhoods dark — and Lamb of God played anyway.",
    htmlFile: "/newsletter-issues/denver-went-dark-dia-lost-power-lamb-of-god-fillmore.html",
  },
  {
    slug: "denver-did-denver-things-snowstorm-sunday",
    title: "Denver did Denver things: snowstorm Sunday, 85 degrees Friday, a flying semi, 20,000 without power",
    date: "2026-03-18",
    description: "Denver's wildest weather week yet, plus new restaurants, housing news, the NWSL team's rocky debut, and 90-MPH winds that sent a semi airborne.",
    htmlFile: "/newsletter-issues/denver-did-denver-things-snowstorm-sunday.html",
  },
  {
    slug: "denver-kept-together-hospital-shooting-trail-cpr-mafia-poker",
    title: "Denver kept it together this week: hospital shooting, trail CPR, mafia poker, frozen shelters",
    date: "2026-03-12",
    description: "A week of wild Denver stories — a hospital shooting, a trail rescue, underground poker, and shelters pushed to the limit in the cold.",
    htmlFile: "/newsletter-issues/denver-kept-together-hospital-shooting-trail-cpr-mafia-poker.html",
  },
  {
    slug: "denver-fires-big-brother-bans-masked-cops-sex-workers",
    title: "Denver Fires Big Brother, Bans Masked Cops, and Lets Sex Workers Off the Hook",
    date: "2026-03-05",
    description: "Denver ditches surveillance tech, bans masked police officers, and decriminalizes sex work in a wave of bold policy moves.",
    htmlFile: "/newsletter-issues/denver-fires-big-brother-bans-masked-cops-sex-workers.html",
  },
  {
    slug: "denver-jazz-fest-tickets",
    title: "Denver Jazz Fest tickets (for you?)",
    date: "2026-02-27",
    description: "A special edition on the Denver Jazz Festival, what's happening this weekend, and everything worth knowing in Denver right now.",
    htmlFile: "/newsletter-issues/denver-jazz-fest-tickets.html",
  },
  {
    slug: "denver-breaking-point-police-politics-tech-shakeups",
    title: "Denver Breaking Point as Police Politics and Tech Shakeups Unfold",
    date: "2026-02-24",
    description: "Denver reaches a breaking point with police politics, tech industry shakeups, and more local news unfolding across the city.",
    htmlFile: "/newsletter-issues/denver-breaking-point-police-politics-tech-shakeups.html",
  },
  {
    slug: "denver-norteno-legend-federal-strike-healthcare",
    title: "Denver Norteño legend performs as federal strike cuts millions from healthcare",
    date: "2026-02-19",
    description: "A Denver Norteño legend takes the stage, federal strikes impact healthcare funding, and more local news and events.",
    htmlFile: "/newsletter-issues/denver-norteno-legend-federal-strike-healthcare.html",
  },
  {
    slug: "denver-lawmakers-sue-ice-lgbtq-health-funds",
    title: "Denver lawmakers move to sue ICE while DC pulls LGBTQ health funds",
    date: "2026-02-11",
    description: "Denver lawmakers take action against ICE as Washington pulls LGBTQ health funding, plus more local news and events.",
    htmlFile: "/newsletter-issues/denver-lawmakers-sue-ice-lgbtq-health-funds.html",
  },
  {
    slug: "denver-newest-bar-tokyo-acid-trip-neon-city",
    title: "Denver's newest bar is a Tokyo acid trip inside the Neon city that's already raising eyebrows and breaking hearts",
    date: "2026-02-04",
    description: "Denver's newest bar brings a Tokyo acid trip vibe to Broadway, plus more local news and events.",
    htmlFile: "/newsletter-issues/denver-newest-bar-tokyo-acid-trip-neon-city.html",
  },
  {
    slug: "denver-jazz-band-titanic-theme-tech-bros-office",
    title: "Denver jazz band forced to play \"Titanic\" theme as tech bros freeze in voluntary office exodus",
    date: "2026-01-28",
    description: "Denver's tech scene does something weird, a jazz band becomes an unlikely symbol, and the city keeps moving in its own direction.",
    htmlFile: "/newsletter-issues/denver-jazz-band-titanic-theme-tech-bros-office.html",
  },
  {
    slug: "denver-tequila-exhibit-weird-weather-mlk-parade",
    title: "Denver tequila exhibit blamed for \"Weird Weather\" and drunken chaos at MLK parade",
    date: "2026-01-21",
    description: "A Denver tequila exhibit causes chaos at the MLK parade amid weird weather, plus more local news and events.",
    htmlFile: "/newsletter-issues/denver-tequila-exhibit-weird-weather-mlk-parade.html",
  },
  {
    slug: "denver-cowboy-town-daft-punk-stock-show",
    title: "Denver can't decide if it's a cowboy town or a Daft Punk party, and the stock show is ground zero",
    date: "2026-01-14",
    description: "Denver's identity crisis plays out at the stock show, blending cowboy culture with electronic beats.",
    htmlFile: "/newsletter-issues/denver-cowboy-town-daft-punk-stock-show.html",
  },
];
