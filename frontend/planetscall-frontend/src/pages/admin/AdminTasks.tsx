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
          <h1 className={styles.taskAdminTitle}>Zarządzanie zadaniami szablonowymi</h1>
          
          {loading ? (
            <p>Ładowanie...</p>
          ) : error ? (
            <div className="error-message">{error}</div>
          ) : (
            <>
              <Link to={`/admin/task/create`}>Stwórz</Link>
              <Link to={`/admin/task/overwatch`}>Werifikacja</Link>
              <div className={styles.taskList}>
                <h3 className={styles.taskListTitle}>Lista zadań szablonowych</h3>
                {tasks.length > 0 ? (
                  <div className={styles.taskListItems}>
                    {tasks.map((task) => (
                      <div key={task.id} className={styles.taskListItem}>
                        <Link to={`/admin/organisations/task/${task.id}`}>
                          <h4 className={styles.taskListItemTitle}>{task.title}</h4>
                        </Link>
                        <p className={styles.taskListItemDescription}>{task.description}</p>
                        <div className={styles.taskListItemMeta}>
                          <span>{getTypeName(task.type)} • {task.reward} punktów</span>
                          <span className={`${styles.taskListItemStatus} ${task.isActive ? 'active' : 'inactive'}`}>
                            {task.isActive ? 'Aktywne' : 'Nieaktywne'}
                          </span>
                        </div>
                      </div>
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
