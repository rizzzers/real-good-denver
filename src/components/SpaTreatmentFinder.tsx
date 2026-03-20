"use client";

import { useState } from 'react';
import { ExternalLinkIcon, PhoneIcon, InstagramIcon, Clock } from 'lucide-react';

interface Treatment {
  provider: string;
  treatment: string;
  price: number;
  duration: number;
  address: string;
  phone: string;
  website: string;
  instagram: string;
  price_max: number;
}

const treatments: Treatment[] = [
  { provider: "5 Star Salt Caves Wellness Center", treatment: "Salt Therapy (halotherapy) session", price: 45, duration: 45, address: "722 S Pearl St, Denver, CO 80209", phone: "(855) 578-2725", website: "https://5starsaltcaves.com/services/", instagram: "https://www.instagram.com/5starsaltcaves/", price_max: 45 },
  { provider: "5 Star Salt Caves Wellness Center", treatment: "Infrared Sauna (30 min)", price: 35, duration: 30, address: "722 S Pearl St, Denver, CO 80209", phone: "(855) 578-2725", website: "https://5starsaltcaves.com/services/", instagram: "https://www.instagram.com/5starsaltcaves/", price_max: 35 },
  { provider: "5 Star Salt Caves Wellness Center", treatment: "Infrared Sauna (45 min)", price: 45, duration: 45, address: "722 S Pearl St, Denver, CO 80209", phone: "(855) 578-2725", website: "https://5starsaltcaves.com/services/", instagram: "https://www.instagram.com/5starsaltcaves/", price_max: 45 },
  { provider: "5 Star Salt Caves Wellness Center", treatment: "Ionic Foot Bath", price: 45, duration: 30, address: "722 S Pearl St, Denver, CO 80209", phone: "(855) 578-2725", website: "https://5starsaltcaves.com/services/", instagram: "https://www.instagram.com/5starsaltcaves/", price_max: 45 },
  { provider: "5 Star Salt Caves Wellness Center", treatment: "Massage (50 min)", price: 105, duration: 50, address: "722 S Pearl St, Denver, CO 80209", phone: "(855) 578-2725", website: "https://oysterlink.com/company-profile/5-star-salt-caves-spa/", instagram: "https://www.instagram.com/5starsaltcaves/", price_max: 105 },
  { provider: "5 Star Salt Caves Wellness Center", treatment: "Massage (80 min)", price: 150, duration: 80, address: "722 S Pearl St, Denver, CO 80209", phone: "(855) 578-2725", website: "https://oysterlink.com/company-profile/5-star-salt-caves-spa/", instagram: "https://www.instagram.com/5starsaltcaves/", price_max: 150 },
  { provider: "5 Star Salt Caves Wellness Center", treatment: "Private Salt Cave session (base)", price: 250, duration: 90, address: "722 S Pearl St, Denver, CO 80209", phone: "(855) 578-2725", website: "https://5starsaltcaves.com/packages/", instagram: "https://www.instagram.com/5starsaltcaves/", price_max: 250 },
  { provider: "Restore Hyper Wellness (Cherry Hills)", treatment: "Membership: Level Up (8 credits/mo)", price: 190, duration: 0, address: "5046 E Hampden Ave, Ste 10, Denver, CO 80222", phone: "(720) 704-6115", website: "https://www.restore.com/locations/co-denver-cherry-hills-co033", instagram: "https://www.instagram.com/rhw_cherryhills/", price_max: 190 },
  { provider: "Restore Hyper Wellness (Cherry Hills)", treatment: "Membership: Elevate (14 credits/mo)", price: 290, duration: 0, address: "5046 E Hampden Ave, Ste 10, Denver, CO 80222", phone: "(720) 704-6115", website: "https://www.restore.com/locations/co-denver-cherry-hills-co033", instagram: "https://www.instagram.com/rhw_cherryhills/", price_max: 290 },
  { provider: "Restore Hyper Wellness (Cherry Hills)", treatment: "Membership: Core (31 credits/mo)", price: 330, duration: 0, address: "5046 E Hampden Ave, Ste 10, Denver, CO 80222", phone: "(720) 704-6115", website: "https://www.restore.com/locations/co-denver-cherry-hills-co033", instagram: "https://www.instagram.com/rhw_cherryhills/", price_max: 330 },
  { provider: "Restore Hyper Wellness (Cherry Hills)", treatment: "IV Drip Therapy (per drip via credits)", price: 100, duration: 60, address: "5046 E Hampden Ave, Ste 10, Denver, CO 80222", phone: "(720) 704-6115", website: "https://www.restore.com/local/iv-drip-therapy-co-denver-cherry-hills-co033", instagram: "https://www.instagram.com/rhw_cherryhills/", price_max: 250 },
  { provider: "Aria Integrative Health", treatment: "Membership: Silver", price: 99, duration: 0, address: "2500 18th St, Suite B, Denver, CO 80211", phone: "(303) 953-2899", website: "https://ariaintegrativehealth.com/wellness-membership-in-denver/", instagram: "https://www.instagram.com/ariaintegrativehealth/", price_max: 99 },
  { provider: "Aria Integrative Health", treatment: "Membership: Gold", price: 149, duration: 0, address: "2500 18th St, Suite B, Denver, CO 80211", phone: "(303) 953-2899", website: "https://ariaintegrativehealth.com/wellness-membership-in-denver/", instagram: "https://www.instagram.com/ariaintegrativehealth/", price_max: 149 },
  { provider: "Aria Integrative Health", treatment: "Membership: Platinum", price: 249, duration: 0, address: "2500 18th St, Suite B, Denver, CO 80211", phone: "(303) 953-2899", website: "https://ariaintegrativehealth.com/wellness-membership-in-denver/", instagram: "https://www.instagram.com/ariaintegrativehealth/", price_max: 249 },
  { provider: "Aria Integrative Health", treatment: "Membership: Diamond", price: 379, duration: 0, address: "2500 18th St, Suite B, Denver, CO 80211", phone: "(303) 953-2899", website: "https://ariaintegrativehealth.com/wellness-membership-in-denver/", instagram: "https://www.instagram.com/ariaintegrativehealth/", price_max: 379 },
  { provider: "Aria Integrative Health", treatment: "Cryotherapy (Frozen C device)", price: 75, duration: 15, address: "2500 18th St, Suite B, Denver, CO 80211", phone: "(303) 953-2899", website: "https://ariaintegrativehealth.com/services/cryotherapy-in-denver/", instagram: "https://www.instagram.com/ariaintegrativehealth/", price_max: 200 },
  { provider: "Colorado Cryo Clinic", treatment: "Localized Cryotherapy: Mood/Energy", price: 65, duration: 15, address: "975 Lincoln St, Suite 205, Unit F, Denver, CO 80203", phone: "(303) 909-1277", website: "https://www.coloradocryoclinic.com/services", instagram: "https://www.instagram.com/cocryoclinic/", price_max: 65 },
  { provider: "Colorado Cryo Clinic", treatment: "FROTOX Face & Neck", price: 150, duration: 30, address: "975 Lincoln St, Suite 205, Unit F, Denver, CO 80203", phone: "(303) 909-1277", website: "https://www.coloradocryoclinic.com/services", instagram: "https://www.instagram.com/cocryoclinic/", price_max: 175 },
  { provider: "Sound Haus / Sound Bath Denver", treatment: "Private High‑Fidelity Sound Bath (individual)", price: 150, duration: 90, address: "Private studio (NW Denver; address shared upon booking)", phone: "(via website form)", website: "https://www.soundbathdenver.com/denver-sound-bath-experience/", instagram: "", price_max: 250 },
  { provider: "Sound Haus / Sound Bath Denver", treatment: "Private High‑Fidelity Sound Bath (couple)", price: 250, duration: 90, address: "Private studio (NW Denver; address shared upon booking)", phone: "(via website form)", website: "https://www.soundbathdenver.com/", instagram: "", price_max: 450 },
  { provider: "Woodhouse Spa Denver", treatment: "Ultimate Reset / 150‑min package", price: 350, duration: 150, address: "941 E 17th Ave, Denver, CO 80218", phone: "(303) 813-8488", website: "https://locations.woodhousespas.com/dir/co/denver/941-east-17th-ave", instagram: "https://www.instagram.com/woodhousespadenver/", price_max: 400 },
  { provider: "Woodhouse Spa Denver", treatment: "50‑min Swedish/Signature Massage", price: 145, duration: 50, address: "941 E 17th Ave, Denver, CO 80218", phone: "(303) 813-8488", website: "https://www.woodhousespas.com/pages/services", instagram: "https://www.instagram.com/woodhousespadenver/", price_max: 165 },
  { provider: "Red Rocks Spa (SE Denver)", treatment: "Private Sauna (per person per hour)", price: 50, duration: 60, address: "1842 S Parker Rd, Unit 21, Denver, CO 80231", phone: "(303) 495-5576", website: "https://www.redrocksspa-denver.com/", instagram: "https://www.instagram.com/redrocks_spa/", price_max: 50 },
  { provider: "Recovery Lounge & Spa", treatment: "Massage & Detox package", price: 189, duration: 120, address: "2195 Decatur St, Denver, CO 80211", phone: "(303) 242-6938", website: "https://recoveryloungeandspa.com/services/", instagram: "https://www.instagram.com/recoveryloungeandspa/", price_max: 189 },
  { provider: "Recovery Lounge & Spa", treatment: "Deep Stress Reset package", price: 179, duration: 90, address: "2195 Decatur St, Denver, CO 80211", phone: "(303) 242-6938", website: "https://recoveryloungeandspa.com/services/", instagram: "https://www.instagram.com/recoveryloungeandspa/", price_max: 179 },
  { provider: "Samana Float Center", treatment: "60‑min Float (walk‑in)", price: 69, duration: 60, address: "1307 26th St, Denver, CO 80205", phone: "(720) 573-8744", website: "https://samanafloat.com/", instagram: "https://www.instagram.com/samanafloat/", price_max: 69 },
  { provider: "Samana Float Center", treatment: "90‑min Float (walk‑in)", price: 79, duration: 90, address: "1307 26th St, Denver, CO 80205", phone: "(720) 573-8744", website: "https://samanafloat.com/", instagram: "https://www.instagram.com/samanafloat/", price_max: 79 },
  { provider: "Oakwell Beer Spa (Five Points)", treatment: "Beer Therapy Ritual (up to 2 adults)", price: 199, duration: 90, address: "3004 N Downing St, Denver, CO 80205", phone: "(720) 550-2337", website: "https://oakwell.com/spa-packages-denver/", instagram: "https://www.instagram.com/oakwellbeerspa/", price_max: 199 },
  { provider: "Oakwell Beer Spa (Five Points)", treatment: "Couple's Retreat (up to 2 adults)", price: 259, duration: 90, address: "3004 N Downing St, Denver, CO 80205", phone: "(720) 550-2337", website: "https://oakwell.com/spa-packages-denver/", instagram: "https://www.instagram.com/oakwellbeerspa/", price_max: 259 },
  { provider: "Oakwell Beer Spa (Five Points)", treatment: "Oakwell Escape (up to 2 adults)", price: 349, duration: 90, address: "3004 N Downing St, Denver, CO 80205", phone: "(720) 550-2337", website: "https://oakwell.com/spa-packages-denver/", instagram: "https://www.instagram.com/oakwellbeerspa/", price_max: 349 },
  { provider: "Contour Spa, Cherry Creek", treatment: "Intro: Cryo Slimming + free Cryo Facial", price: 99, duration: 60, address: "Cherry Creek (see site for exact suite)", phone: "", website: "https://cherrycreek.contourspa.com/", instagram: "", price_max: 99 },
  { provider: "Icebox Cryotherapy, Westminster", treatment: "Whole Body Cryotherapy (single)", price: 40, duration: 15, address: "11961 Bradburn Blvd #400, Westminster, CO 80031", phone: "", website: "https://iceboxtherapy.zenoti.com/webstoreNew/services/c2a4ab08-8140-4937-9e8e-e88c64ad2af1", instagram: "", price_max: 40 },
  { provider: "Icebox Cryotherapy, Westminster", treatment: "Intermediate Membership (6 WBC + 4 credits)", price: 129, duration: 0, address: "11961 Bradburn Blvd #400, Westminster, CO 80031", phone: "", website: "https://iceboxtherapy.com/westminster-co/", instagram: "", price_max: 129 },
  { provider: "Spa at The Brown Palace", treatment: "Swedish Massage (50/80 min)", price: 145, duration: 50, address: "321 17th St, Denver, CO 80202", phone: "(303) 297-3111", website: "https://www.brownpalace.com/spa-service-menu/", instagram: "", price_max: 210 },
  { provider: "Spa at The Brown Palace", treatment: "Brown Palace Signature Massage (50/80 min)", price: 165, duration: 50, address: "321 17th St, Denver, CO 80202", phone: "(303) 297-3111", website: "https://www.brownpalace.com/spa-service/the-brown-palace-signature-massage/", instagram: "", price_max: 230 },
];

