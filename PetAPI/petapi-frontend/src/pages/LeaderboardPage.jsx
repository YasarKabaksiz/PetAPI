import React, { useEffect, useState } from 'react';
import { getLeaderboard } from '../services/petService';
import { FaHeart, FaMedal, FaStar } from 'react-icons/fa';

function LeaderboardPage() {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getLeaderboard({ pageNumber: 1, pageSize: 20 });
        setLeaderboardData(data);
      } catch (err) {
        setError('Liderlik tablosu yüklenirken bir hata oluştu.');
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-gradient-to-b from-slate-900 to-slate-800 py-8 px-2">
      <h1 className="text-4xl font-bold text-center text-cyan-300 my-8">🏆 Liderlik Tablosu 🏆</h1>
      <div className="w-full max-w-4xl mx-auto bg-slate-800/50 rounded-xl shadow-lg p-4">
        {/* Başlık Satırı */}
        <div className="grid grid-cols-4 gap-4 px-4 py-2 text-sm font-bold text-gray-400 border-b border-slate-700">
          <span>#</span>
          <span>Pet Adı</span>
          <span className="text-center">Seviye</span>
          <span className="text-center">Mutluluk</span>
        </div>
        {/* Yükleniyor durumu */}
        {loading && (
          <div className="flex justify-center items-center py-10">
            <span className="text-cyan-200 animate-pulse text-lg">Yükleniyor...</span>
          </div>
        )}
        {/* Hata durumu */}
        {error && (
          <div className="flex justify-center items-center py-10">
            <span className="text-red-400 font-semibold">{error}</span>
          </div>
        )}
        {/* Veri Satırları */}
        {!loading && !error && leaderboardData && leaderboardData.length === 0 && (
          <div className="flex justify-center items-center py-10">
            <span className="text-gray-400">Henüz liderlik tablosunda veri yok.</span>
          </div>
        )}
        {!loading && !error && leaderboardData && leaderboardData.map((pet, index) => {
          // İlk üç için özel stiller
          let borderClass = '';
          let medal = null;
          if (index === 0) {
            borderClass = 'border-l-4 border-yellow-400 bg-yellow-400/10';
            medal = <FaMedal className="inline text-yellow-400 mr-1" title="Altın" />;
          } else if (index === 1) {
            borderClass = 'border-l-4 border-gray-400 bg-gray-400/10';
            medal = <FaMedal className="inline text-gray-400 mr-1" title="Gümüş" />;
          } else if (index === 2) {
            borderClass = 'border-l-4 border-orange-600 bg-orange-600/10';
            medal = <FaMedal className="inline text-orange-600 mr-1" title="Bronz" />;
          }
          return (
            <div
              key={pet.id || index}
              className={`grid grid-cols-4 gap-4 px-4 py-3 items-center hover:bg-slate-700/50 rounded-lg transition-colors mb-1 ${borderClass}`}
            >
              <span className="font-bold text-lg text-gray-300 flex items-center gap-1">
                {medal}
                {index + 1}
              </span>
              <span className="font-semibold text-white">{pet.name}</span>
              <span className="flex items-center justify-center gap-2 font-semibold text-cyan-200"><FaStar /> {pet.level}</span>
              <span className="flex items-center justify-center gap-2 text-yellow-400"><FaHeart /> {pet.happiness}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default LeaderboardPage; 