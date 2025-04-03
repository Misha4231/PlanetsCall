import React, { useEffect, useState } from 'react'
import Header from '../../components/shared/Header'
import Footer from '../../components/Footer/Footer'
import { useAuth } from '../../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { blockUserAdmin, getUsersAdmin, resetUserAdmin, unblockUserAdmin } from '../../services/adminService';
import { UserAdmin, UsersResponseAdmin } from '../../types/adminTypes';
import { isBlock } from 'typescript';

const AdminMain = () => {
    const { user, isAuthenticated, token } = useAuth();
    
    const [loading, setLoading] = useState<boolean>(false);
    const [success, setSuccess] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

useEffect(() => {
  if (token && user?.isAdmin) {
        const fetchData = async () => {  
            try {              
              setError(null);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
        }    
    }, [token,  user?.isAdmin]);



  if (!isAuthenticated) {
    return (<div>
      <Header/>
      <p style={{ color: 'red' }}>Użytkownik nie jest zalogowany.</p>
      <Footer/>

    </div>);   
  }

  if(!user?.isAdmin){
    return (<div>
      <Header/>
      <p style={{ color: 'red' }}>Nie masz uprawnień administratora.</p>
      <Footer/>

    </div>);  
  } 




return (
  <div className="app-container">
      <Header/>
      <section className="blockCode">
      {loading ? (
          <p>Ładowanie...</p>
        ) : (
          <>
          {success && <p style={{ color: 'green' }}>{success}</p>}
          {error && <p style={{ color: 'red' }}>{error}</p>}
            <ul>
                <li><Link to="/admin/organisations">Organizacje</Link></li>
                <li><Link to="/admin/users">Użytkownicy</Link></li>
                <li><Link to="/admin/tasks">Zadania</Link></li>
            </ul>
          </>
        )}
      </section>
      <Footer/> 
    </div>
  )
}

export default AdminMain
