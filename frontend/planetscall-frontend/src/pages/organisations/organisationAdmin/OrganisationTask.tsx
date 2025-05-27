import React, { useEffect, useState } from 'react';
import Footer from '../../../components/Footer/Footer';
import Header from '../../../components/shared/Header';
import { useAuth } from '../../../context/AuthContext';
import { Organisation } from '../../community/communityTypes';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { 
  getOrganizationTasks,
  deleteOrganizationTask,
  activateOrganizationTask,
  OrganizationTask,
  TaskType
} from '../../../services/adminOrgService';
import { getOrganisationData } from '../../../services/communityService';
import NotAdmin from '../../Additional/NotAdmin';
import styles from '../../../stylePage/admin/adminTask.module.css';
import NotAuthenticated from '../../Additional/NotAuthenticated';

const OrganisationTaskManagement = () => {
    const { user, isAuthenticated, token } = useAuth();
    const [loading, setLoading] = useState<boolean>(false);
    const [loadingForm, setLoadingForm] = useState<boolean>(false);
    const [activityFilter, setActivityFilter] = useState<'active' | 'inactive' | null>(null);
    const [success, setSuccess] = useState<string | null>(sessionStorage.getItem('successInfo'));
    const [organisation, setOrganisation] = useState<Organisation | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [tasks, setTasks] = useState<OrganizationTask[]>([]);
    
    const { organisationUniqueName } = useParams<{ organisationUniqueName: string }>();
    const navigate = useNavigate();

    sessionStorage.setItem('successInfo', "");
    
    { /* Get organisation data and tasks */} 
    useEffect(() => {
        if (token && organisationUniqueName) {
            const fetchData = async () => {  
                try {
                    setLoading(true);

                    const orgData = await getOrganisationData(token, organisationUniqueName);
                    setOrganisation(orgData);

                    const tasksData = await getOrganizationTasks(token, organisationUniqueName);
                    setTasks(tasksData);
                    setError(null);
                } catch (err: any) {
                    setError(err.message);
                } finally {
                    setLoading(false);
                }
            };
            fetchData();
        }    
    }, [token, organisationUniqueName]);

    if (!isAuthenticated) {
    return (<NotAuthenticated/>
        );   
    }

    if(organisation?.creatorId!=user?.id){
        return (<NotAdmin/>) 
      } 

    { /* Function to activate or delete task */}
    const handleTaskAction = async (id: number, action: 'activate' | 'delete') => {
        if (!token || !organisationUniqueName) return;
        
        setLoadingForm(true);
        setError(null);
        setSuccess(null);
        
        try {
            if (action === 'activate') {
                await activateOrganizationTask(token, organisationUniqueName, id);
                setSuccess('Zadanie zostało aktywowane na 3 dni!');
                const updatedTasks = await getOrganizationTasks(token, organisationUniqueName);
                setTasks(updatedTasks);
            } else if (action === 'delete') {
                await deleteOrganizationTask(token, organisationUniqueName, id);
                setTasks(tasks.filter(task => task.id !== id));
                setSuccess('Zadanie zostało usunięte!');
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoadingForm(false);
        }
    };

    { /* Function to get if task is active */}
    const getStatusInfo = (task: OrganizationTask): string => {
        if (task.isActive && task.expiresAt) {
            return `Aktywne (wygaśnie: ${new Date(task.expiresAt).toLocaleString()})`;
        }
        return 'Nieaktywne';
    };

      const getTypeName = (type: TaskType): string => {
        switch(type) {
            case 1: return 'Łatwe (dzienne)';
            case 2: return 'Trudne (tygodniowe)';
            case 3: return 'Organizacyjne';
        }
    };


    
      const toggleActivityFilter = (filter: 'active' | 'inactive') => {
        setActivityFilter(prev => prev === filter ? null : filter);
      };
      
      
      const filteredTasks = tasks.filter(task => {
        const matchesActivity =
          activityFilter === null ||
          (activityFilter === 'active' && task.isActive) ||
          (activityFilter === 'inactive' && !task.isActive);
      
        return matchesActivity ;
      });

    return (
        <div className="app-container">
            <Header />
      <section className={styles.taskAdminContainer}>
        <div className={styles.taskAdminContent}>          
            {success && <div className={styles.successMessage}>{success}</div>}
            {error && <p className={styles.errorMessage}>{error}</p>}
              
          {loading ? (
            <p>Ładowanie...</p>
          ) : error ? (
            <div className="error-message">{error}</div>
          ) : (
            <>
            <div className={styles.headerSection}>
              <h2 className={styles.searchTitle}>Zarządzanie zadaniami </h2>
              <div className={styles.organisationActions}>
              <Link to={`/community/organisation/${organisationUniqueName}/tasks/create`} className={styles.createButton}>
                <i className="fas fa-plus"></i> Stwórz zadanie
              </Link>
              </div>
            </div>
          <Link to={`/community/organisation/${organisationUniqueName}/settings`} className={styles.backButton}>
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
              </div>

                {filteredTasks.length > 0 ? (
                  <div className={styles.taskListItemsOrg}>
                    {filteredTasks.map((task) => (
                      <div className={styles.hiddenLink}>
                        <div key={task.id} className={styles.taskListItemOrg}>
                            <h4 className={styles.taskListItemTitle}>{task.title}</h4>
                          <p className={styles.taskListItemDescription}>{task.description}</p>
                          <div className={styles.taskListItemMeta}>
                            <span className={`${styles.taskListItemStatus} ${task.isActive ? 'active' : 'inactive'}`}>
                              {task.isActive ? 'Aktywne' : 'Nieaktywne'}
                            </span>
                          </div>
                        <div className={styles.taskActions}>
                            {!task.isActive && (
                            <button
                                onClick={() => handleTaskAction(task.id, 'activate')}
                                disabled={loading}
                                className={`${styles.actionButton} ${styles.primaryButton}`}
                            >
                                <i className="fas fa-power-off"></i>  Aktywuj na 3 dni
                            </button>
                            )}
                            <button
                            onClick={() => handleTaskAction(task.id, 'delete')}
                            disabled={loading}
                            className={`${styles.actionButton} ${styles.deleteButton}`}
                            >
                            <i className="fas fa-trash"></i> Usuń 
                            </button>
                        </div>
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
            <Footer/>
        </div>
    );
};

export default OrganisationTaskManagement;