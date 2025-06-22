import React from "react";
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav style={{ background: "#fff", boxShadow: "0 2px 8px rgba(0,0,0,0.06)", padding: "12px 0", marginBottom: 32 }}>
      <div style={{ maxWidth: 900, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 24px" }}>
        <div style={{ fontWeight: 700, fontSize: 20 }}>
          <Link to="/game" style={{ textDecoration: "none", color: "#222" }}>Pet Oyunu</Link>
        </div>
        <div style={{ display: "flex", gap: 16 }}>
          {token ? (
            <>
              <Link to="/game">Oyun Ekranı</Link>
              <Link to="/leaderboard">Liderlik Tablosu</Link>
              <button onClick={handleLogout} style={{ background: "#e53e3e", color: "#fff", border: "none", borderRadius: 6, padding: "6px 16px", cursor: "pointer" }}>Çıkış Yap</button>
            </>
          ) : (
            <>
              <Link to="/login">Giriş Yap</Link>
              <Link to="/register">Kayıt Ol</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar; 