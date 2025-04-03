import React, { useEffect, useState } from 'react'
import Header from '../../components/shared/Header'
import Footer from '../../components/Footer/Footer'
import { activateTemplateTask, createTemplateTask, deleteTemplateTask, getAllTemplateTasks, TaskTemplate, TaskType } from '../../services/adminOrgService';
import { Link, useNavigate } from 'react-router-dom';
import { Organisation } from '../community/communityTypes';
import { useAuth } from '../../context/AuthContext';

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
      return (
          <div>
              <Header/>
              <p style={{ color: 'red' }}>Nie masz uprawnień administratora.</p>
              <Footer/>
          </div>
      );  
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
    <div className="app-container">
      <Header/>
      <section className="blockCode">
      {loading ? (
          <p>Ładowanie...</p>
        ) : (
          <>
            <h2>Zarządzanie zadaniami szablonowymi</h2>
                
                <div className="create-task-form">
                    <h3>Utwórz nowe zadanie</h3>
                    <form onSubmit={handleTaskSubmit}>
                        <div>
                            <label>Tytuł:</label>
                            <input
                                type="text"
                                value={newTask.title}
                                onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                                required
                            />
                        </div>
                        <div>
                            <label>Opis:</label>
                            <textarea
                                value={newTask.description}
                                onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                                required
                            />
                        </div>
                        <div>
                            <label>Nagroda (punkty):</label>
                            <input
                                type="number"
                                value={newTask.reward}
                                onChange={(e) => setNewTask({...newTask, reward: Number(e.target.value)})}
                                required
                            />
                        </div>
                        <div>
                            <label>Typ zadania:</label>
                            <select
                                value={newTask.type}
                                onChange={(e) => setNewTask({...newTask, type: Number(e.target.value) as TaskType})}
                                required
                            >
                                <option value={1}>Łatwe (dzienne)</option>
                                <option value={2}>Trudne (tygodniowe)</option>
                                <option value={3}>Organizacyjne</option>
                            </select>
                        </div>
                        <div>
                            <label>
                                <input
                                    type="checkbox"
                                    checked={newTask.isGroup}
                                    onChange={(e) => setNewTask({...newTask, isGroup: e.target.checked})}
                                />
                                Zadanie grupowe
                            </label>
                        </div>
                        <button type="submit" disabled={loading}>
                            {loading ? 'Tworzenie...' : 'Utwórz zadanie'}
                        </button>
                    </form>
                </div>

                <div className="tasks-list">
                    <h3>Lista zadań szablonowych</h3>
                    {tasks.length > 0 ? (
                        <ul>
                            {tasks.map((task) => (
                                <li key={task.id}>
                                    <div>
                                        <Link to={`/admin/organisations/task/${task.id}`}><h4>{task.title}</h4></Link>
                                        
                                        <p>{task.description}</p>
                                        <p>Punkty: {task.reward}</p>
                                        <p>Typ: {getTypeName(task.type)}</p>
                                        <p>Status: {task.isActive ? 'Aktywne' : 'Nieaktywne'}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>Brak zadań szablonowych.</p>
                    )}
                </div>

          </>
        )}
      </section>
      <Footer/>
    </div>
  )
}

export default AdminTasks
