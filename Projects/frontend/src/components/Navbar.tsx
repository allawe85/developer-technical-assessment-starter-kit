import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Home, User, LogOut, Moon, Sun, Map as MapIcon, Menu, X } from 'lucide-react'; // Added Menu, X
import { useStore } from '../store/useStore';

export const Navbar = () => {
  const { user, logout, darkMode, toggleTheme } = useStore();
  const navigate = useNavigate();
  
  // State for mobile menu toggle
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsMenuOpen(false); // Close menu on logout
  };

  return (
    <nav className="bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 sticky top-0 z-50 shadow-sm transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          
          {/* --- LEFT: BRAND --- */}
          <Link to="/" className="flex items-center gap-3 group z-50">
            <div className="bg-ohb-gold p-2 rounded text-white group-hover:scale-105 transition-transform">
              <Home size={24} />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-xl text-ohb-dark dark:text-white tracking-wide uppercase transition-colors">
                Oman Housing Bank
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400 tracking-widest uppercase transition-colors">
                Real Estate Marketplace
              </span>
            </div>
          </Link>

          {/* --- MIDDLE: DESKTOP MENU (Hidden on Mobile) --- */}
          <div className="hidden md:flex space-x-8 text-sm font-medium text-gray-600 dark:text-gray-300 transition-colors items-center">
            <Link to="/" className="hover:text-ohb-gold dark:hover:text-ohb-gold transition">Search</Link>
            <Link to="/map" className="flex items-center gap-1 hover:text-ohb-gold dark:hover:text-ohb-gold transition text-ohb-gold dark:text-ohb-gold font-semibold">
              <MapIcon size={16} /> Map View
            </Link>
            <a href="#" className="hover:text-ohb-gold dark:hover:text-ohb-gold transition">Processes</a>
            <a href="#" className="hover:text-ohb-gold dark:hover:text-ohb-gold transition">Help</a>
          </div>

          {/* --- RIGHT: ACTIONS (Desktop) --- */}
          <div className="hidden md:flex items-center gap-4">
            <button 
              onClick={toggleTheme} 
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-600 dark:text-yellow-400 transition-colors"
              title="Toggle Theme"
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            <div className="h-6 w-px bg-gray-200 dark:bg-slate-700"></div>

            {user ? (
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  Hello, {user.name.split(' ')[0]}
                </span>
                <button 
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-sm font-medium text-red-500 hover:text-red-600 transition"
                >
                  <LogOut size={18} /> Logout
                </button>
              </div>
            ) : (
              <Link 
                to="/login" 
                className="flex items-center gap-2 text-sm font-medium text-ohb-gold border border-ohb-gold px-4 py-2 rounded-full hover:bg-ohb-gold hover:text-white transition-all"
              >
                <User size={18} /> Login
              </Link>
            )}
          </div>

          {/* --- MOBILE HAMBURGER BUTTON (Visible only on Mobile) --- */}
          <div className="md:hidden flex items-center gap-4">
             <button 
              onClick={toggleTheme} 
              className="p-2 text-gray-600 dark:text-yellow-400 transition-colors"
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-gray-600 dark:text-white hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* --- MOBILE MENU DROPDOWN --- */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-20 left-0 w-full bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 shadow-xl py-4 px-6 flex flex-col space-y-4 animate-in slide-in-from-top-5 duration-200">
          <Link 
            to="/" 
            onClick={() => setIsMenuOpen(false)}
            className="text-gray-700 dark:text-gray-200 hover:text-ohb-gold font-medium py-2"
          >
            Search
          </Link>
          <Link 
            to="/map" 
            onClick={() => setIsMenuOpen(false)}
            className="text-ohb-gold font-semibold flex items-center gap-2 py-2"
          >
            <MapIcon size={18} /> Map View
          </Link>
          <a href="#" className="text-gray-700 dark:text-gray-200 hover:text-ohb-gold font-medium py-2">Processes</a>
          <a href="#" className="text-gray-700 dark:text-gray-200 hover:text-ohb-gold font-medium py-2">Help</a>
          
          <div className="h-px w-full bg-gray-100 dark:bg-slate-800 my-2"></div>

          {user ? (
            <div className="flex flex-col gap-3">
              <span className="text-sm text-gray-500 dark:text-gray-400">Logged in as {user.name}</span>
              <button 
                onClick={handleLogout}
                className="flex items-center gap-2 text-red-500 font-medium py-2"
              >
                <LogOut size={18} /> Logout
              </button>
            </div>
          ) : (
            <Link 
              to="/login" 
              onClick={() => setIsMenuOpen(false)}
              className="w-full bg-ohb-gold text-white text-center py-3 rounded-lg font-bold hover:bg-ohb-dark transition"
            >
              Login / Register
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};