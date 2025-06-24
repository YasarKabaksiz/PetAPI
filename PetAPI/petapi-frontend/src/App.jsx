import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import GamePage from './pages/GamePage.jsx';
import LeaderboardPage from './pages/LeaderboardPage.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Navbar from './components/Navbar.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import StorePage from "./pages/StorePage";
import InventoryPage from "./pages/InventoryPage";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <div className="bg-slate-900 text-white min-h-screen font-sans">
          <Routes>
            {/* Ana sayfa - Login'e yönlendir */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            
            {/* Sayfa yönlendirmeleri */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/game" element={
              <ProtectedRoute>
                <GamePage />
              </ProtectedRoute>
            } />
            <Route path="/leaderboard" element={<ProtectedRoute><LeaderboardPage /></ProtectedRoute>} />
            <Route path="/store" element={<StorePage />} />
            <Route path="/inventory" element={<InventoryPage />} />
            
            {/* 404 - Bilinmeyen yollar için Login'e yönlendir */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
