import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../services/authService';

function LoginPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(formData);
      // Başarılı giriş - game sayfasına yönlendir
      navigate('/game');
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container center">
      <h2 style={{ marginBottom: 24 }}>Giriş Yap</h2>
      <form onSubmit={handleSubmit} style={{ width: "100%" }}>
        <input
          type="text"
          placeholder="Kullanıcı Adı"
          name="username"
          value={formData.username}
          onChange={handleInputChange}
          style={{ marginBottom: 16 }}
          required
        />
        <input
          type="password"
          placeholder="Şifre"
          name="password"
          value={formData.password}
          onChange={handleInputChange}
          style={{ marginBottom: 16 }}
          required
        />
        <button type="submit" style={{ width: "100%", marginBottom: 12 }} disabled={isLoading}>
          {isLoading ? "Giriş yapılıyor..." : "Giriş Yap"}
        </button>
        {error && <div style={{ color: "red", marginTop: 8 }}>{error}</div>}
      </form>
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <p>
          Hesabınız yok mu?{' '}
          <Link to="/register" style={{ color: '#1976d2', textDecoration: 'none' }}>
            Kayıt Ol
          </Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage; 