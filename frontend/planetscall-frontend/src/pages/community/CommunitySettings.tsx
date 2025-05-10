import React, { useState } from 'react'
import Header from '../../components/shared/Header'
import Footer from '../../components/Footer/Footer'

const CommunitySettings = () => {
  const [loading, setLoading] = useState<boolean>(false);


  return (
    <div className="app-container">
    <Header/>
    <section className="blockCode">
    {loading ? (
        <p>Ładowanie...</p>
      ) : (
        <>



        </>
      )}
    </section>
    <Footer/>
      
    </div>
  )
}

export default CommunitySettings
