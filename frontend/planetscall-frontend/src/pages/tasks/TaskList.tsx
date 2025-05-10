import React, { useEffect, useState } from 'react';
import Header from '../../components/shared/Header';
import { useAuth } from '../../context/AuthContext';
import { getTasks, getCompletedTasks, CompletedTask, Task, OverwatchTaskItem  } from '../../services/taskService';
import { Link } from 'react-router-dom';
import Footer from '../../components/Footer/Footer';
import { TaskType } from '../../services/adminOrgService';
import styles from '../../stylePage/task/task.module.css';
import NotAuthenticated from '../Additional/NotAuthenticated';
import { PaginationResponse } from '../../services/headers';
import { imageUrl } from '../../services/imageConvert';

const TaskList = () => {
  const { isAuthenticated, token } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [completedTasks, setCompletedTasks] = useState<OverwatchTaskItem[]>([]);
  const [typeFilters, setTypeFilters] = useState<TaskType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'available' | 'completed'>('available');
  const [pagination, setPagination] = useState({
      pageIndex: 1,
    hasNextPage: false,
    hasPreviousPage: false,
    totalPages: 1,
  });
  const [currentPage, setCurrentPage] = useState<number>(1); 

  useEffect(() => {
    if (!isAuthenticated || !token) return;

    const fetchTasks = async () => {
      try {
        setLoading(true);
        if (activeTab === 'available') {
          const availableTasks = await getTasks(token);
          setTasks(availableTasks);
        } else {
          const response = await getCompletedTasks(token);
          setCompletedTasks(response.items);
          setPagination({
              pageIndex: response.pageIndex,
              totalPages: response.totalPages,
              hasPreviousPage: response.hasPreviousPage,
              hasNextPage: response.hasNextPage
          });
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


  const goToPage = (page: number) => {
      if (page >= 1 && page <= (pagination?.totalPages || 1)) {
          setCurrentPage(page);
      }
  };


  const toggleTypeFilter = (type: TaskType) => {
    setTypeFilters(prev => 
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };
  
  const filteredTasks = tasks.filter(task => {
    
    const matchesType =
      typeFilters.length === 0 || typeFilters.includes(task.type);
  
    return matchesType;
  });
  
  

  if (!isAuthenticated) {
    return (<NotAuthenticated/>
    );   
}

return (
  <div className="app-container dark-theme">
    <Header />
    <section className={styles.taskContainer}>
      <div className={styles.taskContent}>
          <div className={styles.headerSection}>
            <h2 className={styles.searchTitle}>Zadania</h2>
        <Link to="/community" className={styles.backButton}>
          <i className="fas fa-arrow-left"></i> Powrót
        </Link>
          </div>
        
        <div className={styles.taskTabs}>
          <button 
            className={`${styles.taskTab} ${activeTab === 'available' ? 'active' : ''}`}
            onClick={() => setActiveTab('available')}
          >
            <i className="fas fa-tasks"></i> Dostępne zadania
          </button>
          <button 
            className={`${styles.taskTab} ${activeTab === 'completed' ? 'active' : ''}`}
            onClick={() => setActiveTab('completed')}
          >
            <i className="fas fa-check-circle"></i> Wykonane zadania
          </button>
        </div>

        {error && <div className={`${styles.taskMessage} ${styles.taskError}`}>{error}</div>}

        {loading ? (
          <p>Ładowanie...</p>
        ) : activeTab === 'available' ? (
          tasks.length > 0 ? (<>
            <h3 className={styles.taskListTitle}>Lista zadań szablonowych</h3>
            <div className={styles.taskFilters}>
              <div className={styles.filterGroup}>
                <button
                  className={`${styles.filterButton} ${typeFilters.includes(1) ? styles.active : ''}`}
                  onClick={() => toggleTypeFilter(1)}
                >
                  Łatwe
                </button>
                <button
                  className={`${styles.filterButton} ${typeFilters.includes(2) ? styles.active : ''}`}
                  onClick={() => toggleTypeFilter(2)}
                >
                  Trudne
                </button>
                <button
                  className={`${styles.filterButton} ${typeFilters.includes(3) ? styles.active : ''}`}
                  onClick={() => toggleTypeFilter(3)}
                >
                  Organizacyjne
                </button>
              </div>
          </div>
            <div className={styles.taskList}>
              {filteredTasks.map(task => (
                <div key={task.id} className={styles.taskCard}>
                  <Link to={`/task/${task.id}`} className={styles.taskCardTitle}>
                    <h3>{task.title}</h3>
                  </Link>
                  <p className={styles.taskCardDescription}>{task.description}</p>
                  <div className={styles.taskCardMeta}>
                    <span className={styles.taskReward}>
                      <i className="fas fa-star"></i> {task.reward} punktów
                    </span>
                    <span className={styles.taskCardMetaItem}>
                      <i className="fas fa-tag"></i> {getTaskTypeName(task.type)}
                    </span>
                    <span className={styles.taskCardMetaItem}>
                      <i className={task.isGroup ? 'fas fa-users' : 'fas fa-user'}></i>
                      {task.isGroup ? 'Grupowe' : 'Indywidualne'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            </>
          ) : (
            <div className={styles.taskEmpty}>
              <i className="fas fa-tasks"></i>
              <p>Brak dostępnych zadań</p>
            </div>
          )
        ) : (
          completedTasks.length > 0 ? (
            <>
            <div className={styles.taskList}>
              {completedTasks.map(taskInfo => (
                <div key={taskInfo.task.id} className={styles.taskCard}>
                  <Link to={`/task/${taskInfo.task.id}`} className={styles.taskCardTitle}>
                    <h3>{taskInfo.task.title}</h3>
                  </Link>
                  <p className={styles.completedTaskDate}>
                    <i className="fas fa-calendar-check"></i> Wykonano: {new Date(taskInfo.completedAt).toLocaleDateString()}
                    <i className="fas fa-calendar-check"></i> Sprawdzono: {new Date(taskInfo.checkedAt).toLocaleDateString()}
                  </p>
                  <div className={styles.taskCardMeta}>
                    <span className={styles.taskReward}>
                      <i className="fas fa-star"></i> {taskInfo.task.reward} punktów
                    </span>
                  </div>
                  {taskInfo.proof && (
                    <a 
                      href={imageUrl() + taskInfo.proof} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className={styles.taskProof}
                    >
                      <i className="fas fa-eye"></i> Spójrz
                    </a>
                  )}
                </div>
              ))}     
            </div>
            {pagination && pagination.totalPages!=1 && (
                      <div className={styles.adminPagination}>
                          <button 
                              onClick={() => goToPage(currentPage - 1)} 
                              disabled={!pagination.hasPreviousPage}
                              className={styles.adminPaginationButton}
                          >
                              Poprzednia
                          </button>
                          
                          <span>
                              Strona {pagination.pageIndex} z {pagination.totalPages}
                          </span>
                          
                          <button 
                              onClick={() => goToPage(currentPage + 1)} 
                              disabled={!pagination.hasNextPage}
                              className={styles.adminPaginationButton}
                          >
                              Następna
                          </button>
                      </div>
                  )}
            </>
          ) : (
            <div className={styles.taskEmpty}>
              <i className="fas fa-tasks"></i>
              <p>Nie masz jeszcze wykonanych zadań</p>
            </div>
          )
        )}
      </div>
    </section>
    <Footer />
  </div>
);
};

export default TaskList;