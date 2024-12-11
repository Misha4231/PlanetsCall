import React, { useContext } from "react";
import { Link } from "react-router-dom";
import "./HeaderProfile.css";
import AuthContext from "../../../context/AuthContext";

interface NavProps {
  isAuth?: boolean;
  isAdmin?: boolean;
}

const HeaderProfile: React.FC<NavProps> = ({ isAuth = false, isAdmin = false }) => {
  const authContext = useContext(AuthContext);

  if (!authContext) {
    throw new Error("AuthContext is not provided");
  }

  const { user, logout } = authContext;

  return (
    <header className="header">
      <Link to="/profile" className="logo">
        Awatar Profilu
      </Link>
      <nav className="nav">
        <ul>
          <li>
            <Link to="/">🏠 </Link>
          </li>
          <li>
            <Link to="/profile/shop/">Sklep </Link>
          </li>
          <li>
            <Link to="/profile/level/">Drzewko levelów </Link>
          </li>
          <li>
            <Link to="/profile/achivements/">Odznaki </Link>
          </li>
          <li>
            <Link to="/profile/settings/">Ustawienia </Link>
          </li>
          <li>
            <Link to="/profile/statistics/">Statystyka</Link>
          </li>

        </ul>
      </nav>
    </header>
  );
};

export default HeaderProfile;
