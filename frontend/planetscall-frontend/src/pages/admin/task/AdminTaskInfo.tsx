import React, { useEffect, useState } from 'react'
import Footer from '../../../components/Footer/Footer'
import Header from '../../../components/shared/Header'
import { getOrganisationVerifications, sentResponseToOrganisationVerification, createTemplateTask, getAllTemplateTasks, activateTemplateTask, deleteTemplateTask, TaskTemplate, TaskType, getTemplateTaskById  } from '../../../services/adminOrgService';
import { useAuth } from '../../../context/AuthContext';
import { Organisation } from '../../community/communityTypes';
import { Link, useNavigate, useParams } from 'react-router-dom';
import styles from '../../../stylePage/admin/adminTask.module.css';
import NotAdmin from '../../Additional/NotAdmin';
import Loading from '../../Additional/Loading';

const AdminTaskInfo = () => {
    const { user, isAuthenticated, token } = useAuth();
    const [loading, setLoading] = useState<boolean>(false);
    const [success, setSuccess] = useState<string | null>(sessionStorage.getItem('successInfo'));
    const [error, setError] = useState<string | null>(null);
    const [task, setTask] = useState<TaskTemplate>();
    const { taskId } = useParams<{ taskId: string }>();
    
    const navigate = useNavigate();

    sessionStorage.setItem('successInfo', "");
    
    useEffect(() => {
        if (token && user?.isAdmin && taskId) {
            const fetchData = async () => {  
                try {
                    setLoading(true);
                    const taskData = await getTemplateTaskById(token, taskId);
                    setTask(taskData);
                    setError(null);
                } catch (err: any) {
                    setError(err.message);
                } finally {
                    setLoading(false);
                }
            };
            fetchData();
        }    
    }, [token, user?.isAdmin, taskId]);
  


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
    const getTypeName = (type: TaskType): string => {
      switch(type) {
          case 1: return 'Łatwe (dzienne)';
          case 2: return 'Trudne (tygodniowe)';
          case 3: return 'Organizacyjne';
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
                  setTimeout(() => navigate('/admin/tasks'), 1000);
              } else {
                  await deleteTemplateTask(token, id);
                  navigate('/admin/organisations');
              }
  
          } catch (err: any) {
              setError(err.message);
          } finally {
              setLoading(false);
          }
      };

      return (
        <div className="app-container dark-theme">
          <Header />
          <section className={styles.taskAdminContainer}>
            <div className={styles.taskAdminContent}> 
            {success && <div className={styles.successMessage}>{success}</div>}
            {error && <p className={styles.errorMessage}>{error}</p>}
              {loading ? (<Loading/>
              ) : task ? (
                <>
                  <div className={styles.taskInfoHeader}>
                    <div>
                      <h1 className={styles.taskInfoTitle}>{task.title}</h1>
                      <div className={styles.taskInfoMeta}>
                        <span className={styles.taskInfoMetaItem}>
                          <i className="fas fa-star"></i> {task.reward} punktów
                        </span>
                        <span className={styles.taskInfoMetaItem}>
                          <i className="fas fa-tag"></i> {getTypeName(task.type)}
                        </span>
                        <span className={`${styles.taskInfoMetaItem} ${task.isActive ? 'active' : 'inactive'}`}>
                          <i className={task.isActive ? 'fas fa-check-circle' : 'fas fa-times-circle'}></i>
                          {task.isActive ? 'Aktywne' : 'Nieaktywne'}
                        </span>
                      </div>
                    </div>
                    <Link 
                      to={`/admin/organisations/task/${taskId}/settings`}
                      className={`${styles.actionButton} ${styles.editButton}`}
                    >
                      <i className="fas fa-edit"></i> Edytuj
                    </Link>
                  </div>
                    <Link to="/admin/tasks" className={styles.backButton}>
                        <i className="fas fa-arrow-left"></i> Powrót
                    </Link>
    
                  <div className={styles.taskInfoDescription}>
                    <h3>Opis zadania</h3>
                    <p>{task.description}</p>
                  </div>
    
                  <div className={styles.taskInfoActions}>
                  {!task.isActive && (                    
                    <button
                      onClick={() => task.id && handleTaskAction(task.id, 'activate')}
                      className={`${styles.actionButton} ${styles.primaryButton}`}
                    >
                      <i className="fas fa-power-off"></i> Aktywuj
                    </button>
                  )}
                    <button
                      onClick={() => task.id && handleTaskAction(task.id, 'delete')}
                      disabled={loading}
                      className={`${styles.actionButton} ${styles.deleteButton}`}
                    >
                      <i className="fas fa-trash"></i> Usuń
                    </button>
                  </div>
                </>
              ) : (
                <div className={styles.taskEmptyState}>
                  <i className="fas fa-tasks"></i>
                  <p>Nie znaleziono zadania</p>
                </div>
              )}
            </div>
          </section>
          <Footer />
        </div>
      )
}

export default AdminTaskInfo
