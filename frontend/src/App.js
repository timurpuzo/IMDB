import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
import { ThemeProvider } from './hooks/useTheme';
import { ToastProvider } from './hooks/useToast';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import MovieDetail from './pages/MovieDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import WatchlistPage from './pages/WatchlistPage';
import AdminPanel from './pages/AdminPanel';
import './App.css';

function App() {
  return (
    <ToastProvider>
      <ThemeProvider>
        <AuthProvider>
          <Router>
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/movie/:id" element={<MovieDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/watchlist" element={<WatchlistPage />} />
            <Route path="/admin" element={<AdminPanel />} />
          </Routes>
        </main>
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </ToastProvider>
  );
}

export default App;
