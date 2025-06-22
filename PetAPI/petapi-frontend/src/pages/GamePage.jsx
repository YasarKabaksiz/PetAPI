import React, { useEffect, useState, useContext } from "react";
import { getMyPet, feedMyPet, playWithMyPet } from "../services/petService";
import PetStatusCard from "../components/PetStatusCard.jsx";
import CreatePetForm from "../components/CreatePetForm.jsx";
import { AuthContext } from "../context/AuthContext.jsx";

function GamePage() {
  const [pet, setPet] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [isInteracting, setIsInteracting] = useState(false);
  const { user, updateUser, token } = useContext(AuthContext);

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
    return <div>Yükleniyor...</div>;
  }

  if (!pet) {
    return (
      <div className="container center" style={{ marginTop: 40 }}>
        <CreatePetForm onPetCreated={setPet} />
      </div>
    );
  }

  return (
    <div className="container center">
      <PetStatusCard
        name={pet.name}
        hunger={pet.hunger}
        happiness={pet.happiness}
        health={pet.health}
        level={pet.level}
        experience={pet.experience}
      />
      <div style={{ marginTop: 24 }}>
        <button onClick={handleFeed} disabled={isInteracting} style={{ marginRight: 12, padding: "10px 24px", fontSize: 16, boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>Besle</button>
        <button onClick={handlePlay} disabled={isInteracting} style={{ padding: "10px 24px", fontSize: 16, boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>Oyna</button>
      </div>
      {error && <div style={{ color: "red", marginTop: 16 }}>{error}</div>}
    </div>
  );
}

export default GamePage; 