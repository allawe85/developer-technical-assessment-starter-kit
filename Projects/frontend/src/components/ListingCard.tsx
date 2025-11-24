import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, ArrowRight } from 'lucide-react';

interface Props {
  id: string;
  type: string;
  name: string;
  price: string;
  location: string;
  image_urls: string[];
}

export const ListingCard: React.FC<Props> = ({ id, type, name, price, location, image_urls }) => {
  const navigate = useNavigate();

  return (
    <div 
      onClick={() => navigate(`/details/${type}/${id}`)}
      className="group bg-white dark:bg-slate-900 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 dark:border-slate-800 overflow-hidden cursor-pointer"
    >
      {/* Image Section */}
      <div className="h-56 w-full relative overflow-hidden bg-gray-100 dark:bg-slate-800">
        <img 
          src={image_urls[0] || 'https://via.placeholder.com/400'} 
          alt={name} 
          className="w-full h-full object-cover group-hover:scale-105 transition duration-500" 
        />
        <span className="absolute top-4 left-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur px-3 py-1 rounded text-xs font-bold uppercase tracking-wider text-ohb-dark dark:text-white shadow-sm">
          {type}
        </span>
      </div>

      {/* Content Section */}
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-lg text-ohb-dark dark:text-white mb-1 truncate w-full">
            {name}
          </h3>
        </div>
        
        <p className="text-ohb-gold font-bold text-xl mb-3">
            {(!isNaN(Number(price))) ? `OMR ${Number(price).toLocaleString()}` : price}
        </p>

        <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm mb-4">
          <MapPin size={16} className="mr-1 flex-shrink-0" /> 
          <span className="truncate">{location}</span>
        </div>

        <button className="w-full py-2 bg-gray-50 dark:bg-slate-800 text-ohb-dark dark:text-white font-medium rounded-lg group-hover:bg-ohb-gold group-hover:text-white transition-colors flex items-center justify-center gap-2">
          View Details <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
};