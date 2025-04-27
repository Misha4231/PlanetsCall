import React, { useEffect, useState } from 'react'
import Header from '../../components/shared/Header'
import Footer from '../../components/Footer/Footer'
import { useAuth } from '../../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { blockUserAdmin, getUsersAdmin, resetUserAdmin, unblockUserAdmin } from '../../services/adminService';
import { UserAdmin, UsersResponseAdmin } from '../../types/adminTypes';
import { isBlock } from 'typescript';
import styles from '../../stylePage/styles.module.css';
import Loading from '../Additional/Loading';
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
        <section className={styles.container}>
            {loading ? (
                <Loading />
            ) : (
                <div className={styles.content}>
                    <h2 className={styles.title}>Panel Administracyjny</h2>
                    
                    <div className={styles.grid}>
                        <Link to="/admin/organisations" className={styles.card}>
                            <div className={styles.icon}>
                                <i className="fas fa-sitemap"></i>
                            </div>
                            <h3>Organizacje</h3>
                            <p>Przeglądaj i zarządzaj organizacjami</p>
                        </Link>
                        
                        <Link to="/admin/users" className={styles.card}>
                            <div className={styles.icon}>
                                <i className="fas fa-users"></i>
                            </div>
                            <h3>Użytkownicy</h3>
                            <p>Przeglądaj i zarządzaj użytkownikami</p>
                        </Link>
                        
                        <Link to="/admin/tasks" className={styles.card}>
                            <div className={styles.icon}>
                                <i className="fas fa-tasks"></i>
                            </div>
                            <h3>Zadania</h3>
                            <p>Przeglądaj i zarządzaj zadaniami</p>
                        </Link>
                        
                        <Link to="/admin/shop" className={styles.card}>
                            <div className={styles.icon}>
                                <i className="fas fa-store"></i>
                            </div>
                            <h3>Sklep</h3>
                            <p>Przeglądaj i zarządzaj asortymentem sklepu</p>
                        </Link>
                    </div>
                </div>
            )}
        </section>
        <Footer />
    </div>
);
};

export default AdminMain
