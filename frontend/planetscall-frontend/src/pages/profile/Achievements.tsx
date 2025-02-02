import React from 'react'
import Header from '../../components/shared/Header'
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Achievements = () => {
  const { user, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  if (loading) {
    return <div>Ładowanie danych użytkownika...</div>;
  }  
  
  if (!isAuthenticated) {
    return (<div>
      <Header/>
      <p style={{ color: 'red' }}>Użytkownik nie jest zalogowany.</p>

    </div>);   
  }

  if (!user) {
    return <p>Ładowanie danych użytkownika...</p>;
  }

  return (
    <div>
      <Header/>
      
    </div>
  )
}

export default Achievements
