import React, { useEffect, useState } from 'react'
import Header from '../../../components/shared/Header'
import Footer from '../../../components/Footer/Footer'
import { activateTemplateTask, createTemplateTask, deleteTemplateTask, getAllTemplateTasks, TaskTemplate, TaskType } from '../../../services/adminOrgService';
import { Link, useNavigate } from 'react-router-dom';
import { Organisation } from '../../community/communityTypes';
import { useAuth } from '../../../context/AuthContext';
import styles from '../../../stylePage/admin/adminTask.module.css';
import NotAdmin from '../../Additional/NotAdmin';


const AdminTaskCreate = () => {
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
        type: 1 
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
        }    
    }, [token, user?.isAdmin]);
  
    
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
            setSuccess('Nowe zadanie zostało pomyślnie utworzone!');
          }
      } catch (err: any) {
          setError(err.message || 'Nie udało się utworzyć zadania');
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
            <h1 className={styles.taskAdminTitle}>Utwórz nowe zadanie</h1>
            
            {loading ? (
              <p>Ładowanie...</p>
            ) : error ? (
              <div className="error-message">{error}</div>
            ) : (
              <>
                <div className={styles.taskForm}>
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
  
            
              </>
            )}
          </div>
        </section>
        <Footer />
      </div>
    )
  }
  

export default AdminTaskCreate
