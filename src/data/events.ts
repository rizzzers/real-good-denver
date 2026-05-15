export interface Event {
  id: string;
  venue: string;
  title: string;
  category: string;
  date: string;
  description: string[];
  highlights?: string[];
  closingNote?: string;
}

export const eventCategories = [
  { id: "all", name: "All Events" },
  { id: "fathers-day", name: "Father's Day" },
  { id: "pride", name: "Pride" },
];

export const events: Event[] = [
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
