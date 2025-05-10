import React, { useEffect, useState } from 'react'
import Header from '../../../components/shared/Header'
import Footer from '../../../components/Footer/Footer'
import { activateTemplateTask, createTemplateTask, deleteTemplateTask, getAllTemplateTasks, TaskTemplate, TaskType } from '../../../services/adminOrgService';
import { Link, useNavigate } from 'react-router-dom';
import { Organisation } from '../../community/communityTypes';
import { useAuth } from '../../../context/AuthContext';
import styles from '../../../stylePage/admin/adminTask.module.css';
import authStyles from '../../../stylePage/auth.module.css';
import NotAdmin from '../../Additional/NotAdmin';
import Loading from '../../Additional/Loading';
import NotAuthenticated from '../../Additional/NotAuthenticated';


const AdminTaskCreate = () => {
    const { user, isAuthenticated, token } = useAuth();
    
    const [loading, setLoading] = useState<boolean>(false);
    const [loadingForm, setLoadingForm] = useState<boolean>(false);
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
        return (<NotAuthenticated/>
        );   
    }
  
    if(!user?.isAdmin){
      return (<NotAdmin/>) 
    } 
  
  
  
    
    const handleTaskSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!token) return;
      
      setLoadingForm(true);
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
            setTimeout(() => navigate('/admin/tasks'), 1000);
          }
      } catch (err: any) {
          setError(err.message || 'Nie udało się utworzyć zadania');
      } finally {
        setLoadingForm(false);
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
        <section className={styles.taskAdminTaskContainer}>
          <div className={styles.taskAdminContent}>
            <h1 className={styles.taskAdminTitle}>Utwórz nowe zadanie</h1>
          <Link to="/admin/tasks" className={styles.backButton}>
            <i className="fas fa-arrow-left"></i> Powrót
          </Link>
            {success && <div className={styles.successMessage}>{success}</div>}
            {error && <p className={styles.errorMessage}>{error}</p>}
            
            {loading ? (
              <Loading/>
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
                    
                    <div className={`${styles.taskFormGroup} ${authStyles.checkboxLabel}`}>
                      <input
                        type="checkbox"
                        id="isGroup"
                        checked={newTask.isGroup}
                        className={authStyles.checkbox}
                        onChange={(e) => setNewTask({...newTask, isGroup: e.target.checked})}
                      />
                      <label htmlFor="isGroup" className={styles.taskFormLabel}>Zadanie grupowe</label>
                    </div>
                    
                    <div className={styles.taskFormSubmit}>                      
                    <button 
                            type="submit" 
                            className={styles.primaryButton}
                            disabled={loadingForm}
                        >
                            {loadingForm ? (
                                <>
                                    <i className="fas fa-spinner fa-spin"></i> Tworzenie...
                                </>
                            ) : (
                                <>
                                    <i className="fas fa-plus"></i> Stwórz kategorię
                                </>
                            )}
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
