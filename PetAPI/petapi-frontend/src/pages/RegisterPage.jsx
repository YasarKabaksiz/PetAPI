import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../services/authService';

function RegisterPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: ''
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

  const validateForm = () => {
    if (formData.password !== formData.confirmPassword) {
      setError('Şifreler eşleşmiyor');
      return false;
    }
    if (formData.password.length < 6) {
      setError('Şifre en az 6 karakter olmalıdır');
      return false;
    }
    if (formData.username.length < 3) {
      setError('Kullanıcı adı en az 3 karakter olmalıdır');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // confirmPassword'ü çıkar, sadece username ve password gönder
      const { confirmPassword, ...registerData } = formData;
      await register(registerData);
      
      // Başarılı kayıt - login sayfasına yönlendir
      navigate('/login');
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container center">
      <h2 style={{ marginBottom: 24 }}>Kayıt Ol</h2>
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
        <input
          type="password"
          placeholder="Şifre Tekrar"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleInputChange}
          style={{ marginBottom: 16 }}
          required
        />
        <button type="submit" style={{ width: "100%", marginBottom: 12 }} disabled={isLoading}>
          {isLoading ? "Kayıt olunuyor..." : "Kayıt Ol"}
        </button>
        {error && <div style={{ color: "red", marginTop: 8 }}>{error}</div>}
      </form>
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <p>
          Zaten hesabınız var mı?{' '}
          <Link to="/login" style={{ color: '#1976d2', textDecoration: 'none' }}>
            Giriş Yap
          </Link>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage; 