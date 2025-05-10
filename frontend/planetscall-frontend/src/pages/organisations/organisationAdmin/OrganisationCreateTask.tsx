
import React, { useEffect, useState } from 'react';
import Footer from '../../../components/Footer/Footer';
import Header from '../../../components/shared/Header';
import { useAuth } from '../../../context/AuthContext';
import { Organisation } from '../../community/communityTypes';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { 
  getOrganizationTasks,
  deleteOrganizationTask,
  createOrganizationTask,
  activateOrganizationTask,
  OrganizationTask,
  TaskType
} from '../../../services/adminOrgService';
import { getOrganisationData } from '../../../services/communityService';
import NotAdmin from '../../Additional/NotAdmin';
import styles from '../../../stylePage/organisation/organisationAdmin.module.css';
import Loading from '../../Additional/Loading';
import NotAuthenticated from '../../Additional/NotAuthenticated';

const OrganisationCreateTask = () => {
    const { user, isAuthenticated, token } = useAuth();
    const [loading, setLoading] = useState<boolean>(false);
    const [loadingForm, setLoadingForm] = useState<boolean>(false);        
      const [success, setSuccess] = useState<string | null>(null);
    const [organisation, setOrganisation] = useState<Organisation | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [newTask, setNewTask] = useState({
        title: '',
        description: '',
        isGroup: false,
    });    
    const { organisationUniqueName } = useParams<{ organisationUniqueName: string }>();
    const navigate = useNavigate();

    
    { /* Get organisation data and tasks */} 
    useEffect(() => {
        if (token && organisationUniqueName) {
            const fetchData = async () => {  
                try {
                    setLoading(true);

                    const orgData = await getOrganisationData(token, organisationUniqueName);
                    setOrganisation(orgData);
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

    { /* Function to create task */}
    const handleTaskSubmit= async (e: React.FormEvent) => {
        e.preventDefault();
        if (!token || !organisationUniqueName) {
            setError('Brak tokenu lub nazwy organizacji');
            return;
        }
        
        { /* Validation of requirement fields */} 
        if (!newTask.title || !newTask.description) {
        setError('Tytuł i opis są wymagane.');
        return;
        }
        
        try {
            setLoadingForm(true);
            setError(null);
            setSuccess(null);
            const taskToSend = {
                title: newTask.title,
                description: newTask.description,
                isGroup: newTask.isGroup
            };
                      
            await createOrganizationTask(token,organisationUniqueName, taskToSend);
            setSuccess('Nowe zadanie zostało pomyślnie utworzone!');
            setTimeout(() => navigate(`/community/organisation/${organisationUniqueName}/admin`), 1000);
            
        } catch (err: any) {
            setError(err.message || 'Wystąpił błąd podczas tworzenia zadania');
        } finally {
            setLoadingForm(false);
        }
    };

    return (
      <div className="app-container dark-theme">
            <Header/>
        <section className={styles.adminContainer}>
            <div className={styles.adminContent}>
                <div className={styles.adminHeader}>
                    <h1 className={styles.taskAdminTitle}>Utwórz nowe zadanie</h1>
                    <Link to={`/community/organisation/${organisationUniqueName}/tasks`} className={styles.backButton}>
                        <i className="fas fa-arrow-left"></i> Powrót
                    </Link>
                </div>
                {success && <div className={styles.successMessage}>{success}</div>}
                {error && <p className={styles.errorMessage}>{error}</p>}
                
                <div className={styles.taskForm}>
                    <form onSubmit={handleTaskSubmit} className={styles.settingsForm}>
                        <div className={styles.formGrid}>
                            <div className={styles.formColumn}>
                                <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                                    <label className={styles.formLabel}>Tytuł:</label>
                                    <input
                                        type="text"
                                        className={styles.formInput}
                                        value={newTask.title}
                                        onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                                        required
                                        
                                    />
                                </div>                            
                                <div className={styles.formGroup}>
                                    <div className={styles.checkboxGroup}>
                                        <label className={styles.checkboxLabel}>
                                            <input
                                                type="checkbox"
                                                checked={newTask.isGroup}
                                                onChange={(e) => setNewTask({...newTask, isGroup: e.target.checked})}
                                                className={styles.checkboxInput}
                                            />
                                            <span className={styles.checkboxCustom}></span>
                                            <span className={styles.checkboxText}>Zadanie grupowe</span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <div className={styles.formColumn}>                                
                                <div className={`${styles.taskFormGroup} ${styles.fullWidth}`}>
                                    <label className={styles.formLabel}>Opis:</label>
                                    <textarea
                                        className={styles.formTextarea}
                                        value={newTask.description}
                                         onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                                         required
                                        
                                    />
                                </div>
                            </div>
                        </div>                       
                        
                        <div className={styles.formActions}>                      
                            <button 
                                type="submit" 
                                className={styles.primaryButton}
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <i className="fas fa-spinner fa-spin"></i> Tworzenie...
                                    </>
                                ) : (
                                    <>
                                        <i className="fas fa-plus"></i> Stwórz zadanie
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>   
                
            </div>
        </section>
            <Footer/>
        </div>
    );
};

export default OrganisationCreateTask;