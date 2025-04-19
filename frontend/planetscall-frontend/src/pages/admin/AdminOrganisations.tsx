import React, { useEffect, useState } from 'react'
import Footer from '../../components/Footer/Footer'
import Header from '../../components/shared/Header'
import { getOrganisationVerifications, sentResponseToOrganisationVerification, createTemplateTask, getAllTemplateTasks, activateTemplateTask, deleteTemplateTask, TaskTemplate, TaskType  } from '../../services/adminOrgService';
import { useAuth } from '../../context/AuthContext';
import { Organisation } from '../community/communityTypes';
import { Link, useNavigate } from 'react-router-dom';
import styles from '../../stylePage/admin/admin.module.css';


const AdminOrganisations = () => {
    const { user, isAuthenticated, token } = useAuth();
    
    const [loading, setLoading] = useState<boolean>(false);
    const [organisation, setOrganisation] = useState<Organisation[]>([]);
    const [success, setSuccess] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    
    useEffect(() => {
        if (token && user?.isAdmin) {
            const fetchData = async () => {  
                try {
                    setLoading(true);
                    const org = await getOrganisationVerifications(token);
                    setOrganisation(org);
                    setError(null);
                } catch (err: any) {
                    setError(err.message);
                } finally {
                    setLoading(false);
                }
            };
            fetchData();
        }    
    }, [token, user?.isAdmin]);
  

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

    const handleSentResponse = async (organisationUniqueName: string, action: string) => {
        if (!token) return;
        setLoading(true);
        setError(null);
        setSuccess(null);
        try {
            await sentResponseToOrganisationVerification(token, organisationUniqueName, action);
            setSuccess(`Weryfikacja organizacji ${organisationUniqueName} zostało wysłana.`);

            const org = await getOrganisationVerifications(token);
            setOrganisation(org);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="app-container dark-theme">
          <Header />
          <section className={styles.adminContainer}>
            <div className={styles.adminContent}>
              <h1 className={styles.adminTitle}>Weryfikacja organizacji</h1>
                  <Link 
                    to={`/admin/`} 
                    className={styles.adminBackButton}
                  >
                    <i className="fas fa-arrow-left"></i> Powrót
                  </Link>
              
              {loading ? (
                <p>Ładowanie...</p>
              ) : error ? (
                <div className={`${styles.adminMessage} ${styles.adminError}`}>{error}</div>
              ) : organisation.length > 0 ? (
                <ul className={styles.adminList}>
                  {organisation.map((org) => (
                    <li key={org.id} className={styles.adminListItem}>
                      <div className={styles.adminListItemContent}>
                        <Link 
                          to={`/community/organisation/${org.uniqueName}`} 
                          className={styles.adminListItemLink}
                        >
                          {org.name}
                        </Link>
                        <span>@{org.uniqueName}</span>
                      </div>
                      <div className={styles.adminButtonGroup}>
                        <button
                          onClick={() => handleSentResponse(org.uniqueName, "reject")}
                          disabled={loading}
                          className={`${styles.adminButton} ${styles.adminButtonDanger}`}
                        >
                          <i className="fas fa-times"></i> Odrzuć
                        </button>
                        <button
                          onClick={() => handleSentResponse(org.uniqueName, "approve")}
                          disabled={loading}
                          className={`${styles.adminButton} ${styles.adminButtonPrimary}`}
                        >
                          <i className="fas fa-check"></i> Zaakceptuj
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className={styles.adminEmpty}>
                  <i className="fas fa-folder-open"></i>
                  <p>Brak żądań do zaakceptowania.</p>
                </div>
              )}
              
              {success && <div className={`${styles.adminMessage} ${styles.adminSuccess}`}>{success}</div>}
            </div>
          </section>
          <Footer />
        </div>
      );
};

export default AdminOrganisations