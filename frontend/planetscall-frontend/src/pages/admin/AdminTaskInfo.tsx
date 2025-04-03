import React, { useEffect, useState } from 'react'
import Footer from '../../components/Footer/Footer'
import Header from '../../components/shared/Header'
import { getOrganisationVerifications, sentResponseToOrganisationVerification, createTemplateTask, getAllTemplateTasks, activateTemplateTask, deleteTemplateTask, TaskTemplate, TaskType, getTemplateTaskById  } from '../../services/adminOrgService';
import { useAuth } from '../../context/AuthContext';
import { Organisation } from '../community/communityTypes';
import { Link, useNavigate, useParams } from 'react-router-dom';

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
        return (
            <div>
                <Header/>
                <p style={{ color: 'red' }}>Nie masz uprawnień administratora.</p>
                <Footer/>
            </div>
        );  
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
    <div className="app-container">
      <Header/>

      <section className="blockCode">        
        {loading ? (
            <p>Ładowanie...</p>
            ) : (
            <>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                {success && <p style={{ color: 'green' }}>{success}</p>}
                {task && (
                <div>
                    <h2>{task.title}</h2>
                    <p>{task.description}</p>   
                    <p>Punkty: {task.reward}</p>
                    <p>Typ: {getTypeName(task.type)}</p>
                    <button><Link to={`/admin/organisations/task/${taskId}/settings`}>Edytuj ustawienia</Link></button>
                    <p>Status: {task.isActive ? 'Aktywne' : 'Nieaktywne'}</p>
                    <div>
                        <button
                            onClick={() => task.id && handleTaskAction(task.id, 'activate')}
                            disabled={loading || task.isActive}
                        >
                            Aktywuj
                        </button>
                        <button
                            onClick={() => task.id && handleTaskAction(task.id, 'delete')}
                            disabled={loading}
                            style={{ backgroundColor: '#ff4444' }}
                        >
                            Usuń
                        </button>
                    </div>
                </div>
                )}
            </>
            )}

      </section>
      <Footer/>
    </div>
  )
}

export default AdminTaskInfo
