import React, { useState } from 'react'
import Header from '../../components/shared/Header'
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Footer from '../../components/Footer/Footer';

const Achievements = () => {
  const { user, isAuthenticated, loadingUser } = useAuth();
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  if (loadingUser) {
    return <div>Ładowanie danych użytkownika...</div>;
  }  
  
  if (!isAuthenticated) {
    return (<div>
      <Header/>
      <p style={{ color: 'red' }}>Użytkownik nie jest zalogowany.</p>

    </div>);   
  }

  if (!user) {
    return  (
      <div>     <Header/>
      <section className="blockCode">
        Ładowanie danych użytkownika...
      </section>
      <Footer/>
        
      </div>
    );
  }

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

export default Achievements
