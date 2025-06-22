import React, { useState } from "react";
import { createPet } from "../services/petService";

function CreatePetForm({ onPetCreated }) {
  const [name, setName] = useState("");
  const [type, setType] = useState("Kedi");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const newPet = await createPet({ name, type });
      onPetCreated(newPet);
    } catch (err) {
      setError(err.message || "Pet oluşturulurken bir hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="center" style={{ width: "100%", maxWidth: 400 }}>
      <h3 style={{ marginBottom: 20 }}>Evcil Hayvanını Oluştur</h3>
      <input
        type="text"
        placeholder="Pet Adı"
        value={name}
        onChange={e => setName(e.target.value)}
        required
        style={{ marginBottom: 16 }}
      />
      <select value={type} onChange={e => setType(e.target.value)} style={{ marginBottom: 16 }}>
        <option value="Kedi">Kedi</option>
        <option value="Köpek">Köpek</option>
        <option value="Kuş">Kuş</option>
      </select>
      <button type="submit" disabled={loading} style={{ width: "100%", marginBottom: 12 }}>
        {loading ? "Oluşturuluyor..." : "Oluştur"}
      </button>
      {error && <div style={{ color: "red", marginTop: 8 }}>{error}</div>}
    </form>
  );
}

export default CreatePetForm; 