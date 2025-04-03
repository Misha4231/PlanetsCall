import React, { useEffect, useState } from 'react';
import Header from '../../components/shared/Header';
import { useAuth } from '../../context/AuthContext';
import { useParams, useNavigate } from 'react-router-dom';
import { getTaskById, uploadTaskProof, Task } from '../../services/taskService';
import Footer from '../../components/Footer/Footer';
import { TaskType } from '../../services/adminOrgService';

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

  return (
    <div className="app-container">
      <Header />
      <section className="blockCode">
        {loading ? (
          <p>Ładowanie...</p>
        ) : (
          <>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {uploadSuccess && <p style={{ color: 'green' }}>Dowód wykonania zadania został przesłany!</p>}
            
            {task && (
              <div>
                <h2>{task.title}</h2>
                <p>{task.description}</p>
                <p>Nagroda: {task.reward} punktów</p>
                <p>Typ: {getTaskTypeName(task.type)}</p>
                <p>{task.isGroup ? 'Zadanie grupowe' : 'Zadanie indywidualne'}</p>
                
                <div style={{ marginTop: '20px' }}>
                  <h3>Prześlij dowód wykonania:</h3>
                  <input type="file" onChange={handleFileChange} accept="image/*,video/*" />
                  {selectedFile && (
                    <div>
                      <p>Wybrany plik: {selectedFile.name}</p>
                      <button onClick={handleSubmitProof} disabled={loading}>
                        {loading ? 'Przesyłanie...' : 'Wyślij dowód'}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </section>
      <Footer />
    </div>
  );
};

export default TaskDetails;