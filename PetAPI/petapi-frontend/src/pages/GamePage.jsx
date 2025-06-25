import React, { useEffect, useState, useContext } from "react";
import { getMyPet, feedMyPet, playWithMyPet, submitMinigameResult, getUserInventory, useItemOnPet } from "../services/petService"; // petService'in doğru path'de olduğundan emin ol
import PetStatusCard from "../components/PetStatusCard.jsx";
import CreatePetForm from "../components/CreatePetForm.jsx";
import { AuthContext } from "../context/AuthContext.jsx";
import { FaUtensils, FaGamepad } from "react-icons/fa";
import useInterval from "../hooks/useInterval";
import PetHologram from "../components/hologram/PetHologram.jsx";
import CatchTheFoodGame from "../components/minigames/CatchTheFoodGame.jsx";
import RhythmGame from "../components/minigames/RhythmGame.jsx";
import QuickBar from "../components/QuickBar.jsx";

function GamePage() {
  // --- STATE MANAGEMENT ---
  const [pet, setPet] = useState(null); // Mevcut evcil hayvan verisi
  const [inventory, setInventory] = useState([]); // Kullanıcının envanteri
  const [isLoading, setIsLoading] = useState(true); // Sayfa ilk yüklenirken
  const [isActionLoading, setIsActionLoading] = useState(false); // Besle/Oyna butonu tıklanınca
  const [cooldown, setCooldown] = useState(0); // Butonlar için geri sayım
  const [error, setError] = useState(""); // Hata mesajları için
  const { user, setUser, updateUser } = useContext(AuthContext); // Global kullanıcı bilgileri
  const [effectKey, setEffectKey] = useState(0); // Hologram efekt tetikleyici
  const [hologramEffect, setHologramEffect] = useState({ type: null, key: 0 });
  const [gameState, setGameState] = useState('idle'); // idle, playing_feed, playing_play

  // --- COOLDOWN GERI SAYIM ---
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => {
      setCooldown(prev => prev - 1);
    }, 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  // --- PET VE ENVANTER VERİSİNİ ÇEKEN ANA FONKSİYON ---
  const fetchPetData = async () => {
    try {
      const [petData, inventoryData] = await Promise.all([
        getMyPet(),
        getUserInventory()
      ]);
      setPet(petData);
      setInventory(inventoryData);
    } catch (error) {
      console.error("Veri çekilirken hata oluştu:", error);
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

  // Eşya kullanma fonksiyonu
  const handleItemUse = async (itemId) => {
    try {
      const updatedPet = await useItemOnPet(itemId);
      setPet(updatedPet);
      setError("");
      setHologramEffect(prev => ({ type: 'item_use', key: prev.key + 1 }));
      // Envanteri güncelle
      await fetchPetData();
      window.toast && window.toast.success("Eşya kullanıldı!");
    } catch (err) {
      setError(err.message || "Eşya kullanılırken bir hata oluştu.");
      window.toast && window.toast.error(err.message || "Eşya kullanılırken bir hata oluştu.");
    }
  };

  // Mini oyun kazanç hesaplama fonksiyonu
  const calculateCoins = (score, gameType) => {
    if (gameType === 'feed') {
      return Math.floor(score * 0.10);
    }
    if (gameType === 'play') {
      return Math.floor(score * 0.20);
    }
    return 0;
  };

  const handleFeedGameEnd = async (score) => {
    setIsActionLoading(true);
    try {
      const updatedPet = await submitMinigameResult({ gameType: 'feed', score });
      setPet(updatedPet);
      setError("");
      setHologramEffect(prev => ({ type: 'feed', key: prev.key + 1 }));
      // Kazanılan coin'i hesapla ve user'ı güncelle
      if (score > 0 && user) {
        const coinsEarned = calculateCoins(score, 'feed');
        setUser(currentUser => ({
          ...currentUser,
          coins: (currentUser.coins || 0) + coinsEarned,
        }));
      }
      // Envanteri güncelle
      await fetchPetData();
    } catch (err) {
      setError(err.message || "Mini oyun sonucu gönderilirken bir hata oluştu.");
    } finally {
      setIsActionLoading(false);
      setCooldown(5);
      setGameState('idle');
    }
  };

  const handlePlayGameEnd = async (score) => {
    setIsActionLoading(true);
    try {
      const updatedPet = await submitMinigameResult({ gameType: 'play', score });
      setPet(updatedPet);
      setError("");
      setHologramEffect(prev => ({ type: 'play', key: prev.key + 1 }));
      // Kazanılan coin'i hesapla ve user'ı güncelle
      if (score > 0 && user) {
        const coinsEarned = calculateCoins(score, 'play');
        setUser(currentUser => ({
          ...currentUser,
          coins: (currentUser.coins || 0) + coinsEarned,
        }));
      }
      // Envanteri güncelle
      await fetchPetData();
    } catch (err) {
      setError(err.message || "Mini oyun sonucu gönderilirken bir hata oluştu.");
    } finally {
      setIsActionLoading(false);
      setCooldown(5);
      setGameState('idle');
    }
  };

  // Pet modelini type'a göre seçen yardımcı fonksiyon
  const getModelForPetType = (type) => {
    switch ((type || '').toLowerCase()) {
      case 'kedi':
        return 'cat.glb';
      case 'köpek':
        return 'dog.glb';
      case 'kuş':
        return 'bird.glb';
      default:
        return 'cat.glb';
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
  const isPetAlive = pet && pet.health > 0;
  const modelToRender = isPetAlive ? getModelForPetType(pet.type) : 'headstone.glb';

  if (!isPetAlive) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center min-h-[calc(100vh-80px)] p-8 bg-gradient-to-br from-slate-900 to-slate-800">
        {/* Sol Sütun: Mesaj */}
        <div className="flex flex-col items-center justify-center">
          <div className="bg-slate-800/70 rounded-xl p-8 shadow-xl text-center">
            <h2 className="text-3xl font-bold text-gray-300 mb-4">{pet.name} huzur içinde uyuyor.</h2>
            <p className="text-gray-400">Evcil hayvanının sağlığı tükendi. Yeni bir pet oluşturabilir veya {pet.name}'u canlandırabilirsin.</p>
          </div>
        </div>
        {/* Orta Sütun: Headstone Hologram */}
        <div className="flex flex-col items-center justify-center">
          <div className="h-96 w-full flex items-center justify-center">
            <PetHologram modelName="headstone.glb" />
          </div>
        </div>
        {/* Sağ Sütun: Yeni Pet Oluşturma */}
        <div className="flex flex-col items-center justify-center">
          <CreatePetForm onPetCreated={handlePetCreated} />
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center min-h-[calc(100vh-80px)] p-8 bg-gradient-to-br from-slate-900 to-slate-800">
      {/* Sol Sütun: Durum Kartı */}
      <div className="flex flex-col items-center justify-center">
        <PetStatusCard pet={pet} onPetUpdate={setPet} />
      </div>
      {/* Orta Sütun: 3D Hologram ve Bilgiler */}
      <div className="flex flex-col items-center justify-center">
        <div className="h-96 w-full flex items-center justify-center">
          <PetHologram key={modelToRender} modelName={modelToRender} petType={pet.type} effectType={hologramEffect.type} effectKey={hologramEffect.key} />
        </div>
        <div className="mt-8 text-cyan-300 text-2xl font-bold text-shadow-glow text-center select-none">
          Seviye <span className="text-3xl text-cyan-400 drop-shadow">{pet.level}</span>
          <span className="mx-3 text-base text-cyan-200">|</span>
          XP <span className="text-xl text-cyan-200">{pet.experience} / {xpForNextLevel}</span>
        </div>
      </div>
      {/* Sağ Sütun: Etkileşim Butonları veya Mini Oyun */}
      <div className="flex flex-col items-center justify-center space-y-6">
        {gameState === 'playing_feed' ? (
          <CatchTheFoodGame onGameEnd={handleFeedGameEnd} />
        ) : gameState === 'playing_play' ? (
          <RhythmGame onGameEnd={handlePlayGameEnd} />
        ) : (
          <>
            <button
              onClick={() => setGameState('playing_feed')}
              disabled={isActionLoading || cooldown > 0}
              className="w-64 flex items-center justify-center gap-x-3 px-4 py-4 font-bold text-white bg-green-500 rounded-xl shadow-lg transform transition-transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FaUtensils className="text-xl" />
              <span>{cooldown > 0 ? `Bekle (${cooldown}s)` : "Besle (Mini Oyun)"}</span>
            </button>
            <button
              onClick={() => setGameState('playing_play')}
              disabled={isActionLoading || cooldown > 0}
              className="w-64 flex items-center justify-center gap-x-3 px-4 py-4 font-bold text-white bg-blue-500 rounded-xl shadow-lg transform transition-transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FaGamepad className="text-xl" />
              <span>{cooldown > 0 ? `Bekle (${cooldown}s)` : "Oyna (Ritim Oyunu)"}</span>
            </button>
            {/* Hızlı Kullanım Barı */}
            <QuickBar inventory={inventory} onItemUse={handleItemUse} />
          </>
        )}
        {error && <div className="text-red-400 text-center mt-4 bg-red-900/50 p-3 rounded-lg w-64">{error}</div>}
      </div>
    </div>
  );
}

export default GamePage;