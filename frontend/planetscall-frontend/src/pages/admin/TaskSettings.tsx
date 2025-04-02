import React, { useEffect, useState } from 'react'
import Footer from '../../components/Footer/Footer'
import Header from '../../components/shared/Header'
import { getOrganisationVerifications, sentResponseToOrganisationVerification, createTemplateTask, getAllTemplateTasks, activateTemplateTask, deleteTemplateTask, TaskTemplate, TaskType, getTemplateTaskById, updateTemplateTask, TaskTemplateUpdate  } from '../../services/adminOrgService';
import { useAuth } from '../../context/AuthContext';
import { Link, useNavigate, useParams } from 'react-router-dom';

const TaskSettings = () => {
    const { user, isAuthenticated, token } = useAuth();
    const [loading, setLoading] = useState<boolean>(false);
    const [success, setSuccess] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [task, setTask] = useState<TaskTemplate>();
    const { taskId } = useParams<{ taskId: string }>();
    const [formData, setFormData] = useState<Partial<TaskTemplateUpdate>>({});
    const navigate = useNavigate();


/*
  useEffect(() => {
    if (user) {
    }
  }, [user]);
*/
    
    useEffect(() => {
        if (token && user?.isAdmin && taskId) {
            const fetchData = async () => {  
                try {
                    setLoading(true);
                    const taskData = await getTemplateTaskById(token, taskId);
                    setTask(taskData);
                    setFormData({
                      title: taskData.title || '',
                      description: taskData.description || '',
                      reward: taskData.reward || 0,
                      type: taskData.type ?? 0,
                      isGroup: taskData.isGroup ?? false,
                    });
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
  
 const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
        const checkbox = e.target as HTMLInputElement;
        const isChecked = checkbox.checked;

        setFormData(prevData => ({
            ...prevData,
            [name]: isChecked,
        }));
    } else {
        setFormData(prevData => ({
            ...prevData,
            [name]: value,
        }));
    }
};

const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated || !taskId) {
        alert('Musisz być zalogowany.');
        return;
    }

    try {
        setLoading(true);
        await updateTemplateTask(token!, taskId, formData);
        sessionStorage.setItem('successInfo', "Pomyślnie zaaktulizowane dane.");
        navigate(`/admin/organisations/task/${taskId}`); 
        setError(null);
    } catch (err: any) {
        setError(err.message || 'Failed to update organisation settings.');
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

  

  return (
    <div>
      <Header/>

      <section className="blockCode">        
        {loading ? (
            <p>Ładowanie...</p>
            ) : (
            <>
                {success && <p style={{ color: 'green' }}>{success}</p>}
                {error && <p style={{ color: 'red' }}>{error}</p>}
                {task && (
                        <div>
                            <form onSubmit={handleSubmit}>
                        <div>
                            <label>Nazwa:</label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div>
                            <label>Opis:</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div>
                            <label>Nagroda:</label>
                            <input
                                type="number"
                                name="reward"
                                value={formData.reward || 0}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div>
                            <label>
                                <input
                                    type="checkbox"
                                    name="isGroup"
                                    checked={formData.isGroup || false}
                                    onChange={handleInputChange}
                                />
                                Grupowe
                            </label>
                        </div>                        
                        <div>
                        <label>Typ:</label>
                        <select
                            name="type"
                            value={formData.type}
                            onChange={handleInputChange}
                        >
                        <option value={1}>Łatwe (dzienne)</option>
                        <option value={2}>Trudne (tygodniowe)</option>
                        <option value={3}>Organizacyjne</option>
                        </select>
                        </div>
                        <button type="submit" disabled={loading}>
                            {loading ? 'Zapisywanie...' : 'Zapisano'}
                        </button>
                    </form>
                </div>
                )}
            </>
            )}

      </section>
      <Footer/>
    </div>
  )
}

export default TaskSettings
