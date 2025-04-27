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

interface exportOverwatchVerification {
    verificationId: number,
    reaction: boolean,
    message: string | null,
}

const AdminVerificationInfo = () => {
    const { user, isAuthenticated, token } = useAuth();
    const [loading, setLoading] = useState<boolean>(false);
    const [success, setSuccess] = useState<string | null>(sessionStorage.getItem('successInfo'));
    const [error, setError] = useState<string | null>(null);
    const [verification, setVerification] = useState<OverwatchTaskItem>();
    const { verificationId } = useParams<{ verificationId: string }>();
    const [formData, setFormData] = useState<exportOverwatchVerification>({
        verificationId: 0,
        reaction: false,
        message: "",
    });
    
    const navigate = useNavigate();

    sessionStorage.setItem('successInfo', "");
    
    useEffect(() => {
        if (token && user?.isAdmin && verificationId) {
            const fetchData = async () => {  
                try {
                    setLoading(true);
                    const taskData = await getOverwatchSpecificFeed(token, verificationId);
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
    }, [token, user?.isAdmin, verificationId]);
  


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

    const handleOverwatchReaction = async (id: number, action: boolean) => {
              if (!token) return;
              
              setLoading(true);
              setError(null);
              setSuccess(null);
              setFormData({
                verificationId: id,
                reaction: action,
                message: "",
            });

              try {
                await addOverwatchReaction(token, formData);
      
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
              ) : error ? (
                <div className="error-message">{error}</div>
              ) : verification ? (
                <>
                  <div className={styles.taskInfoHeader}>
                    <div>
                      <h1 className={styles.taskInfoTitle}>{verification.insector?.username}</h1>
                      <div className={styles.taskInfoMeta}>
                      </div>
                    </div>
                  </div>
    
                  <div className={styles.taskInfoDescription}>
                    <h3>Opis zadania</h3>
                    <p>{verification.message}</p>
                        <span className={styles.taskInfoMetaItem}>
                          <i className="fas fa-star"></i> {verification.proof} punktów
                        </span>
                  </div>
    
                  <div className={styles.taskInfoActions}>
                    <button
                      onClick={() => verification.id && handleOverwatchReaction(verification.id, true)}
                      disabled={loading || verification.isApproved}
                    >
                      <i className="fas fa-power-off"></i> Potwierdź
                    </button>
                    <button
                      onClick={() => verification.id && handleOverwatchReaction(verification.id, false)}
                      disabled={loading}
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
