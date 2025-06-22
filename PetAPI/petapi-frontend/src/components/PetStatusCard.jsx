import React from "react";
// GiHeart yerine IoIosHeart'ı Io (Ionicons) koleksiyonundan import ediyoruz.
import { IoIosHeart } from "react-icons/io"; 
import { GiShinyApple } from "react-icons/gi";
import { FaSmile } from "react-icons/fa";

function PetStatusCard({ pet }) {
  // pet objesi null veya undefined ise, boş bir ekran göstermek için bir kontrol ekleyelim.
  if (!pet) {
    return (
      <div className="bg-slate-800/50 rounded-xl p-6 shadow-xl backdrop-blur-sm w-full max-w-md flex flex-col items-center">
        <p className="text-slate-400">Evcil hayvan bilgileri yükleniyor...</p>
      </div>
    );
  }

  // Pet verilerini obje içinden alalım, bu kodu daha okunabilir kılar.
  const { name, hunger, happiness, health, level, experience } = pet;

  const xpForNextLevel = level * 100;
  // Olası bir "bölme sıfıra" hatasını önlemek için kontrol
  const xpPercent = xpForNextLevel > 0 ? Math.min(100, (experience / xpForNextLevel) * 100) : 0;

  return (
    <div className="bg-slate-800/50 rounded-xl p-6 shadow-xl backdrop-blur-sm w-full max-w-md flex flex-col items-center border border-slate-700">
      {/* BAŞLIK VE SEVİYE */}
      <div className="flex items-center justify-between w-full mb-6">
        <h2 className="text-4xl font-bold text-cyan-300 tracking-tight">{name}</h2>
        <span className="bg-cyan-500 text-slate-900 font-bold px-3 py-1 rounded-full text-sm shadow">Seviye {level}</span>
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
    </div>
  );
}

export default PetStatusCard;