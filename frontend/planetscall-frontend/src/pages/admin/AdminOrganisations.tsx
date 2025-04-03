import React, { useEffect, useState } from 'react'
import Footer from '../../components/Footer/Footer'
import Header from '../../components/shared/Header'
import { getOrganisationVerifications, sentResponseToOrganisationVerification, createTemplateTask, getAllTemplateTasks, activateTemplateTask, deleteTemplateTask, TaskTemplate, TaskType  } from '../../services/adminOrgService';
import { useAuth } from '../../context/AuthContext';
import { Organisation } from '../community/communityTypes';
import { Link, useNavigate } from 'react-router-dom';

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
        <div className="app-container">
            <Header/>
            <section className="blockCode">
                <h2>Weryfikacja organizacji</h2>
                {loading ? (
                    <p>Ładowanie...</p>
                ) : error ? (
                    <p style={{ color: 'red' }}>{error}</p>
                ) : organisation.length > 0 ? (
                    <ul>
                        {organisation.map((org) => (
                            <li key={org.id}>
                                <Link to={`/community/organisation/${org.uniqueName}`}>{org.name}</Link>
                                <button
                                    onClick={() => handleSentResponse(org.uniqueName, "reject")}
                                    disabled={loading}
                                >
                                    Odrzuć
                                </button>
                                <button
                                    onClick={() => handleSentResponse(org.uniqueName, "approve")}
                                    disabled={loading}
                                >
                                    Zaakceptuj
                                </button>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>Brak żądań do zaakceptowania.</p>
                )}
                
                {success && <p style={{ color: 'green' }}>{success}</p>}
            </section>            
            <Footer/>
        </div>
    )
}

export default AdminOrganisations