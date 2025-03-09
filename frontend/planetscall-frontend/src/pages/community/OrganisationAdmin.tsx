import React, { useState, useEffect } from 'react'
import Header from '../../components/shared/Header'
import Footer from '../../components/Footer/Footer'
import { useAuth } from '../../context/AuthContext';
import { Member, Organisation } from './communityTypes';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getOrganisationData, getOrganisationRoles, getOrganisationUsers, getOrganisationRequests, acceptOrganisationRequest, rejectOrganisationRequest, removeOrganisationUser } from '../../services/communityService';




const OrganisationAdmin = () => {
    const { user, isAuthenticated, token } = useAuth();
    const [organisation, setOrganisation] = useState<any>();
    const [organisationRoles, setOrganisationRoles] = useState<any>(null);
    const [users, setUsers] = useState<Member[]>([]);
    const [requestList, setRequestList] = useState<Member[]>([]);


    const { organisationUniqueName } = useParams<{ organisationUniqueName: string }>();

    const [loading, setLoading] = useState<boolean>(false);
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
                setUsers(request);

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

    </div>);   
  }

//   if(organisation?.creatorId!=user?.id){
//     navigate('/profile/');
//   } 

const handleAcceptRequest = async (userId: number) =>{
    
        try {
          const authToken = token || '';
    
          if (!userId || !organisationUniqueName) {
            alert('Nie można zaakceptować błędne dane użytkownika');
            return;
          }
            
          const response = await acceptOrganisationRequest(authToken, organisationUniqueName, userId);
    
        } catch (err: any) {
          alert(err.message || 'Nie udało się zaakceptować prośby');
        }
}

const handleDeleteRequest = async (userId: number) =>{
    
    try {
        const authToken = token || '';
  
        if (!userId || !organisationUniqueName) {
          alert('Nie można usunąc błędne dane użytkownika');
          return;
        }
          
        const response = await rejectOrganisationRequest(authToken, organisationUniqueName, userId);
  
      } catch (err: any) {
        alert(err.message || 'Nie udało się usunąć prośby');
      }
}
const handleDeleteUser = async (userId: number) =>{
    
    try {
        const authToken = token || '';
  
        if (!userId || !organisationUniqueName) {
          alert('Nie można usunąc błędne dane użytkownika');
          return;
        }
          
        const response = await removeOrganisationUser(authToken, organisationUniqueName, userId);
  
      } catch (err: any) {
        alert(err.message || 'Nie udało się usunąć użytkownika');
      }
}
  return (
    <div>
        <Header/>
        <p>{organisation?.isPrivate}</p>
        <section className="blockCode">
            
      {loading ? (
          <p>Ładowanie...</p>
        ) : (
            <div>
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
                                    onClick={() => handleAcceptRequest(us.id)} 
                                />
                                <input
                                    type="button"
                                    value="Odrzuć"
                                    onClick={() => handleDeleteRequest(us.id)}
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
