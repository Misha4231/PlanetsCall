import React, { useEffect, useState } from 'react';
import Header from '../../components/shared/Header';
import { useAuth } from '../../context/AuthContext';
import { useParams, useNavigate } from 'react-router-dom';
import { getTaskById, uploadTaskProof, Task } from '../../services/taskService';
import Footer from '../../components/Footer/Footer';
import { TaskType } from '../../services/adminOrgService';
import styles from '../../stylePage/task/task.module.css';
import NotAuthenticated from '../Additional/NotAuthenticated';

const TaskDetails = () => {
  const { taskId } = useParams<{ taskId: string }>();
  const { isAuthenticated, token } = useAuth();
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated || !token || !taskId) return;

    const fetchTask = async () => {
      try {
        setLoading(true);
        const taskData = await getTaskById(token, taskId);
        setTask(taskData);
        setError(null);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTask();
  }, [isAuthenticated, token, taskId]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmitProof = async () => {
    if (!selectedFile || !token || !taskId) return;

    try {
      setLoading(true);
      await uploadTaskProof(token, taskId, selectedFile);
      setUploadSuccess(true);
      setError(null);
      setTimeout(() => navigate('/tasks'), 2000); 
    } catch (err: any) {
      setError(err.message);
      if(err.message == "Zadanie zostału już wysłane"){
        setTimeout(() => navigate('/tasks'), 2000); 
      }
      setUploadSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  const getTaskTypeName = (type: TaskType): string => {
      switch(type) {
          case 1: return 'Łatwe (dzienne)';
          case 2: return 'Trudne (tygodniowe)';
          case 3: return 'Organizacyjne';
      }
  };

  if (!isAuthenticated) {
      return (<NotAuthenticated/>
      );   
  }

  return (
    <div className="app-container dark-theme">
      <Header />
      <section className={styles.taskContainer}>
        <div className={styles.taskContent}>
          {loading ? (
            <p>Ładowanie...</p>
          ) : (
            <>
              {error && <div className={`${styles.taskMessage} ${styles.taskError}`}>{error}</div>}
              {uploadSuccess && (
                <div className={`${styles.taskMessage} ${styles.taskSuccess}`}>
                  Dowód wykonania zadania został przesłany!
                </div>
              )}
              
              {task && (
                <div className={styles.taskDetails}>
                  <h1 className={styles.taskDetailsTitle}>{task.title}</h1>
                  <p className={styles.taskDetailsDescription}>{task.description}</p>
                  
                  <div className={styles.taskDetailsMeta}>
                    <span className={styles.taskDetailsMetaItem}>
                      <i className="fas fa-star"></i> {task.reward} punktów
                    </span>
                    <span className={styles.taskDetailsMetaItem}>
                      <i className="fas fa-tag"></i> {getTaskTypeName(task.type)}
                    </span>
                    <span className={styles.taskDetailsMetaItem}>
                      <i className={task.isGroup ? 'fas fa-users' : 'fas fa-user'}></i>
                      {task.isGroup ? 'Zadanie grupowe' : 'Zadanie indywidualne'}
                    </span>
                  </div>
                  
                  <div className={styles.taskUpload}>
                    <h3 className={styles.taskUploadTitle}>Prześlij dowód wykonania:</h3>
                    <input 
                      type="file" 
                      id="taskProof"
                      className={styles.taskUploadInput}
                      onChange={handleFileChange} 
                      accept="image/*,video/*" 
                    />
                    <label htmlFor="taskProof" className={styles.taskUploadLabel}>
                      <i className="fas fa-cloud-upload-alt"></i> Wybierz plik
                    </label>
                    
                    {selectedFile && (
                      <div className={styles.taskFileInfo}>
                        <i className="fas fa-file"></i>
                        <span>Wybrany plik: {selectedFile.name}</span>
                      </div>
                    )}
                    
                    {selectedFile && (
                      <button 
                        onClick={handleSubmitProof} 
                        disabled={loading}
                        className={styles.taskSubmitButton}
                      >
                        <i className="fas fa-paper-plane"></i>
                        {loading ? 'Przesyłanie...' : 'Wyślij dowód'}
                      </button>
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default TaskDetails;