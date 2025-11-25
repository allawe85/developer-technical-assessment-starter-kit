import React, { useEffect, useState } from 'react';
import { Search, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import api from '../lib/api';
import { ListingCard } from '../components/ListingCard';
import { useStore } from '../store/useStore';

interface ListingSummary {
  id: string;
  type: string;
  name: string;
  price: string;
  location: string;
  image_urls: string[];
}

export const LandingPage = () => {
  const [listings, setListings] = useState<ListingSummary[]>([]);
  const [featuredListings, setFeaturedListings] = useState<ListingSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const { setSearchQuery } = useStore();
  
  // Carousel State
  const [currentSlide, setCurrentSlide] = useState(0);
  //const carouselRef = useRef<HTMLDivElement>(null);

  const fetchListings = async (query = '') => {
    setLoading(true);
    setError('');
    try {
      const endpoint = query.trim() 
        ? `/listings/search?q=${encodeURIComponent(query)}` 
        : '/listings/popular';
        
      const { data } = await api.get<ListingSummary[]>(endpoint);
      setListings(data);
      
      // Logic to select "Featured" properties (e.g., first 5 from popular list)
      // In a real app, this might be a separate API call like /listings/featured
      if (!query) {
        setFeaturedListings(data.slice(0, 5));
      }
    } catch (err) {
      console.error(err);
      setError('Failed to load listings. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, []);

  // Auto-scroll carousel
  useEffect(() => {
    if (featuredListings.length === 0) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % featuredListings.length);
    }, 5000); // Change slide every 5 seconds
    return () => clearInterval(interval);
  }, [featuredListings]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(searchTerm);
    fetchListings(searchTerm);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % featuredListings.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + featuredListings.length) % featuredListings.length);
  };

  return (
    <div className="pb-20 bg-gray-50 dark:bg-slate-950 min-h-screen transition-colors duration-300">
      {/* Hero Section */}
      <section className="bg-ohb-gray dark:bg-slate-950 py-16 px-4 text-center border-b border-gray-200 dark:border-slate-800 transition-colors duration-300 relative overflow-hidden">
        <div className="max-w-4xl mx-auto space-y-6 relative z-10">
          <h1 className="text-4xl md:text-6xl font-extrabold text-ohb-dark dark:text-white tracking-tight transition-colors">
            Unlock Your <span className="text-ohb-gold">Dream Home</span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto transition-colors">
            Find approved, perfect property with flexible options and expert guidance directly from Oman Housing Bank partners.
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto mt-10">
            <input 
              type="text" 
              placeholder="Search by location, keywords..."
              className="w-full pl-14 pr-4 py-5 rounded-full shadow-lg border-0 ring-1 ring-gray-200 dark:ring-slate-700 focus:ring-2 focus:ring-ohb-gold bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-gray-400 transition-all text-lg"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" size={24} />
            <button 
              type="submit" 
              className="absolute right-3 top-2.5 bottom-2.5 bg-ohb-dark dark:bg-ohb-gold text-white px-8 rounded-full font-bold hover:bg-ohb-gold dark:hover:bg-white dark:hover:text-ohb-gold transition-colors"
            >
              Search
            </button>
          </form>
        </div>
      </section>

      {/* Featured Carousel Section (Only shows on home page, not search results) */}
      {!searchTerm && featuredListings.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
          <h2 className="text-2xl font-bold text-ohb-dark dark:text-white mb-6 border-l-4 border-ohb-gold pl-4 transition-colors">
            Featured Properties
          </h2>
          
          <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-xl group">
            {/* Slides */}
            <div 
              className="absolute inset-0 flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {featuredListings.map((item) => (
                <div key={item.id} className="min-w-full h-full relative">
                  <img 
                    src={item.image_urls[0] || 'https://via.placeholder.com/1200x600'} 
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                  {/* Overlay Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  
                  {/* Content Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                    <span className="bg-ohb-gold px-3 py-1 rounded text-xs font-bold uppercase tracking-wider mb-2 inline-block">
                      Featured {item.type}
                    </span>
                    <h3 className="text-3xl font-bold mb-2">{item.name}</h3>
                    <p className="text-xl font-medium mb-4 opacity-90">{item.location}</p>
                    <div className="flex items-center gap-4">
                      <span className="text-2xl font-bold text-ohb-gold">
                        {(!isNaN(Number(item.price))) ? `OMR ${Number(item.price).toLocaleString()}` : item.price}
                      </span>
                      <a 
                        href={`/details/${item.type}/${item.id}`}
                        className="bg-white text-ohb-dark px-6 py-2 rounded-lg font-bold hover:bg-ohb-gold hover:text-white transition-colors"
                      >
                        View Details
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Navigation Arrows */}
            <button 
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 backdrop-blur-md p-2 rounded-full text-white transition-all opacity-0 group-hover:opacity-100"
            >
              <ChevronLeft size={32} />
            </button>
            <button 
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 backdrop-blur-md p-2 rounded-full text-white transition-all opacity-0 group-hover:opacity-100"
            >
              <ChevronRight size={32} />
            </button>

            {/* Dots Indicators */}
            <div className="absolute bottom-4 right-8 flex gap-2">
              {featuredListings.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    idx === currentSlide ? 'bg-ohb-gold w-8' : 'bg-white/50 hover:bg-white'
                  }`}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Listings Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-ohb-dark dark:text-white border-l-4 border-ohb-gold pl-4 transition-colors">
            {searchTerm ? `Results for "${searchTerm}"` : 'Most Popular Properties'}
          </h2>
        </div>

        {error && (
          <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg text-center mb-8">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-ohb-gold" size={48} />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {listings.length > 0 ? (
              listings.map((item) => (
                <ListingCard 
                  key={item.id}
                  {...item}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-20 text-gray-500 dark:text-gray-400">
                No properties found matching your criteria.
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};