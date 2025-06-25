import React, { useState } from "react";
// GiHeart yerine IoIosHeart'ı Io (Ionicons) koleksiyonundan import ediyoruz.
import { IoIosHeart } from "react-icons/io"; 
import { GiShinyApple } from "react-icons/gi";
import { FaSmile, FaPencilAlt } from "react-icons/fa";
import { updateMyPet, updatePetNickname } from "../services/petService";

function PetStatusCard({ pet, onPetUpdate }) {
  const [editOpen, setEditOpen] = useState(false);
  const [form, setForm] = useState({ name: pet?.name || "", type: pet?.type || "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [nicknameEditOpen, setNicknameEditOpen] = useState(false);
  const [nicknameInput, setNicknameInput] = useState(pet?.nickname || "");
  const [nicknameLoading, setNicknameLoading] = useState(false);
  const [nicknameError, setNicknameError] = useState("");

  // pet objesi null veya undefined ise, boş bir ekran göstermek için bir kontrol ekleyelim.
  if (!pet) {
    return (
      <div className="bg-slate-800/50 rounded-xl p-6 shadow-xl backdrop-blur-sm w-full max-w-md flex flex-col items-center">
        <p className="text-slate-400">Evcil hayvan bilgileri yükleniyor...</p>
      </div>
    );
  }

  // Pet verilerini obje içinden alalım, bu kodu daha okunabilir kılar.
  const { name, hunger, happiness, health, level, experience, type, nickname } = pet;

  const xpForNextLevel = level * 100;
  // Olası bir "bölme sıfıra" hatasını önlemek için kontrol
  const xpPercent = xpForNextLevel > 0 ? Math.min(100, (experience / xpForNextLevel) * 100) : 0;

  const handleEditClick = () => {
    setForm({ name, type });
    setEditOpen(true);
    setError("");
  };

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const updated = await updateMyPet({ name: form.name, type: form.type });
      setEditOpen(false);
      if (onPetUpdate) onPetUpdate(updated);
    } catch (err) {
      setError(err.message || "Güncelleme başarısız oldu");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-800/50 rounded-xl p-6 shadow-xl backdrop-blur-sm w-full max-w-md flex flex-col items-center border border-slate-700">
      {/* BAŞLIK VE SEVİYE */}
      <div className="flex items-center justify-between w-full mb-6">
        <div className="flex items-center gap-2">
          <h2 className="text-4xl font-bold text-cyan-300 tracking-tight">{name}</h2>
          <button onClick={handleEditClick} className="ml-1 text-cyan-400 hover:text-cyan-200 transition-colors" title="Düzenle">
            <FaPencilAlt />
          </button>
        </div>
        <span className="bg-cyan-500 text-slate-900 font-bold px-3 py-1 rounded-full text-sm shadow">Seviye {level}</span>
      </div>
      {/* Nickname alanı ve butonu */}
      <div className="mb-2 w-full text-center flex flex-col items-center gap-1">
        {nickname && <span className="text-cyan-200 text-base italic">Takma Ad: {nickname}</span>}
        <button onClick={() => { setNicknameEditOpen(true); setNicknameInput(nickname || ""); setNicknameError(""); }} className="text-xs text-cyan-400 hover:text-cyan-200 underline mt-1">{nickname ? "Takma Adı Değiştir" : "Takma Ad Ekle"}</button>
      </div>
      {/* Tür bilgisi */}
      <div className="mb-4 w-full text-center">
        <span className="text-slate-300 text-lg font-semibold">Tür: {type}</span>
      </div>
      {/* XP BARI */}
      <div className="w-full mb-5">
        <div className="flex justify-between items-center mb-1">
          <span className="text-cyan-300 font-semibold">XP</span>
          <span className="text-xs text-slate-300">{experience} / {xpForNextLevel}</span>
        </div>
        <div className="w-full h-4 bg-slate-700 rounded-full overflow-hidden">
          <div
            className="bg-gradient-to-r from-yellow-400 to-cyan-400 h-4 rounded-full transition-all duration-500"
            style={{ width: `${xpPercent}%` }}
          ></div>
        </div>
      </div>

      {/* İSTATİSTİK BİLGİLERİ */}
      <div className="w-full space-y-4">
        {/* AÇLIK BARI */}
        <div className="w-full">
          <div className="flex justify-between items-center mb-1">
            <div className="flex items-center">
              <GiShinyApple className="text-green-400 mr-2 text-lg" />
              <span className="text-sm text-slate-300">Açlık</span>
            </div>
            <span className="text-xs font-mono text-slate-300">{hunger} / 100</span>
          </div>
          <div className="w-full h-3 bg-slate-700 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-green-400 to-lime-400 h-3 rounded-full transition-all duration-500"
              style={{ width: `${hunger}%` }}
            ></div>
          </div>
        </div>

        {/* MUTLULUK BARI */}
        <div className="w-full">
          <div className="flex justify-between items-center mb-1">
            <div className="flex items-center">
              <FaSmile className="text-yellow-300 mr-2 text-lg" />
              <span className="text-sm text-slate-300">Mutluluk</span>
            </div>
            <span className="text-xs font-mono text-slate-300">{happiness} / 100</span>
          </div>
          <div className="w-full h-3 bg-slate-700 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-yellow-300 to-pink-400 h-3 rounded-full transition-all duration-500"
              style={{ width: `${happiness}%` }}
            ></div>
          </div>
        </div>

        {/* SAĞLIK BARI */}
        <div className="w-full">
          <div className="flex justify-between items-center mb-1">
            <div className="flex items-center">
              {/* Değiştirilen ikon burada kullanılıyor */}
              <IoIosHeart className="text-red-400 mr-2 text-xl" /> 
              <span className="text-sm text-slate-300">Sağlık</span>
            </div>
            <span className="text-xs font-mono text-slate-300">{health} / 100</span>
          </div>
          <div className="w-full h-3 bg-slate-700 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-red-400 to-pink-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${health}%` }}
            ></div>
          </div>
        </div>
      </div>
      {/* Düzenleme Modalı */}
      {editOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <form onSubmit={handleSave} className="bg-slate-800 rounded-xl p-6 shadow-2xl w-full max-w-xs flex flex-col gap-4 border border-cyan-700">
            <h3 className="text-xl font-bold text-cyan-300 mb-2">Evcil Hayvanı Düzenle</h3>
            <label className="flex flex-col gap-1">
              <span className="text-slate-300 text-sm">Adı</span>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleInputChange}
                maxLength={20}
                required
                className="px-3 py-2 rounded bg-slate-700 text-cyan-200 focus:outline-none focus:ring-2 focus:ring-cyan-400"
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-slate-300 text-sm">Türü</span>
              <select
                name="type"
                value={form.type}
                onChange={handleInputChange}
                required
                className="px-3 py-2 rounded bg-slate-700 text-cyan-200 focus:outline-none focus:ring-2 focus:ring-cyan-400"
              >
                <option value="">Tür Seçiniz</option>
                <option value="Kedi">Kedi</option>
                <option value="Köpek">Köpek</option>
                <option value="Kuş">Kuş</option>
              </select>
            </label>
            {error && <div className="text-red-400 text-sm">{error}</div>}
            <div className="flex gap-2 mt-2">
              <button type="button" onClick={() => setEditOpen(false)} className="flex-1 py-2 rounded bg-slate-600 text-slate-200 hover:bg-slate-700 transition-colors">İptal</button>
              <button type="submit" disabled={loading} className="flex-1 py-2 rounded bg-cyan-500 text-slate-900 font-bold hover:bg-cyan-400 transition-colors disabled:opacity-60">
                {loading ? "Kaydediliyor..." : "Kaydet"}
              </button>
            </div>
          </form>
        </div>
      )}
      {/* Takma ad düzenleme popup */}
      {nicknameEditOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <form onSubmit={async (e) => {
            e.preventDefault();
            setNicknameLoading(true);
            setNicknameError("");
            try {
              const updated = await updatePetNickname(nicknameInput);
              setNicknameEditOpen(false);
              if (onPetUpdate) onPetUpdate(updated);
            } catch (err) {
              setNicknameError(err.message || "Takma ad güncellenemedi");
            } finally {
              setNicknameLoading(false);
            }
          }} className="bg-slate-800 rounded-xl p-6 shadow-2xl w-full max-w-xs flex flex-col gap-4 border border-cyan-700">
            <h3 className="text-lg font-bold text-cyan-300 mb-2">Takma Adı {nickname ? "Değiştir" : "Ekle"}</h3>
            <input
              type="text"
              value={nicknameInput}
              onChange={e => setNicknameInput(e.target.value)}
              maxLength={20}
              placeholder="Takma ad giriniz"
              className="px-3 py-2 rounded bg-slate-700 text-cyan-200 focus:outline-none focus:ring-2 focus:ring-cyan-400"
              required
            />
            {nicknameError && <div className="text-red-400 text-sm">{nicknameError}</div>}
            <div className="flex gap-2 mt-2">
              <button type="button" onClick={() => setNicknameEditOpen(false)} className="flex-1 py-2 rounded bg-slate-600 text-slate-200 hover:bg-slate-700 transition-colors">İptal</button>
              <button type="submit" disabled={nicknameLoading} className="flex-1 py-2 rounded bg-cyan-500 text-slate-900 font-bold hover:bg-cyan-400 transition-colors disabled:opacity-60">
                {nicknameLoading ? "Kaydediliyor..." : "Kaydet"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default PetStatusCard;