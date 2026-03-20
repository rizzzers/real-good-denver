export interface RestaurantEntry {
  rank: number;
  name: string;
  address: string;
  neighborhood: string;
  body: string[];
  imageUrl: string | null;
  imageAlt: string;
  mapsUrl: string;
}

export interface BlogPost {
  slug: string;
  title: string;
  publishedAt: string;
  author: string;
  featuredImage: string;
  featuredImageAlt: string;
  intro: string[];
  restaurants: RestaurantEntry[];
  outro: string[];
}

export const posts: BlogPost[] = [
  {
    slug: 'best-nachos-denver',
    title: 'The Best Nachos in Denver (That Actually Layer the Damn Cheese)',
    publishedAt: '2026-03-19',
    author: 'Ryan Estes',
    featuredImage: '/images/nachos-featured.jpg',
    featuredImageAlt: 'A massive plate of fully loaded nachos with cheese on every chip, served with a Denver Ale at a local bar',
    intro: [
      "Listen, we need to talk about the nacho situation in Denver. Some Redditor recently mourned the \"lost art\" of properly layered nachos, and they're not wrong. Too many spots are out here dumping a pile of chips on a plate, microwaving some cheese on top, and calling it a day. And the nerve. The absolute audacity. You ordered nachos, not a sad little cheese island floating in a sea of naked tortilla chips. You deserve better. You deserve cheese on every. Single. Chip.",
      "The layering problem is real, it's widespread, and it affects good people of all walks of life. Nothing kills the vibe faster than confidently pulling a chip from the pile only to discover it is bone dry, chipless in its cheese journey, completely forsaken by the kitchen. This is a personal injury. This is a human rights issue. Okay, that might be a stretch. But still.",
      "Here's where Denver is actually getting it right, sorted by neighborhood so you have no excuse to drive past one of these and end up at some sports bar that serves nachos out of a steam tray.",
    ],
    restaurants: [
      {
        rank: 1,
        name: "Adelita's Cocina y Cantina",
        address: '1294 S Broadway, Denver, CO 80210',
        neighborhood: 'Baker / Platte Park',
        imageUrl: 'https://scontent-den2-1.cdninstagram.com/v/t51.82787-15/613123013_18548997439013277_3939489977073889825_n.jpg?stp=dst-jpg_e35_p640x640_sh0.08_tt6&_nc_ht=scontent-den2-1.cdninstagram.com&_nc_cat=109&_nc_oc=Q6cZ2gGOPmukWoVfhm8DTdHVOTkT2FPYVWoVlN4ofjK9ANrt6p3C3g_ONGr815sszvpCNwM&_nc_ohc=iLYVJdlGPqkQ7kNvwGYXxRf&_nc_gid=kgw_LGGlCstlr8atKAnKvg&edm=AOQ1c0wBAAAA&ccb=7-5&oh=00_AfzFSGpDYoJvZgnPU4TNWtTE9edWf1OBfRS0K6M4cAkP6A&oe=69C24DC2&_nc_sid=8b3546',
        imageAlt: "Nachos at Adelita's Cocina y Cantina",
        mapsUrl: 'https://maps.google.com/?q=Adelita%27s+Cocina+y+Cantina+1294+S+Broadway+Denver+CO',
        body: [
          "The nachos at this Baker neighborhood gem come piled high with actual layers. They're not precious about it either. Expect generous amounts of beans, cheese, and your choice of carne asada or chicken. The portions are stupid big, the chips stay crispy even under all that toppings weight, and they don't skimp on the jalapeños.",
          "Here's context that makes the nachos hit different: Adelita's is a Latin and woman-owned family restaurant founded by matriarch owner and head chef Silvia Andaya, serving traditional Mexican food from the state of Michoacán, Mexico. The whole menu is built on family recipes, which means the flavors aren't chasing a trend. They're just good. The kind of good your abuela would approve of, if your abuela were from Michoacán and had strong opinions about cheese distribution.",
          "The carne asada here is the move. It's seasoned properly, portioned generously, and it does not apologize for existing. Pair it with one of their mezcal cocktails and your nacho situation becomes legitimately excellent. They offer a late-night menu to satisfy your after dark cravings, and after 9pm, they dim the lights so your nachos feel more cinematic. Weekend crowds can be intense, so plan accordingly or just accept that you'll spend twenty minutes waiting outside and that it will be worth it.",
        ],
      },
      {
        rank: 2,
        name: "Illegal Pete's",
        address: '2001 E Colfax Ave, Denver, CO 80206',
        neighborhood: 'Cap Hill / Colfax',
        imageUrl: 'https://cdn.sanity.io/images/v6mnhs8n/production/f36baf4d81d4bfea604d449bb17d15f4ab3f677f-1800x1200.jpg',
        imageAlt: "Fresh burritos and queso at Illegal Pete's on Colfax",
        mapsUrl: 'https://maps.google.com/?q=Illegal+Pete%27s+2001+E+Colfax+Ave+Denver+CO',
        body: [
          "Yeah, it's a chain. Yeah, locals have opinions about it. But their queso game is legitimately solid if you're in the liquid cheese camp, and the Colfax location has enough personality to make you forget you're at a chain for at least three bites.",
          "Illegal Pete's describes their signature queso as \"liquid gold,\" made fresh with pork and their own special blend of sautéed vegetables and spices. That tracks. It has the kind of depth that makes you wonder what's actually in it, which is either a compliment or a warning depending on your relationship with mystery ingredients. The nachos come with that gooey queso Denverites keep requesting on Reddit, plus black beans and all the fixings.",
          "The Colfax location is on the iconic Colfax Avenue and features a full bar with a wide selection of local beer on tap. Multiple locations mean you're never far from a reliable nacho fix. The Colfax spot does consistent work, has two levels, a patio, and trivia nights if you need to feel productive while eating nachos. The vibe is casual in the best way. No dress code. No pretense. Just chips, queso, and a cold beer from a local brewery that definitely has a funny name involving mountains or bears.",
        ],
      },
      {
        rank: 3,
        name: "Historians Ale House",
        address: '24 Broadway #102, Denver, CO 80203',
        neighborhood: 'Baker',
        imageUrl: 'https://historiansalehouse.com/wp-content/uploads/2019/05/SUMMERADE-_-El-Diablo.jpg',
        imageAlt: 'Craft cocktails and bar atmosphere at Historians Ale House',
        mapsUrl: 'https://maps.google.com/?q=Historians+Ale+House+24+Broadway+Denver+CO',
        body: [
          "Historians doesn't mess around with their nachos, mainly because they've rerouted the entire concept into Irish nacho territory and it is a better decision than most things decided in this city.",
          "Waffle fries instead of tortilla chips, covered in cheese, bacon, sour cream, and green onions. It's nacho logic applied to potatoes, and it absolutely rips. The structural integrity of a waffle fry under toppings is something regular tortilla chips can't compete with. You know how a regular nacho gets soggy at the bottom? Doesn't happen here. The ridges hold. The crisp survives.",
          "Historians has dozens of beers on tap and a large rooftop patio, which makes these Irish nachos even more dangerous because they pair perfectly with basically everything they're pouring. Perfect for when you want nacho energy but need something more substantial to soak up all those craft beers. The rooftop has views of downtown Denver and the mountains, which means you will eat your waffle fry nachos while looking at something beautiful, and that is a life well lived.",
          "Happy hour runs Monday through Friday from 2 to 6pm. Show up during that window, order the Irish nachos, and tell them the internet sent you. They won't know what that means but it'll be fun.",
        ],
      },
      {
        rank: 4,
        name: 'Avanti F&B (hit up Quiero Arepas inside)',
        address: '3200 N Pecos St, Denver, CO 80211',
        neighborhood: 'LoHi',
        imageUrl: 'https://scontent-den2-1.cdninstagram.com/v/t51.82787-15/652019919_18158228413434889_4405764246065659317_n.jpg?stp=dst-jpg_e35_p640x640_sh0.08_tt6&_nc_ht=scontent-den2-1.cdninstagram.com&_nc_cat=101&_nc_oc=Q6cZ2gF_oCEy9OUWu9DCDf2UUbGqrUSo9o2w2aim6rMIAdhnW_QUplqck_V8d64EbMcEFs4&_nc_ohc=3QYmPLSwmsgQ7kNvwHcEfyv&_nc_gid=kAwIOxv75WxJsafSOXrE8A&edm=AOQ1c0wBAAAA&ccb=7-5&oh=00_AfwGfi96R3XcQI2eq56P4K2h6EEFKrZMyiXxgPZTmK4SJw&oe=69C250EB&_nc_sid=8b3546',
        imageAlt: 'Venezuelan plantain chip nachos at Quiero Arepas inside Avanti F&B',
        mapsUrl: 'https://maps.google.com/?q=Avanti+F%26B+3200+N+Pecos+St+Denver+CO',
        body: [
          "Hit up Quiero Arepas inside this LoHi food hall for their Venezuelan take on the nacho format. Plantain chips form the base, and they actually crisp them fresh. The layering situation is on point, and the addition of black beans and queso fresco brings flavors you won't find at your standard sports bar.",
          "Quiero Arepas makes Venezuelan-style food in the traditional way, with everything built from scratch. The plantain chip nacho situation benefits directly from that scratch mentality. These aren't the bagged plantain chips from the grocery store. They're made to order, and the difference is noticeable in the first bite.",
          "Avanti has been on a mission to deliver an unparalleled food and drink experience since opening the Denver location in 2015, with an eclectic mix of talented chefs and an inventive drink program. So while you're eating your Venezuelan plantain nachos, you can also grab drinks from the main bar and argue with your friends about which of the other seven kitchens to hit next. Grab a seat on the rooftop if the weather cooperates. The views of downtown Denver from up there are excellent and you'll feel like a very cultured person eating nachos in the sunshine, which is the exact kind of cognitive dissonance Denver does best.",
        ],
      },
      {
        rank: 5,
        name: "Hayter's & Co.",
        address: '1920 Blake St, Denver, CO 80202',
        neighborhood: 'LoDo / Ballpark',
        imageUrl: 'https://images.squarespace-cdn.com/content/v1/54d25b62e4b0c9bd00306a53/1609247721647-2F2B8E4XG3ZWENSFV8U3/Menu+Graphic.jpg',
        imageAlt: "Hayter's & Co pub fare menu featuring nachos and comfort food",
        mapsUrl: "https://maps.google.com/?q=Hayter's+%26+Co+1920+Blake+St+Denver+CO",
        body: [
          "Quick note on the original post calling this one a Stapleton spot: Hayter's is actually LoDo, two blocks from Coors Field, which makes the \"beginning of the month, feeling sassy\" nacho energy even more appropriate given the Rockies game-day crowd nearby.",
          "Hayter's head chef created a menu described as \"pub fare with a twist,\" starting with comfort food favorites like nachos and chicken wings and taking them to another level of quality and creativity. Their ground beef nachos specifically feature house queso, pico, jalapeño, lime crema, pickled onion, black beans, and cilantro. That ingredient list is doing real work. Pickled onion on nachos is a bold choice and a correct one.",
          "Proper layers, generous protein portions, and they don't drown everything in cheese to the point where it becomes soup. The bar boasts over 20 big screens including two 100-inch HD projectors, so if you're eating nachos and also watching a game, Hayter's covers both needs without compromise. Solid neighborhood sports bar doing fundamentals right, with a rooftop patio for when you need air and want to eat nachos with a view simultaneously.",
        ],
      },
      {
        rank: 6,
        name: 'Star Bar',
        address: '2137 Larimer St, Denver, CO 80205',
        neighborhood: 'Ballpark',
        imageUrl: 'https://scontent-den2-1.cdninstagram.com/v/t51.71878-15/652766779_914385231302399_2300329164176186797_n.jpg?stp=dst-jpg_e15_tt6&_nc_ht=scontent-den2-1.cdninstagram.com&_nc_cat=111&_nc_oc=Q6cZ2gGFm0DOXu6XD1lAkStH4hNK2zDSdALzwzWwx5SB4MTIVNSZPEYcLg3F1ixwoM2oC4M&_nc_ohc=c6LT2crkz_EQ7kNvwHwa_J2&_nc_gid=kezPZnk8B2quWMLBV8nGZQ&edm=AOQ1c0wBAAAA&ccb=7-5&oh=00_AfwvXKlOksDOs8zMaBBLFwEp6dOVriHemc3pUwNX3g8hdg&oe=69C25877&_nc_sid=8b3546',
        imageAlt: 'Star Bar Denver, the original Ballpark neighborhood tavern',
        mapsUrl: 'https://maps.google.com/?q=Star+Bar+2137+Larimer+St+Denver+CO',
        body: [
          "This Ballpark neighborhood dive gets it. Their nachos come out with individually topped chips when they're not slammed, and even during rushes, the cheese distribution is democratic. Nothing fancy, just good execution on a classic.",
          "Star Bar has been in business for 50 years and calls itself the Ballpark's original neighborhood tavern, with 50-cent pool, live music, comfortable booths, and video games just two blocks from Coors Field. The fact that they've survived 50 years in a neighborhood that went from skid row to high-end condos says something about their commitment to just being a good bar. No gimmicks. No $22 artisanal cocktails served in a tiny clay pot. Just nachos, pool, and no one judging your life choices.",
          "You can eat nachos and shoot pool without anyone side-eyeing you. You can wear whatever you want. You can order a second plate of nachos and the bartender will not blink. That kind of unconditional nacho support is rare and valuable and should be protected.",
        ],
      },
    ],
    outro: [
      "The nacho standards in Denver can be higher. These spots prove it's possible to layer cheese, keep chips crispy, and not treat toppings like an afterthought. Revolutionary concepts, apparently.",
      "The common thread across all of them: kitchens that care about the chip-to-topping ratio and don't cut corners on the thing that makes nachos worth eating. Cheese on every chip is not a premium request. It is the baseline. Go forth, eat nachos, and hold your local bars to a higher standard. They can handle it.",
    ],
  },
];

export function getPost(slug: string): BlogPost | undefined {
  return posts.find((p) => p.slug === slug);
}
