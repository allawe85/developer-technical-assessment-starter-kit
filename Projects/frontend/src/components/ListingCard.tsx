import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, ArrowRight } from 'lucide-react';

interface Props {
  id: string; type: string; name: string; price: string; location: string; image_urls: string[];
}

export const ListingCard: React.FC<Props> = ({ id, type, name, price, location, image_urls }) => {
  const navigate = useNavigate();
  return (
    <div 
      onClick={() => navigate(`/details/${type}/${id}`)}
      className="group bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 overflow-hidden cursor-pointer"
    >
      <div className="h-56 w-full relative overflow-hidden bg-gray-100">
        <img src={image_urls[0] || 'https://via.placeholder.com/400'} alt={name} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
        <span className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded text-xs font-bold uppercase tracking-wider text-ohb-dark">{type}</span>
      </div>
      <div className="p-5">
        <h3 className="font-bold text-lg text-ohb-dark mb-1 truncate">{name}</h3>
        <p className="text-ohb-gold font-bold text-xl mb-3">
            {(!isNaN(Number(price))) ? `OMR ${Number(price).toLocaleString()}` : price}
        </p>
        <div className="flex items-center text-gray-500 text-sm mb-4">
          <MapPin size={16} className="mr-1" /> <span className="truncate">{location}</span>
        </div>
        <button className="w-full py-2 bg-gray-50 text-ohb-dark font-medium rounded-lg group-hover:bg-ohb-gold group-hover:text-white transition flex items-center justify-center gap-2">
          View Details <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
};