import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Phone, CheckCircle } from 'lucide-react';
import api from '../lib/api';
import { useStore } from '../store/useStore';

// 1. Define the Shape of a Listing
interface Listing {
    id: string;
    name: string;
    price: string; // We format this as a string in the backend
    location: string;
    image_urls: string[];
    details: string;
    type: string;
    amenities?: string[]; // Optional: Only exists on properties
}

export const DetailsPage = () => {
    const { type, id } = useParams();
    const { user } = useStore();
    const navigate = useNavigate();

    // 2. Use the Interface instead of <any>
    const [item, setItem] = useState<Listing | null>(null);
    const [activeImg, setActiveImg] = useState(0);

    useEffect(() => {
        api.get(`/listings/${type}/${id}`)
            .then(res => setItem(res.data))
            .catch(console.error);
    }, [type, id]);

    const handleContact = async () => {
        if (!user) return navigate('/login'); // Auth Guard
        try {
            await api.post('/agent-contact', { listingId: id, listingType: type, message: "Interested!" });
            alert('Agent has been notified!');
        } catch (e) { alert('Failed to contact agent.' + e); }
    };

    if (!item) return <div className="p-20 text-center">Loading...</div>;

    return (
        <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left: Images */}
            <div className="space-y-4">
                <div className="h-96 bg-gray-200 rounded-2xl overflow-hidden shadow-sm">
                    <img
                        src={item.image_urls[activeImg] || 'https://via.placeholder.com/600'}
                        className="w-full h-full object-cover"
                        alt={item.name}
                    />
                </div>
                <div className="flex gap-4 overflow-x-auto pb-2">
                    {item.image_urls.map((url, idx) => (
                        <button
                            key={idx}
                            onClick={() => setActiveImg(idx)}
                            className={`h-20 w-20 rounded-lg overflow-hidden border-2 flex-shrink-0 ${idx === activeImg ? 'border-ohb-gold' : 'border-transparent'}`}
                        >
                            <img src={url} className="w-full h-full object-cover" alt={`Thumbnail ${idx}`} />
                        </button>
                    ))}
                </div>
            </div>

            {/* Right: Info */}
            <div className="space-y-8">
                <div>
                    <h1 className="text-3xl font-bold text-ohb-dark mb-2">{item.name}</h1>
                    <div className="flex items-center text-gray-500">
                        <MapPin size={18} className="mr-1" /> {item.location}
                    </div>
                </div>

                <div className="p-6 bg-gray-50 rounded-xl border border-gray-100">
                    <span className="text-gray-500 text-sm uppercase tracking-wide">Price</span>
                    <p className="text-4xl font-bold text-ohb-gold mt-1">
                        {(!isNaN(Number(item.price))) ? `OMR ${Number(item.price).toLocaleString()}` : item.price}
                    </p>
                </div>

                <div>
                    <h3 className="font-bold text-lg mb-3">Description</h3>
                    <p className="text-gray-600 leading-relaxed">{item.details}</p>
                </div>

                {/* Amenities Section - Only renders if array exists and has items */}
                {item.amenities && item.amenities.length > 0 && (
                    <div>
                        <h3 className="font-bold text-lg mb-3">Amenities</h3>
                        <div className="grid grid-cols-2 gap-3">
                            {item.amenities.map((am, i) => (
                                <div key={i} className="flex items-center gap-2 text-gray-600">
                                    <CheckCircle size={16} className="text-ohb-gold" /> {am}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <button
                    onClick={handleContact}
                    className="w-full py-4 bg-ohb-dark text-white font-bold rounded-xl hover:bg-ohb-gold transition flex items-center justify-center gap-2 text-lg shadow-lg shadow-blue-900/10"
                >
                    <Phone size={20} /> Contact Agent
                </button>
            </div>
        </div>
    );
};