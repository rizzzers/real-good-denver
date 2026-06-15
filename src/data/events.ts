export interface Event {
  id: string;
  venue: string;
  title: string;
  category: string;
  date: string;
  description: string[];
  highlights?: string[];
  closingNote?: string;
  url?: string;
}

export const eventCategories = [
  { id: "all", name: "All Events" },
  { id: "experiences", name: "Experiences" },
  { id: "world-cup", name: "World Cup" },
  { id: "fathers-day", name: "Father's Day" },
  { id: "pride", name: "Pride" },
];

export const events: Event[] = [
  {
    id: "ritz-carlton-padel-haus-stay-play",
    venue: "The Ritz-Carlton, Denver",
    title: "The Ritz-Carlton x Padel Haus Stay & Play Package",
    category: "experiences",
    date: "Now Available",
    description: [
      "The Ritz-Carlton, Denver has partnered with Padel Haus to launch an exclusive Stay & Play Package, timed to the debut of Padel Haus Denver, the newest location from the leading premium indoor padel club in the U.S. The package brings the world's fastest-growing racket sport to the Mile High City through a luxury hospitality lens.",
      "The new Denver club features state-of-the-art indoor courts, a stylish co-working lounge, café and juice bar, and recovery amenities, designed for competitive players, wellness-minded travelers, and anyone looking for a sophisticated new way to experience Denver.",
    ],
    highlights: [
      "Two nights accommodations at The Ritz-Carlton, Denver",
      "Transfers to/from the hotel and Padel Haus",
      "One private lesson with a Padel Haus Denver coach",
      "Two hours of play/matches against local players",
      "Dinner at Elway's Downtown (up to $250)",
      "Custom Ritz-Carlton x Padel Haus racket, shirt, and water bottle",
    ],
    closingNote:
      "Starting rate: $1,100/night. Padel Haus locations include NYC, Nashville, and Atlanta, with Denver as its newest expansion.",
  },
  {
    id: "denver-press-club-book-talk",
    venue: "Denver Press Club, 1330 Glenarm Place",
    title: "Book Talk: Cornered Office with Melissa Doman",
    category: "experiences",
    date: "Wednesday, May 28, 6:30 PM",
    description: [
      "Colorado-based organizational psychologist and mental health expert Melissa Doman brings her new book to the Denver Press Club for an evening conversation about leadership mental health. Cornered Office makes the case that leaders need support too, and offers data-backed, research-grounded steps for managers and executives to start taking care of themselves at work.",
      "Doman has worked with Google, Microsoft, Salesforce, and Siemens, spoken at SXSW, and been featured in CNN, Vogue, NPR, and Fast Company. Tickets are limited.",
    ],
    highlights: [
      "General Admission: $15",
      "Member Admission: $5",
    ],
    closingNote: "Limited tickets available. Questions? Contact Development Director Katlyn Howery.",
    url: "https://denverpressclub.org/event/book-talk-with-melissa-doman-ma/",
  },
  {
    id: "art-hotel-chef-cycle",
    venue: "FIRE Restaurant & Lounge at The ART Hotel Denver",
    title: "Sip for a Cause: Chef Cycle at FIRE Restaurant",
    category: "experiences",
    date: "Throughout June",
    description: [
      "The ART Hotel Denver is supporting the 2026 Chef Cycle, a 200-mile race uniting chefs and hospitality professionals to fight childhood hunger for No Kid Hungry. All June, guests can join the cause at FIRE Restaurant & Lounge, where Tito's will donate $1 to No Kid Hungry for every Tito's Handmade Vodka cocktail sold.",
      "The ART's own Assistant General Manager Tobias Burkhalter is riding for the fourth consecutive year alongside Michelin-starred Chef Byron Gomez, having already raised over $7,600 of his $13,000 goal. Collectively, the Commonwealth Hotels team has raised approximately $10,000 for the cause.",
    ],
    highlights: [
      "$1 donated to No Kid Hungry for every Tito's cocktail sold at FIRE",
      "AGM Tobias Burkhalter riding 200 miles for the fourth consecutive year",
      "Commonwealth Hotels team collectively raised approximately $10,000",
      "Property team also built bikes donated to the Chef Cycle national mission",
    ],
  },
  {
    id: "maria-empanada-world-cup",
    venue: "Maria Empanada (South Broadway & Riverview)",
    title: "World Cup Fútbol HQ at Maria Empanada",
    category: "world-cup",
    date: "June 11 – July 19",
    description: [
      "Maria Empanada's South Broadway and Riverview locations are your fútbol headquarters for the World Cup. Both spots will air every match during operating hours, with beer bucket specials and a family-friendly game-day atmosphere.",
    ],
    highlights: [
      "3 empanadas + 1 dipping sauce for $15",
      "6 empanadas + 2 dipping sauces for $30",
      "12 empanadas + 4 dipping sauces for $60",
      "Fresh Baked Bundles available in-store and for takeout starting June 1",
    ],
  },
  {
    id: "ay-papi-world-cup",
    venue: "Ay Papi, Cherry Creek",
    title: "Fútbol Lives Here at Ay Papi",
    category: "world-cup",
    date: "June 11 – July 19",
    description: [
      "Cherry Creek's destination for Latin culture and cocktails just installed brand-new big-screen TVs for the World Cup. Ay Papi will stream every match during operating hours and open early for select games, with the sound up and the room locked in.",
    ],
    highlights: [
      "The Tí Breaker: Tí punch with St. Benevolence Haitian Rum",
      "Bicycle Kick: Carajillo-inspired with Mexican Coke, Licor 43, and Mr. Black",
      "The Pitch: Casamigos Margaritas",
      "Beer and cocktail pitcher specials throughout the tournament",
    ],
    closingNote: "Reservations not required but highly encouraged at aypapidenver.com.",
  },
  {
    id: "mister-oso-boulder-world-cup",
    venue: "Mister Oso Boulder",
    title: "World Cup Watching at Mister Oso Boulder",
    category: "world-cup",
    date: "June 11 – July 19",
    description: [
      "Mister Oso Boulder's cozy yet energetic atmosphere makes it the ideal spot in Boulder for World Cup watching, with ample TV screens and delicious Latin fare throughout the tournament.",
    ],
    highlights: [
      "Daily happy hour 3–6 p.m.",
      "Free valet parking at the Boulder Moxy Hotel",
    ],
  },
  {
    id: "ritz-carlton-dads-reserve",
    venue: "The Ritz-Carlton, Denver",
    title: "Dad's Reserve: A Spirits Dinner",
    category: "fathers-day",
    date: "Friday, June 12",
    description: [
      "Celebrate Father's Day with an elevated evening of steak, whiskey, and expertly crafted pairings at Dad's Reserve: A Spirits Dinner at The Ritz-Carlton, Denver. Hosted at ELWAY'S Downtown in collaboration with Breckenridge Distillery, the exclusive dinner features a multi-course menu paired with signature cocktails and premium bourbon pours.",
      "Guests will also enjoy insights and guided tastings from Breckenridge Distillery's Bret Zareck throughout the night.",
    ],
    highlights: [
      "Bone Marrow Whisky Luge",
      "Interactive Surf & Turf Sushi Experience featuring A5 Wagyu and Hamachi",
      "Duck breast with huckleberry demi-glace",
      "Flash-seared A5 Wagyu paired with a Cognac Finish Sazerac",
    ],
    closingNote:
      "The experience concludes on the Plaza Terrace with a final whiskey pairing featuring Breckenridge Honey Whiskey served alongside a playful \"cigar\" cookie dessert, a fitting finale to the celebration. Each guest will also take home a personalized bottle of The Ritz-Carlton Denver's Reserve Blend Breckenridge Bourbon.",
  },
  {
    id: "art-hotel-fathers-day",
    venue: "The ART Hotel Denver",
    title: "Father's Day at FIRE Restaurant & Lounge",
    category: "fathers-day",
    date: "June 20 – 21",
    description: [
      "To celebrate Dads, FIRE Restaurant & Lounge at The ART Hotel Denver will offer dads a free beer, bourbon, or Bloody Mary with the purchase of an entree from June 20 through June 21.",
    ],
  },
  {
    id: "art-hotel-pride-drag-brunch",
    venue: "The ART Hotel Denver",
    title: "FIRE Restaurant Pride Drag Brunch",
    category: "pride",
    date: "Saturday, June 27",
    description: [
      "Celebrate Pride Month in style at The ART Hotel Denver with FIRE Restaurant's unforgettable Drag Brunch. Featuring dazzling performances by Raquelle C. Schelle, Banana Splits, and drag king Benjamin Banjee Misdemeanor, this high-energy event brings together fierce entertainment, delicious brunch favorites, DJ beats, and signature Smirnoff cocktails for a truly fabulous experience.",
      "Guests can choose from two lively brunch shows while supporting an important cause, as 10% of all ticket proceeds benefit The Trevor Project in support of LGBTQIA+ communities. It's the perfect way to honor Denver Pride weekend.",
    ],
  },
  {
    id: "rally-hotel-fathers-day",
    venue: "The Rally Hotel",
    title: "Father's Day at the Ballpark",
    category: "fathers-day",
    date: "Sunday, June 21",
    description: [
      "Father's Day hits a home run at The Rally Hotel Denver, where baseball-loving dads can celebrate just steps from Coors Field as the Colorado Rockies take on the Pittsburgh Pirates on Sunday, June 21 at 1:10 p.m. Located in the heart of McGregor Square, The Rally Hotel places guests at the center of Denver's sports culture, complete with a complimentary draft Coors Banquet beer for every guest at check-in.",
      "Guests can catch the action live at the ballpark or from McGregor Square's massive LED screen before unwinding at the rooftop pool with panoramic views of Coors Field and the Rocky Mountains.",
    ],
    highlights: [
      "\"Game On\" package: four Rockies tickets and a $50 dining credit",
      "\"Step Up to the Plate\" package: an exclusive behind-the-scenes tour of Coors Field",
      "Complimentary draft Coors Banquet beer at check-in",
      "Rooftop pool with panoramic views of Coors Field and the Rocky Mountains",
    ],
  },
];
