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
    <form
      onSubmit={handleSubmit}
      className="bg-slate-800/60 backdrop-blur-sm rounded-2xl shadow-2xl p-8 flex flex-col items-center w-full max-w-md"
    >
      <h3 className="text-2xl font-bold text-cyan-300 mb-6">Evcil Hayvanını Oluştur</h3>
      <input
        type="text"
        placeholder="Pet Adı"
        value={name}
        onChange={e => setName(e.target.value)}
        required
        className="w-full mb-4 px-4 py-2 rounded-lg bg-slate-900/80 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition"
      />
      <select
        value={type}
        onChange={e => setType(e.target.value)}
        className="w-full mb-6 px-4 py-2 rounded-lg bg-slate-900/80 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 transition"
      >
        <option value="Kedi">Kedi</option>
        <option value="Köpek">Köpek</option>
        <option value="Kuş">Kuş</option>
      </select>
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-cyan-500 hover:bg-cyan-600 text-slate-900 font-bold py-2 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-400 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? "Oluşturuluyor..." : "Oluştur"}
      </button>
      {error && <div className="text-red-400 mt-4 text-center">{error}</div>}
    </form>
  );
}

export default CreatePetForm; 