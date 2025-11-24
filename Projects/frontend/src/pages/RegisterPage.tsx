import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../lib/api';
import { AxiosError } from 'axios';

export const RegisterPage = () => {
  const [formData, setFormData] = useState({ email: '', password: '', fullName: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      await api.post('/auth/register', formData);
      alert('Registration successful! Please login.');
      navigate('/login');
    } catch (err) {
      // Cast the error to AxiosError so TypeScript knows it has a 'response' property
      const error = err as AxiosError<{ message: string }>;
      setError(error.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md border border-gray-100">
        <h1 className="text-2xl font-bold text-ohb-dark mb-2 text-center">Create Account</h1>
        <p className="text-gray-500 text-center mb-6">Join Oman Housing Bank Marketplace</p>
        
        {error && <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input 
              type="text" 
              className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-ohb-gold outline-none" 
              required
              value={formData.fullName}
              onChange={e => setFormData({...formData, fullName: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input 
              type="email" 
              className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-ohb-gold outline-none" 
              required
              value={formData.email}
              onChange={e => setFormData({...formData, email: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input 
              type="password" 
              className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-ohb-gold outline-none" 
              required
              value={formData.password}
              onChange={e => setFormData({...formData, password: e.target.value})}
            />
          </div>
          <button type="submit" className="w-full py-3 bg-ohb-dark text-white font-bold rounded-lg hover:bg-ohb-gold transition">
            Register
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="text-ohb-gold font-bold hover:underline">
            Login here
          </Link>
        </div>
      </div>
    </div>
  );
};