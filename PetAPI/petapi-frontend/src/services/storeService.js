import api from './api';

/**
 * Envanterden bir eşyayı siler (bir adet azaltır veya tamamen kaldırır)
 * @param {number} itemId
 * @returns {Promise<void>} Başarılıysa resolve olur, hata varsa throw eder
 */
export const removeItemFromInventory = async (itemId) => {
  try {
    await api.delete(`/store/inventory/${itemId}`);
  } catch (error) {
    throw new Error(error.response?.data || 'Eşya silinirken bir hata oluştu');
  }
}; 