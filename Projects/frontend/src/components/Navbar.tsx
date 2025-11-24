import { Link, useNavigate } from 'react-router-dom';
import { Home, User, LogOut, Moon, Sun } from 'lucide-react';
import { useStore } from '../store/useStore';

export const Navbar = () => {
  const { user, logout, darkMode, toggleTheme } = useStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 sticky top-0 z-50 shadow-sm transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3">
            <div className="bg-ohb-gold p-2 rounded text-white">
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

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8 text-sm font-medium text-gray-600 dark:text-gray-300 transition-colors">
            <Link to="/" className="hover:text-ohb-gold dark:hover:text-ohb-gold transition">Search</Link>
            <a href="#" className="hover:text-ohb-gold dark:hover:text-ohb-gold transition">Processes</a>
            <a href="#" className="hover:text-ohb-gold dark:hover:text-ohb-gold transition">Help</a>
            <a href="#" className="hover:text-ohb-gold dark:hover:text-ohb-gold transition">Properties</a>
          </div>

          {/* Right Actions: Theme Toggle + Auth */}
          <div className="flex items-center gap-4">
            {/* Dark Mode Toggle */}
            <button 
              onClick={toggleTheme} 
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-600 dark:text-yellow-400 transition-colors"
              title="Toggle Theme"
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {/* Divider */}
            <div className="h-6 w-px bg-gray-200 dark:bg-slate-700"></div>

            {/* Auth Logic */}
            {user ? (
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600 dark:text-gray-300 hidden sm:block">
                  Hello, {user.name}
                </span>
                <button 
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-sm font-medium text-red-500 hover:text-red-600 transition"
                >
                  <LogOut size={18} />
                  <span className="hidden md:inline">Logout</span>
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
        </div>
      </div>
    </nav>
  );
};