import React from 'react'
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import { Link } from 'react-router-dom';


const Profile = () => {

  return (
    <div className="profile">
      <Header/>
      <main>
        <div>
          <img
            alt="Avatar"
          />
          <div>
            <button>Zmień itemy</button>
          </div>
        </div>
        <div>
          <p>Waluta wirtualna:</p>
          <p>Level:</p>
          <p>Osiągnięcia:</p>
          <p>Odznaki:</p>
        </div>
        <nav>
          <Link to="/profile/shop/">Sklep </Link>
          <Link to="/profile/level/">Drzewko levelów </Link>
          <Link to="/profile/achivements/">Odznaki </Link>
          <Link to="/profile/settings/">Ustawienia </Link>
          <Link to="/profile/statistics/">Statystyka</Link>
        </nav>
      </main>
      <Footer/>
    </div>
  )
}

export default Profile
