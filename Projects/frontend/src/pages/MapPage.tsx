import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import api from '../lib/api';
import { useStore } from '../store/useStore';
import 'leaflet/dist/leaflet.css';

// --- Leaflet Default Icon Fix ---
// This is required because Webpack/Vite sometimes breaks default Leaflet marker assets
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
});
L.Marker.prototype.options.icon = DefaultIcon;
// --------------------------------

interface ListingLocation {
  id: string;
  type: string;
  name: string;
  price: string;
  location: string;
  latitude: number;
  longitude: number;
  image_urls: string[];
}

export const MapPage = () => {
  const [listings, setListings] = useState<ListingLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  // 1. Get Dark Mode state from the global store
  const { darkMode } = useStore();

  useEffect(() => {
    // 2. Fetch data from your new specific Map endpoint
    api.get<ListingLocation[]>('/listings/map')
      .then(res => {
        // Filter out any bad data that might crash the map
        const validListings = res.data.filter(i => i.latitude && i.longitude);
        setListings(validListings);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // 3. Define Tile Layers
  const lightTiles = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
  const darkTiles = "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png";
  const attribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>';

  if (loading) return (
    <div className="flex h-[calc(100vh-80px)] items-center justify-center bg-gray-50 dark:bg-slate-950 transition-colors duration-300">
      <Loader2 className="animate-spin text-ohb-gold" size={48} />
    </div>
  );

  return (
    <div className="h-[calc(100vh-80px)] w-full relative z-0 bg-gray-200 dark:bg-slate-900 transition-colors duration-300">
      
      {/* 4. The Key Prop is CRITICAL: It forces React to destroy and recreate the map when the theme changes, ensuring tiles update instantly. */}
      <MapContainer 
        key={darkMode ? 'dark' : 'light'} 
        center={[23.5880, 58.3829]} // Muscat Coordinates
        zoom={11} 
        scrollWheelZoom={true}
        className="h-full w-full z-0"
      >
        {/* 5. Dynamic Tile Layer based on Theme */}
        <TileLayer
          attribution={attribution}
          url={darkMode ? darkTiles : lightTiles}
        />
        
        {listings.map((item) => (
          <Marker 
            key={item.id} 
            position={[item.latitude, item.longitude]}
          >
            <Popup className="custom-popup">
              <div className="min-w-[200px]">
                <div className="relative h-24 w-full mb-2">
                  <img 
                    src={item.image_urls[0] || 'https://via.placeholder.com/400'} 
                    alt={item.name} 
                    className="w-full h-full object-cover rounded-t-lg"
                  />
                  <span className="absolute top-1 left-1 bg-white/90 px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider text-ohb-dark shadow-sm">
                    {item.type}
                  </span>
                </div>
                
                <h3 className="font-bold text-sm text-gray-900 line-clamp-1 mb-1">{item.name}</h3>
                
                <p className="text-ohb-gold font-bold text-sm mb-2">
                  {(!isNaN(Number(item.price))) ? `OMR ${Number(item.price).toLocaleString()}` : item.price}
                </p>
                
                <button 
                  onClick={() => navigate(`/details/${item.type}/${item.id}`)}
                  className="w-full bg-ohb-dark text-white text-xs py-2 rounded hover:bg-ohb-gold transition font-medium"
                >
                  View Details
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      
      {/* 6. Floating Legend Overlay (Dark Mode Aware) */}
      <div className="absolute top-4 right-4 z-[1000] bg-white/90 dark:bg-slate-900/90 backdrop-blur-md p-4 rounded-xl shadow-xl border border-gray-200 dark:border-slate-700 max-w-xs transition-colors duration-300">
        <h4 className="font-bold text-sm text-ohb-dark dark:text-white mb-1">Map Explorer</h4>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-0">
          Showing {listings.length} properties in Muscat
        </p>
      </div>
    </div>
  );
};