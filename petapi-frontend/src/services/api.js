import axios from 'axios';

// Temel API URL'i
const API_BASE_URL = 'https://localhost:7090/api';

// Axios instance oluştur
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - her istekte token'ı ekle
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - hata yönetimi
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // 401 hatası durumunda token'ı temizle ve login sayfasına yönlendir
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      // Burada router ile login sayfasına yönlendirme yapılabilir
    }
    return Promise.reject(error);
  }
);

export default api; 