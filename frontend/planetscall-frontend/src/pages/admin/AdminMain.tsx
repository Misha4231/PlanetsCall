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
    const [page, setPage] = useState<number>(1);
    const [users, setUsers] = useState<UserAdmin[]>([]);
    const [success, setSuccess] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [pagination, setPagination] = useState({
      hasNextPage: false,
      hasPreviousPage: false,
      totalPages: 1,
    });
    const navigate = useNavigate();

useEffect(() => {
  if (token && user?.isAdmin) {
        const fetchData = async () => {  
            try {
                setLoading(true);
                const userData: UsersResponseAdmin = await getUsersAdmin(token, page);
                setUsers(userData.items);
                setPagination({
                hasNextPage: userData.hasNextPage,
                hasPreviousPage: userData.hasPreviousPage,
                totalPages: userData.totalPages,
              });
              setError(null);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
        }    
    }, [token, page, user?.isAdmin]);



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


  const handleBlockUser = async (username: string) => {
    if (!token) return;
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      await blockUserAdmin(token, username);
      setSuccess(`Użytkownik ${username} został zablokowany.`);
      refreshUserList();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };



  const handleUnblockUser = async (username: string) => {
    if (!token) return;
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      await unblockUserAdmin(token, username);
      setSuccess(`Użytkownik ${username} został odblokowany.`);
      refreshUserList();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResetUser = async (username: string) => {
    if (!token) return;
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      await resetUserAdmin(token, username);
      setSuccess(`Użytkownik ${username} został zresetowany.`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const refreshUserList = async () => {
    if (token) {
      try {
        const userData: UsersResponseAdmin = await getUsersAdmin(token, page);
        setUsers(userData.items);
      } catch (err: any) {
        setError(err.message || 'Wystąpił błąd podczas odświeżania listy.');
      }
    }
  };


return (
    <div>
      <Header/>

        {success && <p style={{ color: 'green' }}>{success}</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <section className="blockCode">
            <h4>Użytkownicy</h4>
            {loading ? (
              <p>Ładowanie...</p>
            ) : error ? (
              <p style={{ color: 'red' }}>{error}</p>
            ) : users.length > 0 ? (
              <ul>
                {users.map((us) => (
                  <li key={us.id}>
                  <Link to={`/user/${us.username}`}>{us.username}</Link>
                  {us.isBlocked ? (
                    <button
                      onClick={() => handleUnblockUser(us.username)}
                      disabled={loading || !us.isBlocked}
                    >
                      Odblokuj
                    </button>
                    ): (
                    <button
                      onClick={() => handleBlockUser(us.username)}
                      disabled={loading || us.isBlocked}
                    >
                      Zablokuj
                      </button>
                    )}
                    <button
                      onClick={() => handleResetUser(us.username)}
                      disabled={loading}
                    >
                      Resetuj hasło
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p>Brak użytkowników.</p>
            )}



          <div>
            {pagination.totalPages > 1 && pagination.hasPreviousPage && (
              <button
                onClick={() => setPage(page - 1)}
                disabled={loading}
              >
                Poprzednia strona
              </button>
            )}

            {pagination.totalPages > 1 && (
              <span>Strona {page} z {pagination.totalPages}</span>
            )}

            {pagination.totalPages > 1 && pagination.hasNextPage && (
              <button
                onClick={() => setPage(page + 1)}
                disabled={loading}
              >
                Następna strona
              </button>
            )}
          </div>
        </section>
      <Footer/>      
    </div>
  )
}

export default AdminMain
