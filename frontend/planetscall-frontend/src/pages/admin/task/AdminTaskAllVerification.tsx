import React, { useEffect, useState } from 'react'
import Footer from '../../../components/Footer/Footer'
import Header from '../../../components/shared/Header'
import {  activateTemplateTask, deleteTemplateTask, TaskTemplate, TaskType, getTemplateTaskById  } from '../../../services/adminOrgService';
import { useAuth } from '../../../context/AuthContext';
import { addOverwatchReaction, getOverwatchFeed, getOverwatchSpecificFeed, OverwatchTaskItem} from '../../../services/taskService';
import { Organisation } from '../../community/communityTypes';
import { Link, useNavigate, useParams } from 'react-router-dom';
import styles from '../../../stylePage/admin/adminTask.module.css';
import NotAdmin from '../../Additional/NotAdmin';
import { PaginationResponse } from '../../../services/headers';



const AdminTaskAllVerification = () => {
  const { user, isAuthenticated, token } = useAuth();
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<string | null>(sessionStorage.getItem('successInfo'));
  const [error, setError] = useState<string | null>(null);
  const [verifications, setVerifications] = useState<OverwatchTaskItem[]>([]);
  const [pagination, setPagination] = useState<PaginationResponse<OverwatchTaskItem> | null>(null); 
  const [currentPage, setCurrentPage] = useState<number>(1); 
  
  const navigate = useNavigate();

  sessionStorage.setItem('successInfo', "");
  
  useEffect(() => {
      if (token && user?.isAdmin) {
          const fetchData = async () => {  
              try {
                  setLoading(true);
                  const response = await getOverwatchFeed(token, currentPage);
                  console.log('API Response:', response);
                  
                  setVerifications(response.items);
                  setPagination({
                      pageIndex: response.pageIndex,
                      totalPages: response.totalPages,
                      hasPreviousPage: response.hasPreviousPage,
                      hasNextPage: response.hasNextPage,
                      items: response.items
                  });
                  
                  setError(null);
              } catch (err: any) {
                  setError(err.message);
                  console.error('Error fetching data:', err);
              } finally {
                  setLoading(false);
              }
          };
          fetchData();
      }    
  }, [token, user?.isAdmin, currentPage]);

  const goToPage = (page: number) => {
      if (page >= 1 && page <= (pagination?.totalPages || 1)) {
          setCurrentPage(page);
      }
  };

  if (!isAuthenticated) {
    return (
        <div>
            <Header/>
            <p style={{ color: 'red' }}>Użytkownik nie jest zalogowany.</p>
            <Footer/>
        </div>
    );   
}

  if(!user?.isAdmin){
    return (<NotAdmin/>) 
  } 



  return (
      <div className="app-container dark-theme">
          <Header />
          <section className={styles.taskAdminContainer}>
              <div className={styles.taskAdminContent}>
                  <h1>Weryfikacje zadań</h1>
                  
                  {loading && <p>Ładowanie...</p>}
                  {error && <div className="error-message">{error}</div>}
                  
                  {verifications.length > 0 ? (
                      <>
                          <div className={styles.taskList}>
                              {verifications.map((verification) => (
                                  <div key={verification.id} className={styles.taskItem}>
                                      <h3>ID: {verification.id}</h3>
                                      <p>Wykonawca: {verification.executor?.username || 'Brak danych'}</p>
                                      <p>Data ukończenia: {new Date(verification.completedAt).toLocaleString()}</p>
                                  </div>
                              ))}
                              {verifications.map((verification) => (
                                <div key={verification.id} className={styles.taskListItem}>
                                    <Link to={`/admin/task/overwatch/${verification.id}`}>
                                        <h4 className={styles.taskListItemTitle}>{verification.executor.username} - {new Date(verification.completedAt).toLocaleString()}</h4>
                                    </Link>
                                    {verification.message ? (
                                        <p className={styles.taskListItemDescription}>{verification.message}</p>
                                    ) : (
                                        <p className={styles.taskListItemDescription}>Brak informacji</p>
                                    )}
                                    <div className={styles.taskListItemMeta}>
                                    </div>
                                </div>
                                ))}
                          </div>
                          
                          
                          {pagination && pagination.totalPages!=1 && (
                              <div className={styles.pagination}>
                                  <button 
                                      onClick={() => goToPage(currentPage - 1)} 
                                      disabled={!pagination.hasPreviousPage}
                                  >
                                      Poprzednia
                                  </button>
                                  
                                  <span>
                                      Strona {pagination.pageIndex} z {pagination.totalPages}
                                  </span>
                                  
                                  <button 
                                      onClick={() => goToPage(currentPage + 1)} 
                                      disabled={!pagination.hasNextPage}
                                  >
                                      Następna
                                  </button>
                              </div>
                          )}
                      </>
                  ) : (
                      !loading && (
                          <div className={styles.taskEmptyState}>
                              <i className="fas fa-tasks"></i>
                              <p>Nie znaleziono żądań weryfikacji</p>
                          </div>
                      )
                  )}
              </div>
          </section>
          <Footer />
      </div>
  );
};

export default AdminTaskAllVerification;