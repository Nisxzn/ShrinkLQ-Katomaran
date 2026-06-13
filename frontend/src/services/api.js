import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const register = async (name, email, password) => {
  const response = await api.post('/auth/register', { name, email, password });
  return response.data;
};

export const login = async (email, password) => {
  const response = await api.post('/auth/login', { email, password });
  return response.data;
};

export const verifyEmail = async (token) => {
  const response = await api.get(`/auth/verify/${token}`);
  return response.data;
};

export const resendVerification = async (email) => {
  const response = await api.post('/auth/resend-verification', { email });
  return response.data;
};

export const googleLogin = async (credential) => {
  const response = await api.post('/auth/google-login', { credential });
  return response.data;
};

export const forgotPassword = async (email) => {
  const response = await api.post('/auth/forgot-password', { email });
  return response.data;
};

export const resetPassword = async (token, password) => {
  const response = await api.post('/auth/reset-password', { token, password });
  return response.data;
};

export const getProfile = async () => {
  const response = await api.get('/auth/profile');
  return response.data;
};

export const createUrl = async (originalUrl, customAlias, expiryDate) => {
  const response = await api.post('/url/create', { originalUrl, customAlias, expiryDate });
  return response.data;
};

export const getAllUrls = async () => {
  const response = await api.get('/url/all');
  return response.data;
};

export const deleteUrl = async (id) => {
  const response = await api.delete(`/url/${id}`);
  return response.data;
};

export const updateUrl = async (id, originalUrl, customAlias, expiryDate) => {
  const response = await api.put(`/url/${id}`, { originalUrl, customAlias, expiryDate });
  return response.data;
};

export const bulkCreateUrls = async (urls) => {
  const response = await api.post('/url/bulk', { urls });
  return response.data;
};

export const getAnalytics = async (id) => {
  const response = await api.get(`/analytics/${id}`);
  return response.data;
};

export const getPublicStats = async (shortCode) => {
  const response = await axios.get(`${API_URL.replace('/api', '')}/stats/${shortCode}`);
  return response.data;
};

export default api;
