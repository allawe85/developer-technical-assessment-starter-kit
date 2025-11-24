import { Link, useNavigate } from 'react-router-dom';
import { Home, User, LogOut } from 'lucide-react';
import { useStore } from '../store/useStore';

export const Navbar = () => {
  const { user, logout } = useStore();
  const navigate = useNavigate();

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          {/* Brand */}
          <Link to="/" className="flex items-center gap-3">
            <div className="bg-ohb-gold p-2 rounded text-white">
              <Home size={24} />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-xl text-ohb-dark tracking-wide uppercase">Oman Housing Bank</span>
              <span className="text-xs text-gray-500 tracking-widest uppercase">Real Estate Marketplace</span>
            </div>
          </Link>

          {/* Navigation (Wireframe) */}
          <div className="hidden md:flex space-x-8 text-sm font-medium text-gray-600">
            <Link to="/" className="hover:text-ohb-gold transition">Search</Link>
            <a href="#" className="hover:text-ohb-gold transition">Processes</a>
            <a href="#" className="hover:text-ohb-gold transition">Help</a>
            <a href="#" className="hover:text-ohb-gold transition">Properties</a>
          </div>

          {/* Auth Button */}
          <div>
            {user ? (
              <button onClick={() => { logout(); navigate('/login'); }} className="text-red-500 flex items-center gap-2 text-sm font-medium">
                <LogOut size={16} /> Logout
              </button>
            ) : (
              <Link to="/login" className="flex items-center gap-2 text-sm font-medium text-ohb-gold border border-ohb-gold px-4 py-2 rounded-full hover:bg-ohb-gold hover:text-white transition">
                <User size={18} /> Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};