import React, { useContext } from "react";
import { Link } from "react-router-dom";
import "./Header.css";
import AuthContext from "../../context/AuthContext";

interface NavProps {
  isAuth?: boolean;
  isAdmin?: boolean;
}

const Header: React.FC<NavProps> = ({ isAuth = false, isAdmin = false }) => {
  const authContext = useContext(AuthContext);

  if (!authContext) {
    throw new Error("AuthContext is not provided");
  }

  const { user, logout } = authContext;

  return (
    <header className="header">
      <Link to="/" className="logo">
        (Future Icon) Planet's Call
      </Link>
      <nav className="nav">
        <ul>
          <li>
            <Link to="/profile">Profil</Link>
          </li>
          <li>
            <Link to="/tasks">Zadania</Link>
          </li>
          {user ? (
            <>
              <li>
                <Link to="/profile">Profil</Link>
              </li>
              <li>
                <button onClick={logout} className="logoutButton">
                  Wyloguj się
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/signin">Zaloguj Się</Link>
              </li>
              <li>
                <Link to="/signup">Zajerestruj się</Link>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
