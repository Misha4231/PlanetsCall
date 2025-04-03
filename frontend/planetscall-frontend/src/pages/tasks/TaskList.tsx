import React, { useEffect, useState } from 'react';
import Header from '../../components/shared/Header';
import { useAuth } from '../../context/AuthContext';
import { getTasks, getCompletedTasks, CompletedTask, Task  } from '../../services/taskService';
import { Link } from 'react-router-dom';
import Footer from '../../components/Footer/Footer';
import { TaskType } from '../../services/adminOrgService';

const TaskList = () => {
  const { isAuthenticated, token } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [completedTasks, setCompletedTasks] = useState<CompletedTask[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'available' | 'completed'>('available');

  useEffect(() => {
    if (!isAuthenticated || !token) return;

    const fetchTasks = async () => {
      try {
        setLoading(true);
        if (activeTab === 'available') {
          const availableTasks = await getTasks(token);
          setTasks(availableTasks);
        } else {
          const completed = await getCompletedTasks(token);
          setCompletedTasks(completed);
        }
        setError(null);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [isAuthenticated, token, activeTab]);

  const getTaskTypeName = (type: TaskType): string => {
    switch(type) {
        case 1: return 'Łatwe (dzienne)';
        case 2: return 'Trudne (tygodniowe)';
        case 3: return 'Organizacyjne';
    }
};

  return (
    <div className="app-container">
      <Header />
      <section className="blockCode">
        <h3>Zadania</h3>
        
        <div style={{ display: 'flex', marginBottom: '20px' }}>
          <button 
            onClick={() => setActiveTab('available')}
            style={{ 
              fontWeight: activeTab === 'available' ? 'bold' : 'normal',
              marginRight: '10px'
            }}
          >
            Dostępne zadania
          </button>
          <button 
            onClick={() => setActiveTab('completed')}
            style={{ 
              fontWeight: activeTab === 'completed' ? 'bold' : 'normal'
            }}
          >
            Wykonane zadania
          </button>
        </div>

        {error && <p style={{ color: 'red' }}>{error}</p>}

        {loading ? (
          <p>Ładowanie...</p>
        ) : activeTab === 'available' ? (
          tasks.length > 0 ? (
            <ul>
              {tasks.map(task => (
                <li key={task.id}>
                  <Link to={`/task/${task.id}`}>
                    <h3>{task.title}</h3>
                  </Link>
                  <p>{task.description}</p>
                  <p>Nagroda: {task.reward} punktów</p>
                  <p>Typ: {getTaskTypeName(task.type)}</p>
                  <p>{task.isGroup ? 'Zadanie grupowe' : 'Zadanie indywidualne'}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p>Brak dostępnych zadań.</p>
          )
        ) : (
          completedTasks.length > 0 ? (
            <ul>
              {completedTasks.map(task => (
                <li key={task.id}>
                  <h3>{task.title}</h3>
                  <p>Wykonano: {new Date(task.completionDate).toLocaleDateString()}</p>
                  <p>Nagroda: {task.reward} punktów</p>
                  {task.proofUrl && (
                    <a href={task.proofUrl} target="_blank" rel="noopener noreferrer">
                      Zobacz dowód wykonania
                    </a>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p>Nie masz jeszcze wykonanych zadań.</p>
          )
        )}
      </section>
      <Footer />
    </div>
  );
};

export default TaskList;