import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  const isAdmin = user.role === 'admin';

  return (
    <nav className="navbar">
      <div className="container">
        <Link to={isAdmin ? '/admin' : '/dashboard'} className="nav-brand">
          <span>🍕</span>
          <span className="nav-brand-text">SliceHub</span>
        </Link>

        <button className="nav-hamburger" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? '✕' : '☰'}
        </button>

        <ul className={`nav-links ${menuOpen ? 'open' : ''}`}>
          {isAdmin ? (
            <>
              <li><Link to="/admin" className={location.pathname === '/admin' ? 'active' : ''} onClick={() => setMenuOpen(false)}>Dashboard</Link></li>
              <li><Link to="/admin/inventory" className={location.pathname === '/admin/inventory' ? 'active' : ''} onClick={() => setMenuOpen(false)}>Inventory</Link></li>
              <li><Link to="/admin/orders" className={location.pathname === '/admin/orders' ? 'active' : ''} onClick={() => setMenuOpen(false)}>Orders</Link></li>
            </>
          ) : (
            <>
              <li><Link to="/dashboard" className={location.pathname === '/dashboard' ? 'active' : ''} onClick={() => setMenuOpen(false)}>Menu</Link></li>
              <li><Link to="/build-pizza" className={location.pathname === '/build-pizza' ? 'active' : ''} onClick={() => setMenuOpen(false)}>Build Pizza</Link></li>
              <li><Link to="/my-orders" className={location.pathname === '/my-orders' ? 'active' : ''} onClick={() => setMenuOpen(false)}>My Orders</Link></li>
            </>
          )}
          <li className="mobile-user-nav">
            <div className="nav-avatar">{user.name.charAt(0).toUpperCase()}</div>
            <span>{user.name}</span>
            <button className="nav-logout" onClick={handleLogout}>Logout</button>
          </li>
        </ul>

        <div className="nav-user">
          <div className="nav-avatar">{user.name.charAt(0).toUpperCase()}</div>
          <span className="nav-username">{user.name}</span>
          <button className="nav-logout" onClick={handleLogout}>Logout</button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
