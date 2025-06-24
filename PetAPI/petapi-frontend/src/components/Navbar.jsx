import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.jsx";
import { FaCoins } from "react-icons/fa";

function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-slate-800 shadow-lg px-4 py-3">
      <div className="max-w-5xl mx-auto flex justify-between items-center">
        {/* Logo veya Oyun Adı */}
        <div className="text-2xl font-extrabold tracking-tight text-cyan-400 select-none">
          <Link to="/game" className="hover:text-cyan-300 transition-colors">PetAPI</Link>
        </div>
        <div className="flex items-center gap-4">
          {user && (
            <div className="flex items-center bg-yellow-500 text-slate-900 font-bold px-3 py-1 rounded-full mr-2 shadow">
              <FaCoins className="mr-1 text-lg" />
              <span>{user.coins}</span>
            </div>
          )}
          {user ? (
            <>
              <Link to="/game" className="hover:text-cyan-400 transition-colors font-medium">Oyun Ekranı</Link>
              <Link to="/leaderboard" className="hover:text-cyan-400 transition-colors font-medium">Liderlik Tablosu</Link>
              <Link to="/store" className="nav-link">Mağaza</Link>
              <Link to="/inventory" className="nav-link">Envanter</Link>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-white font-semibold ml-2 transition-colors"
              >
                Çıkış Yap
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-cyan-400 transition-colors font-medium">Giriş Yap</Link>
              <Link to="/register" className="hover:text-cyan-400 transition-colors font-medium">Kayıt Ol</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar; 