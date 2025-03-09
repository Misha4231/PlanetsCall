import React, { useEffect, useState } from 'react'
import Header from '../../components/shared/Header';
import Footer from '../../components/Footer/Footer';
import { useAuth } from '../../context/AuthContext';
import { Member, Organisation } from './communityTypes';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getOrganisationData, getOrganisationSettings, updateOrganisationSettings } from '../../services/communityService';

const OrganisationSettings = () => {
    const { user, isAuthenticated, token } = useAuth();
    const [organisation, setOrganisation] = useState<Organisation | null>(null);
    const [formData, setFormData] = useState<Partial<Organisation>>({});

    const { organisationUniqueName } = useParams<{ organisationUniqueName: string }>();

    const [loading, setLoading] = useState<boolean>(false);
      const [success, setSuccess] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();



    useEffect(() => {
        if(token && organisationUniqueName){
        const fetchData = async () => {  
            try {
                setLoading(true);
                const orgData = await getOrganisationData(token, organisationUniqueName);
                setOrganisation(orgData);

                const orgSettings = await getOrganisationSettings(token, organisationUniqueName);
                setFormData(orgSettings);

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


  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
        const checkbox = e.target as HTMLInputElement;
        const isChecked = checkbox.checked;

        setFormData(prevData => ({
            ...prevData,
            [name]: isChecked,
        }));
    } else {
        setFormData(prevData => ({
            ...prevData,
            [name]: value,
        }));
    }
};

const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated || !organisationUniqueName) {
        alert('You must be logged in and have an organisation selected to update settings.');
        return;
    }

    try {
        setLoading(true);
        await updateOrganisationSettings(token!, organisationUniqueName, formData);
        setSuccess('Organisation settings updated successfully!');
        setError(null);
    } catch (err: any) {
        setError(err.message || 'Failed to update organisation settings.');
    } finally {
        setLoading(false);
    }
};



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

    if (loading) {
        return (
            <div>
                <Header />
                <p>Loading...</p>
                <Footer />
            </div>
        );
    }

  return (
    <div>
        <Header/>

        <h1>Organisation Settings</h1>
            {success && <p style={{ color: 'green' }}>{success}</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
        <form onSubmit={handleSubmit}>
                <div>
                    <label>Nazwa:</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name || ''}
                        onChange={handleInputChange}
                    />
                </div>
                <div>
                    <label>Unikalna nazwa:</label>
                    <input
                        type="text"
                        name="uniqueName"
                        value={formData.uniqueName || ''}
                        onChange={handleInputChange}
                    />
                </div>
                <div>
                    <label>Opis:</label>
                    <textarea
                        name="description"
                        value={formData.description || ''}
                        onChange={handleInputChange}
                    />
                </div>
                <div>
                    <label>Logo:</label>
                    <input
                        type="text"
                        name="organizationLogo"
                        value={formData.organizationLogo || ''}
                        onChange={handleInputChange}
                    />
                </div>
                <div>
                    <label>
                        <input
                            type="checkbox"
                            name="isPrivate"
                            checked={formData.isPrivate || false}
                            onChange={handleInputChange}
                        />
                        Private Organisation
                    </label>
                </div>
                <div>
                    <label>Minimalny poziom dołączenia</label>
                    <input
                        type="number"
                        name="minimumJoinLevel"
                        value={formData.minimumJoinLevel || 0}
                        onChange={handleInputChange}
                    />
                </div>
                <div>
                    <label>Instagram Link:</label>
                    <input
                        type="text"
                        name="instagramLink"
                        value={formData.instagramLink || ''}
                        onChange={handleInputChange}
                    />
                </div>
                <div>
                    <label>LinkedIn Link:</label>
                    <input
                        type="text"
                        name="linkedinLink"
                        value={formData.linkedinLink || ''}
                        onChange={handleInputChange}
                    />
                </div>
                <div>
                    <label>Youtube Link:</label>
                    <input
                        type="text"
                        name="youtubeLink"
                        value={formData.youtubeLink || ''}
                        onChange={handleInputChange}
                    />
                </div>
                <button type="submit" disabled={loading}>
                    {loading ? 'Saving...' : 'Save Changes'}
                </button>
            </form>

        <Footer/>
    </div>
  )
}

export default OrganisationSettings
