import React, { useEffect, useState } from 'react'
import Footer from '../../components/Footer/Footer'
import Header from '../../components/shared/Header'
import { getOrganisationVerifications, sentResponseToOrganisationVerification, createTemplateTask, getAllTemplateTasks, activateTemplateTask, deleteTemplateTask, TaskTemplate, TaskType  } from '../../services/adminOrgService';
import { useAuth } from '../../context/AuthContext';
import { Organisation } from '../community/communityTypes';
import { Link, useNavigate } from 'react-router-dom';
import styles from '../../stylePage/admin/admin.module.css';
import NotAdmin from '../Additional/NotAdmin';
import NotAuthenticated from '../Additional/NotAuthenticated';

interface OrganisationVerification {
  description:string,
  id : number,
  organisation: Organisation,
}

const AdminOrganisations = () => {
    const { user, isAuthenticated, token } = useAuth();
    
    const [loading, setLoading] = useState<boolean>(false);
    const [organisations, setOrganisations] = useState<OrganisationVerification[]>([]);
    const [expandedDescriptions, setExpandedDescriptions] = useState<Record<number, boolean>>({});
    const [success, setSuccess] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    
    useEffect(() => {
        if (token && user?.isAdmin) {
            const fetchData = async () => {  
                try {
                    setLoading(true);
                    const org = await getOrganisationVerifications(token);
                    console.log(org);
                    setOrganisations(org);
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
  
    const toggleDescription = (id: number) => {
        setExpandedDescriptions(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };
  

    if (!isAuthenticated) {
        return (<NotAuthenticated/>);   
    }

    if(!user?.isAdmin){
      return (<NotAdmin/>) 
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
            setOrganisations(org);
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
              ) : organisations.length > 0 ? (
                <ul className={styles.adminList}>
                  {organisations.map((org) => (
                    <li key={org.id} className={styles.adminListItem}>
                      <div className={styles.adminListItemContent}>
                        <Link 
                          to={`/community/organisation/${org.organisation.uniqueName}`} 
                          className={styles.adminListItemLink}
                        >
                          {org.organisation.name}
                        </Link>
                        <span>@{org.organisation.uniqueName}</span>
                      </div>
                      
                      {org.description && (
                        <div className={styles.adminDescriptionContainer}>
                          <button 
                            onClick={() => toggleDescription(org.id)}
                            className={styles.adminShowMoreButton}
                          >
                            <i className={`fas fa-${expandedDescriptions[org.id] ? 'chevron-up' : 'chevron-down'}`}></i>
                            {expandedDescriptions[org.id] ? 'Pokaż mniej' : 'Pokaż więcej'}
                          </button>
                          {expandedDescriptions[org.id] && (
                            <p className={styles.adminDescriptionText}>
                              {org.description}
                            </p>
                          )}
                        </div>
                      )}
                      
                      <div className={styles.adminButtonGroup}>
                        <button
                          onClick={() => handleSentResponse(org.organisation.uniqueName, "reject")}
                          disabled={loading}
                          className={`${styles.adminButton} ${styles.adminButtonDanger}`}
                        >
                          <i className="fas fa-times"></i> Odrzuć
                        </button>
                        <button
                          onClick={() => handleSentResponse(org.organisation.uniqueName, "approve")}
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