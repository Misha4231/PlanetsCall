import React, { useEffect, useState } from 'react'
import Footer from '../../../components/Footer/Footer'
import Header from '../../../components/shared/Header'
import { getOrganisationVerifications, sentResponseToOrganisationVerification, createTemplateTask, getAllTemplateTasks, activateTemplateTask, deleteTemplateTask, TaskTemplate, TaskType, getTemplateTaskById  } from '../../../services/adminOrgService';
import { useAuth } from '../../../context/AuthContext';
import { Organisation } from '../../community/communityTypes';
import { Link, useNavigate, useParams } from 'react-router-dom';
import styles from '../../../stylePage/admin/adminTask.module.css';
import NotAdmin from '../../Additional/NotAdmin';
import { addOverwatchReaction, getOverwatchSpecificFeed, OverwatchTaskItem } from '../../../services/taskService';
import { imageUrl } from '../../../services/imageConvert';

export interface exportOverwatchVerification {
    verificationId: number,
    reaction: boolean,
    message: string,
}

const AdminVerificationInfo = () => {
    const { user, isAuthenticated, token } = useAuth();
    const [loading, setLoading] = useState<boolean>(false);
    const [success, setSuccess] = useState<string | null>(sessionStorage.getItem('successInfo'));
    const [error, setError] = useState<string | null>(null);
    const [verification, setVerification] = useState<OverwatchTaskItem>();
    const { verId } = useParams<{ verId: string }>();
    const [formData, setFormData] = useState<exportOverwatchVerification>({
        verificationId: 0,
        reaction: false,
        message: "",
    });
    
    const navigate = useNavigate();

    sessionStorage.setItem('successInfo', "");
    
    useEffect(() => {
        if (token && user?.isAdmin && verId) {
            const fetchData = async () => {  
                try {
                    setLoading(true);
                    const taskData = await getOverwatchSpecificFeed(token, verId);
                    console.log(taskData);
                    setVerification(taskData);
          
                    setError(null);
                } catch (err: any) {
                    setError(err.message);
                } finally {
                    setLoading(false);
                }
            };
            fetchData();
        }    
    }, [token, user?.isAdmin, verId]);
  


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
      return (<NotAdmin/>) 
    } 

    const handleOverwatchReaction = async (data: exportOverwatchVerification) => {
              if (!token) return;
              
              setLoading(true);
              setError(null);
              setSuccess(null);

              try {
                console.log(data);
                await addOverwatchReaction(token, data);
                setSuccess('Pomyślnie dodano ocenienie');
                setTimeout(() => navigate('/admin/task/overwatch'), 1000);
      
              } catch (err: any) {
                  setError(err.message);
              } finally {
                  setLoading(false);
              }

    }


      return (
        <div className="app-container dark-theme">
          <Header />
          <section className={styles.taskAdminContainer}>
            <div className={styles.taskAdminContent}>
              
              {loading ? (
                <p>Ładowanie...</p>
              ) : verification ? (
                <>
              <div className={styles.headerSection}>
                <h2 className={styles.searchTitle}>Wykonane zadanie użytkownika {verification.executor.username}</h2>
                <div className={styles.organisationActions}>
                <Link to="/admin/task/overwatch" className={styles.backButton}>
                  <i className="fas fa-arrow-left"></i> Powrót
                </Link>
                </div>
              </div>
              {success && <div className={styles.successMessage}>{success}</div>}
              {error && <p className={styles.errorMessage}>{error}</p>}
    
                  <div className={styles.taskInfoDescription}>
                    <h3>Opis zadania</h3>
                    <p>{verification.message}</p>
                        <span className={styles.taskInfoMetaItem}>
                        {verification.proof && (
                          <div className={styles.proofPreview}>
                            {verification.proof.endsWith('.mp4') ? (
                              <video controls className={styles.proofMedia}>
                                <source src={imageUrl() + verification.proof} type="video/mp4" />
                                Twój przeglądarka nie obsługuje odtwarzacza video.
                              </video>
                            ) : (
                              <img src={imageUrl() + verification.proof} alt="Dowód" className={styles.proofMedia} />
                            )}
                          </div>
                        )}

                        </span>
                  </div>
                  <div className={styles.taskFormGroup}>
                    <textarea
                      id="message"
                      value={formData.message || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                      placeholder="Dodaj wiadomość dla wykonawcy (opcjonalne)"
                      className={styles.taskFormInput}
                    />
                  </div>
                  <div className={styles.taskInfoActions}>
                    <button
                      onClick={() => {
                        handleOverwatchReaction({
                          verificationId: parseInt(verId!),
                          reaction: true,
                          message: formData.message,
                        });
                      }}
                      disabled={loading || verification.isApproved}
                      className={`${styles.actionButton} ${styles.primaryButton}`}
                    >
                      <i className="fas fa-check"></i> Potwierdź
                    </button>
                    <button
                      onClick={() => {
                        handleOverwatchReaction({
                          verificationId: parseInt(verId!),
                          reaction: true,
                          message: formData.message,
                        });
                      }}
                      disabled={loading}
                      className={`${styles.actionButton} ${styles.deleteButton}`}
                    
                    >
                      <i className="fas fa-trash"></i> Odrzuć
                    </button>
                  </div>
                </>
              ) : (
                <div className={styles.taskEmptyState}>
                  <i className="fas fa-tasks"></i>
                  <p>Nie znaleziono do zwerifikowania</p>
                </div>
              )}
            </div>
          </section>
          <Footer />
        </div>
      )
}

export default AdminVerificationInfo
