import React, { useEffect, useState, useContext } from "react";
import { getMyPet, feedMyPet, playWithMyPet } from "../services/petService"; // petService'in doğru path'de olduğundan emin ol
import PetStatusCard from "../components/PetStatusCard.jsx";
import CreatePetForm from "../components/CreatePetForm.jsx";
import { AuthContext } from "../context/AuthContext.jsx";
import { FaUtensils, FaGamepad } from "react-icons/fa";
import useInterval from "../hooks/useInterval";
import PetHologram from "../components/hologram/PetHologram.jsx";

function GamePage() {
  // --- STATE MANAGEMENT ---
  const [pet, setPet] = useState(null); // Mevcut evcil hayvan verisi
  const [isLoading, setIsLoading] = useState(true); // Sayfa ilk yüklenirken
  const [isActionLoading, setIsActionLoading] = useState(false); // Besle/Oyna butonu tıklanınca
  const [cooldown, setCooldown] = useState(0); // Butonlar için geri sayım
  const [error, setError] = useState(""); // Hata mesajları için
  const { user, updateUser } = useContext(AuthContext); // Global kullanıcı bilgileri
  const [effectKey, setEffectKey] = useState(0); // Hologram efekt tetikleyici

  // --- COOLDOWN GERI SAYIM ---
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => {
      setCooldown(prev => prev - 1);
    }, 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  // --- PET VERİSİNİ ÇEKEN ANA FONKSİYON ---
  const fetchPetData = async () => {
    try {
      const petData = await getMyPet();
      setPet(petData);
    } catch (error) {
      console.error("Pet verisi çekilirken hata oluştu:", error);
      // İsteğe bağlı: Kullanıcıya bilgi verecek bir state ayarlanabilir.
    }
  };

  // --- İLK YÜKLEMEDE PET VERİSİNİ ÇEK ---
  useEffect(() => {
    setIsLoading(true);
    fetchPetData().finally(() => setIsLoading(false));
  }, []);

  // --- POLLING: Her 10 saniyede bir pet verisini güncelle ---
  useInterval(() => {
    if (pet && !isActionLoading) {
      fetchPetData();
    }
  }, 10000);

  // --- EVENT HANDLERS ---
  const handlePetCreated = (newPet) => {
    setPet(newPet);
  };

  const handleFeed = async () => {
    if (isActionLoading || cooldown > 0) return;
    setIsActionLoading(true);
    try {
      const updatedPet = await feedMyPet();
      setPet(updatedPet);
      if (user) {
        updateUser(prevUser => ({ ...prevUser, coins: prevUser.coins + 1 }));
      }
      setError("");
      setEffectKey(e => e + 1); // Hologram efektini tetikle
    } catch (err) {
      setError(err.response?.data?.message || "Besleme işlemi sırasında bir hata oluştu.");
    } finally {
      setIsActionLoading(false);
      setCooldown(5); // Geri sayımı başlat
    }
  };

  const handlePlay = async () => {
    if (isActionLoading || cooldown > 0) return;
    setIsActionLoading(true);
    try {
      const updatedPet = await playWithMyPet();
      setPet(updatedPet);
      if (user) {
        updateUser(prevUser => ({ ...prevUser, coins: prevUser.coins + 2 }));
      }
      setError("");
      setEffectKey(e => e + 1); // Hologram efektini tetikle
    } catch (err) {
      setError(err.response?.data?.message || "Oyun oynama işlemi sırasında bir hata oluştu.");
    } finally {
      setIsActionLoading(false);
      setCooldown(5); // Geri sayımı başlat
    }
  };

  // --- RENDER LOGIC ---
  if (isLoading) {
    return <div className="flex justify-center items-center min-h-[70vh] text-2xl text-cyan-300">Evcil hayvan bilgileri yükleniyor...</div>;
  }

  if (!pet) {
    return (
      <div className="flex justify-center items-center min-h-[70vh]">
        <CreatePetForm onPetCreated={handlePetCreated} />
      </div>
    );
  }

  // XP ve Level bilgisi
  const xpForNextLevel = pet.level * 100;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center min-h-[calc(100vh-80px)] p-8 bg-gradient-to-br from-slate-900 to-slate-800">
      {/* Sol Sütun: Durum Kartı */}
      <div className="flex flex-col items-center justify-center">
        <PetStatusCard pet={pet} />
      </div>
      {/* Orta Sütun: 3D Hologram ve Bilgiler */}
      <div className="flex flex-col items-center justify-center">
        <div className="h-96 w-full flex items-center justify-center">
          <PetHologram petType={pet.type} effectKey={effectKey} />
        </div>
        <div className="mt-8 text-cyan-300 text-2xl font-bold text-shadow-glow text-center select-none">
          Seviye <span className="text-3xl text-cyan-400 drop-shadow">{pet.level}</span>
          <span className="mx-3 text-base text-cyan-200">|</span>
          XP <span className="text-xl text-cyan-200">{pet.experience} / {xpForNextLevel}</span>
        </div>
      </div>
      {/* Sağ Sütun: Etkileşim Butonları */}
      <div className="flex flex-col items-center justify-center gap-8">
        <button
          onClick={handleFeed}
          disabled={isActionLoading || cooldown > 0}
          className="w-48 py-4 mb-2 flex items-center justify-center gap-3 bg-cyan-900/60 border border-cyan-500 text-cyan-200 text-lg font-bold rounded-2xl shadow-xl hover:bg-cyan-800/80 hover:border-cyan-400 active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed backdrop-blur-md"
        >
          <FaUtensils className="text-2xl" />
          {cooldown > 0 ? `Bekle (${cooldown}s)` : "Besle"}
        </button>
        <button
          onClick={handlePlay}
          disabled={isActionLoading || cooldown > 0}
          className="w-48 py-4 flex items-center justify-center gap-3 bg-cyan-900/60 border border-cyan-500 text-cyan-200 text-lg font-bold rounded-2xl shadow-xl hover:bg-cyan-800/80 hover:border-cyan-400 active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed backdrop-blur-md"
        >
          <FaGamepad className="text-2xl" />
          {cooldown > 0 ? `Bekle (${cooldown}s)` : "Oyna"}
        </button>
        {error && <div className="text-red-400 text-center mt-4 bg-red-900/50 p-3 rounded-lg w-48">{error}</div>}
      </div>
    </div>
  );
}

export default GamePage;