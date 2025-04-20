import React, { useEffect, useState } from 'react'
import Header from '../../components/shared/Header'
import Footer from '../../components/Footer/Footer'
import { useAuth } from '../../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { blockUserAdmin, getUsersAdmin, resetUserAdmin, unblockUserAdmin } from '../../services/adminService';
import { UserAdmin, UsersResponseAdmin } from '../../types/adminTypes';
import { isBlock } from 'typescript';
import styles from '../../stylePage/admin/admin.module.css';
import NotAdmin from '../Additional/NotAdmin';

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
    return (<NotAdmin/>) 
  } 




  return (
    <div className="app-container dark-theme">
      <Header />
      <section className={styles.adminContainer}>
        {loading ? (
          <p>Ładowanie...</p>
        ) : (
          <div className={styles.adminContent}>
            {success && <div className={`${styles.adminMessage} ${styles.adminSuccess}`}>{success}</div>}
            {error && <div className={`${styles.adminMessage} ${styles.adminError}`}>{error}</div>}
            
            <h1 className={styles.adminTitle}>Panel Administracyjny</h1>
            
            <nav className={styles.adminNav}>
              <Link to="/admin/organisations" className={styles.adminNavLink}>
                <i className="fas fa-sitemap"></i>
                Organizacje
              </Link>
              <Link to="/admin/users" className={styles.adminNavLink}>
                <i className="fas fa-users"></i>
                Użytkownicy
              </Link>
              <Link to="/admin/tasks" className={styles.adminNavLink}>
                <i className="fas fa-tasks"></i>
                Zadania
              </Link>
            </nav>
          </div>
        )}
      </section>
      <Footer />
    </div>
  )
};;

export default AdminMain
