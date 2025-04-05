// src/components/shared/Header.tsx
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Header.css';

const Header: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const toggleDropdown = (menu: string) => {
    setActiveDropdown(activeDropdown === menu ? null : menu);
  };

  return (
    <header className='header-container'>
      <nav>
        <ul className='main-nav'>
          <li className="nav-item"><Link to="/">Strona Główna</Link></li>
          
          {isAuthenticated && (
            <>
              <li 
                className="nav-item dropdown"
                onMouseEnter={() => toggleDropdown('profile')}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <Link to="/profile">Profil</Link>
                <ul className={`dropdown-menu ${activeDropdown === 'profile' ? 'show' : ''}`}>
                  <li><Link to="/profile/statistics">Statystyka</Link></li>
                  <li><Link to="/profile/settings">Ustawienia</Link></li>
                </ul>
              </li>
              <li 
                className="nav-item dropdown"
                onMouseEnter={() => toggleDropdown('community')}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <Link to="/community">Społeczność</Link>
                <ul className={`dropdown-menu ${activeDropdown === 'community' ? 'show' : ''}`}>
                <li><Link to="/community/users">Ludzie</Link></li>
                  <li><Link to="/community/friends">Znajomi</Link></li>
                  <li><Link to="/community/organisations/search">Organizacje</Link></li>
                  <li><Link to="/community/organisations">Moje Organizacje</Link></li>
                </ul>
              </li>

              <li className="nav-item"><Link to="/tasks">Zadania</Link></li>
              
              <li className="nav-item"><Link to="/shop">Sklep</Link></li>
              
              {user?.isAdmin && (
                <li 
                  className="nav-item dropdown"
                  onMouseEnter={() => toggleDropdown('admin')}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <Link to="/admin">Panel Administracyjny</Link>
                  <ul className={`dropdown-menu ${activeDropdown === 'admin' ? 'show' : ''}`}>
                    <li><Link to="/admin/organisations">Organizacje</Link></li>
                    <li><Link to="/admin/users">Użytkownicy</Link></li>
                    <li><Link to="/admin/tasks">Zadania</Link></li>
                  </ul>
                </li>
              )}

              <li className="nav-item">
                <button className="logout-btn" onClick={logout}>Wyloguj</button>
              </li>
            </>
          )}
          
          {!isAuthenticated && (
            <>
              <li className="nav-item"><Link to="/auth/sign-in">Zaloguj się</Link></li>
              <li className="nav-item"><Link to="/auth/sign-up">Zajerestruj się</Link></li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;