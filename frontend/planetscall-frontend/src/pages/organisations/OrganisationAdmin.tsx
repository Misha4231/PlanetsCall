import React, { useState, useEffect } from 'react'
import Header from '../../components/shared/Header';
import Footer from '../../components/Footer/Footer';
import { useAuth } from '../../context/AuthContext';
import { Member, Organisation } from '../community/communityTypes';
import { Link, useNavigate, useParams } from 'react-router-dom';
import styles from '../../stylePage/organisation/organisationAdmin.module.css';
import { getOrganisationData, getOrganisationRoles,
   getOrganisationUsers, getOrganisationRequests,
    acceptOrganisationRequest, rejectOrganisationRequest,
     removeOrganisationUser, sentVerificationRequest,
     deleteOrganisation } from '../../services/communityService';
import { imageUrl } from '../../services/imageConvert';




const OrganisationAdmin = () => {
    const { user, isAuthenticated, token } = useAuth();
    const [organisation, setOrganisation] = useState<Organisation>();
    const [organisationRoles, setOrganisationRoles] = useState<any>(null);
    const [users, setUsers] = useState<Member[]>([]);
    const [requestList, setRequestList] = useState<Member[]>([]);


    const { organisationUniqueName } = useParams<{ organisationUniqueName: string }>();
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

    const [loading, setLoading] = useState<boolean>(false);
      const [success, setSuccess] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();


    useEffect(() => {
        if(token!=null){
        const fetchData = async () => {  
            if (!organisationUniqueName) {
                setError('Organisation unique name is missing.');
                return;
            }
            try {
                setLoading(true);
                const orgData = await getOrganisationData(token, organisationUniqueName);
                setOrganisation(orgData);

                const request = await getOrganisationRequests(token, organisationUniqueName);
                setRequestList(request);

                const userData = await getOrganisationUsers(token, organisationUniqueName);
                setUsers(userData);

                const orgRoles = await getOrganisationRoles(token, organisationUniqueName);
                setOrganisationRoles(orgRoles);
                
                setError(null);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
        }    
  }, [token, organisationUniqueName]);



  if (!isAuthenticated) {
    return (<div>
      <Header/>
      <p style={{ color: 'red' }}>Użytkownik nie jest zalogowany.</p>
      <Footer/>

    </div>);   
  }

  if(organisation?.creatorId!=user?.id){
    return (<div>
      <Header/>
      <p style={{ color: 'red' }}>Nie masz uprawnień by zarządać organizacją.</p>
      <Footer/>

    </div>);  
  } 

const handleAcceptRequest = async (userId: number) =>{
        if (!isAuthenticated || !token) return;
        setLoading(true);
        setError(null);
        setSuccess(null);
    
        try {
          const authToken = token || '';
    
          if (!userId || !organisationUniqueName) {
            alert('Nie można zaakceptować błędne dane użytkownika');
            return;
          }
            
          await acceptOrganisationRequest(authToken, organisationUniqueName, userId);
          const updatedUsers = await getOrganisationUsers(token, organisationUniqueName);
          setUsers(updatedUsers);
  
          setSuccess('Prośba zaakceptowana pomyślnie!');
    
        } catch (err: any) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
}

const handleDeleteRequest = async (userId: number) =>{
  if (!isAuthenticated || !token) return;
  setLoading(true);
  setError(null);
  setSuccess(null);
    
    try {
        const authToken = token || '';
  
        if (!userId || !organisationUniqueName) {
          alert('Nie można usunąc błędne dane użytkownika');
          return;
        }
          
        await rejectOrganisationRequest(authToken, organisationUniqueName, userId);
        setSuccess('Prośba odrzucona pomyślnie!');
  
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
}
const handleDeleteUser = async (userId: number) =>{
      if (!isAuthenticated || !token) return;
      setLoading(true);
      setError(null);
      setSuccess(null);
    
    try {
        const authToken = token || '';
  
        if (!userId || !organisationUniqueName) {
          alert('Nie można usunąc błędne dane użytkownika');
          return;
        }
          
        await removeOrganisationUser(authToken, organisationUniqueName, userId);
        setSuccess('Użytkownik usunięty pomyślnie!');
  
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
}

const handleSentRequestToVerify = async () =>{
  if (!isAuthenticated || !token) return;
  setLoading(true);
  setError(null);
  setSuccess(null);

  try {
    if(!organisationUniqueName) {
      alert('Nie można usunąc błędne dane użytkownika');
      return;
    }
    const authToken = token || '';
    await sentVerificationRequest(authToken, organisationUniqueName);


  } catch (err: any) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
}


const handleDeleteOrganisation = async () =>{
  if (!isAuthenticated || !token) return;
  setShowDeleteConfirmation(false);
  setLoading(true);
  setError(null);
  setSuccess(null);

try {
    const authToken = token || '';

    if ( !organisationUniqueName) {
      alert('Nie można usunąc');
      return;
    }
      
    const response = await deleteOrganisation(authToken, organisationUniqueName);
    console.log(response);
    setSuccess('Organizacja usunięta pomyślnie!');
    navigate('/community/');

  } catch (err: any) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
}

return (
  <div className="app-container dark-theme">
    <Header />
    <section className={styles.adminContainer}>
      {success && <div className={styles.successMessage}>{success}</div>}
      {error && <div className={styles.errorMessage}>{error}</div>}
      
      {loading ? (
        <div className={styles.loading}>Ładowanie...</div>
      ) : (
        <div className={styles.adminContent}>
          <div className={styles.adminHeader}>
            <h1>Zarządzanie organizacją</h1>
            <button
              className={styles.dangerButton}
              onClick={() => setShowDeleteConfirmation(true)}
              disabled={loading}
            >
              Usuń Organizację
            </button>
          </div>

          <div className={styles.adminNav}>
            <Link 
              to={`/community/organisation/${organisationUniqueName}/settings`}
              className={styles.adminNavLink}
            >
              Ustawienia
            </Link>
            <Link 
              to={`/community/organisation/${organisationUniqueName}/settings/tasks`}
              className={styles.adminNavLink}
            >
              Zadania
            </Link>
          </div>

          {!organisation?.isVerified && (
            <button
              className={styles.primaryButton}
              onClick={() => handleSentRequestToVerify()}
              disabled={loading}
            >
              Wyślij prośbę o weryfikację organizacji
            </button>
          )}

          {organisation?.isPrivate && (
            <>
              <h3 className={styles.sectionTitle}>Prośby o dołączenie</h3>
              {requestList.length > 0 ? (
                <ul className={styles.requestList}>
                  {requestList.map((us) => (
                    <li key={us.id} className={styles.requestItem}>
                      <div className={styles.userInfo}>
                        <div className={styles.userAvatar}>
                          {us.profileImage ? (
                            <img src={us.profileImage} alt={us.username} />
                          ) : (
                            <i className="fas fa-user"></i>
                          )}
                        </div>
                        <span className={styles.username}>{us.username}</span>
                      </div>
                      <div className={styles.actions}>
                        <button
                          className={`${styles.actionButton} ${styles.acceptButton}`}
                          onClick={() => handleAcceptRequest(us.id)}
                          disabled={loading}
                        >
                          Zaakceptuj
                        </button>
                        <button
                          className={`${styles.actionButton} ${styles.rejectButton}`}
                          onClick={() => handleDeleteRequest(us.id)}
                          disabled={loading}
                        >
                          Odrzuć
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className={styles.noItems}>Nie ma żadnych próśb.</div>
              )}
              <div className={styles.divider}></div>
            </>
          )}

          <h3 className={styles.sectionTitle}>Członkowie ({users.length})</h3>
          {users.length > 0 ? (
            <ul className={styles.memberList}>
              {users.map((member) => (
                <li key={member.id} className={styles.memberItem}>
                  <div className={styles.userInfo}>
                    <div className={styles.userAvatar}>
                      {member.profileImage ? (
                        <img src={imageUrl() + member.profileImage} alt={"Profilowe: " + member.username} />
                      ) : (
                        <i className="fas fa-user"></i>
                      )}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', minWidth: 0 }}>
                      <Link 
                        to={`/user/${member.username}`} 
                        className={styles.username}
                      >
                        {member.username}
                      </Link>
                      {member.id === user?.id && (
                        <span className={styles.youTag}>Ty</span>
                      )}
                    </div>
                  </div>
                  {member.id !== user?.id && (
                    <div className={styles.actions}>
                      <button
                        className={`${styles.actionButton} ${styles.removeButton}`}
                        onClick={() => handleDeleteUser(member.id)}
                        disabled={loading}
                      >
                        Usuń
                      </button>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <div className={styles.noItems}>Brak członków w organizacji.</div>
          )}
        </div>
      )}
    </section>

    {showDeleteConfirmation && (
      <div className={styles.modalOverlay}>
        <div className={styles.modalContent}>
          <h2 className={styles.modalTitle}>Potwierdzenie usunięcia</h2>
          <p>Czy na pewno chcesz usunąć organizację {organisation?.name}? Tej akcji nie można cofnąć.</p>
          <div className={styles.modalButtons}>
            <button
              className={`${styles.actionButton} ${styles.modalCancelButton}`}
              onClick={() => setShowDeleteConfirmation(false)}
            >
              Anuluj
            </button>
            <button
              className={`${styles.actionButton} ${styles.dangerButton}`}
              onClick={handleDeleteOrganisation}
              disabled={loading}
            >
              {loading ? 'Usuwanie...' : 'Usuń organizację'}
            </button>
          </div>
        </div>
      </div>
    )}

    <Footer />
  </div>
);
}

export default OrganisationAdmin
