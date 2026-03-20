"use client";

import { useState } from "react";
import Navigation from "@/components/Navigation";
import NewsletterCTA from "@/components/NewsletterCTA";
import Footer from "@/components/Footer";
import { Search, MapPin, Phone, Globe, Truck, DollarSign, Star } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

interface Restaurant {
  name: string;
  cuisine: string;
  pricePoint: string;
  address: string;
  website?: string;
  deliveryOptions: string[];
  phoneNumber?: string;
  quotes: string[];
  rating?: number;
}

export default function RestaurantFinderPage() {
  const [zipCode, setZipCode] = useState("");
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const searchRestaurants = async () => {
    if (!zipCode || zipCode.length !== 5) {
      toast({ title: "Invalid Zip Code", description: "Please enter a valid 5-digit zip code", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('restaurant-finder', { body: { zipCode } });
      if (error) throw error;
      setRestaurants(data.restaurants || []);
      if (data.restaurants?.length === 0) {
        toast({ title: "No Results", description: "No off-the-beaten-path restaurants found in this area. Try a different zip code." });
      }
    } catch (error) {
      console.error('Error fetching restaurants:', error);
      toast({ title: "Search Failed", description: "Unable to find restaurants. Please try again.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    searchRestaurants();
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Hidden Gem Restaurant Finder
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover off-the-beaten-path restaurants in your area, curated from Reddit recommendations and Google reviews
            </p>
          </div>

          <div className="bg-card border border-border rounded-xl mb-8">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-1 flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Find Hidden Gems Near You
              </h2>
              <p className="text-muted-foreground text-sm mb-4">Enter your zip code to discover local restaurant treasures</p>
              <form onSubmit={handleSubmit} className="flex gap-4">
                <input
                  type="text"
                  placeholder="Enter zip code (e.g., 80202)"
                  value={zipCode}
                  onChange={(e) => setZipCode(e.target.value)}
                  maxLength={5}
                  pattern="[0-9]{5}"
                  className="flex-1 h-10 px-3 border border-input rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
                <button type="submit" disabled={loading}
                  className="min-w-[120px] h-10 px-4 bg-primary text-primary-foreground rounded-md font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-background border-t-transparent rounded-full animate-spin" />
                      Searching...
                    </>
                  ) : (
                    <>
                      <Search className="h-4 w-4" />
                      Search
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {restaurants.length > 0 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold mb-4">Hidden Gems in {zipCode}</h2>
              {restaurants.map((restaurant, index) => (
                <div key={index} className="bg-card border border-border rounded-xl overflow-hidden">
                  <div className="p-6 pb-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-bold mb-1">{restaurant.name}</h3>
                        <p className="text-muted-foreground">{restaurant.cuisine} • {restaurant.pricePoint}</p>
                      </div>
                      {restaurant.rating && (
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-medium">{restaurant.rating}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="px-6 pb-6 space-y-4">
                    <div className="flex items-start gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                      <span>{restaurant.address}</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      {restaurant.phoneNumber && (
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <span>{restaurant.phoneNumber}</span>
                        </div>
                      )}
                      {restaurant.website && (
                        <div className="flex items-center gap-2">
                          <Globe className="h-4 w-4 text-muted-foreground" />
                          <a href={restaurant.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Visit Website</a>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                        <span>{restaurant.pricePoint}</span>
                      </div>
                      {restaurant.deliveryOptions.length > 0 && (
                        <div className="flex items-center gap-2">
                          <Truck className="h-4 w-4 text-muted-foreground" />
                          <span>{restaurant.deliveryOptions.join(", ")}</span>
                        </div>
                      )}
                    </div>
                    {restaurant.quotes.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="font-medium text-sm">What People Are Saying:</h4>
                        <div className="space-y-2">
                          {restaurant.quotes.map((quote, quoteIndex) => (
                            <blockquote key={quoteIndex} className="border-l-4 border-primary/20 pl-4 italic text-muted-foreground text-sm">
                              &ldquo;{quote}&rdquo;
                            </blockquote>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && restaurants.length === 0 && zipCode && (
            <div className="bg-card border border-border rounded-xl p-8 text-center">
              <p className="text-muted-foreground">No restaurants found. Try searching with a different zip code.</p>
            </div>
          )}
        </div>
      </div>
      <NewsletterCTA />
      <Footer />
    </div>
  );
}
