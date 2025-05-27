import React, { useEffect, useState } from 'react';
import Header from '../../components/shared/Header';
import { getAnotherOrganisationJoin, getOrganisationUsers, searchOrganisations } from '../../services/communityService';
import Footer from '../../components/Footer/Footer';
import { useAuth } from '../../context/AuthContext';
import { Organisation, OrganisationsResponse } from './communityTypes';
import { Link, useNavigate } from 'react-router-dom';
import { imageUrl } from '../../services/imageConvert';
import styles from '../../stylePage/community.module.css';
import NotAuthenticated from '../Additional/NotAuthenticated';

const SearchOrganisation = () => {
  const { user, isAuthenticated, token } = useAuth();
  const [organisations, setOrganisations] = useState<Organisation[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [membershipStatus, setMembershipStatus] = useState<{ [key: string]: boolean }>({});
  const [requestStatus, setRequestStatus] = useState<{ [key: string]: boolean }>({});
  const [error, setError] = useState<string | null>(null);
  const [searchPhrase, setSearchPhrase] = useState<string>("");
  const [success, setSuccess] = useState<string | null>(null);
  const navigate = useNavigate();
  const [pagination, setPagination] = useState({
    pageIndex: 1,
    totalPages: 1,
    hasPreviousPage: false,
    hasNextPage: false,
  });

  useEffect(() => {
    if (organisations.length > 0) {
      organisations.forEach((org) => {
        checkMembership(org.uniqueName);
      });
    }
  }, [organisations, searchPhrase]);

  if (!isAuthenticated) {
    return  <NotAuthenticated/> 
  }

  { /* Function to search organisations by search phrase */} 
  const handleSearch = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!isAuthenticated || !token || !searchPhrase.trim()) return;

    try {
      setLoading(true);
      const response: OrganisationsResponse = await searchOrganisations(token, searchPhrase, pagination.pageIndex);
      setOrganisations(response.items);
      setPagination({
        pageIndex: response.pageIndex,
        totalPages: response.totalPages,
        hasPreviousPage: response.hasPreviousPage,
        hasNextPage: response.hasNextPage,
      });
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  { /* Function to join organisation or sending request */} 
  const handleJoinOrganisation = async (organisationUniqueName: string, isPrivate: boolean) => {
    if (!isAuthenticated || !token) return;
  
    try {
      const success = await getAnotherOrganisationJoin(token, organisationUniqueName);
      if (success) {
        if (isPrivate) {    
          setRequestStatus(prev => ({ ...prev, [organisationUniqueName]: true }));
          setSuccess('Prośba o dołączenie została wysłana.');
        } else {
          setMembershipStatus(prev => ({ ...prev, [organisationUniqueName]: true }));
          setSuccess('Dołączono do organizacji.');
        }
      } else {
        setRequestStatus(prev => ({ ...prev, [organisationUniqueName]: true }));
        setSuccess('Już wysłałeś prośbę lub jesteś członkiem');
      }
    } catch (err) {
      console.log('Błąd podczas dołączania do organizacji:', err);
      setError('Wystąpił błąd podczas próby dołączenia');
    }
  };

  { /* Function to check if user is a member of organisation */} 
  const checkMembership = async (organisationUniqueName: string) => {
    if (!isAuthenticated || !token) return false;
  
    try {
      const members = await getOrganisationUsers(token, organisationUniqueName);
      const isMember = members.some((member: { id: number; }) => member.id === user?.id);
      setMembershipStatus(prev => ({ ...prev, [organisationUniqueName]: isMember }));
      return isMember;
    } catch (err) {
      console.error('Błąd podczas sprawdzania członkostwa:', err);
      return false;
    }
  };

  return (
    <div className="app-container dark-theme">
      <Header />
      <section className={styles.userSearchContainer}>
        <div className={styles.searchContent}>
          <h2 className={styles.searchTitle}>Wyszukaj Organizacje</h2>
                {success && <div className={styles.successMessage}>{success}</div>}

          <form onSubmit={handleSearch} className={styles.searchForm}>
            <div className={styles.searchGroup}>
              <label htmlFor="search" className={styles.searchLabel}>WYSZUKAJ ORGANIZACJE</label>
              <div className={styles.searchInputWrapper}>
                <input
                  id="search"
                  type="text"
                  value={searchPhrase}
                  onChange={(e) => setSearchPhrase(e.target.value)}
                  placeholder="Wpisz nazwę organizacji..."
                  className={styles.searchInput}
                />
                <button
                  type="submit"
                  className={styles.searchButton}
                  disabled={!searchPhrase.trim() || loading}
                >
                  {loading ? (
                    <span className={styles.smallLoader}></span>
                  ) : (
                    <span>Szukaj</span>
                  )}
                </button>
              </div>
            </div>
          </form>

          {error && (
            <div className={styles.errorMessage}>
              <i className="fas fa-exclamation-circle"></i> {error}
            </div>
          )}

          {loading ? (
            <div className={styles.loadingContainer}>
              <span className={styles.loader}></span>
            </div>
          ) : organisations.length > 0 ? (
            <>
              <div className={styles.organisationsList}>
                {organisations.map((org) => {
                  const isMember = membershipStatus[org.uniqueName] || false;
                  const hasRequested = requestStatus[org.uniqueName] || false;

                  return (
                    <div key={org.uniqueName} className={styles.organisationCard}  onClick={() => navigate(`/community/organisation/${org.uniqueName}`)}>
                      <div 
                        className={styles.orgImageContainer}
                      >
                        <img 
                          src={org.organizationLogo ? imageUrl() + org.organizationLogo : '/default-org.png'} 
                          alt={`Logo ${org.name}`} 
                          className={styles.orgImage}
                        />
                      </div>
                      <div className={styles.orgInfo}>
                        <h3 className={styles.orgName}>{org.name}</h3>
                        <p className={styles.orgUniqueName}>@{org.uniqueName}</p>
                        <p className={styles.orgDescription}>{org.description}</p>
                        <div className={styles.orgMeta}>
                          <span className={`${styles.orgPrivacy} ${org.isPrivate ? styles.private : styles.public}`}>
                            {org.isPrivate ? 'Prywatna' : 'Publiczna'}
                          </span>
                          <span className={styles.orgLevel}>
                            <i className="fas fa-level-up-alt"></i> Min. poziom: {org.minimumJoinLevel}
                          </span>
                        </div>
                        {isMember ? (
                          <span className={styles.memberBadge}>
                            <i className="fas fa-check"></i> Jesteś członkiem
                          </span>
                        ) : org.isPrivate ? (
                          hasRequested ? (
                            <span className={styles.requestedBadge}>
                              <i className="fas fa-clock"></i> Prośba wysłana
                            </span>
                          ) : (
                            <button 
                              className={styles.joinButton}
                              onClick={() => handleJoinOrganisation(org.uniqueName, org.isPrivate)}
                              disabled={loading}
                            >
                              <i className="fas fa-paper-plane"></i> Wyślij prośbę
                            </button>
                          )
                        ) : (
                          <button 
                            className={styles.joinButton}
                            onClick={() => handleJoinOrganisation(org.uniqueName, org.isPrivate)}
                            disabled={loading}
                          >
                            <i className="fas fa-user-plus"></i> Dołącz
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

                {pagination && pagination.totalPages>1 &&(
                    <div className={styles.pagination}>
                      <button
                        onClick={() => setPagination(prev => ({ ...prev, pageIndex: prev.pageIndex - 1 }))}
                        disabled={!pagination.hasPreviousPage || loading}
                        className={styles.paginationButton}
                      >
                        <i className="fas fa-chevron-left"></i> Poprzednia
                      </button>
                      <span className={styles.pageInfo}>
                        Strona {pagination.pageIndex} z {pagination.totalPages}
                      </span>
                      <button
                        onClick={() => setPagination(prev => ({ ...prev, pageIndex: prev.pageIndex + 1 }))}
                        disabled={!pagination.hasNextPage || loading}
                        className={styles.paginationButton}
                      >
                        Następna <i className="fas fa-chevron-right"></i>
                      </button>
                    </div>

                )}
            </>
          ) : searchPhrase ? (
            <div className={styles.noResults}>
              <i className="fas fa-search"></i>
              <p>Nie znaleziono organizacji pasujących do wyszukiwania "{searchPhrase}"</p>
            </div>
          ) : (
            <div className={styles.noResults}>
              <i className="fas fa-users"></i>
              <p>Wpisz frazę, by znaleźć organizację</p>
            </div>
          )}
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default SearchOrganisation;