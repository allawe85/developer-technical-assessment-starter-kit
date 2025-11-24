import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Phone, CheckCircle, ArrowLeft } from 'lucide-react';
import api from '../lib/api';
import { useStore } from '../store/useStore';

interface Listing {
  id: string;
  name: string;
  price: string;
  location: string;
  image_urls: string[];
  details: string;
  type: string;
  amenities?: string[];
}

export const DetailsPage = () => {
  const { type, id } = useParams();
  const { user } = useStore();
  const navigate = useNavigate();
  
  const [item, setItem] = useState<Listing | null>(null);
  const [activeImg, setActiveImg] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fix: Wrap logic in an async function to avoid synchronous state update warnings
    const fetchDetails = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/listings/${type}/${id}`);
        setItem(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [type, id]);

  const handleContact = async () => {
    if (!user) return navigate('/login');
    try {
      await api.post('/agent-contact', { listingId: id, listingType: type, message: "Interested!" });
      alert('Agent has been notified! They will contact you shortly.');
    } catch (e) { alert('Failed to contact agent.' + e); }
  };

  if (loading) return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="animate-pulse text-ohb-gold font-semibold">Loading Property Details...</div>
    </div>
  );

  if (!item) return <div className="p-20 text-center dark:text-white">Listing not found.</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 min-h-screen">
      {/* Back Button */}
      <button 
        onClick={() => navigate(-1)} 
        className="flex items-center text-gray-500 hover:text-ohb-gold dark:text-gray-400 dark:hover:text-ohb-gold transition mb-6"
      >
        <ArrowLeft size={20} className="mr-2" /> Back to Search
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Left: Image Gallery */}
        <div className="space-y-4">
          <div className="h-[400px] bg-gray-200 dark:bg-slate-900 rounded-2xl overflow-hidden shadow-sm border border-gray-100 dark:border-slate-800">
            <img 
              src={item.image_urls[activeImg] || 'https://via.placeholder.com/600'} 
              className="w-full h-full object-cover" 
              alt={item.name}
            />
          </div>
          {/* Thumbnails */}
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
            {item.image_urls.map((url, idx) => (
              <button 
                key={idx} 
                onClick={() => setActiveImg(idx)} 
                className={`h-20 w-20 rounded-xl overflow-hidden border-2 flex-shrink-0 transition-all ${
                  idx === activeImg 
                    ? 'border-ohb-gold ring-2 ring-ohb-gold/20' 
                    : 'border-transparent opacity-70 hover:opacity-100'
                }`}
              >
                <img src={url} className="w-full h-full object-cover" alt={`View ${idx + 1}`} />
              </button>
            ))}
          </div>
        </div>

        {/* Right: Property Info */}
        <div className="space-y-8">
          <div>
            <span className="inline-block px-3 py-1 bg-ohb-gold/10 text-ohb-gold text-xs font-bold uppercase tracking-wider rounded-full mb-3">
              {item.type}
            </span>
            <h1 className="text-3xl md:text-4xl font-bold text-ohb-dark dark:text-white mb-3 leading-tight">
              {item.name}
            </h1>
            <div className="flex items-center text-gray-500 dark:text-gray-400 text-lg">
              <MapPin size={20} className="mr-2 text-ohb-gold" /> 
              {item.location}
            </div>
          </div>

          {/* Price Box */}
          <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm">
            <span className="text-gray-500 dark:text-gray-400 text-sm uppercase tracking-wide font-medium">
              Current Price
            </span>
            <p className="text-4xl font-bold text-ohb-dark dark:text-white mt-2">
              {(!isNaN(Number(item.price))) ? `OMR ${Number(item.price).toLocaleString()}` : item.price}
            </p>
          </div>

          {/* Description */}
          <div>
            <h3 className="font-bold text-xl mb-4 text-ohb-dark dark:text-white">Overview</h3>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg">
              {item.details}
            </p>
          </div>

          {/* Amenities */}
          {item.amenities && item.amenities.length > 0 && (
            <div>
              <h3 className="font-bold text-xl mb-4 text-ohb-dark dark:text-white">Amenities</h3>
              <div className="grid grid-cols-2 gap-4">
                {item.amenities.map((am, i) => (
                  <div key={i} className="flex items-center gap-3 text-gray-700 dark:text-gray-300 p-3 bg-gray-50 dark:bg-slate-900 rounded-lg">
                    <CheckCircle size={18} className="text-ohb-gold" /> 
                    <span className="font-medium">{am}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Call to Action */}
          <div className="pt-4">
            <button 
              onClick={handleContact}
              className="w-full py-4 bg-ohb-dark dark:bg-ohb-gold text-white font-bold rounded-xl hover:bg-ohb-gold dark:hover:bg-white dark:hover:text-ohb-dark transition-all duration-300 flex items-center justify-center gap-3 text-lg shadow-xl shadow-blue-900/5"
            >
              <Phone size={22} /> 
              Contact Agent
            </button>
            {!user && (
              <p className="text-center text-xs text-gray-400 mt-3">
                Please login to send an inquiry
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};