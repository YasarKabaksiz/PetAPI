import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login } from "../services/authService";

function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const data = await login({ username, password });
      localStorage.setItem("token", data.token);
      navigate("/game");
    } catch (err) {
      setError(err.response?.data?.message || "Giriş başarısız. Lütfen bilgilerinizi kontrol edin.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-900">
      <div className="w-full max-w-md p-8 space-y-8 bg-slate-800 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold text-center text-white">Oyuna Giriş Yap</h2>
        {error && (
          <div className="p-3 my-2 text-sm text-center text-red-200 bg-red-800/50 rounded-lg">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="text-sm font-bold text-gray-400" htmlFor="username">Kullanıcı Adı</label>
            <input
              id="username"
              type="text"
              className="w-full px-4 py-2 mt-2 text-white bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
              autoFocus
            />
          </div>
          <div>
            <label className="text-sm font-bold text-gray-400" htmlFor="password">Şifre</label>
            <input
              id="password"
              type="password"
              className="w-full px-4 py-2 mt-2 text-white bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-2 font-bold text-white bg-cyan-600 rounded-lg hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-cyan-500 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Giriş yapılıyor..." : "Giriş Yap"}
          </button>
        </form>
        <div className="text-sm text-center text-gray-400">
          Hesabın yok mu?{' '}
          <Link to="/register" className="font-medium text-cyan-400 hover:underline">Kayıt Ol</Link>
        </div>
      </div>
    </div>
  );
}

export default LoginPage; 