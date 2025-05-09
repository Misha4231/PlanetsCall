import React, { useEffect, useState } from 'react'
import Header from '../../components/shared/Header'
import Footer from '../../components/Footer/Footer'
import { activateTemplateTask, createTemplateTask, deleteTemplateTask, getAllTemplateTasks, TaskTemplate, TaskType } from '../../services/adminOrgService';
import { Link, useNavigate } from 'react-router-dom';
import { Organisation } from '../community/communityTypes';
import { useAuth } from '../../context/AuthContext';
import styles from '../../stylePage/admin/adminTask.module.css';
import NotAdmin from '../Additional/NotAdmin';

const AdminTasks = () => {
  const { user, isAuthenticated, token } = useAuth();
  
  const [loading, setLoading] = useState<boolean>(false);
  const [activityFilter, setActivityFilter] = useState<'active' | 'inactive' | null>(null);
  const [typeFilters, setTypeFilters] = useState<TaskType[]>([]);
  const [organisation, setOrganisation] = useState<Organisation[]>([]);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [tasks, setTasks] = useState<TaskTemplate[]>([]);
  const navigate = useNavigate();
  
  useEffect(() => {
      if (token && user?.isAdmin) {
          const fetchData = async () => {  
              try {
                  setLoading(true);
                  setError(null);
              } catch (err: any) {
                  setError(err.message);
              } finally {
                  setLoading(false);
              }
          };
          fetchData();
          fetchTasks();
      }    
  }, [token, user?.isAdmin]);

  const fetchTasks = async () => {
  if (!isAuthenticated || !token) return;
  setLoading(true);
  setError(null);
  try {
      const tasksData = await getAllTemplateTasks(token);
      setTasks(tasksData);
  } catch (err:any) {
      setError(err.message);
  } finally {
      setLoading(false);
  }
  };

  const toggleActivityFilter = (filter: 'active' | 'inactive') => {
    setActivityFilter(prev => prev === filter ? null : filter);
  };
  
  const toggleTypeFilter = (type: TaskType) => {
    setTypeFilters(prev => 
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };
  
  const filteredTasks = tasks.filter(task => {
    const matchesActivity =
      activityFilter === null ||
      (activityFilter === 'active' && task.isActive) ||
      (activityFilter === 'inactive' && !task.isActive);
  
    const matchesType =
      typeFilters.length === 0 || typeFilters.includes(task.type);
  
    return matchesActivity && matchesType;
  });
  

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


  const handleTaskAction = async (id: number, action: 'activate' | 'delete') => {
      if (!token) return;
      
      setLoading(true);
      setError(null);
      setSuccess(null);
      
      try {
          if (action === 'activate') {
              await activateTemplateTask(token, id);
              setSuccess('Zadanie zostało aktywowane!');
          } else {
              await deleteTemplateTask(token, id);
              setSuccess('Zadanie zostało usunięte!');
          }

          const updatedTasks = await getAllTemplateTasks(token);
          setTasks(updatedTasks);
      } catch (err: any) {
          setError(err.message);
      } finally {
          setLoading(false);
      }
  };

  const getTypeName = (type: TaskType): string => {
    switch(type) {
        case 1: return 'Łatwe (dzienne)';
        case 2: return 'Trudne (tygodniowe)';
        case 3: return 'Organizacyjne';
    }
};

return (
    <div className="app-container dark-theme">
      <Header />
      <section className={styles.taskAdminContainer}>
        <div className={styles.taskAdminContent}>          
          {loading ? (
            <p>Ładowanie...</p>
          ) : error ? (
            <div className="error-message">{error}</div>
          ) : (
            <>
            <div className={styles.headerSection}>
              <h2 className={styles.searchTitle}>Zarządzanie zadaniami szablonowymi</h2>
              <div className={styles.organisationActions}>
              <Link to="/admin/task/create" className={styles.createButton}>
                <i className="fas fa-plus"></i> Stwórz zadanie
              </Link>
                <Link to="/admin/task/overwatch" className={styles.searchButton}>
                  <i className="fas fa-search"></i> Werifikacja zadań
                </Link>
              </div>
            </div>
          <Link to="/admin/" className={styles.backButton}>
            <i className="fas fa-arrow-left"></i> Powrót
          </Link>
              <div className={styles.taskList}>
                <h3 className={styles.taskListTitle}>Lista zadań szablonowych</h3>
                <div className={styles.taskFilters}>
                <div className={styles.filterGroup}>
                  <button
                    className={`${styles.filterButton} ${activityFilter === 'active' ? styles.active : ''}`}
                    onClick={() => toggleActivityFilter('active')}
                  >
                    Aktywne
                  </button>
                  <button
                    className={`${styles.filterButton} ${activityFilter === 'inactive' ? styles.active : ''}`}
                    onClick={() => toggleActivityFilter('inactive')}
                  >
                    Nieaktywne
                  </button>
                </div>

                <div className={styles.filterGroup}>
                  <button
                    className={`${styles.filterButton} ${typeFilters.includes(1) ? styles.active : ''}`}
                    onClick={() => toggleTypeFilter(1)}
                  >
                    Łatwe (dzienne)
                  </button>
                  <button
                    className={`${styles.filterButton} ${typeFilters.includes(2) ? styles.active : ''}`}
                    onClick={() => toggleTypeFilter(2)}
                  >
                    Trudne (tygodniowe)
                  </button>
                  <button
                    className={`${styles.filterButton} ${typeFilters.includes(3) ? styles.active : ''}`}
                    onClick={() => toggleTypeFilter(3)}
                  >
                    Organizacyjne
                  </button>
                </div>
              </div>

                {filteredTasks.length > 0 ? (
                  <div className={styles.taskListItems}>
                    {filteredTasks.map((task) => (
                      <Link to={`/admin/organisations/task/${task.id}`}  className={styles.hiddenLink}>
                        <div key={task.id} className={styles.taskListItem}>
                            <h4 className={styles.taskListItemTitle}>{task.title}</h4>
                          <p className={styles.taskListItemDescription}>{task.description}</p>
                          <div className={styles.taskListItemMeta}>
                            <span>{getTypeName(task.type)} • {task.reward} punktów</span>
                            <span className={`${styles.taskListItemStatus} ${task.isActive ? 'active' : 'inactive'}`}>
                              {task.isActive ? 'Aktywne' : 'Nieaktywne'}
                            </span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className={styles.taskEmptyState}>
                    <i className="fas fa-tasks"></i>
                    <p>Brak zadań szablonowych</p>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </section>
      <Footer />
    </div>
  )
}

export default AdminTasks
