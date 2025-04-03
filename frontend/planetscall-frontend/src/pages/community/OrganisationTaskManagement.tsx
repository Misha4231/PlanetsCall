import React, { useEffect, useState } from 'react';
import Footer from '../../components/Footer/Footer';
import Header from '../../components/shared/Header';
import { useAuth } from '../../context/AuthContext';
import { Organisation } from '../../pages/community/communityTypes';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { 
  getOrganizationTasks,
  deleteOrganizationTask,
  createOrganizationTask,
  activateOrganizationTask,
  OrganizationTask
} from '../../services/adminOrgService';
import { getOrganisationData } from '../../services/communityService';

const OrganisationTaskManagement = () => {
    const { user, isAuthenticated, token } = useAuth();
    const [loading, setLoading] = useState<boolean>(false);
    const [success, setSuccess] = useState<string | null>(sessionStorage.getItem('successInfo'));
    const [organisation, setOrganisation] = useState<Organisation | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [tasks, setTasks] = useState<OrganizationTask[]>([]);
    const [newTask, setNewTask] = useState({
        title: '',
        description: ''
    });
    
    const { organisationUniqueName } = useParams<{ organisationUniqueName: string }>();
    const navigate = useNavigate();

    sessionStorage.setItem('successInfo', "");
    
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
        return (
            <div>
                <Header/>
                <p style={{ color: 'red' }}>Użytkownik nie jest zalogowany.</p>
                <Footer/>
            </div>
        );   
    }

    if(organisation?.creatorId!=user?.id){
        return (<div>
          <Header/>
          <p style={{ color: 'red' }}>Nie masz uprawnień by zarządać organizacją.</p>
          <Footer/>
    
        </div>);  
      } 

    const handleTaskAction = async (id: number, action: 'activate' | 'delete') => {
        if (!token || !organisationUniqueName) return;
        
        setLoading(true);
        setError(null);
        setSuccess(null);
        
        try {
            if (action === 'activate') {
                await activateOrganizationTask(token, organisationUniqueName, id);
                setSuccess('Zadanie zostało aktywowane na 3 dni!');
                const updatedTasks = await getOrganizationTasks(token, organisationUniqueName);
                setTasks(updatedTasks);
            } else {
                await deleteOrganizationTask(token, organisationUniqueName, id);
                setTasks(tasks.filter(task => task.id !== id));
                setSuccess('Zadanie zostało usunięte!');
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateTask = async () => {
        if (!token || !organisationUniqueName) {
            setError('Brak tokenu lub nazwy organizacji');
            return;
        }
        
        setLoading(true);
        setError(null);
        setSuccess(null);
        
        try {
            const createdTask = await createOrganizationTask(
                token, 
                organisationUniqueName, 
                {
                    title: newTask.title,
                    description: newTask.description
                }
            );
            
            setTasks([...tasks, createdTask]);
            setNewTask({ title: '', description: '' });
            setSuccess('Zadanie zostało utworzone!');
        } catch (err: any) {
            setError(err.message || 'Wystąpił błąd podczas tworzenia zadania');
        } finally {
            setLoading(false);
        }
    };

    const getStatusInfo = (task: OrganizationTask): string => {
        if (task.isActive && task.expiresAt) {
            return `Aktywne (wygaśnie: ${new Date(task.expiresAt).toLocaleString()})`;
        }
        return 'Nieaktywne';
    };

    return (
        <div className="app-container">
            <Header/>

            <section className="blockCode">        
                {loading ? (
                    <p>Ładowanie...</p>
                ) : (
                    <>
                        {error && <p style={{ color: 'red' }}>{error}</p>}
                        {success && <p style={{ color: 'green' }}>{success}</p>}
                        
                        <h2>Zarządzanie zadaniami organizacji</h2>
                        
                        <div>
                            <h3>Utwórz nowe zadanie</h3>
                            <div >
                                <input
                                    type="text"
                                    placeholder="Tytuł zadania"
                                    value={newTask.title}
                                    onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                                />
                            </div>
                            <div >
                                <textarea
                                    placeholder="Opis zadania"
                                    value={newTask.description}
                                    onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                                />
                            </div>
                            <button 
                                onClick={handleCreateTask} 
                                disabled={loading || !newTask.title}
                            >
                                Utwórz zadanie
                            </button>
                        </div>

                        <h3>Lista zadań</h3>
                        {tasks.length > 0 ? (
                            <div >
                                {tasks.map(task => (
                                    <div key={task.id}>
                                        <h4>{task.title}</h4>
                                        <p>{task.description}</p>
                                        <p>Status: {getStatusInfo(task)}</p>
                                        <p>Utworzono: {new Date(task.createdAt).toLocaleString()}</p>
                                        
                                        <div>
                                            <button
                                                onClick={() => handleTaskAction(task.id, 'activate')}
                                                disabled={loading || task.isActive}
                                    
                                            >
                                                Aktywuj
                                            </button>
                                            <button
                                                onClick={() => handleTaskAction(task.id, 'delete')}
                                                disabled={loading}
                                            >
                                                Usuń
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p>Brak zadań dla tej organizacji</p>
                        )}
                    </>
                )}
            </section>
            <Footer/>
        </div>
    );
};

export default OrganisationTaskManagement;