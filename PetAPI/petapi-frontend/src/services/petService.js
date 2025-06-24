import api from './api';

/**
 * Yeni bir evcil hayvan oluşturur
 * @param {Object} petData - Evcil hayvan bilgileri
 * @param {string} petData.name - Evcil hayvan adı
 * @param {string} petData.type - Evcil hayvan türü
 * @returns {Promise<Object>} Oluşturulan evcil hayvan
 */
export const createPet = async (petData) => {
  try {
    const response = await api.post('/pets', petData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data || 'Evcil hayvan oluşturulurken bir hata oluştu');
  }
};

/**
 * Kullanıcının evcil hayvanını getirir
 * @returns {Promise<Object>} Evcil hayvan bilgileri
 */
export const getMyPet = async () => {
  try {
    const response = await api.get('/pets/mypet');
    return response.data;
  } catch (error) {
    if (error.response?.status === 404) {
      throw new Error('Size ait bir evcil hayvan bulunamadı');
    }
    throw new Error(error.response?.data || 'Evcil hayvan bilgileri alınırken bir hata oluştu');
  }
};

/**
 * Evcil hayvanı besler
 * @returns {Promise<Object>} Güncellenmiş evcil hayvan bilgileri
 */
export const feedMyPet = async () => {
  try {
    const response = await api.post('/pets/feed');
    return response.data;
  } catch (error) {
    if (error.response?.status === 404) {
      throw new Error('Size ait bir evcil hayvan bulunamadı');
    }
    throw new Error(error.response?.data || 'Evcil hayvan beslenirken bir hata oluştu');
  }
};

/**
 * Evcil hayvanla oyun oynar
 * @returns {Promise<Object>} Güncellenmiş evcil hayvan bilgileri
 */
export const playWithMyPet = async () => {
  try {
    const response = await api.post('/pets/play');
    return response.data;
  } catch (error) {
    if (error.response?.status === 404) {
      throw new Error('Size ait bir evcil hayvan bulunamadı');
    }
    throw new Error(error.response?.data || 'Evcil hayvanla oyun oynanırken bir hata oluştu');
  }
};

/**
 * Liderlik tablosunu getirir
 * @param {Object} params - Sayfalama parametreleri
 * @param {number} params.pageNumber - Sayfa numarası (varsayılan: 1)
 * @param {number} params.pageSize - Sayfa boyutu (varsayılan: 10)
 * @returns {Promise<Array>} Liderlik tablosu
 */
export const getLeaderboard = async (params = {}) => {
  try {
    const { pageNumber = 1, pageSize = 10 } = params;
    const response = await api.get('/pets/leaderboard', {
      params: { pageNumber, pageSize }
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data || 'Liderlik tablosu alınırken bir hata oluştu');
  }
};

/**
 * Mini oyun sonucunu backend'e gönderir
 * @param {Object} result - { gameType: string, score: number }
 * @returns {Promise<Object>} Güncellenmiş pet
 */
export const submitMinigameResult = async (result) => {
  try {
    const response = await api.post('/pets/submit-minigame', result);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data || 'Mini oyun sonucu gönderilirken bir hata oluştu');
  }
};

/**
 * Kullanıcının envanterini getirir
 * @returns {Promise<Array>} Envanter listesi
 */
export const getUserInventory = async () => {
  try {
    const response = await api.get('/Store/my-inventory');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data || 'Envanter alınırken bir hata oluştu');
  }
};

/**
 * Pet üzerinde eşya kullanır
 * @param {number} itemId - Kullanılacak eşyanın ID'si
 * @returns {Promise<Object>} Güncellenmiş pet
 */
export const useItemOnPet = async (itemId) => {
  try {
    const response = await api.post(`/Pets/use-item/${itemId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Eşya kullanılırken bir hata oluştu');
  }
};

/**
 * Oda dekorasyonunu günceller
 * @param {number} itemId - Kullanılacak dekorasyon eşyasının ID'si
 * @returns {Promise<Object>} İşlem sonucu
 */
export const decorateRoom = async (itemId) => {
  try {
    const response = await api.post(`/Pets/decorate/${itemId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Dekorasyon uygulanırken bir hata oluştu');
  }
}; 