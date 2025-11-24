import React, { useEffect, useState } from 'react';
import { Search, Loader2 } from 'lucide-react';
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [searchTerm, setSearchTerm] = useState('');
  const { setSearchQuery } = useStore();

  const fetchListings = async (query = '') => {
    setLoading(true);
    setError('');
    try {
      const endpoint = query.trim() 
        ? `/listings/search?q=${encodeURIComponent(query)}` 
        : '/listings/popular';
        
      const { data } = await api.get<ListingSummary[]>(endpoint);
      setListings(data);
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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(searchTerm);
    fetchListings(searchTerm);
  };

  return (
    <div className="pb-20">
      {/* Hero Section */}
      <section className="bg-ohb-gray dark:bg-slate-950 py-20 px-4 text-center border-b border-gray-200 dark:border-slate-800 transition-colors duration-300">
        <div className="max-w-4xl mx-auto space-y-6">
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