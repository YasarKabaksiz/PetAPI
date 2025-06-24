import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.jsx";
import { FaCoins } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";

function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 p-4 flex justify-between items-center">
      {/* Sol Taraf - Logo */}
      <div className="bg-slate-800/70 backdrop-blur-sm px-4 py-2 rounded-xl text-xl font-bold text-cyan-300 shadow-lg">
        <Link to="/game" className="hover:text-cyan-200 transition-colors">PetAPI</Link>
      </div>

      {/* Sağ Taraf - Kullanıcı Paneli */}
      {user ? (
        <div className="flex items-center gap-x-4 bg-slate-800/70 backdrop-blur-sm px-4 py-2 rounded-xl shadow-lg">
          {/* Para */}
          <div className="flex items-center gap-x-2 font-semibold text-yellow-400">
            <FaCoins className="text-lg" />
            <span>{user.coins}</span>
          </div>
          
          <span className="text-slate-600">|</span>

          {/* Linkler */}
          <Link to="/game" className="text-slate-300 hover:text-white transition-colors font-medium">Oyun Ekranı</Link>
          <Link to="/leaderboard" className="text-slate-300 hover:text-white transition-colors font-medium">Liderlik Tablosu</Link>
          <Link to="/store" className="text-slate-300 hover:text-white transition-colors font-medium">Mağaza</Link>
          <Link to="/inventory" className="text-slate-300 hover:text-white transition-colors font-medium">Envanter</Link>

          <span className="text-slate-600">|</span>

          {/* Çıkış İkonu */}
          <button 
            onClick={handleLogout} 
            className="text-slate-400 hover:text-red-500 transition-colors p-1"
            title="Çıkış Yap"
          >
            <FiLogOut size={20} />
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-x-4 bg-slate-800/70 backdrop-blur-sm px-4 py-2 rounded-xl shadow-lg">
          <Link to="/login" className="text-slate-300 hover:text-white transition-colors font-medium">Giriş Yap</Link>
          <span className="text-slate-600">|</span>
          <Link to="/register" className="text-slate-300 hover:text-white transition-colors font-medium">Kayıt Ol</Link>
        </div>
      )}
    </nav>
  );
}

export default Navbar; 