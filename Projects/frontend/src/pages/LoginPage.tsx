import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // <--- 1. Added Link here
import api from '../lib/api';
import { useStore } from '../store/useStore';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { login } = useStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data } = await api.post('/auth/login', { email, password });
      login(data.user, data.access_token);
      navigate('/');
    } catch (err) { 
      alert('Invalid credentials' + err); 
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-100">
        <h1 className="text-2xl font-bold text-ohb-dark mb-6 text-center">Login to OHB Estate</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-ohb-gold outline-none" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-ohb-gold outline-none" required />
          </div>
          <button type="submit" className="w-full py-3 bg-ohb-gold text-white font-bold rounded-lg hover:bg-ohb-dark transition">
            Sign In
          </button>
        </form>

        {/* --- 2. ADDED THIS SECTION --- */}
        <div className="mt-6 text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <Link to="/register" className="text-ohb-gold font-bold hover:underline">
            Create one
          </Link>
        </div>
        
      </div>
    </div>
  );
};