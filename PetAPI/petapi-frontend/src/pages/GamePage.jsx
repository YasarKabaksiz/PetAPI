import React, { useEffect, useState, useContext } from "react";
import { getMyPet, feedMyPet, playWithMyPet } from "../services/petService"; // petService'in doğru path'de olduğundan emin ol
import PetStatusCard from "../components/PetStatusCard.jsx";
import CreatePetForm from "../components/CreatePetForm.jsx";
import { AuthContext } from "../context/AuthContext.jsx";
import { FaUtensils, FaGamepad } from "react-icons/fa";

function GamePage() {
  // --- STATE MANAGEMENT ---
  const [pet, setPet] = useState(null); // Mevcut evcil hayvan verisi
  const [isLoading, setIsLoading] = useState(true); // Sayfa ilk yüklenirken
  const [isActionLoading, setIsActionLoading] = useState(false); // Besle/Oyna butonu tıklanınca
  const [cooldown, setCooldown] = useState(0); // Butonlar için geri sayım
  const [error, setError] = useState(""); // Hata mesajları için
  const { user, updateUser } = useContext(AuthContext); // Global kullanıcı bilgileri

  // --- COOLDOWN GERI SAYIM ---
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => {
      setCooldown(prev => prev - 1);
    }, 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  // --- DATA FETCHING ---
  // Sayfa yüklendiğinde kullanıcının evcil hayvanını getiren ana fonksiyon
  useEffect(() => {
    const fetchPetData = async () => {
      try {
        setIsLoading(true);
        const petData = await getMyPet();
        
        // Hata ayıklama için konsola log yazdır
        console.log("API'den gelen pet verisi:", petData);

        if (petData) {
          setPet(petData);
        } else {
          // API hata vermedi ama pet de göndermedi, yani kullanıcının peti yok.
          setPet(null);
        }
        setError(""); // Başarılı istek sonrası eski hataları temizle
      } catch (err) {
        // Hata ayıklama için hatanın tamamını konsola yazdır
        console.error("Pet bilgileri alınırken hata oluştu:", err);
        
        // 404 hatası bir "hata" değil, kullanıcının peti olmadığının bir göstergesi olabilir.
        // Bu yüzden kullanıcıya bir hata mesajı göstermiyoruz.
        if (err.response?.status !== 404) {
          setError("Evcil hayvan bilgileri yüklenemedi. Lütfen sayfayı yenileyin.");
        }
        setPet(null); // Hata durumunda pet verisini temizle
      } finally {
        setIsLoading(false); // Her durumda yüklenme durumunu sonlandır
      }
    };

    fetchPetData();
  }, []); // Boş bağımlılık dizisi sayesinde sadece ilk render'da çalışır

  // --- EVENT HANDLERS ---
  // Pet oluşturulduğunda tetiklenen fonksiyon (CreatePetForm'dan gelir)
  const handlePetCreated = (newPet) => {
    setPet(newPet);
  };

  // "Besle" butonuna tıklandığında
  const handleFeed = async () => {
    if (isActionLoading || cooldown > 0) return;

    setIsActionLoading(true);
    try {
      const updatedPet = await feedMyPet();
      setPet(updatedPet); // Arayüzü backend'den gelen en güncel veriyle güncelle
      
      // Global kullanıcı context'ini güncelle (daha güvenli yöntem)
      if (user) {
        updateUser(prevUser => ({ ...prevUser, coins: prevUser.coins + 1 }));
      }
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Besleme işlemi sırasında bir hata oluştu.");
    } finally {
      setIsActionLoading(false);
      setCooldown(5); // Geri sayımı başlat
    }
  };

  // "Oyna" butonuna tıklandığında
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
    } catch (err) {
      setError(err.response?.data?.message || "Oyun oynama işlemi sırasında bir hata oluştu.");
    } finally {
      setIsActionLoading(false);
      setCooldown(5); // Geri sayımı başlat
    }
  };

  // --- RENDER LOGIC ---
  // 1. Veri yüklenirken gösterilecek ekran
  if (isLoading) {
    return <div className="flex justify-center items-center min-h-[70vh] text-2xl text-cyan-300">Evcil hayvan bilgileri yükleniyor...</div>;
  }

  // 2. Veri yüklendi ama pet yoksa, pet oluşturma formunu göster
  if (!pet) {
    return (
      <div className="flex justify-center items-center min-h-[70vh]">
        <CreatePetForm onPetCreated={handlePetCreated} />
      </div>
    );
  }

  // 3. Veri yüklendi ve pet varsa, ana oyun ekranını göster
  return (
    <div className="flex flex-col md:flex-row gap-8 max-w-5xl mx-auto py-8 px-4">
      {/* Sol Sütun: Pet görseli ve durum kartı */}
      <div className="flex-1 flex flex-col items-center gap-6">
        <div className="w-40 h-40 rounded-full bg-gradient-to-br from-cyan-400 to-blue-700 flex items-center justify-center shadow-lg mb-4 ring-4 ring-cyan-500/50">
          <span className="text-7xl select-none animate-pulse">
            {pet.type === "Kedi" && "🐱"}
            {pet.type === "Köpek" && "🐶"}
            {pet.type === "Kuş" && "🐦"}
            {!["Kedi", "Köpek", "Kuş"].includes(pet.type) && "🐾"}
          </span>
        </div>
        <PetStatusCard pet={pet} />
      </div>

      {/* Sağ Sütun: Etkileşim butonları */}
      <div className="flex-1 flex flex-col items-center gap-8 justify-center">
        <div className="flex flex-col gap-6 w-full max-w-xs">
          <button
            onClick={handleFeed}
            disabled={isActionLoading || cooldown > 0}
            className="flex items-center justify-center gap-3 bg-green-500 hover:bg-green-600 active:scale-95 text-white text-lg font-bold py-4 rounded-xl shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105"
          >
            <FaUtensils className="text-xl" />
            {cooldown > 0 ? `Bekle (${cooldown}s)` : "Besle"}
          </button>
          <button
            onClick={handlePlay}
            disabled={isActionLoading || cooldown > 0}
            className="flex items-center justify-center gap-3 bg-blue-500 hover:bg-blue-600 active:scale-95 text-white text-lg font-bold py-4 rounded-xl shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105"
          >
            <FaGamepad className="text-xl" />
            {cooldown > 0 ? `Bekle (${cooldown}s)` : "Oyna"}
          </button>
        </div>
        {error && <div className="text-red-400 text-center mt-4 bg-red-900/50 p-3 rounded-lg">{error}</div>}
      </div>
    </div>
  );
}

export default GamePage;