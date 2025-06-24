import React, { useEffect, useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

export default function InventoryPage() {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

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

  if (loading) return <div className="text-center mt-8 text-cyan-400">Yükleniyor...</div>;
  if (error) return <div className="text-center mt-8 text-red-400">{error}</div>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4 text-cyan-300">Envanterim</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {inventory.length === 0 && <div className="col-span-full text-gray-400">Envanterin boş.</div>}
        {inventory.map((inv) => (
          <div key={inv.item.id} className="bg-slate-800 rounded-lg shadow p-4 flex flex-col items-center">
            <img src={inv.item.imageUrl} alt={inv.item.name} className="w-20 h-20 object-contain mb-2" />
            <div className="font-bold text-lg text-cyan-200">{inv.item.name}</div>
            <div className="text-gray-300 text-sm mb-1">{inv.item.description}</div>
            <div className="flex items-center gap-1 text-yellow-300 font-semibold mb-2">
              <span className="material-icons">paid</span> {inv.item.price}
            </div>
            <div className="flex items-center gap-2 mt-auto">
              <div className="bg-cyan-700 text-white px-3 py-1 rounded">x{inv.quantity}</div>
              {(inv.item.itemType === "Food" || inv.item.itemType === "Toy") && inv.quantity > 0 && (
                <button
                  className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
                  onClick={() => handleUse(inv.item.id)}
                >
                  Kullan
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 