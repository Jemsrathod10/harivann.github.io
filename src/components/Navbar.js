import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { getCartItemsCount } = useCart();

  const handleLogout = () => {
    logout();
  };

  // Internal CSS styles enhanced to remove white gap between navbar and page
  const navbarStyles = `
    /* Reset default margin and padding to remove layout gaps */
    html, body {
      margin: 0;
      padding: 0;
      height: 100%;
      background: #dff5e4; /* consistent page background */
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    }
    /* Container below navbar should have no margin at top */
    .container, .section, main {
      margin-top: 0 !important;
      padding-top: 1rem;
      background: transparent;
    }
    /* Navbar styles */
    .navbar {
      background: linear-gradient(135deg, #00b894 0%, #2d3436 100%);
      padding: 14px 32px;
      position: sticky;
      top: 0;
      z-index: 1100;
      box-shadow: 0 5px 18px rgba(0, 0, 0, 0.22);
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      transition: background 0.35s ease;
      margin-bottom: 0; /* remove any bottom margin */
    }
    .navbar:hover {
      background: linear-gradient(135deg, #019875 0%, #243031 100%);
    }
    .nav-container {
      max-width: 1180px;
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .nav-logo {
      font-size: 1.8rem;
      font-weight: 700;
      color: #e6fff1;
      text-decoration: none;
      user-select: none;
      display: flex;
      align-items: center;
      gap: 8px;
      transition: color 0.3s ease;
    }
    .nav-logo:hover {
      color: #00ffcc;
    }
    .nav-menu {
      list-style: none;
      display: flex;
      gap: 26px;
      margin: 0;
      padding: 0;
    }
    .nav-item a {
      color: #e8fcee;
      font-size: 1.05rem;
      font-weight: 600;
      text-decoration: none;
      padding-bottom: 5px;
      position: relative;
      transition: color 0.3s ease;
    }
    .nav-item a::after {
      content: "";
      position: absolute;
      width: 0%;
      height: 2.5px;
      bottom: 0;
      left: 0;
      background-color: #00ffcc;
      transition: width 0.3s ease;
      border-radius: 2px;
    }
    .nav-item a:hover {
      color: #00ffcc;
    }
    .nav-item a:hover::after {
      width: 100%;
    }
    .nav-auth {
      display: flex;
      align-items: center;
      gap: 16px;
      user-select: none;
    }
    .welcome-text {
      color: #e6fff1;
      font-size: 1rem;
      font-weight: 600;
      white-space: nowrap;
    }
    .btn {
      padding: 10px 20px;
      border-radius: 26px;
      font-size: 1rem;
      font-weight: 600;
      border: none;
      cursor: pointer;
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      transition: background 0.35s ease, transform 0.25s ease;
      user-select: none;
      box-shadow: 0 3px 8px rgba(0,0,0,0.12);
    }
    .btn:hover {
      transform: translateY(-3px);
    }
    .btn-primary {
      background: #06d6a0;
      color: #fff;
      box-shadow: 0 6px 12px #04a97eaa;
    }
    .btn-primary:hover {
      background: #04a97e;
      box-shadow: 0 8px 18px #038863cc;
    }
    .btn-secondary {
      background: #2e3e3b;
      color: #e6fff1;
      box-shadow: 0 4px 10px #222e2caa;
    }
    .btn-secondary:hover {
      background: #3c534f;
      box-shadow: 0 6px 14px #273a3655;
    }
    .btn-cart {
      background: #00b894;
      color: #fff;
      padding: 10px 22px;
      border-radius: 26px;
      position: relative;
      font-weight: 700;
      box-shadow: 0 5px 13px #049466cc;
      transition: background 0.3s ease, transform 0.25s ease, box-shadow 0.3s ease;
    }
    .btn-cart:hover {
      background: #019875;
      transform: scale(1.1);
      box-shadow: 0 7px 20px #017754ee;
    }
    .cart-badge {
      position: absolute;
      top: -9px;
      right: -9px;
      background: #e74c3c;
      color: #fff;
      font-size: 0.82rem;
      border-radius: 50%;
      width: 23px;
      height: 23px;
      font-weight: 700;
      display: flex;
      justify-content: center;
      align-items: center;
      box-shadow: 0 0 6px #ff5c5ccc;
    }
    @media (max-width: 768px) {
      .nav-container {
        padding: 0 12px;
      }
      .nav-menu {
        gap: 16px;
      }
      .btn, .btn-primary, .btn-secondary {
        padding: 8px 14px;
        font-size: 0.9rem;
      }
      .welcome-text {
        display: none;
      }
    }
  `;

  return (
    <>
      <style>{navbarStyles}</style>
      <nav className="navbar" role="navigation" aria-label="Primary Navigation">
        <div className="nav-container">
          <Link to="/" className="nav-logo" aria-label="PlantShop Home">
            🌱 PlantShop
          </Link>
          <ul className="nav-menu">
            <li className="nav-item"><Link to="/">Home</Link></li>
            <li className="nav-item"><Link to="/products">Products</Link></li>
            <li className="nav-item"><Link to="/about">About</Link></li>
            <li className="nav-item"><Link to="/contact">Contact</Link></li>
            {user && user.isAdmin && (
              <li className="nav-item"><Link to="/admin">Admin Panel</Link></li>
            )}
            {user && !user.isAdmin && (
              <li className="nav-item"><Link to="/orders">My Orders</Link></li>
            )}
          </ul>
          <div className="nav-auth" role="region" aria-label="User Account Actions">
            {user && !user.isAdmin && (
              <Link to="/cart" className="btn btn-cart" aria-label={`Cart with ${getCartItemsCount()} items`}>
                🛒 Cart
                {getCartItemsCount() > 0 && (
                  <span className="cart-badge">{getCartItemsCount()}</span>
                )}
              </Link>
            )}
            {user ? (
              <>
                <span className="welcome-text" aria-live="polite">
                  Welcome, {user.name}
                </span>
                <button onClick={handleLogout} className="btn btn-secondary" aria-label="Logout">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-secondary">Login</Link>
                <Link to="/register" className="btn btn-primary">Register</Link>
              </>
            )}
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
