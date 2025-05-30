import React, { useState, useEffect } from 'react'
import Header from '../../../components/shared/Header';
import Footer from '../../../components/Footer/Footer';
import { useAuth } from '../../../context/AuthContext';
import { Member, Organisation } from '../../community/communityTypes';
import { Link, useNavigate, useParams } from 'react-router-dom';
import styles from '../../../stylePage/organisation/organisationAdmin.module.css';
import { getOrganisationData, getOrganisationRoles,
   getOrganisationUsers, getOrganisationRequests,
    acceptOrganisationRequest, rejectOrganisationRequest,
     removeOrganisationUser, sentVerificationRequest,
     deleteOrganisation } from '../../../services/communityService';
import { imageUrl } from '../../../services/imageConvert';
import NotAdmin from '../../Additional/NotAdmin';
import Loading from '../../Additional/Loading';




const OrganisationAdmin = () => {
    const { user, isAuthenticated, token } = useAuth();
    const [organisation, setOrganisation] = useState<Organisation>();
    const [organisationRoles, setOrganisationRoles] = useState<any>(null);
    const [users, setUsers] = useState<Member[]>([]);
    const [requestList, setRequestList] = useState<Member[]>([]);
    const [requestSent, setRequestSent] = useState<boolean>(false);
    const [verificationMessage, setVerificationMessage] = useState('');
    const [showVerificationModal, setShowVerificationModal] = useState(false);


    const { organisationUniqueName } = useParams<{ organisationUniqueName: string }>();
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

    const [loading, setLoading] = useState<boolean>(false);
    const [loadingForm, setLoadingForm] = useState<boolean>(false);
    const [success, setSuccess] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();


    { /* Get data about organisation data, users, roles for users and also request of joining if organisation is private */} 
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
  }, [token, organisationUniqueName, requestSent]);



  if (!isAuthenticated) {
    return (<div>
      <Header/>
      <p style={{ color: 'red' }}>Użytkownik nie jest zalogowany.</p>
      <Footer/>

    </div>);   
  }

  if(organisation?.creatorId!=user?.id){
    return (<NotAdmin/>);  
  } 

{ /* Accepting request from user to join organisation if its private */} 
const handleAcceptRequest = async (userId: number) =>{
        if (!isAuthenticated || !token) return;
        setLoadingForm(true);
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
          setLoadingForm(false);
        }
}

{ /* Decline request from user to join organisation if its private */} 
const handleDeleteRequest = async (userId: number) =>{
  if (!isAuthenticated || !token) return;
  setLoadingForm(true);
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
        setLoadingForm(false);
      }
}

{ /* Delete user from organisation */}
const handleDeleteUser = async (userId: number) =>{
      if (!isAuthenticated || !token) return;
      setLoadingForm(true);
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
        setLoadingForm(false);
      }
}

{ /* Sent Request to verify organisation to main admin */}
const handleSentRequestToVerify = async () =>{
  if (!isAuthenticated || !token) return;
  setLoadingForm(true);
  setError(null);
  setSuccess(null);
  setShowVerificationModal(false);

  try {
    if(!organisationUniqueName) {
      alert('Nie można usunąc błędne dane użytkownika');
      return;
    }
    const authToken = token || '';
    await sentVerificationRequest(authToken, organisationUniqueName, verificationMessage);
    setSuccess('Prośba o weryfikację została wysłana!');
    setVerificationMessage('');


  } catch (err: any) {
    if(err.message == "Request was already sent"){
    setSuccess('Prośba o weryfikację została już wysłana!');
      setRequestSent(true);
    }
    setError(err.message);
  } finally {
    setLoadingForm(false);
  }
}


{ /* Delete organisation */}
const handleDeleteOrganisation = async () =>{
  if (!isAuthenticated || !token) return;
  setShowDeleteConfirmation(false);
  setLoadingForm(true);
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
    setLoadingForm(false);
  }
}

return (
  <div className="app-container dark-theme">
    <Header />
    <section className={styles.adminContainer}>
      
      {loading ? (
        <Loading/>
      ) : (
        <div className={styles.adminContent}>
          <div className={styles.adminHeader}>
            <h1>Zarządzanie organizacją</h1>
            <button
              className={styles.dangerButton}
              onClick={() => setShowDeleteConfirmation(true)}
              disabled={loadingForm}
            >
              Usuń Organizację
            </button>
          </div>
          {success && <div className={styles.successMessage}>{success}</div>}
          {error && <div className={styles.errorMessage}>{error}</div>}

          <div className={styles.adminNav}>
            <Link 
                to={`/community/organisation/${organisationUniqueName}`} 
                className={styles.backButton}
              >
              <i className="fas fa-arrow-left"></i> Powrót
            </Link>
            <Link 
              to={`/community/organisation/${organisationUniqueName}/settings`}
              className={`${styles.backButton} ${styles.right}`}
            >
              Ustawienia
            </Link>
            <Link 
              to={`/community/organisation/${organisationUniqueName}/tasks`}
              className={styles.backButton}
            >
              Zadania
            </Link>
          </div>

          {(!organisation?.isVerified && !requestSent) && (
            <>
                <button
              className={`${styles.primaryButton} ${styles.backButton}`}
                    onClick={() => setShowVerificationModal(true)}
                    disabled={loadingForm}
                >
                    Wyślij prośbę o weryfikację organizacji
                </button>
            </>
          )}

          { /* If organisation is private it shows a request list of users */}
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
                          disabled={loadingForm}
                        >
                          Zaakceptuj
                        </button>
                        <button
                          className={`${styles.actionButton} ${styles.rejectButton}`}
                          onClick={() => handleDeleteRequest(us.id)}
                          disabled={loadingForm}
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

          { /* Show members of the organisation */}
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
                        disabled={loadingForm}
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

    {showVerificationModal && (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <h2 className={styles.modalTitle}>Prośba o weryfikację</h2>
                <p>Wpisz wiadomość do administratora (opcjonalnie):</p>
                <textarea
                    value={verificationMessage}
                    onChange={(e) => setVerificationMessage(e.target.value)}
                    className={styles.formTextarea}
                    rows={4}
                    placeholder="Dlaczego Twoja organizacja powinna zostać zweryfikowana?"
                />
                <div className={styles.modalButtons}>
                    <button
                        className={`${styles.actionButton} ${styles.modalCancelButton}`}
                        onClick={() => {
                            setShowVerificationModal(false);
                            setVerificationMessage('');
                        }}
                    >
                        Anuluj
                    </button>
                    <button
                        className={`${styles.actionButton} ${styles.primaryButton}`}
                        onClick={handleSentRequestToVerify}
                        disabled={loadingForm}
                    >
                        {loadingForm ? 'Wysyłanie...' : 'Wyślij prośbę'}
                    </button>
                </div>
            </div>
        </div>
    )}

    { /* Confirmation if admin of organisation wants delete organisation  */}
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
              disabled={loadingForm}
            >
              {loadingForm ? 'Usuwanie...' : 'Usuń organizację'}
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
