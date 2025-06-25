import React, { useContext } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
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
    <nav className="fixed top-0 left-0 right-0 z-50 select-none backdrop-blur-md bg-slate-800/30 border-b-2 border-cyan-500/40 shadow-lg">
      <div className="w-full flex flex-row items-center justify-between p-0 py-3 sm:py-4">
        {/* Sol üstte logo */}
        <div className="flex-1 flex items-center justify-start">
          <div className="text-3xl font-bold text-cyan-300 drop-shadow-lg animate-glow ml-2 sm:ml-6">
            <Link to="/game" className="hover:text-cyan-200 transition-colors duration-200">
              <span className="relative">
                PetAPI
                <span className="absolute -inset-1 blur-md opacity-60 bg-cyan-400 rounded-full animate-logo-glow" aria-hidden="true"></span>
              </span>
            </Link>
          </div>
        </div>
        {/* Sağ üstte tüm kullanıcı etkileşimleri */}
        <div className="flex-1 flex items-center justify-end gap-x-5 sm:gap-x-8 mr-2 sm:mr-6">
          {user && (
            <div className="flex items-center gap-x-2 bg-slate-800/70 border border-slate-700 px-3 py-1.5 rounded-full text-yellow-300 font-semibold shadow animate-coin-glow">
              <FaCoins className="text-lg animate-spin-slow" />
              <span>{user.coins}</span>
            </div>
          )}
          {user ? (
            <>
              <NavLink
                to="/game"
                className={({ isActive }) =>
                  `text-sm font-medium transition-all duration-200 px-2 py-1 rounded-md ${isActive ? "text-cyan-400 border-b-2 border-cyan-400 bg-cyan-400/10" : "text-gray-300 hover:text-white hover:scale-105 hover:bg-cyan-400/5"}`
                }
              >
                Oyun Ekranı
              </NavLink>
              <NavLink
                to="/leaderboard"
                className={({ isActive }) =>
                  `text-sm font-medium transition-all duration-200 px-2 py-1 rounded-md ${isActive ? "text-cyan-400 border-b-2 border-cyan-400 bg-cyan-400/10" : "text-gray-300 hover:text-white hover:scale-105 hover:bg-cyan-400/5"}`
                }
              >
                Liderlik Tablosu
              </NavLink>
              <NavLink
                to="/store"
                className={({ isActive }) =>
                  `text-sm font-medium transition-all duration-200 px-2 py-1 rounded-md ${isActive ? "text-cyan-400 border-b-2 border-cyan-400 bg-cyan-400/10" : "text-gray-300 hover:text-white hover:scale-105 hover:bg-cyan-400/5"}`
                }
              >
                Mağaza
              </NavLink>
              <NavLink
                to="/inventory"
                className={({ isActive }) =>
                  `text-sm font-medium transition-all duration-200 px-2 py-1 rounded-md ${isActive ? "text-cyan-400 border-b-2 border-cyan-400 bg-cyan-400/10" : "text-gray-300 hover:text-white hover:scale-105 hover:bg-cyan-400/5"}`
                }
              >
                Envanter
              </NavLink>
              <button
                onClick={handleLogout}
                className="text-sm font-medium text-gray-400 hover:text-red-500 transition-all duration-200 flex items-center gap-x-1.5 px-2 py-1 rounded-md hover:scale-105 hover:bg-red-500/10"
              >
                <FiLogOut className="text-lg" />
                Çıkış Yap
              </button>
            </>
          ) : (
            <>
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  `text-sm font-medium transition-all duration-200 px-2 py-1 rounded-md ${isActive ? "text-cyan-400 border-b-2 border-cyan-400 bg-cyan-400/10" : "text-gray-300 hover:text-white hover:scale-105 hover:bg-cyan-400/5"}`
                }
              >
                Giriş Yap
              </NavLink>
              <NavLink
                to="/register"
                className={({ isActive }) =>
                  `text-sm font-medium transition-all duration-200 px-2 py-1 rounded-md ${isActive ? "text-cyan-400 border-b-2 border-cyan-400 bg-cyan-400/10" : "text-gray-300 hover:text-white hover:scale-105 hover:bg-cyan-400/5"}`
                }
              >
                Kayıt Ol
              </NavLink>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar; 