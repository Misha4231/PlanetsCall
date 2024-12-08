import React from 'react'
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import ProductCard from '../../components/ProductCard/ProductCard';
import { Link } from 'react-router-dom';


const Profile = () => {

  return (
    <div className="profile">
      <Header/>

    <header>
      <label> Liczba Monet [0]
        </label>
      <input type="search" placeholder='Wyszukaj'/>
      <div>
        <label>New</label>
        <label>Promocje</label>
        <label>Tanie eko ubrania</label>
      </div>
    
    
    </header>  
    
    <aside className='sidebar'>
      <h4>Filtry</h4>
      <div>
        <label>
          <input type="checkbox"/> Ubrania
        </label>
        <label>
          <input type="checkbox"/> Nakrycia głowy
        </label>
        <label>
          <input type="checkbox"/> Okulary
        </label>
      </div>
    </aside>

      <main>
        <div>
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
