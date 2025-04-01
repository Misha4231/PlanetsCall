//{/*Mozliwosc stworzenia organizacji*/}
import React, { useState } from 'react'
import Header from '../../components/shared/Header'
import { useAuth } from '../../context/AuthContext';
import { createOrganisation } from '../../services/communityService';
import { Link } from 'react-router-dom';


const CreateOrganisation = () => {
  const { user, isAuthenticated, token } = useAuth();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  
  { /* Stan dla danych organizacji */} 
  const [organisationData, setOrganisationData] = useState({
    name: '',
    uniqueName: '',
    description: '',
    organizationLogo: '',
    instagramLink: '',
    linkedinLink: '',
    youtubeLink: '',
    isPrivate: false,
    minimumJoinLevel: 0,
  });

  { /* Obsługa zmian w formularzu */} 
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;

    { /* Obsługa checkboxa */} 
    if (type === 'checkbox') {
      setOrganisationData(prev => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked,
      }));
    } else {
      setOrganisationData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  { /* Obsługa wysłania formularza */} 
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated || !token) {
      setError('Musisz być zalogowany, aby stworzyć organizację.');
      return;
    }

    { /* Walidacja pól wymaganych */} 
    if (!organisationData.name || !organisationData.uniqueName) {
      setError('Nazwa i unikalna nazwa są wymagane.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      { /* Wywołanie funkcji do tworzenia organizacji */} 
      const newOrganisation = await createOrganisation(token, organisationData);

      { /* Komunikat sukcesu */} 
      setSuccess(`Organizacja "${newOrganisation.name}" została pomyślnie utworzona!`);

      { /* Reset formularza */} 
      setOrganisationData({
        name: '',
        uniqueName: '',
        description: '',
        organizationLogo: '',
        instagramLink: '',
        linkedinLink: '',
        youtubeLink: '',
        isPrivate: false,
        minimumJoinLevel: 0,
      });
    } catch (err: any) {
      setError(err.message || 'Wystąpił błąd podczas tworzenia organizacji.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Header />
      <section className="codeBlock">
        
                <h3>Stwórz Organizacje</h3>
                <ul>
                  <li><Link to="/community/organisations">Twoje Organizacje</Link></li>
                  <li><Link to="/community/">Znajdź Organizacje</Link></li>
                </ul>
        
                {/* Komunikat w razie błędu */}
                {error && <p style={{ color: 'red' }}>{error}</p>}

                
        {/* Komunikat sukcesu */}
        {success && <p style={{ color: 'green' }}>{success}</p>}

        {/* Formularz do tworzenia organizacji */}
        <form onSubmit={handleSubmit}>
          <div>
            <label>Nazwa organizacji:</label>
            <input
              type="text"
              name="name"
              value={organisationData.name}
              onChange={handleInputChange}
              required
            />
          </div>

          <div>
            <label>Unikalna nazwa:</label>
            <input
              type="text"
              name="uniqueName"
              value={organisationData.uniqueName}
              onChange={handleInputChange}
              required
            />
          </div>

          <div>
            <label>Opis:</label>
            <textarea
              name="description"
              value={organisationData.description}
              onChange={handleInputChange}
            />
          </div>

          <div>
            <label>Logo (URL):</label>
            <input
              type="text"
              name="organizationLogo"
              value={organisationData.organizationLogo}
              onChange={handleInputChange}
            />
          </div>

          <div>
            <label>Link do Instagrama:</label>
            <input
              type="text"
              name="instagramLink"
              value={organisationData.instagramLink}
              onChange={handleInputChange}
            />
          </div>

          <div>
            <label>Link do LinkedIn:</label>
            <input
              type="text"
              name="linkedinLink"
              value={organisationData.linkedinLink}
              onChange={handleInputChange}
            />
          </div>

          <div>
            <label>Link do YouTube:</label>
            <input
              type="text"
              name="youtubeLink"
              value={organisationData.youtubeLink}
              onChange={handleInputChange}
            />
          </div>

          <div>
            <label>
              <input
                type="checkbox"
                name="isPrivate"
                checked={organisationData.isPrivate}
                onChange={handleInputChange}
              />
              Prywatna organizacja
            </label>
          </div>

          <div>
            <label>Minimalny poziom dołączenia:</label>
            <input
              type="number"
              name="minimumJoinLevel"
              value={organisationData.minimumJoinLevel}
              onChange={handleInputChange}
            />
          </div>

          <button type="submit" disabled={loading}>
            {loading ? 'Tworzenie...' : 'Stwórz organizację'}
          </button>
        </form>
        
      </section>
    </div>
  )
}

export default CreateOrganisation
