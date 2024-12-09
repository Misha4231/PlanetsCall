import React from 'react'
import Header from '../../components/Header/Profile/HeaderProfile'
import Footer from '../../components/Footer/Footer'
import HeaderProfile from '../../components/Header/Profile/HeaderProfile'

const Shop = () => {
  return (
    <div>
      <HeaderProfile/>
      

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
        <label>
          Koszt
          <input type="range" min={0} max={100}  />
        </label>
      </div>
    </aside>

      <main>
        <div>
          <div>
            <button>Zmień itemy</button>
          </div>
        </div>
      </main>
      <Footer/>
    </div>
  )
}

export default Shop
