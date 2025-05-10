import React, { useEffect, useState } from 'react'
import Footer from '../../components/Footer/Footer'
import Header from '../../components/shared/Header'
import { getOrganisationVerifications, sentResponseToOrganisationVerification, createTemplateTask, getAllTemplateTasks, activateTemplateTask, deleteTemplateTask, TaskTemplate, TaskType  } from '../../services/adminOrgService';
import { useAuth } from '../../context/AuthContext';
import { Organisation } from '../community/communityTypes';
import { Link, useNavigate } from 'react-router-dom';
import styles from '../../stylePage/admin/adminUser.module.css';
import NotAdmin from '../Additional/NotAdmin';
import NotAuthenticated from '../Additional/NotAuthenticated';
import { imageUrl } from '../../services/imageConvert';

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
              ) : organisations.length > 0 ? (
                <div className={styles.usersList}>
                {success && <div className={styles.successMessage}>{success}</div>}
                {error && <p className={styles.errorMessage}>{error}</p>}
                  {organisations.map((org) => (
                    <div className={styles.orgCard}>
                    <div key={org.id}  className={styles.userCard}>
                      <Link 
                        to={`/community/organisation/${org.organisation.uniqueName}`} 
                        className={styles.adminListItemLink}
                      >
                        <div className={styles.avatarContainer}>
                          {org.organisation.organizationLogo ? (
                            <img
                              src={imageUrl() + org.organisation.organizationLogo}
                              alt={`Logo ${org.organisation.name}`}
                              className={styles.avatarImage}
                            />
                          ) : (
                            <div className={styles.organisationAvatarPlaceholder}>
                              <i className="fas fa-building"></i>
                            </div>
                          )}
                        </div>
                      </Link>
                      <div className={styles.userInfo}>
                      <Link 
                        to={`/community/organisation/${org.organisation.uniqueName}`} 
                        className={styles.adminListItemLink}
                      >
                        <div className={styles.nameSection}>
                          <h3 className={styles.username}>
                            {org.organisation.name}
                          </h3>
                          <p className={styles.fullName}>@{org.organisation.uniqueName}</p>
                        </div>
                      </Link>

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

                        {org.description && (
                          <div className={styles.organisationDescriptionToggle}>
                            <button 
                              onClick={() => toggleDescription(org.id)}
                              className={`${styles.adminButton} ${styles.adminButtonShow}`}
                            >
                              <i className={`fas fa-${expandedDescriptions[org.id] ? 'chevron-up' : 'chevron-down'}`}></i>
                              {expandedDescriptions[org.id] ? 'Ukryj opis' : 'Pokaż opis'}
                            </button>
                          </div>
                        )}
                        </div>
                      </div>
                    </div>

                        {org.description && (
                          <div>
                            {expandedDescriptions[org.id] && (
                              <p className={styles.organisationDescriptionText}>
                                {org.description}
                              </p>
                            )}
                          </div>
                        )}
                    </div>
                  ))}
                </div>
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