export function SpaTreatmentFinder() {
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');
  const [recommendations, setRecommendations] = useState<Treatment[]>([]);
  const [showResults, setShowResults] = useState(false);

  const findRecommendations = () => {
    const min = parseInt(minPrice) || 0;
    const max = parseInt(maxPrice) || 1000;
    const filtered = treatments.filter(t => t.price >= min && t.price <= max);
    const shuffled = [...filtered].sort(() => 0.5 - Math.random());
    setRecommendations(shuffled.slice(0, 3));
    setShowResults(true);
  };

  return (
    <div className="mb-8 p-6 bg-gradient-to-r from-primary/5 to-accent/5 rounded-lg border">
      <div className="max-w-4xl mx-auto">
        <h3 className="text-2xl font-bold mb-4 text-center">Find Your Perfect Spa Treatment</h3>
        <p className="text-muted-foreground text-center mb-6">Set your budget and discover personalized recommendations</p>
        <div className="flex flex-col sm:flex-row gap-4 items-end justify-center mb-6">
          <div className="flex flex-col">
            <label className="text-sm font-medium mb-2">Min Price ($)</label>
            <input type="number" placeholder="0" value={minPrice} onChange={(e) => setMinPrice(e.target.value)}
              className="w-32 h-10 px-3 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-medium mb-2">Max Price ($)</label>
            <input type="number" placeholder="500" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)}
              className="w-32 h-10 px-3 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>
          <button onClick={findRecommendations}
            className="h-10 px-8 bg-primary text-primary-foreground rounded-md font-semibold hover:bg-primary/90 transition-colors">
            GO
          </button>
        </div>

        {showResults && (
          <div className="mt-8">
            <h4 className="text-xl font-semibold mb-4 text-center">
              {recommendations.length > 0 ? "Perfect Matches for Your Budget" : "No treatments found in this price range"}
            </h4>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {recommendations.map((treatment, index) => (
                <div key={index} className="relative overflow-hidden bg-card border border-border rounded-xl">
                  <div className="p-4 pb-2">
                    <div className="flex justify-between items-start mb-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-secondary text-secondary-foreground text-lg font-bold">
                        ${treatment.price}
                      </span>
                      {treatment.duration > 0 && (
                        <div className="flex items-center text-muted-foreground text-sm">
                          <Clock className="h-4 w-4 mr-1" />
                          {treatment.duration} min
                        </div>
                      )}
                    </div>
                    <h3 className="text-lg font-bold leading-tight">{treatment.treatment}</h3>
                    <p className="font-medium text-primary text-sm">{treatment.provider}</p>
                  </div>
                  <div className="p-4 pt-0">
                    <p className="text-sm text-muted-foreground mb-3">{treatment.address}</p>
                    <div className="flex flex-wrap gap-2">
                      {treatment.phone && treatment.phone !== "(via website form)" && (
                        <a href={`tel:${treatment.phone}`}
                          className="inline-flex items-center text-xs bg-muted hover:bg-muted/80 px-2 py-1 rounded-md transition-colors">
                          <PhoneIcon className="h-3 w-3 mr-1" />Call
                        </a>
                      )}
                      {treatment.website && (
                        <a href={treatment.website} target="_blank" rel="noopener noreferrer"
                          className="inline-flex items-center text-xs bg-primary/10 hover:bg-primary/20 text-primary px-2 py-1 rounded-md transition-colors">
                          <ExternalLinkIcon className="h-3 w-3 mr-1" />Website
                        </a>
                      )}
                      {treatment.instagram && (
                        <a href={treatment.instagram} target="_blank" rel="noopener noreferrer"
                          className="inline-flex items-center text-xs bg-accent/10 hover:bg-accent/20 text-accent-foreground px-2 py-1 rounded-md transition-colors">
                          <InstagramIcon className="h-3 w-3 mr-1" />Instagram
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
