import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import api from "../services/api";

export default function StorePage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user, setUser } = useContext(AuthContext);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const res = await api.get("/Store/items");
      setItems(res.data);
    } catch (err) {
      setError("Eşyalar yüklenemedi.");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchItems();
    // eslint-disable-next-line
  }, []);

  const handleBuy = async (itemId, price) => {
    setError("");
    try {
      await api.post(`/Store/purchase/${itemId}`);
      setUser((u) => ({ ...u, coins: u.coins - price }));
      window.toast && window.toast.success("Satın alındı!");
    } catch (err) {
      setError(err.response?.data || "Satın alma başarısız.");
      window.toast && window.toast.error(err.response?.data || "Satın alma başarısız.");
    }
  };

  if (loading) return <div className="text-center mt-8 text-cyan-400">Yükleniyor...</div>;
  if (error) return <div className="text-center mt-8 text-red-400">{error}</div>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4 text-cyan-300">Mağaza</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {items.map((item) => (
          <div key={item.id} className="bg-slate-800 rounded-lg shadow p-4 flex flex-col items-center transition-transform duration-200 hover:scale-105 hover:shadow-cyan-500/50">
            <img src={item.imageUrl} alt={item.name} className="w-24 h-24 mx-auto object-contain mb-3 drop-shadow-lg" />
            <div className="font-bold text-lg text-cyan-200 mb-1">{item.name}</div>
            <div className="text-gray-300 text-sm mb-2 text-center">{item.description}</div>
            <div className="flex items-center gap-1 bg-yellow-400/90 text-yellow-900 font-bold px-3 py-1 rounded-full text-lg mb-3 shadow">
              <span className="material-icons">paid</span> {item.price}
            </div>
            <button
              className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-1 rounded mt-auto font-semibold shadow"
              onClick={() => handleBuy(item.id, item.price)}
              disabled={user?.coins < item.price}
            >
              Satın Al
            </button>
          </div>
        ))}
      </div>
    </div>
  );
} 