import React, { useEffect, useState } from "react";
import { getMyPet } from "../services/petService";
import PetStatusCard from "../components/PetStatusCard.jsx";

function GamePage() {
  const [pet, setPet] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPet = async () => {
      setLoading(true);
      try {
        const data = await getMyPet();
        setPet(data);
        setError("");
      } catch (err) {
        setPet(null);
        setError(err.message || "Bilinmeyen bir hata oluştu");
      } finally {
        setLoading(false);
      }
    };
    fetchPet();
  }, []);

  if (loading) {
    return <div>Yükleniyor...</div>;
  }

  if (pet) {
    return (
      <div>
        <PetStatusCard
          name={pet.name}
          hunger={pet.hunger}
          happiness={pet.happiness}
          health={pet.health}
        />
      </div>
    );
  }

  return (
    <div style={{ textAlign: "center", marginTop: 40 }}>
      <p>Henüz bir evcil hayvanınız yok. Bir tane oluşturun!</p>
      <button onClick={() => window.location.href = "/register-pet"} style={{ padding: "10px 20px", fontSize: 16 }}>Pet Oluştur</button>
      {error && <div style={{ color: "red", marginTop: 16 }}>{error}</div>}
    </div>
  );
}

export default GamePage; 