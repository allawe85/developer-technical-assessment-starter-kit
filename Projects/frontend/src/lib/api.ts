import axios from 'axios';
import { useStore } from '../store/useStore';

const api = axios.create({
  baseURL: 'http://localhost:3000', // Your NestJS Server
});

// Auto-attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = useStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;