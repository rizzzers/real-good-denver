export interface CommunityEvent {
  id: string;
  title: string;
  date: string; // "YYYY-MM-DD": use start date for multi-day events
  time?: string; // e.g. "1:00–8:00 PM"
  location: string;
  description: string;
  link?: string;
}

export const communityEvents: CommunityEvent[] = [
  {
    id: "olive-finch-golden-triangle-grand-opening",
    title: "Olive & Finch Golden Triangle: Grand Opening Weekend",
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
    title: "Let's Vibe Boulder: Cinco de Vibo",
    date: "2026-05-05",
    time: "3:45–7:00 PM",
    location: "Junkyard Social, Boulder, CO",
    description:
      "AI meetup for builders, hackers, and vibe coders of all levels. Kick off with Vibe Coding Power Hour (3:45–5:00 PM): grab an idea, build something fast, and demo it. Then the full Let's Vibe meetup runs 5:00–7:00 PM with networking, sharing, and the latest in AI tools. Facilitated by Danny Newman. Junkyard Social is a non-profit venue: sign the waiver ahead of time at the link below.",
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
      "U.S. debut of this globally touring exhibition, seen by 5M+ people across 60+ cities. Explore real preserved human specimens organized by body system: respiration, movement, nervous system, and more: presented in English and Spanish. Open daily 11 AM–7 PM through June 28. Tickets from $17 (kids) / $36 (adults) on weekends; weekday discounts available. $1 of each ticket benefits local nonprofits.",
    link: "https://www.bodiestour.com",
  },
  {
    id: "swing-for-hope-topgolf-2026",
    title: "Swing for Hope: DCAC Fundraiser at Topgolf",
    date: "2026-05-14",
    location: "Topgolf, Denver",
    description:
      "An evening benefiting the Denver Children's Advocacy Center (DCAC). Celebrate child abuse prevention with a client impact story, award ceremony, happy hour, two hours of Topgolf play, and a catered buffet dinner. Earn your ticket through the Hope Starts Here fundraiser: raise $500 as an individual (1 ticket) or $4,000 as a team of up to 8. Founded in 1995, DCAC's mission is to prevent abuse, strengthen families, and restore childhood.",
    link: "https://secure.qgiv.com/for/swingforhope2026/event/swingforhope/",
  },
  {
    id: "dcf-cattle-roping-union-station-2026",
    title: "Cattle Roping Competition: Denver Children's Foundation",
    date: "2026-05-16",
    time: "12:30–5:30 PM",
    location: "Union Station, Denver",
    description:
      "Free to enter. Rope a bull dummy at 40 ft for a shot at $5,000 cash: smaller prizes for shorter throws. Benefits the Denver Children's Foundation.",
  },
  {
    id: "senor-bear-tajin-tahini-dinner-2026",
    title: "Tajín & Tahini Fusion Dinner at Señor Bear",
    date: "2026-05-28",
    time: "5:00 PM",
    location: "Señor Bear, Denver",
    description:
      "Señor Bear's Blake Edmunds and Ash'Kara's Reggie Dotson team up for an intimate, high-energy dinner blending Latin flavor with Mediterranean soul. Expect dishes like Gordo Crunch hummus and falafel with creamy salsa verde, Turkish ezma relish, and sorrel. The evening is part of The Culinary Creative Group's (CCG) mission to invest in culinary talent: Edmunds was recently promoted to culinary director after more than a decade with CCG, while Dotson led Ash'Kara to a Michelin Bib Gourmand three times in a row. Multi-course dinner is $55 per person, with an optional curated beverage pairing for an extra $36.",
    link: "https://www.opentable.com/r/senor-bear-denver",
  },
  {
    id: "drink-red-wear-red-2026",
    title: "Drink Red Wear Red",
    date: "2026-05-28",
    time: "6:00–9:30 PM",
    location: "Mile High Station & Ironworks, Denver",
    description:
      "Denver's kickoff to summer party season. Dress in red (funky to formal) and dig into unlimited bites from 20+ local restaurants: STK, Tavernetta, Matsuhisa, Table 6, and more: plus endless wine tastings, signature cocktails, beer, N/A options, big-energy DJs, a Best Dressed contest, and a silent auction of culinary experiences. VIP access includes the Ironworks exclusive area and top-tier restaurant tastings. Benefits the Colorado Restaurant Foundation and the Mile High Chapter Hardship Fund for hospitality workers.",
    link: "https://corestaurant.org/drink-red-wear-red-2026/",
  },
  {
    id: "flight-club-denver-spring-menu-2026",
    title: "Flight Club Denver: Spring in Bloom Menu",
    date: "2026-05-05",
    location: "Flight Club Denver",
    description:
      "Ongoing. Flight Club's new seasonal menu is here: bright citrus cocktails, shareable bites (sliders, tacos, easy pass-around plates), and Social Darts®. Good excuse to rally the group chat.",
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
    title: "Soda Club Denver: Opening August 2026",
    date: "2026-08-01",
    location: "Denver (exact address TBD)",
    description:
      "The beloved NYC pasta and natural wine spot is coming to Denver. Known for handmade pasta, a vibrant natural wine program, and a romantic, playful atmosphere: Soda Club is bringing the whole vibe to the Mile High City. Opening August 2026.",
    link: "https://www.sodaclubnyc.com/soda-club-denver",
  },
  {
    id: "denver-chalk-art-festival-2026",
    title: "24th Annual Denver Chalk Art Festival",
    date: "2026-06-06",
    time: "10:00 AM – 8:00 PM (Sat & Sun, June 6–7)",
    location: "Golden Triangle Creative District, Denver (Speer Blvd, Colfax Ave & Lincoln St)",
    description:
      "Free, family-friendly. 200+ professional, amateur, and student artists transform the streets of Denver's Golden Triangle into a massive open-air chalk gallery: inspired by the 400-year-old Italian tradition of street painting. Watch art come to life in real time, meet artists, vote in the People's Choice Award, and stick around for live music, food trucks, craft drinks, and interactive art experiences. One of Denver's most photogenic summer traditions.",
    link: "https://denverchalk.art",
  },
  {
    id: "dcf-barn-party-littleton-polo-2026",
    title: "Barn Party: Denver Children's Foundation",
    date: "2026-06-06",
    location: "Littleton Polo Reserve",
    description:
      "Live music fundraiser at the Polo Reserve's barn with open bar, food, vendors, and a mechanical bull. Benefits the Denver Children's Foundation.",
  },
  {
    id: "romyo-rite-i-the-making-2026",
    title: "Six Nights, Six Rites at Rōmyō: Rite I: The Making",
    date: "2026-05-08",
    time: "5:30 PM",
    location: "Larimer Square, Denver (Rōmyō)",
    description:
      "Step into the chaos of design with a living vision board and toast the new design elements as the space begins to take shape. One of six free, reservation-only pop-up events hosted by Bonanno Concepts as they transform Larimer Square into Rōmyō this summer. Each night in the series includes an offering (something poured, passed, or tasted), a ritual (something shared or enacted), and a token to take with you. Space is limited.",
    link: "https://www.opentable.com/restref/client/?rid=1401487&restref=1401487&accessRuleToken=7c3cb57f-f676-4041-a360-c2e6dc7557f2&covers=1&dateTime=2026-05-08T17:30",
  },
  {
    id: "romyo-rite-ii-transformation-2026",
    title: "Six Nights, Six Rites at Rōmyō: Rite II: Transformation",
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
    title: "Six Nights, Six Rites at Rōmyō: Rite III: First Taste",
    date: "2026-05-22",
    time: "5:30 PM",
    location: "Larimer Square, Denver (Rōmyō)",
    description:
      "Before a menu, there is instinct. Expect small tastes of what's to come as Frank plays with texture and flavor. Free, reservation only, and part of the 'Six Nights, Six Rites' series as Bonanno Concepts builds out Rōmyō this summer on Larimer Square. Each event includes an offering, a ritual, and a token. Space is limited.",
    link: "https://www.opentable.com/restref/client/?rid=1401487&restref=1401487&accessRuleToken=7c3cb57f-f676-4041-a360-c2e6dc7557f2&covers=1&dateTime=2026-05-22T17:30",
  },
  {
    id: "romyo-rite-iv-unlikely-alliances-2026",
    title: "Six Nights, Six Rites at Rōmyō: Rite IV: Unlikely Alliances",
    date: "2026-05-29",
    time: "5:30 PM",
    location: "Larimer Square, Denver (Rōmyō)",
    description:
      "Expect the unexpected and partake in the refreshing delight that is Jelly beer, a super-chilled beer that yields a novel slushy texture. Free, reservation only. Part of the six-event 'Six Nights, Six Rites' series hosted by Bonanno Concepts as they bring Rōmyō to life on Larimer Square. Each event includes an offering, a ritual, and a token. Space is limited.",
    link: "https://www.opentable.com/restref/client/?rid=1401487&restref=1401487&accessRuleToken=7c3cb57f-f676-4041-a360-c2e6dc7557f2&covers=1&dateTime=2026-05-29T17:30",
  },
  {
    id: "networking-practice-lab-2026",
    title: "Networking Practice Lab",
    date: "2026-06-18",
    time: "June 18–19",
    location: "Denver, CO",
    description:
      "A two-day workshop for entrepreneurs, professionals, community builders, career changers, or anyone tired of networking feeling transactional. You'll practice conversations that put the person before the profession, learn how to prepare for events strategically, strengthen your current network, build a 90-day networking plan, and put your skills into action at a real event. Two things can be true at the same time: networking can be thoughtful, generous, and authentic while also creating real opportunities, referrals, partnerships, and growth.",
    link: "https://www.articulated-intelligence.com/practice-lab",
  },
  {
    id: "romyo-rite-v-kamigami-2026",
    title: "Six Nights, Six Rites at Rōmyō: Rite V: Kamigami",
    date: "2026-06-19",
    time: "5:30 PM",
    location: "Larimer Square, Denver (Rōmyō)",
    description:
      "As the space awakens, join the Bonannos to fill it with good intentions and blessings. Free, reservation only. One of six immersive pop-up events in the 'Six Nights, Six Rites' series, giving guests a rare look at Rōmyō as it transforms on Larimer Square ahead of its summer opening. Each event includes an offering, a ritual, and a token. Space is limited.",
    link: "https://www.opentable.com/restref/client/?rid=1401487&restref=1401487&accessRuleToken=7c3cb57f-f676-4041-a360-c2e6dc7557f2&covers=1&dateTime=2026-06-19T17:30",
  },
  {
    id: "romyo-rite-vi-bearing-happy-witness-2026",
    title: "Six Nights, Six Rites at Rōmyō: Rite VI: Bearing Happy Witness",
    date: "2026-06-26",
    time: "5:30 PM",
    location: "Larimer Square, Denver (Rōmyō)",
    description:
      "See the change come together and become a character in the restaurant's story with Wes Anderson-style photo stations placed in colorful spots around the space. The final event in the 'Six Nights, Six Rites' series, hosted by Bonanno Concepts as the Larimer Square transformation reaches its conclusion. Free, reservation only. Each event in the series includes an offering, a ritual, and a token. Space is limited.",
    link: "https://www.opentable.com/restref/client/?rid=1401487&restref=1401487&accessRuleToken=7c3cb57f-f676-4041-a360-c2e6dc7557f2&covers=1&dateTime=2026-06-26T17:30",
  },
  {
    id: "ritz-carlton-padel-haus-stay-play",
    title: "The Ritz-Carlton x Padel Haus Stay & Play Package",
    date: "2026-05-27",
    location: "The Ritz-Carlton, Denver",
    description:
      "The Ritz-Carlton, Denver has partnered with Padel Haus to launch an exclusive Stay & Play Package, timed to the debut of Padel Haus Denver, the newest location from the leading premium indoor padel club in the U.S. The package includes two nights at the Ritz-Carlton, transfers to and from Padel Haus, a private lesson with a coach, two hours of play, dinner at Elway's Downtown (up to $250), and a custom Ritz-Carlton x Padel Haus racket with shirt and water bottle. Starting rate: $1,100/night.",
  },
  {
    id: "denver-press-club-book-talk-melissa-doman",
    title: "Book Talk: Cornered Office with Melissa Doman",
    date: "2026-05-28",
    time: "6:30 PM",
    location: "Denver Press Club, 1330 Glenarm Place",
    description:
      "Colorado-based organizational psychologist Melissa Doman brings her new book to the Denver Press Club for an evening conversation about leadership mental health. Cornered Office makes the case that leaders need support too, with data-backed research and practical steps for managers and executives. Doman has worked with Google, Microsoft, Salesforce, and Siemens, spoken at SXSW, and been featured in CNN, Vogue, NPR, and Fast Company. General Admission: $15. Member Admission: $5. Limited tickets.",
    link: "https://denverpressclub.org/event/book-talk-with-melissa-doman-ma/",
  },
  {
    id: "art-hotel-chef-cycle-sip-for-a-cause",
    title: "Sip for a Cause: Chef Cycle at FIRE Restaurant",
    date: "2026-06-01",
    time: "Throughout June",
    location: "FIRE Restaurant & Lounge at The ART Hotel Denver",
    description:
      "The ART Hotel Denver is supporting the 2026 Chef Cycle, a 200-mile race uniting chefs and hospitality professionals to fight childhood hunger for No Kid Hungry. All June at FIRE Restaurant, Tito's will donate $1 to No Kid Hungry for every Tito's Handmade Vodka cocktail sold. AGM Tobias Burkhalter is riding for the fourth consecutive year alongside Michelin-starred Chef Byron Gomez, having raised over $7,600 of his $13,000 goal. The Commonwealth Hotels team has collectively raised approximately $10,000 for the cause.",
  },
  {
    id: "maria-empanada-world-cup",
    title: "World Cup Fútbol HQ at Maria Empanada",
    date: "2026-06-11",
    time: "June 11 through July 19",
    location: "Maria Empanada (South Broadway and Riverview locations)",
    description:
      "Maria Empanada's South Broadway and Riverview locations are your fútbol headquarters for the World Cup. Both spots will air every match during operating hours with beer bucket specials and a family-friendly game-day atmosphere. Fresh Baked Bundles are available starting June 1: 3 empanadas with one dipping sauce for $15, 6 with two sauces for $30, or 12 with four sauces for $60. Available in-store and for takeout.",
  },
  {
    id: "ay-papi-world-cup",
    title: "Fútbol Lives Here at Ay Papi",
    date: "2026-06-11",
    time: "June 11 through July 19",
    location: "Ay Papi, Cherry Creek",
    description:
      "Cherry Creek's destination for Latin culture and cocktails just installed brand-new big-screen TVs for the World Cup. Ay Papi will stream every match during operating hours and open early for select games. Limited-time drinks include The Ti Breaker (Ti punch with St. Benevolence Haitian Rum), Bicycle Kick (Carajillo-inspired with Mexican Coke, Licor 43, and Mr. Black), and The Pitch (Casamigos Margaritas), plus beer and cocktail pitcher specials. Reservations encouraged at aypapidenver.com.",
  },
  {
    id: "ritz-carlton-pawsh-hour-2026",
    title: "Pawsh Hour: Furry Friends Fiesta at The Ritz-Carlton",
    date: "2026-06-18",
    time: "5:00–7:00 PM",
    location: "The Ritz-Carlton, Denver, 1881 Curtis Street, Denver CO 80202",
    description:
      "A free, dog-friendly happy hour with a Mexican-themed spread at The Ritz-Carlton, Denver. Meet rescue animals from Evergreen Animal Protective League, sample premium dog treats from Full Moon Pet, graze gourmet snack boards from Boardz 4 Budz, and get vet consultations from Sploot Veterinary. Plus: a custom photo op, puppy play zone, dog-safe infused waters, and a bandana design activity. No tickets required, but RSVPs are encouraged. Complimentary parking available.",
    link: "https://www.eventbrite.com/e/pawsh-hour-furry-friends-fiesta-at-the-ritz-carlton-denver-tickets-1989833631958",
  },
  {
    id: "dpc-congressional-forum-2026",
    title: "Colorado's 1st Congressional District Candidate Forum",
    date: "2026-06-19",
    time: "6:30 PM",
    location: "Denver Press Club, 1330 Glenarm Place, Denver",
    description:
      "A candidate forum for Colorado's 1st Congressional District, co-sponsored by Colorado Politics. Confirmed participants include U.S. Congresswoman Diana DeGette, CU Regent Wanda James, and Melat Kiros, moderated by political journalists Marianne Goodland and Ernest Luning. Tickets are $10 per person. Limited seating available on a first-come, first-served basis.",
  },
  {
    id: "dpc-swing-dancing-june-2026",
    title: "Swing Dancing at the Denver Press Club",
    date: "2026-06-21",
    time: "5:00 PM",
    location: "Denver Press Club, 1330 Glenarm Place, Denver",
    description:
      "The Denver Press Club opens for swing dancing classes hosted by Swing Nights, with a live quartet playing upstairs. Each week, instructors teach the basics of easy-to-learn swing plus a few moves to show off. The rest of the club stays open for normal service. Tickets at swingnights.com/classes.",
    link: "https://swingnights.com/classes",
  },
  {
    id: "dpc-ai-talk-brett-schklar-2026",
    title: "Who Owns Tomorrow: A No-BS AI Playbook",
    date: "2026-06-23",
    time: "6:00 PM",
    location: "Denver Press Club, 1330 Glenarm Place, Denver",
    description:
      "Keynote speaker and former CEO Brett Schklar breaks down the AI hype with practical basics for journalists and business professionals: what AI can do, where it falls short, how to use it responsibly, and how to spot AI-generated content and misinformation. Member tickets are discounted.",
  },
  {
    id: "dpc-great-debate-colfax-brt-2026",
    title: "The Great Debate: Colfax BRT",
    date: "2026-06-25",
    time: "6:30 PM",
    location: "Denver Press Club, 1330 Glenarm Place, Denver",
    description:
      "The Denver Press Club's first Great Debate tackles the construction of the Colfax BRT and whether future Colorado Blvd BRT projects will help or hurt the city. Join neighbors, experts, and community leaders for a respectful, moderated debate on the contentious issues shaping Denver's future.",
  },
  {
    id: "dpc-poems-and-potables-2026",
    title: "Poems and Potables at the Denver Press Club",
    date: "2026-06-26",
    time: "6:17 PM",
    location: "Denver Press Club, 1330 Glenarm Place, Denver",
    description:
      "Flex your poetry skills at the Denver Press Club. Write a short poem (or a few), then share them with clubmates over a summery gin cocktail or whatever you prefer.",
  },
  {
    id: "dpc-urban-salon-july-2026",
    title: "DPC Urban Salon: Colfax BRT",
    date: "2026-07-02",
    time: "6:00 PM",
    location: "Denver Press Club, 1330 Glenarm Place, Denver",
    description:
      "A community conversation about the Colfax BRT construction and the possibility of the Colorado Blvd BRT. Less formal than the Great Debate: bring your opinions to the Club over a drink or two and talk with fellow Denverites. This is where the conversation begins.",
  },
  {
    id: "dpc-left-field-literary-salon-2026",
    title: "Left Field Literary Salon: Where Books Meet After Dark",
    date: "2026-07-16",
    time: "6:17 PM",
    location: "Denver Press Club, 1330 Glenarm Place, Denver",
    description:
      "A fundraiser for the Denver Press Club and the Colorado ACLU, and the launch of a monthly literary gathering for curated book events. Step into themed spaces for a night of mystery. Proceeds benefit the Club and the Colorado ACLU.",
  },
  {
    id: "little-man-national-ice-cream-day-2026",
    title: "National Ice Cream Day Party with Free Live Music from DOGTAGS",
    date: "2026-07-19",
    time: "7:00–9:00 PM",
    location: "Little Man Ice Cream, 2620 16th Street, Denver, CO 80211",
    description:
      "Celebrate National Ice Cream Day at Little Man LoHi with a free outdoor concert from DOGTAGS, the Denver soul band that earned an NPR Tiny Desk Contest spotlight. The show marks the release of their new single, \"Sweet Tooth.\" Expect giveaways, interactive games for kids, and a night that works equally well for families, date nights, and dogs. Little Man will also debut the Cloud Cone, a special scoop available one day only. Free to attend.",
    link: "https://www.eventbrite.com/e/national-ice-cream-day-party-at-the-can-free-live-music-from-dogtags-tickets-1993709689350?aff=oddtdtcreator",
  },
  {
    id: "moodswing-summer-sessions-sundresses",
    title: "Summer Sessions at Moodswing: Sundresses + Short Shorts",
    date: "2026-07-12",
    time: "12:00 PM",
    location: "Moodswing, 3625 E 48th Ave, Denver CO 80216",
    description:
      "Kick off Summer Sessions at Moodswing with the Sundresses + Short Shorts theme. Every Sunday in July and August, Moodswing hosts themed vibes with live DJs, free pizza samples, Spritz towers, and a sunset Champagne shower. This week's Spritz: Aperol OG. Free to attend.",
    link: "https://www.eventbrite.com/o/120765226222",
  },
  {
    id: "moodswing-summer-sessions-purple-day",
    title: "Summer Sessions at Moodswing: Purple Day Disco",
    date: "2026-07-19",
    time: "12:00 PM",
    location: "Moodswing, 3625 E 48th Ave, Denver CO 80216",
    description:
      "Week two of Summer Sessions goes full disco with the Purple Day theme. Live DJs, free pizza samples, Spritz towers, and a sunset Champagne shower. This week's Spritz: Purple Plum. Free to attend.",
    link: "https://www.eventbrite.com/o/120765226222",
  },
  {
    id: "moodswing-summer-sessions-yacht-club",
    title: "Summer Sessions at Moodswing: Yacht Club Party",
    date: "2026-07-26",
    time: "12:00 PM",
    location: "Moodswing, 3625 E 48th Ave, Denver CO 80216",
    description:
      "Nautical vibes take over for week three of Summer Sessions. Show up in your best yacht club look for live DJs, free pizza samples, Spritz towers, and a sunset Champagne shower. This week's Spritz: Orange Passionfruit. Free to attend.",
    link: "https://www.eventbrite.com/o/120765226222",
  },
  {
    id: "moodswing-summer-sessions-garden-party",
    title: "Summer Sessions at Moodswing: Garden Party",
    date: "2026-08-02",
    time: "12:00 PM",
    location: "Moodswing, 3625 E 48th Ave, Denver CO 80216",
    description:
      "The final week of Summer Sessions wraps up with a Garden Party theme. Live DJs, free pizza samples, Spritz towers, and a sunset Champagne shower to close out the series. This week's Spritz: Peach. Free to attend.",
    link: "https://www.eventbrite.com/o/120765226222",
  },
  {
    id: "mountain-music-fest-evergreen-2026",
    title: "Mountain Music Fest",
    date: "2026-08-16",
    time: "12:00–9:00 PM",
    location: "Evergreen, Colorado",
    description:
      "A full day of live music, family-friendly entertainment, and community celebration in the mountains, headlined this year by The Bacon Brothers (Kevin Bacon and Michael Bacon). Proceeds support local schools through the Wooden Hawk Foundation.",
  },
  {
    id: "nmbr38-wc-brazil-morocco",
    title: "World Cup Watch Party: Brazil vs Morocco",
    date: "2026-06-13",
    time: "4:00 PM",
    location: "Number Thirty Eight, 3560 Chestnut Place, Denver CO 80216",
    description:
      "Number Thirty Eight hosts World Cup watch parties all tournament long with Mile High Sports, with full game audio on every match. The venue has 10 indoor TVs, two outdoor TVs, and a 220-inch outdoor LED wall. The Gameday Party Pack ($138) reserves a table for up to 10 guests, including 3 lbs of buffalo wings, a 24-inch party pizza, chips and salsa, and a choice of two add-ons: a High Noon bucket, a pitcher of any Breck beer, or a pitcher of Bud Light.",
    link: "https://www.nmbr38.com/world-cup",
  },
  {
    id: "nmbr38-wc-germany-curacao",
    title: "World Cup Watch Party: Germany vs Curacao",
    date: "2026-06-14",
    time: "11:00 AM",
    location: "Number Thirty Eight, 3560 Chestnut Place, Denver CO 80216",
    description:
      "Number Thirty Eight hosts World Cup watch parties all tournament long with Mile High Sports, with full game audio on every match. The venue has 10 indoor TVs, two outdoor TVs, and a 220-inch outdoor LED wall. The Gameday Party Pack ($138) reserves a table for up to 10 guests, including 3 lbs of buffalo wings, a 24-inch party pizza, chips and salsa, and a choice of two add-ons: a High Noon bucket, a pitcher of any Breck beer, or a pitcher of Bud Light.",
    link: "https://www.nmbr38.com/world-cup",
  },
  {
    id: "nmbr38-wc-japan-netherlands",
    title: "World Cup Watch Party: Japan vs Netherlands",
    date: "2026-06-14",
    time: "2:00 PM",
    location: "Number Thirty Eight, 3560 Chestnut Place, Denver CO 80216",
    description:
      "Number Thirty Eight hosts World Cup watch parties all tournament long with Mile High Sports, with full game audio on every match. The venue has 10 indoor TVs, two outdoor TVs, and a 220-inch outdoor LED wall. The Gameday Party Pack ($138) reserves a table for up to 10 guests, including 3 lbs of buffalo wings, a 24-inch party pizza, chips and salsa, and a choice of two add-ons: a High Noon bucket, a pitcher of any Breck beer, or a pitcher of Bud Light.",
    link: "https://www.nmbr38.com/world-cup",
  },
  {
    id: "nmbr38-wc-mexico-south-korea",
    title: "World Cup Watch Party: Mexico vs South Korea",
    date: "2026-06-18",
    time: "7:00 PM",
    location: "Number Thirty Eight, 3560 Chestnut Place, Denver CO 80216",
    description:
      "Number Thirty Eight hosts World Cup watch parties all tournament long with Mile High Sports, with full game audio on every match. The venue has 10 indoor TVs, two outdoor TVs, and a 220-inch outdoor LED wall. The Gameday Party Pack ($138) reserves a table for up to 10 guests, including 3 lbs of buffalo wings, a 24-inch party pizza, chips and salsa, and a choice of two add-ons: a High Noon bucket, a pitcher of any Breck beer, or a pitcher of Bud Light.",
    link: "https://www.nmbr38.com/world-cup",
  },
  {
    id: "nmbr38-wc-usa-australia",
    title: "World Cup Watch Party: USA vs Australia",
    date: "2026-06-19",
    time: "1:00 PM",
    location: "Number Thirty Eight, 3560 Chestnut Place, Denver CO 80216",
    description:
      "Number Thirty Eight hosts World Cup watch parties all tournament long with Mile High Sports, with full game audio on every match. The venue has 10 indoor TVs, two outdoor TVs, and a 220-inch outdoor LED wall. The Gameday Party Pack ($138) reserves a table for up to 10 guests, including 3 lbs of buffalo wings, a 24-inch party pizza, chips and salsa, and a choice of two add-ons: a High Noon bucket, a pitcher of any Breck beer, or a pitcher of Bud Light.",
    link: "https://www.nmbr38.com/world-cup",
  },
  {
    id: "nmbr38-wc-brazil-haiti",
    title: "World Cup Watch Party: Brazil vs Haiti",
    date: "2026-06-19",
    time: "6:30 PM",
    location: "Number Thirty Eight, 3560 Chestnut Place, Denver CO 80216",
    description:
      "Number Thirty Eight hosts World Cup watch parties all tournament long with Mile High Sports, with full game audio on every match. The venue has 10 indoor TVs, two outdoor TVs, and a 220-inch outdoor LED wall. The Gameday Party Pack ($138) reserves a table for up to 10 guests, including 3 lbs of buffalo wings, a 24-inch party pizza, chips and salsa, and a choice of two add-ons: a High Noon bucket, a pitcher of any Breck beer, or a pitcher of Bud Light.",
    link: "https://www.nmbr38.com/world-cup",
  },
  {
    id: "nmbr38-wc-germany-ivory-coast",
    title: "World Cup Watch Party: Germany vs Ivory Coast",
    date: "2026-06-20",
    time: "2:00 PM",
    location: "Number Thirty Eight, 3560 Chestnut Place, Denver CO 80216",
    description:
      "Number Thirty Eight hosts World Cup watch parties all tournament long with Mile High Sports, with full game audio on every match. The venue has 10 indoor TVs, two outdoor TVs, and a 220-inch outdoor LED wall. The Gameday Party Pack ($138) reserves a table for up to 10 guests, including 3 lbs of buffalo wings, a 24-inch party pizza, chips and salsa, and a choice of two add-ons: a High Noon bucket, a pitcher of any Breck beer, or a pitcher of Bud Light.",
    link: "https://www.nmbr38.com/world-cup",
  },
  {
    id: "nmbr38-wc-brazil-scotland",
    title: "World Cup Watch Party: Brazil vs Scotland",
    date: "2026-06-24",
    time: "4:00 PM",
    location: "Number Thirty Eight, 3560 Chestnut Place, Denver CO 80216",
    description:
      "Number Thirty Eight hosts World Cup watch parties all tournament long with Mile High Sports, with full game audio on every match. The venue has 10 indoor TVs, two outdoor TVs, and a 220-inch outdoor LED wall. The Gameday Party Pack ($138) reserves a table for up to 10 guests, including 3 lbs of buffalo wings, a 24-inch party pizza, chips and salsa, and a choice of two add-ons: a High Noon bucket, a pitcher of any Breck beer, or a pitcher of Bud Light.",
    link: "https://www.nmbr38.com/world-cup",
  },
  {
    id: "nmbr38-wc-mexico-czechia",
    title: "World Cup Watch Party: Mexico vs Czechia",
    date: "2026-06-24",
    time: "7:00 PM",
    location: "Number Thirty Eight, 3560 Chestnut Place, Denver CO 80216",
    description:
      "Number Thirty Eight hosts World Cup watch parties all tournament long with Mile High Sports, with full game audio on every match. The venue has 10 indoor TVs, two outdoor TVs, and a 220-inch outdoor LED wall. The Gameday Party Pack ($138) reserves a table for up to 10 guests, including 3 lbs of buffalo wings, a 24-inch party pizza, chips and salsa, and a choice of two add-ons: a High Noon bucket, a pitcher of any Breck beer, or a pitcher of Bud Light.",
    link: "https://www.nmbr38.com/world-cup",
  },
  {
    id: "nmbr38-wc-germany-ecuador",
    title: "World Cup Watch Party: Germany vs Ecuador",
    date: "2026-06-25",
    time: "2:00 PM",
    location: "Number Thirty Eight, 3560 Chestnut Place, Denver CO 80216",
    description:
      "Number Thirty Eight hosts World Cup watch parties all tournament long with Mile High Sports, with full game audio on every match. The venue has 10 indoor TVs, two outdoor TVs, and a 220-inch outdoor LED wall. The Gameday Party Pack ($138) reserves a table for up to 10 guests, including 3 lbs of buffalo wings, a 24-inch party pizza, chips and salsa, and a choice of two add-ons: a High Noon bucket, a pitcher of any Breck beer, or a pitcher of Bud Light.",
    link: "https://www.nmbr38.com/world-cup",
  },
  {
    id: "nmbr38-wc-japan-sweden",
    title: "World Cup Watch Party: Japan vs Sweden",
    date: "2026-06-25",
    time: "5:00 PM",
    location: "Number Thirty Eight, 3560 Chestnut Place, Denver CO 80216",
    description:
      "Number Thirty Eight hosts World Cup watch parties all tournament long with Mile High Sports, with full game audio on every match. The venue has 10 indoor TVs, two outdoor TVs, and a 220-inch outdoor LED wall. The Gameday Party Pack ($138) reserves a table for up to 10 guests, including 3 lbs of buffalo wings, a 24-inch party pizza, chips and salsa, and a choice of two add-ons: a High Noon bucket, a pitcher of any Breck beer, or a pitcher of Bud Light.",
    link: "https://www.nmbr38.com/world-cup",
  },
  {
    id: "nmbr38-wc-usa-turkiye",
    title: "World Cup Watch Party: USA vs Türkiye",
    date: "2026-06-25",
    time: "8:00 PM",
    location: "Number Thirty Eight, 3560 Chestnut Place, Denver CO 80216",
    description:
      "Number Thirty Eight hosts World Cup watch parties all tournament long with Mile High Sports, with full game audio on every match. The venue has 10 indoor TVs, two outdoor TVs, and a 220-inch outdoor LED wall. The Gameday Party Pack ($138) reserves a table for up to 10 guests, including 3 lbs of buffalo wings, a 24-inch party pizza, chips and salsa, and a choice of two add-ons: a High Noon bucket, a pitcher of any Breck beer, or a pitcher of Bud Light.",
    link: "https://www.nmbr38.com/world-cup",
  },
  {
    id: "nmbr38-wc-semifinal-714",
    title: "World Cup Semi-Final Watch Party",
    date: "2026-07-14",
    time: "1:00 PM",
    location: "Number Thirty Eight, 3560 Chestnut Place, Denver CO 80216",
    description:
      "Number Thirty Eight hosts World Cup watch parties all tournament long with Mile High Sports, with full game audio on every match. The venue has 10 indoor TVs, two outdoor TVs, and a 220-inch outdoor LED wall. The Gameday Party Pack ($138) reserves a table for up to 10 guests, including 3 lbs of buffalo wings, a 24-inch party pizza, chips and salsa, and a choice of two add-ons: a High Noon bucket, a pitcher of any Breck beer, or a pitcher of Bud Light.",
    link: "https://www.nmbr38.com/world-cup",
  },
  {
    id: "nmbr38-wc-semifinal-715",
    title: "World Cup Semi-Final Watch Party",
    date: "2026-07-15",
    time: "1:00 PM",
    location: "Number Thirty Eight, 3560 Chestnut Place, Denver CO 80216",
    description:
      "Number Thirty Eight hosts World Cup watch parties all tournament long with Mile High Sports, with full game audio on every match. The venue has 10 indoor TVs, two outdoor TVs, and a 220-inch outdoor LED wall. The Gameday Party Pack ($138) reserves a table for up to 10 guests, including 3 lbs of buffalo wings, a 24-inch party pizza, chips and salsa, and a choice of two add-ons: a High Noon bucket, a pitcher of any Breck beer, or a pitcher of Bud Light.",
    link: "https://www.nmbr38.com/world-cup",
  },
  {
    id: "nmbr38-wc-final",
    title: "World Cup Final Watch Party",
    date: "2026-07-19",
    time: "1:00 PM",
    location: "Number Thirty Eight, 3560 Chestnut Place, Denver CO 80216",
    description:
      "Number Thirty Eight hosts the World Cup Final watch party in partnership with Mile High Sports, with full game audio and the full venue energy. The venue has 10 indoor TVs, two outdoor TVs, and a 220-inch outdoor LED wall. The Gameday Party Pack ($138) reserves a table for up to 10 guests, including 3 lbs of buffalo wings, a 24-inch party pizza, chips and salsa, and a choice of two add-ons: a High Noon bucket, a pitcher of any Breck beer, or a pitcher of Bud Light.",
    link: "https://www.nmbr38.com/world-cup",
  },
  {
    id: "englewood-second-saturday-june-2026",
    title: "Englewood's Second Saturday",
    date: "2026-06-13",
    time: "10:00 AM – 9:00 PM",
    location: "Various locations along S. Broadway and surrounding streets, Englewood, CO",
    description:
      "On the second Saturday of each month, Englewood's galleries, studios, and small businesses open their doors for a day-long art walk and neighborhood celebration. June 13 adds a new twist: a free expanded BERT bus route running every 30 minutes from 10 a.m. to 9 p.m., looping south down Broadway to Inca, hitting Belleview, S. Navajo St., and S. Kalamath St., then back up to Englewood City Center. Park once and ride the rest. Participating spaces include Black Cube Nomadic Art Museum, Blue Tile Art Gallery, EASEL, NKollectiv Gallery, SeeSaw Gallery, Continuum Art Studios, Mutiny Comics and Coffee, and more. Stick around for food and drinks at Lady Justice Brewing, Englewood Grand, Brewability/Pizzability, and Western Sky Bar and Tap Room. Look for the red balloons.",
    link: "https://www.easel-co.com/secondsaturdays",
  },
  {
    id: "cats-on-mats-2026-06-03",
    title: "Cats on Mats at Denver Animal Shelter",
    date: "2026-06-03",
    time: "5:30 PM",
    location: "Denver Animal Shelter, 1241 W. Bayaud Ave., Denver",
    description:
      "Every Wednesday from June through August, Denver Animal Shelter hosts Cats on Mats: a professionally instructed yoga class made better by roaming kittens. Bring your mat and enjoy an hour of downward dogs and kitten cuddles. Classes start promptly at 5:30 p.m. in the Community Room. Free to attend.",
  },
  {
    id: "cats-on-mats-2026-06-10",
    title: "Cats on Mats at Denver Animal Shelter",
    date: "2026-06-10",
    time: "5:30 PM",
    location: "Denver Animal Shelter, 1241 W. Bayaud Ave., Denver",
    description:
      "Every Wednesday from June through August, Denver Animal Shelter hosts Cats on Mats: a professionally instructed yoga class made better by roaming kittens. Bring your mat and enjoy an hour of downward dogs and kitten cuddles. Classes start promptly at 5:30 p.m. in the Community Room. Free to attend.",
  },
  {
    id: "cats-on-mats-2026-06-17",
    title: "Cats on Mats at Denver Animal Shelter",
    date: "2026-06-17",
    time: "5:30 PM",
    location: "Denver Animal Shelter, 1241 W. Bayaud Ave., Denver",
    description:
      "Every Wednesday from June through August, Denver Animal Shelter hosts Cats on Mats: a professionally instructed yoga class made better by roaming kittens. Bring your mat and enjoy an hour of downward dogs and kitten cuddles. Classes start promptly at 5:30 p.m. in the Community Room. Free to attend.",
  },
  {
    id: "cats-on-mats-2026-06-24",
    title: "Cats on Mats at Denver Animal Shelter",
    date: "2026-06-24",
    time: "5:30 PM",
    location: "Denver Animal Shelter, 1241 W. Bayaud Ave., Denver",
    description:
      "Every Wednesday from June through August, Denver Animal Shelter hosts Cats on Mats: a professionally instructed yoga class made better by roaming kittens. Bring your mat and enjoy an hour of downward dogs and kitten cuddles. Classes start promptly at 5:30 p.m. in the Community Room. Free to attend.",
  },
  {
    id: "cats-on-mats-2026-07-01",
    title: "Cats on Mats at Denver Animal Shelter",
    date: "2026-07-01",
    time: "5:30 PM",
    location: "Denver Animal Shelter, 1241 W. Bayaud Ave., Denver",
    description:
      "Every Wednesday from June through August, Denver Animal Shelter hosts Cats on Mats: a professionally instructed yoga class made better by roaming kittens. Bring your mat and enjoy an hour of downward dogs and kitten cuddles. Classes start promptly at 5:30 p.m. in the Community Room. Free to attend.",
  },
  {
    id: "cats-on-mats-2026-07-08",
    title: "Cats on Mats at Denver Animal Shelter",
    date: "2026-07-08",
    time: "5:30 PM",
    location: "Denver Animal Shelter, 1241 W. Bayaud Ave., Denver",
    description:
      "Every Wednesday from June through August, Denver Animal Shelter hosts Cats on Mats: a professionally instructed yoga class made better by roaming kittens. Bring your mat and enjoy an hour of downward dogs and kitten cuddles. Classes start promptly at 5:30 p.m. in the Community Room. Free to attend.",
  },
  {
    id: "cats-on-mats-2026-07-15",
    title: "Cats on Mats at Denver Animal Shelter",
    date: "2026-07-15",
    time: "5:30 PM",
    location: "Denver Animal Shelter, 1241 W. Bayaud Ave., Denver",
    description:
      "Every Wednesday from June through August, Denver Animal Shelter hosts Cats on Mats: a professionally instructed yoga class made better by roaming kittens. Bring your mat and enjoy an hour of downward dogs and kitten cuddles. Classes start promptly at 5:30 p.m. in the Community Room. Free to attend.",
  },
  {
    id: "cats-on-mats-2026-07-22",
    title: "Cats on Mats at Denver Animal Shelter",
    date: "2026-07-22",
    time: "5:30 PM",
    location: "Denver Animal Shelter, 1241 W. Bayaud Ave., Denver",
    description:
      "Every Wednesday from June through August, Denver Animal Shelter hosts Cats on Mats: a professionally instructed yoga class made better by roaming kittens. Bring your mat and enjoy an hour of downward dogs and kitten cuddles. Classes start promptly at 5:30 p.m. in the Community Room. Free to attend.",
  },
  {
    id: "cats-on-mats-2026-07-29",
    title: "Cats on Mats at Denver Animal Shelter",
    date: "2026-07-29",
    time: "5:30 PM",
    location: "Denver Animal Shelter, 1241 W. Bayaud Ave., Denver",
    description:
      "Every Wednesday from June through August, Denver Animal Shelter hosts Cats on Mats: a professionally instructed yoga class made better by roaming kittens. Bring your mat and enjoy an hour of downward dogs and kitten cuddles. Classes start promptly at 5:30 p.m. in the Community Room. Free to attend.",
  },
  {
    id: "cats-on-mats-2026-08-05",
    title: "Cats on Mats at Denver Animal Shelter",
    date: "2026-08-05",
    time: "5:30 PM",
    location: "Denver Animal Shelter, 1241 W. Bayaud Ave., Denver",
    description:
      "Every Wednesday from June through August, Denver Animal Shelter hosts Cats on Mats: a professionally instructed yoga class made better by roaming kittens. Bring your mat and enjoy an hour of downward dogs and kitten cuddles. Classes start promptly at 5:30 p.m. in the Community Room. Free to attend.",
  },
  {
    id: "cats-on-mats-2026-08-12",
    title: "Cats on Mats at Denver Animal Shelter",
    date: "2026-08-12",
    time: "5:30 PM",
    location: "Denver Animal Shelter, 1241 W. Bayaud Ave., Denver",
    description:
      "Every Wednesday from June through August, Denver Animal Shelter hosts Cats on Mats: a professionally instructed yoga class made better by roaming kittens. Bring your mat and enjoy an hour of downward dogs and kitten cuddles. Classes start promptly at 5:30 p.m. in the Community Room. Free to attend.",
  },
  {
    id: "cats-on-mats-2026-08-19",
    title: "Cats on Mats at Denver Animal Shelter",
    date: "2026-08-19",
    time: "5:30 PM",
    location: "Denver Animal Shelter, 1241 W. Bayaud Ave., Denver",
    description:
      "Every Wednesday from June through August, Denver Animal Shelter hosts Cats on Mats: a professionally instructed yoga class made better by roaming kittens. Bring your mat and enjoy an hour of downward dogs and kitten cuddles. Classes start promptly at 5:30 p.m. in the Community Room. Free to attend.",
  },
  {
    id: "cats-on-mats-2026-08-26",
    title: "Cats on Mats at Denver Animal Shelter",
    date: "2026-08-26",
    time: "5:30 PM",
    location: "Denver Animal Shelter, 1241 W. Bayaud Ave., Denver",
    description:
      "Every Wednesday from June through August, Denver Animal Shelter hosts Cats on Mats: a professionally instructed yoga class made better by roaming kittens. Bring your mat and enjoy an hour of downward dogs and kitten cuddles. Classes start promptly at 5:30 p.m. in the Community Room. Free to attend.",
  },
  {
    id: "kong-50th-anniversary-nmbr38-2026",
    title: "KONG 50th Anniversary Celebration",
    date: "2026-08-07",
    time: "5:00–9:00 PM",
    location: "Number Thirty Eight, 3560 Chestnut Place, Denver CO 80216",
    description:
      "Celebrate 50 years of KONG at Number Thirty Eight with local vendors, KONG giveaways, and pup cups featuring special edition birthday cake flavored treats. Enter prize drawings and grab a limited-edition KONG pint glass, with proceeds benefiting Foothills Animal Shelter. Come raise a glass and celebrate!",
    link: "https://www.nmbr38.com/calendar/kong-50th-anniversary-celebration",
  },
  {
    id: "mister-oso-boulder-world-cup",
    title: "World Cup Watching at Mister Oso Boulder",
    date: "2026-06-11",
    time: "June 11 through July 19",
    location: "Mister Oso Boulder",
    description:
      "Mister Oso Boulder's cozy yet energetic atmosphere makes it the ideal spot in Boulder for World Cup watching, with ample TV screens and delicious Latin fare throughout the tournament. Daily happy hour runs 3 to 6 p.m. Bonus: free valet parking at the Boulder Moxy Hotel.",
  },
  {
    id: "sup-yin-yoga-bear-creek-2026-08-11",
    title: "Evening SUP Yin Yoga: Unwind on the Water",
    date: "2026-08-11",
    time: "5:30–7:00 PM",
    location: "Bear Creek Lake Park, Lakewood, CO",
    description:
      "Rocky Mountain Paddleboard and Firefly Community invite you to unwind on the water with a Stand-Up Paddleboard Yin Yoga session at Bear Creek Lake Park. All equipment is provided. Beginner-friendly: you only need to stand while paddling to the practice spot. All poses are done sitting or lying down. Long-held stretches help increase circulation and improve mobility, while the gentle movement of the lake soothes the nervous system. Register through Rocky Mountain Paddleboard.",
    link: "https://fareharbor.com/embeds/book/rockymtnpaddleboard/items/121890/calendar/2026/08/?full-items=yes&back=https://rockymtnpaddleboard.com/location/big-soda-lake&flow=882578&g4=yes",
  },
  {
    id: "affordable-arts-festival-2026-08-30",
    title: "15th Annual Affordable Arts Festival",
    date: "2026-08-30",
    time: "9:00 AM–3:00 PM",
    location: "Arapahoe Community College, 5900 S Santa Fe Dr, Littleton, CO 80120",
    description:
      "One day only: 160+ professional artists selling fine art for $150 or less. Works include paintings, photography, glass art, jewelry, fiber, leather, wood, prints, originals, and more, from Colorado artists and across the country. Ranked among the top five art shows in the country. Admission is $12 (tickets available online now and at the door). Arrive early for best selection: the line forms as early as 5 a.m. and gates open at 9. Artists unveil a fresh round of deals at 11 a.m. Free parking on site; RTD and light rail nearby. Proceeds from admission benefit the ACC Foundation and are matched by the Colorado Opportunity Initiative for student scholarships. The festival has donated $360,000 to ACC students to date.",
    link: "https://affordableartsfestival.com",
  },
  {
    id: "flipping-scripts-2-opening-2026-07-17",
    title: "Flipping Scripts 2: An Exhibition of Colorado Curators (Opening Reception)",
    date: "2026-07-17",
    time: "6:00–9:00 PM",
    location: "Bitfactory Gallery, 851 Santa Fe Drive, Denver",
    description:
      "Opening reception for \"Flipping Scripts 2,\" a group exhibition conceived by Dan Drossman that puts 16 of Denver's gallerists and curators on the other side of the wall. Participants include Grant Adams (Nine Dot Arts), Ray Carney (Naked Ray), Anthony Garcia (Birdseed Collective), Daisy McGowan (RiNo Art District), Eric Nord (Leon Gallery), Sophia Poppy-Erickson (Rule Gallery), and more. Each was asked to interpret \"What do we need right now?\" through their own art. The show runs July 17 through August 15. Gallery hours: Tues.–Sat., 11 a.m.–4 p.m.",
    link: "https://www.bitfactory.net",
  },
  {
    id: "flipping-scripts-2-first-friday-2026-08-07",
    title: "Flipping Scripts 2: First Friday at Bitfactory Gallery",
    date: "2026-08-07",
    time: "6:00–9:00 PM",
    location: "Bitfactory Gallery, 851 Santa Fe Drive, Denver",
    description:
      "Visit \"Flipping Scripts 2\" during the largest First Friday Art Walk of the year, when Santa Fe Drive closes to car traffic and the galleries throw open their doors. The exhibition features work by 16 of Denver's leading curators and gallerists, each responding to the question \"What do we need right now?\" through their own art. Curated by Dan Drossman. On view through August 15.",
    link: "https://www.bitfactory.net",
  },
  {
    id: "hopscotch-beer-garden-opening-2026-07-11",
    title: "Hopscotch Beer Garden Opens at Denargo Market",
    date: "2026-07-11",
    location: "Hopscotch Beer Garden, Denargo Market, Denver",
    description:
      "Denver's newest outdoor gathering spot opens at Denargo Market on July 11. Hopscotch features a 16-tap draft system with beer, wine, and ciders alongside canned cocktails, seltzers, and non-alcoholic options. Light bites and a rotating schedule of food trucks round out the food and drink, and a turf field hosts pick-up volleyball, soccer, and badminton. On-leash dogs are welcome. Ongoing programming includes Yappy Hour, trivia, bingo, bike-in movie nights, and fitness on the lawn. The first Second Sundays event, featuring music and coffee, takes place the following day on July 12.",
  },
  {
    id: "wild-hearts-western-nights-2026-08-01",
    title: "Wild Hearts and Western Nights",
    date: "2026-08-01",
    time: "6:00–8:30 PM",
    location: "The Ranch at Larimer County Fairgrounds, 5280 Arena Circle, Loveland, CO 80538",
    description:
      "An immersive cowboy romance experience from Spark Alchemy, featuring four acclaimed Colorado romance authors: Michelle Major, Jennie Marts, Mary Leo, and Elle Laine, for book signings and conversation. Cherry On Top Bookshop (Fort Collins) hosts a pop-up shop and Urban Cowgirl Denver runs a custom cowboy hat bar on-site. Expect lasso lessons, western-themed food and drinks, and live cowboy music throughout the evening. A prize drawing benefits Hope for Justice, an organization working to end human trafficking. Early bird tickets: $55 through July 15, then $77. VIP tickets ($99) include a book from a featured author, a $50 Minky Couture gift card, curated goodies from local women-owned businesses, and 20% off a future Spark Alchemy event.",
    link: "https://www.eventbrite.com/e/wild-hearts-western-nights-tickets-1992654788112?aff=RyanEstes",
  },
  {
    id: "dpc-social-study-ai-data-2026-07-14",
    title: "How You Are Using AI and How It Is Using You",
    date: "2026-07-14",
    time: "6:00–8:00 PM",
    location: "Denver Press Club, 1330 Glenarm Place, Denver",
    description:
      "A talk from Heath Morgan, attorney and author of \"The Memory Project,\" on the AI systems already shaping your daily life: your social media feed, email, commute, music, search results, banking app, keyboard, camera, and TV. You interact with 20+ AI systems every day, and most of them are collecting data about you under terms you've never read, with no expiration date. Morgan walks through what data is actually being collected, who profits from it, where the technology is headed, and what you can do about it today. He'll also share themes from his novel, set in 2085, following a generation that inherited the consequences of data their grandparents gave away for free. Part of The Social Study series at the Denver Press Club.",
  },
  {
    id: "founder-series-ai-panel-2026-07-22",
    title: "Founder Series: Artificial Intelligence and the New Frontier",
    date: "2026-07-22",
    time: "1:00–3:00 PM",
    location: "Grow House Co-Working, 5th Floor, Trinity Place Building, 1801 N Broadway, Denver, CO 80202",
    description:
      "An afternoon panel discussion charting the profound changes AI brings to society, from transforming creative fields to redefining the modern workplace. Hosted by Ryan Estes (AI for Founders Podcast), five panelists from the frontlines of design, culture, and corporate strategy discuss what AI means for careers and creativity. Followed by Q&A and networking. Open to anyone curious about AI.",
    link: "https://www.evite.com/event/004BIIAE4SKDAARFOEPROSRZ5HWP4I/",
  },
  {
    id: "colorado-saves-the-world-2026-07-23",
    title: "Colorado Saves the World: Your Regional News Quiz!",
    date: "2026-07-23",
    time: "7:00 PM",
    location: "Dude IDK Studios, 2801 N Downing St, Denver, CO 80205",
    description:
      "A fast-paced, fun-filled news quiz spotlighting the weird, wild, and wonderful happenings in Denver, Colorado, and the Rocky Mountain region. A panel of Denver's funniest comedians and celebrity guests from all walks of life bring you the freshest news, hottest takes, and coolest interviews in the West. If you love NPR's Wait Wait Don't Tell Me, you'll have a blast with Colorado Saves the World.",
    link: "https://denvercomedy.multipass.com/coloradosavestheworld",
  },
];
