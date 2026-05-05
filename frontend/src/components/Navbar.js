import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../hooks/useTheme';

function Navbar() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLogout = () => {
    logout();
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-logo">IMDB</Link>
      
      <div className="navbar-actions">
        <button 
          className="theme-toggle" 
          onClick={toggleTheme}
          aria-label="Toggle theme"
        >
          {theme === 'light' ? '🌙' : '☀️'}
        </button>
        
        <button 
          className="mobile-menu-toggle"
          onClick={toggleMobileMenu}
          aria-label="Toggle mobile menu"
        >
          ☰
        </button>
      </div>

      <div className={`navbar-links ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
        <Link to="/" onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
        {user ? (
          <>
            <Link to="/watchlist" onClick={() => setIsMobileMenuOpen(false)}>Watchlist</Link>
            <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)}>Profile</Link>
            {user.role === 'admin' && <Link to="/admin" onClick={() => setIsMobileMenuOpen(false)}>Admin</Link>}
            <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>Login</Link>
            <Link to="/register" onClick={() => setIsMobileMenuOpen(false)}>Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
