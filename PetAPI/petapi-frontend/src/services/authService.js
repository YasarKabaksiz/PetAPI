import api from './api';

/**
 * Kullanıcı girişi yapar
 * @param {Object} credentials - Giriş bilgileri
 * @param {string} credentials.username - Kullanıcı adı
 * @param {string} credentials.password - Şifre
 * @returns {Promise<Object>} Giriş sonucu ve token
 */
export const login = async (credentials) => {
  try {
    const response = await api.post('/auth/login', credentials);
    
    // Token'ı localStorage'a kaydet
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data || 'Giriş yapılırken bir hata oluştu');
  }
};

/**
 * Yeni kullanıcı kaydı oluşturur
 * @param {Object} userData - Kullanıcı kayıt bilgileri
 * @param {string} userData.username - Kullanıcı adı
 * @param {string} userData.password - Şifre
 * @returns {Promise<Object>} Kayıt sonucu
 */
export const register = async (userData) => {
  try {
    const response = await api.post('/auth/register', userData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data || 'Kayıt olurken bir hata oluştu');
  }
};

/**
 * Kullanıcı çıkışı yapar
 */
export const logout = () => {
  localStorage.removeItem('token');
};

/**
 * Kullanıcının giriş yapmış olup olmadığını kontrol eder
 * @returns {boolean} Giriş durumu
 */
export const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};

/**
 * Mevcut token'ı döndürür
 * @returns {string|null} Token
 */
export const getToken = () => {
  return localStorage.getItem('token');
}; 