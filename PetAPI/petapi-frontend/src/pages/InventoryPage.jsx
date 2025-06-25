import React, { useEffect, useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import { FaTrash } from "react-icons/fa";
import { removeItemFromInventory } from "../services/storeService";
import ConfirmationModal from "../components/ui/ConfirmationModal";

export default function InventoryPage() {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const fetchInventory = async () => {
    setLoading(true);
    try {
      const res = await api.get("/Store/my-inventory");
      setInventory(res.data);
    } catch (err) {
      setError("Envanter yüklenemedi.");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const handleUse = async (itemId) => {
    setError("");
    try {
      await api.post(`/Pets/use-item/${itemId}`);
      window.toast && window.toast.success("Eşya kullanıldı!");
      await fetchInventory();
      navigate("/game");
    } catch (error) {
      console.error("Eşya kullanılırken hata oluştu:", error.response);
      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message);
        window.toast && window.toast.error(error.response.data.message);
      } else {
        setError("Beklenmedik bir hata oluştu. Lütfen tekrar deneyin.");
        window.toast && window.toast.error("Beklenmedik bir hata oluştu. Lütfen tekrar deneyin.");
      }
    }
  };

  const handleDeleteClick = (item) => {
    setItemToDelete(item);
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;
    try {
      await removeItemFromInventory(itemToDelete.id);
      window.toast && window.toast.success("Eşya silindi!");
      setIsModalOpen(false);
      setItemToDelete(null);
      await fetchInventory();
    } catch (err) {
      setError(err.message || "Eşya silinirken bir hata oluştu");
      window.toast && window.toast.error(err.message || "Eşya silinirken bir hata oluştu");
      setIsModalOpen(false);
      setItemToDelete(null);
    }
  };

  if (loading) return <div className="text-center mt-8 text-cyan-400">Yükleniyor...</div>;
  if (error) return <div className="text-center mt-8 text-red-400">{error}</div>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4 text-cyan-300">Envanterim</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {inventory.length === 0 && <div className="col-span-full text-gray-400">Envanterin boş.</div>}
        {inventory.map((inv) => (
          <div key={inv.item.id} className="bg-slate-800 rounded-lg shadow p-4 flex flex-col items-center transition-transform duration-200 hover:scale-105 hover:shadow-cyan-500/50 relative">
            <button
              className="absolute top-2 right-2 text-red-400 hover:text-red-600 bg-slate-900/70 rounded-full p-1 shadow"
              title="Eşyayı sil"
              onClick={() => handleDeleteClick(inv.item)}
            >
              <FaTrash />
            </button>
            <img src={inv.item.imageUrl} alt={inv.item.name} className="w-24 h-24 mx-auto object-contain mb-3 drop-shadow-lg" />
            <div className="font-bold text-lg text-cyan-200 mb-1">{inv.item.name}</div>
            <div className="text-gray-300 text-sm mb-2 text-center">{inv.item.description}</div>
            <div className="flex items-center gap-1 bg-yellow-400/90 text-yellow-900 font-bold px-3 py-1 rounded-full text-lg mb-3 shadow">
              <span className="material-icons">paid</span> {inv.item.price}
            </div>
            <div className="flex items-center gap-2 mt-auto">
              <div className="bg-cyan-500/90 text-white font-bold px-4 py-1 rounded-full text-lg shadow">x{inv.quantity}</div>
              {(inv.item.itemType === "Food" || inv.item.itemType === "Toy") && inv.quantity > 0 && (
                <button
                  className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded font-semibold shadow"
                  onClick={() => handleUse(inv.item.id)}
                >
                  Kullan
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setItemToDelete(null); }}
        onConfirm={confirmDelete}
        title="Eşyayı Sil"
        message={`'${itemToDelete?.name || itemToDelete?.item?.name || ""}' adlı eşyadan bir tane silmek istediğinize emin misiniz? Bu işlem geri alınamaz.`}
      />
    </div>
  );
} 