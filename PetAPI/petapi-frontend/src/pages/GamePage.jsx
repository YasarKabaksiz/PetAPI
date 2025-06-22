import React, { useEffect, useState, useContext } from "react";
import { getMyPet, feedMyPet, playWithMyPet } from "../services/petService";
import PetStatusCard from "../components/PetStatusCard.jsx";
import CreatePetForm from "../components/CreatePetForm.jsx";
import { AuthContext } from "../context/AuthContext.jsx";
import { FaUtensils, FaGamepad } from "react-icons/fa";

function GamePage() {
  const [pet, setPet] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [isInteracting, setIsInteracting] = useState(false);
  const { user, updateUser } = useContext(AuthContext);

  useEffect(() => {
    const fetchPet = async () => {
      setLoading(true);
      try {
        const data = await getMyPet();
        setPet(data);
        setError("");
      } catch (err) {
        setPet(null);
        setError("");
      } finally {
        setLoading(false);
      }
    };
    fetchPet();
  }, []);

  const handleFeed = async () => {
    setIsInteracting(true);
    setActionLoading(true);
    try {
      const updatedPet = await feedMyPet();
      setPet(updatedPet);
      setError("");
      if (user) {
        updateUser({ ...user, coins: user.coins + 1 });
      }
    } catch (err) {
      setError(err.message || "Besleme işlemi sırasında hata oluştu");
    } finally {
      setActionLoading(false);
      setTimeout(() => {
        setIsInteracting(false);
      }, 5000);
    }
  };

  const handlePlay = async () => {
    setIsInteracting(true);
    setActionLoading(true);
    try {
      const updatedPet = await playWithMyPet();
      setPet(updatedPet);
      setError("");
      if (user) {
        updateUser({ ...user, coins: user.coins + 2 });
      }
    } catch (err) {
      setError(err.message || "Oyun oynama işlemi sırasında hata oluştu");
    } finally {
      setActionLoading(false);
      setTimeout(() => {
        setIsInteracting(false);
      }, 5000);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-[60vh] text-2xl">Yükleniyor...</div>;
  }

  if (!pet) {
    return (
      <div className="flex justify-center items-center min-h-[70vh]">
        <CreatePetForm onPetCreated={setPet} />
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row gap-8 max-w-5xl mx-auto py-8">
      {/* Sol Sütun: Pet görseli ve durum kartı */}
      <div className="flex-1 flex flex-col items-center gap-6">
        {/* Pet görseli (örnek, türüne göre farklı görsel eklenebilir) */}
        <div className="w-40 h-40 rounded-full bg-gradient-to-br from-cyan-400 to-blue-700 flex items-center justify-center shadow-lg mb-4">
          <span className="text-7xl select-none">
            {pet.type === "Kedi" && "🐱"}
            {pet.type === "Köpek" && "🐶"}
            {pet.type === "Kuş" && "🐦"}
            {!["Kedi","Köpek","Kuş"].includes(pet.type) && "🐾"}
          </span>
        </div>
        <PetStatusCard
          name={pet.name}
          hunger={pet.hunger}
          happiness={pet.happiness}
          health={pet.health}
          level={pet.level}
          experience={pet.experience}
        />
      </div>
      {/* Sağ Sütun: Etkileşim butonları ve diğer oyun elementleri */}
      <div className="flex-1 flex flex-col items-center gap-8 justify-center">
        <div className="flex flex-col gap-6 w-full max-w-xs">
          <button
            onClick={handleFeed}
            disabled={isInteracting}
            className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 active:scale-95 text-white text-lg font-bold py-3 rounded-xl shadow-lg transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed hover:scale-105"
          >
            <FaUtensils className="text-2xl" /> Besle
          </button>
          <button
            onClick={handlePlay}
            disabled={isInteracting}
            className="flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 active:scale-95 text-white text-lg font-bold py-3 rounded-xl shadow-lg transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed hover:scale-105"
          >
            <FaGamepad className="text-2xl" /> Oyna
          </button>
        </div>
        {error && <div className="text-red-400 text-center mt-4">{error}</div>}
      </div>
    </div>
  );
}

export default GamePage; 