export interface CommunityEvent {
  id: string;
  title: string;
  date: string; // "YYYY-MM-DD" — use start date for multi-day events
  time?: string; // e.g. "1:00–8:00 PM"
  location: string;
  description: string;
  link?: string;
}

export const communityEvents: CommunityEvent[] = [
  {
    id: "olive-finch-golden-triangle-grand-opening",
    title: "Olive & Finch Golden Triangle — Grand Opening Weekend",
    date: "2026-04-25",
    location: "1140 Bannock St., Denver (Golden Triangle)",
    description:
      "Grand opening of the largest Olive & Finch location yet. Two days of DJs, live painting, complimentary toasts, and a refreshed dinner menu. Running Saturday–Sunday, April 25–26.",
  },
  {
    id: "denver-press-club-rick-dallago-2026",
    title: "Meet Local Artist Rick Dallago at Crafting for Democracy",
    date: "2026-05-08",
    location: "Denver Press Club",
    description:
      "Painter, film producer, and arts instructor Rick Dallago joins the Crafting for Democracy crew for a casual conversation about his artistic process and art as resistance. Raised in NYC, 30 years in LA, now Denver-based since 2019. He calls himself a \"snarky Norman Rockwell.\" His oil pastel works are satirical, humorous, and worth knowing about. Bring your curiosity and questions. Crafters and non-crafters both welcome.",
  },
  {
    id: "lets-vibe-boulder-cinco-de-vibo",
    title: "Let's Vibe Boulder — Cinco de Vibo",
    date: "2026-05-05",
    time: "3:45–7:00 PM",
    location: "Junkyard Social, Boulder, CO",
    description:
      "AI meetup for builders, hackers, and vibe coders of all levels. Kick off with Vibe Coding Power Hour (3:45–5:00 PM) — grab an idea, build something fast, and demo it. Then the full Let's Vibe meetup runs 5:00–7:00 PM with networking, sharing, and the latest in AI tools. Facilitated by Danny Newman. Junkyard Social is a non-profit venue — sign the waiver ahead of time at the link below.",
    link: "https://revelco.org/events/bsw-2026?session=77fc0b76-ea21-417e-a2eb-baf3e1c99827",
  },
  {
    id: "adaptive-bike-companion-douglas-county-2026",
    title: "Volunteer: Adaptive Bike Companion (Douglas County)",
    date: "2026-05-11",
    time: "Ongoing through September. Shifts vary Mon-Fri.",
    location: "Various trails, Douglas County, CO",
    description:
      "Help residents with Intellectual and Developmental Disabilities (IDD) explore trails as an Adaptive Bike Companion. No biking experience or personal bike required. The program runs May through September, one or two shifts per week. Shift options: Mon/Wed/Fri 8:15-11:15 a.m. or 11:15 a.m.-2:15 p.m.; Tue/Thu 11:15 a.m.-2:15 p.m. or 4:45-7:45 p.m. A 4-5 week commitment is preferred. Requirements include a background check, CAPS check, proof of first two COVID vaccinations, and additional training.",
    link: "https://www.jewishfamilyservice.org/volunteer-disability-services",
  },
  {
    id: "ritz-carlton-derby-day-2026",
    title: "9th Annual Derby Day Party",
    date: "2026-05-02",
    time: "1:00–8:00 PM",
    location: "The Ritz-Carlton, Denver",
    description:
      "21+ Kentucky Derby celebration with video screens, DJs, a live band, Best Dressed contest, and Mint Juleps. Tickets $35.",
  },
  {
    id: "clayton-derby-2026",
    title: "The Clayton Derby",
    date: "2026-05-02",
    time: "1:00–6:30 PM",
    location: "Clayton Hotel & Members Club, Denver",
    description:
      "21+ Derby afternoon with open bar, all-you-can-eat spread, a cigar bar, and Best Look contest. VIP tier includes access to Halcyon's Rare Bird rooftop party.",
  },
  {
    id: "bodies-the-science-within-denver",
    title: "Bodies: The Science Within",
    date: "2026-05-15",
    time: "11:00 AM – 7:00 PM daily (runs through June 28)",
    location: "Denver Pavilions, 500 16th Street Mall, Suite 280, Denver",
    description:
      "U.S. debut of this globally touring exhibition, seen by 5M+ people across 60+ cities. Explore real preserved human specimens organized by body system — respiration, movement, nervous system, and more — presented in English and Spanish. Open daily 11 AM–7 PM through June 28. Tickets from $17 (kids) / $36 (adults) on weekends; weekday discounts available. $1 of each ticket benefits local nonprofits.",
    link: "https://www.bodiestour.com",
  },
  {
    id: "swing-for-hope-topgolf-2026",
    title: "Swing for Hope — DCAC Fundraiser at Topgolf",
    date: "2026-05-14",
    location: "Topgolf, Denver",
    description:
      "An evening benefiting the Denver Children's Advocacy Center (DCAC). Celebrate child abuse prevention with a client impact story, award ceremony, happy hour, two hours of Topgolf play, and a catered buffet dinner. Earn your ticket through the Hope Starts Here fundraiser: raise $500 as an individual (1 ticket) or $4,000 as a team of up to 8. Founded in 1995, DCAC's mission is to prevent abuse, strengthen families, and restore childhood.",
    link: "https://secure.qgiv.com/for/swingforhope2026/event/swingforhope/",
  },
  {
    id: "dcf-cattle-roping-union-station-2026",
    title: "Cattle Roping Competition — Denver Children's Foundation",
    date: "2026-05-16",
    time: "12:30–5:30 PM",
    location: "Union Station, Denver",
    description:
      "Free to enter. Rope a bull dummy at 40 ft for a shot at $5,000 cash — smaller prizes for shorter throws. Benefits the Denver Children's Foundation.",
  },
  {
    id: "drink-red-wear-red-2026",
    title: "Drink Red Wear Red",
    date: "2026-05-28",
    time: "6:00–9:30 PM",
    location: "Mile High Station & Ironworks, Denver",
    description:
      "Denver's kickoff to summer party season. Dress in red (funky to formal) and dig into unlimited bites from 20+ local restaurants — STK, Tavernetta, Matsuhisa, Table 6, and more — plus endless wine tastings, signature cocktails, beer, N/A options, big-energy DJs, a Best Dressed contest, and a silent auction of culinary experiences. VIP access includes the Ironworks exclusive area and top-tier restaurant tastings. Benefits the Colorado Restaurant Foundation and the Mile High Chapter Hardship Fund for hospitality workers.",
    link: "https://corestaurant.org/drink-red-wear-red-2026/",
  },
  {
    id: "flight-club-denver-spring-menu-2026",
    title: "Flight Club Denver — Spring in Bloom Menu",
    date: "2026-05-05",
    location: "Flight Club Denver",
    description:
      "Ongoing. Flight Club's new seasonal menu is here — bright citrus cocktails, shareable bites (sliders, tacos, easy pass-around plates), and Social Darts®. Good excuse to rally the group chat.",
    link: "https://www.flightclubdartsusa.com/denver",
  },
  {
    id: "riaht-fest-2026",
    title: "R!AHT Fest 2026: Music and Wellness Festival",
    date: "2026-07-31",
    time: "July 31 through August 2 (2 nights camping, 2 days of music)",
    location: "Westcliffe, Colorado Mountains",
    description:
      "Two days of live music and wellness workshops under the stars in the Colorado mountains. Camping options include tent camping ($150), car camping without power ($180), car camping with power ($200), and premium car/RV camping ($210). All passes include full festival access Friday through Sunday. Early bird pricing available now.",
    link: "https://www.magnifywithmariah.com/riahtfest",
  },
  {
    id: "soda-club-denver-opening-2026",
    title: "Soda Club Denver — Opening August 2026",
    date: "2026-08-01",
    location: "Denver (exact address TBD)",
    description:
      "The beloved NYC pasta and natural wine spot is coming to Denver. Known for handmade pasta, a vibrant natural wine program, and a romantic, playful atmosphere — Soda Club is bringing the whole vibe to the Mile High City. Opening August 2026.",
    link: "https://www.sodaclubnyc.com/soda-club-denver",
  },
  {
    id: "denver-chalk-art-festival-2026",
    title: "24th Annual Denver Chalk Art Festival",
    date: "2026-06-06",
    time: "10:00 AM – 8:00 PM (Sat & Sun, June 6–7)",
    location: "Golden Triangle Creative District, Denver (Speer Blvd, Colfax Ave & Lincoln St)",
    description:
      "Free, family-friendly. 200+ professional, amateur, and student artists transform the streets of Denver's Golden Triangle into a massive open-air chalk gallery — inspired by the 400-year-old Italian tradition of street painting. Watch art come to life in real time, meet artists, vote in the People's Choice Award, and stick around for live music, food trucks, craft drinks, and interactive art experiences. One of Denver's most photogenic summer traditions.",
    link: "https://denverchalk.art",
  },
  {
    id: "dcf-barn-party-littleton-polo-2026",
    title: "Barn Party — Denver Children's Foundation",
    date: "2026-06-06",
    location: "Littleton Polo Reserve",
    description:
      "Live music fundraiser at the Polo Reserve's barn with open bar, food, vendors, and a mechanical bull. Benefits the Denver Children's Foundation.",
  },
  {
    id: "romyo-rite-i-the-making-2026",
    title: "Six Nights, Six Rites at Rōmyō — Rite I: The Making",
    date: "2026-05-08",
    time: "5:30 PM",
    location: "Larimer Square, Denver (Rōmyō)",
    description:
      "Step into the chaos of design with a living vision board and toast the new design elements as the space begins to take shape. One of six free, reservation-only pop-up events hosted by Bonanno Concepts as they transform Larimer Square into Rōmyō this summer. Each night in the series includes an offering (something poured, passed, or tasted), a ritual (something shared or enacted), and a token to take with you. Space is limited.",
    link: "https://www.opentable.com/restref/client/?rid=1401487&restref=1401487&accessRuleToken=7c3cb57f-f676-4041-a360-c2e6dc7557f2&covers=1&dateTime=2026-05-08T17:30",
  },
  {
    id: "romyo-rite-ii-transformation-2026",
    title: "Six Nights, Six Rites at Rōmyō — Rite II: Transformation",
    date: "2026-05-15",
    time: "5:30 PM",
    location: "Larimer Square, Denver (Rōmyō)",
    description:
      "Get a taste of snow in summer as the Bonannos play with Kakigōri (fluffy Japanese shaved ice) cocktails on the patio. Part of the six-event 'Six Nights, Six Rites' series giving guests an inside look at Rōmyō as it comes to life. Free, reservation only. Each event includes an offering, a ritual, and a token to take home. Guests can also continue the evening at the Rōmyō r&d pop-up dinner at Mizuna (7:15 PM, ticketed separately).",
    link: "https://www.opentable.com/restref/client/?rid=1401487&restref=1401487&accessRuleToken=7c3cb57f-f676-4041-a360-c2e6dc7557f2&covers=1&dateTime=2026-05-15T17:30",
  },
  {
    id: "romyo-popup-mizuna-1-2026",
    title: "Rōmyō Pop-Up Dinner #1 at Mizuna",
    date: "2026-05-15",
    time: "7:15 PM",
    location: "Mizuna, Denver",
    description:
      "Seven-course r&d dinner for Rōmyō, hosted by the Bonannos at Mizuna. Be among the first to experience the evolving Rome-meets-Tokyo itameshi menu. $95 per person, with an optional wine and sake pairing for $80. This dinner falls on the same evening as Rite II of the 'Six Nights, Six Rites' series at Rōmyō on Larimer Square, so guests can partake in the rite before heading to Mizuna.",
    link: "https://www.opentable.com/booking/experiences-availability?rid=3469&restref=3469&experienceId=713252&utm_source=external&utm_medium=referral&utm_campaign=shared&dateTime=2026-05-15T19%3A00%3A00&partySize=2",
  },
  {
    id: "romyo-rite-iii-first-taste-2026",
    title: "Six Nights, Six Rites at Rōmyō — Rite III: First Taste",
    date: "2026-05-22",
    time: "5:30 PM",
    location: "Larimer Square, Denver (Rōmyō)",
    description:
      "Before a menu, there is instinct. Expect small tastes of what's to come as Frank plays with texture and flavor. Free, reservation only, and part of the 'Six Nights, Six Rites' series as Bonanno Concepts builds out Rōmyō this summer on Larimer Square. Each event includes an offering, a ritual, and a token. Space is limited.",
    link: "https://www.opentable.com/restref/client/?rid=1401487&restref=1401487&accessRuleToken=7c3cb57f-f676-4041-a360-c2e6dc7557f2&covers=1&dateTime=2026-05-22T17:30",
  },
  {
    id: "romyo-rite-iv-unlikely-alliances-2026",
    title: "Six Nights, Six Rites at Rōmyō — Rite IV: Unlikely Alliances",
    date: "2026-05-29",
    time: "5:30 PM",
    location: "Larimer Square, Denver (Rōmyō)",
    description:
      "Expect the unexpected and partake in the refreshing delight that is Jelly beer, a super-chilled beer that yields a novel slushy texture. Free, reservation only. Part of the six-event 'Six Nights, Six Rites' series hosted by Bonanno Concepts as they bring Rōmyō to life on Larimer Square. Each event includes an offering, a ritual, and a token. Space is limited.",
    link: "https://www.opentable.com/restref/client/?rid=1401487&restref=1401487&accessRuleToken=7c3cb57f-f676-4041-a360-c2e6dc7557f2&covers=1&dateTime=2026-05-29T17:30",
  },
  {
    id: "romyo-rite-v-kamigami-2026",
    title: "Six Nights, Six Rites at Rōmyō — Rite V: Kamigami",
    date: "2026-06-19",
    time: "5:30 PM",
    location: "Larimer Square, Denver (Rōmyō)",
    description:
      "As the space awakens, join the Bonannos to fill it with good intentions and blessings. Free, reservation only. One of six immersive pop-up events in the 'Six Nights, Six Rites' series, giving guests a rare look at Rōmyō as it transforms on Larimer Square ahead of its summer opening. Each event includes an offering, a ritual, and a token. Space is limited.",
    link: "https://www.opentable.com/restref/client/?rid=1401487&restref=1401487&accessRuleToken=7c3cb57f-f676-4041-a360-c2e6dc7557f2&covers=1&dateTime=2026-06-19T17:30",
  },
  {
    id: "romyo-rite-vi-bearing-happy-witness-2026",
    title: "Six Nights, Six Rites at Rōmyō — Rite VI: Bearing Happy Witness",
    date: "2026-06-26",
    time: "5:30 PM",
    location: "Larimer Square, Denver (Rōmyō)",
    description:
      "See the change come together and become a character in the restaurant's story with Wes Anderson-style photo stations placed in colorful spots around the space. The final event in the 'Six Nights, Six Rites' series, hosted by Bonanno Concepts as the Larimer Square transformation reaches its conclusion. Free, reservation only. Each event in the series includes an offering, a ritual, and a token. Space is limited.",
    link: "https://www.opentable.com/restref/client/?rid=1401487&restref=1401487&accessRuleToken=7c3cb57f-f676-4041-a360-c2e6dc7557f2&covers=1&dateTime=2026-06-26T17:30",
  },
];
