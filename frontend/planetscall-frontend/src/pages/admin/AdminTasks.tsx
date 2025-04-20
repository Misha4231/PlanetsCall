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
  const [newTask, setNewTask] = useState({
      title: '',
      description: '',
      isGroup: false,
      reward: 0,
      type: 1 as TaskType 
  });
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



  
  const handleTaskSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
        const taskToSend = {
            title: newTask.title,
            description: newTask.description,
            isGroup: newTask.isGroup,
            reward: newTask.reward,
            type: newTask.type
        };
        
        if(await createTemplateTask(token, taskToSend)){
          fetchTasks();
          setSuccess('Nowe zadanie zostało pomyślnie utworzone!');
          setNewTask({
              title: '',
              description: '',
              isGroup: false,
              reward: 0,
              type: 1
          });
        }
    } catch (err: any) {
        setError(err.message || 'Nie udało się utworzyć zadania');
    } finally {
        setLoading(false);
    }
};

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
              <div className={styles.taskForm}>
                <h3>Utwórz nowe zadanie</h3>
                <form onSubmit={handleTaskSubmit} className={styles.taskForm}>
                  <div className={styles.taskFormGroup}>
                    <label className={styles.taskFormLabel}>Tytuł:</label>
                    <input
                      type="text"
                      className={styles.taskFormInput}
                      value={newTask.title}
                      onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div className={`${styles.taskFormGroup} ${styles.fullWidth}`}>
                    <label className={styles.taskFormLabel}>Opis:</label>
                    <textarea
                      className={styles.taskFormTextarea}
                      value={newTask.description}
                      onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div className={styles.taskFormGroup}>
                    <label className={styles.taskFormLabel}>Nagroda (punkty):</label>
                    <input
                      type="number"
                      className={styles.taskFormInput}
                      value={newTask.reward}
                      onChange={(e) => setNewTask({...newTask, reward: Number(e.target.value)})}
                      required
                    />
                  </div>
                  
                  <div className={styles.taskFormGroup}>
                    <label className={styles.taskFormLabel}>Typ zadania:</label>
                    <select
                      className={styles.taskFormSelect}
                      value={newTask.type}
                      onChange={(e) => setNewTask({...newTask, type: Number(e.target.value) as TaskType})}
                      required
                    >
                      <option value={1}>Łatwe (dzienne)</option>
                      <option value={2}>Trudne (tygodniowe)</option>
                      <option value={3}>Organizacyjne</option>
                    </select>
                  </div>
                  
                  <div className={`${styles.taskFormGroup} ${styles.taskFormCheckbox}`}>
                    <input
                      type="checkbox"
                      id="isGroup"
                      checked={newTask.isGroup}
                      onChange={(e) => setNewTask({...newTask, isGroup: e.target.checked})}
                    />
                    <label htmlFor="isGroup" className={styles.taskFormLabel}>Zadanie grupowe</label>
                  </div>
                  
                  <div className={styles.taskFormSubmit}>
                    <button type="submit" className="submit-button" disabled={loading}>
                      {loading ? 'Tworzenie...' : 'Utwórz zadanie'}
                    </button>
                  </div>
                </form>
              </div>

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
