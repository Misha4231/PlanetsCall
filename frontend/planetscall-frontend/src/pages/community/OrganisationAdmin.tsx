import React, { useState, useEffect } from 'react'
import Header from '../../components/shared/Header';
import Footer from '../../components/Footer/Footer';
import { useAuth } from '../../context/AuthContext';
import { Member, Organisation } from './communityTypes';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getOrganisationData, getOrganisationRoles,
   getOrganisationUsers, getOrganisationRequests,
    acceptOrganisationRequest, rejectOrganisationRequest,
     removeOrganisationUser, sentVerificationRequest,
     deleteOrganisation } from '../../services/communityService';




const OrganisationAdmin = () => {
    const { user, isAuthenticated, token } = useAuth();
    const [organisation, setOrganisation] = useState<Organisation>();
    const [organisationRoles, setOrganisationRoles] = useState<any>(null);
    const [users, setUsers] = useState<Member[]>([]);
    const [requestList, setRequestList] = useState<Member[]>([]);


    const { organisationUniqueName } = useParams<{ organisationUniqueName: string }>();

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
    setSuccess('Użytkownik usunięty pomyślnie!');
    navigate('/community/');

  } catch (err: any) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
}

  return (
    <div>
        <Header/>
        {success && <p style={{ color: 'green' }}>{success}</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <section className="blockCode">
            
      {loading ? (
          <p>Ładowanie...</p>
        ) : (
            <div>
              <Link to={`/community/organisation/${organisationUniqueName}/settings`}>Ustawienia</Link>
              <Link to={`/community/organisation/${organisationUniqueName}/settings/tasks`}>Zadania</Link>
            <input
                type="button"
                value="Usuń Organizacje"
                onClick={() => handleDeleteOrganisation()} disabled={loading}
              />
                {!organisation?.isVerified && (
                  <div>
                    <input
                        type="button"
                        value="Wyślij prośbę o weryfikacje organizacji"
                        onClick={() => handleSentRequestToVerify()} disabled={loading}
                      />
                    </div>
                )}

                {organisation?.isPrivate && (
                    <div>
                        <h3>Prośby do dołączenia</h3>
                        {requestList.length > 0 ? (
                            <ul>
                            {requestList.map((us) => (
                                <li key={us.id}>
                                {us.username}
                                <input
                                    type="button"
                                    value="Zaakceptuj"
                                    onClick={() => handleAcceptRequest(us.id) } disabled={loading}
                                />
                                <input
                                    type="button"
                                    value="Odrzuć"
                                    onClick={() => handleDeleteRequest(us.id)}disabled={loading}
                                />
                                </li>
                            ))}
                            </ul>
                        ) : (
                            <p>Nie ma żadnych próśb.</p>
                        )}
                        <hr/>
                        <h4>Members</h4>
                            {users.length > 0 ? (
                                <ul>
                                {users.map((member) => (
                                    <li key={member.id}>
                                    <Link to={`/user/${member.username}`}>{member.username}</Link>
                                    {member.id==user?.id ?(<div>(ty)</div>) :
                                    (<div>                                        
                                        <input
                                            type="button"
                                            value="Usuń"
                                            onClick={() => handleDeleteUser(member.id)} 
                                        />
                                    </div>)}
                                    </li>
                                ))}
                                </ul>
                            ) : (
                                <p>Nie należysz do żadnych organizacji.</p>
                            )}
                    </div>
                )}

            </div>
        )}
        </section>
        <Footer/>
      
    </div>
  )
}

export default OrganisationAdmin
