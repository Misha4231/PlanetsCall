import React, { useEffect, useState } from 'react';
import Header from '../../components/shared/Header';
import { useAuth } from '../../context/AuthContext';
import { getMyOrganisations } from '../../services/communityService';
import { Link, useNavigate } from 'react-router-dom';
import { Organisation, OrganisationsResponse } from '../community/communityTypes';
import Footer from '../../components/Footer/Footer';
import { imageUrl } from '../../services/imageConvert';
import styles from '../../stylePage/community.module.css';

const Organisations: React.FC = () => {
  const { user, isAuthenticated, token } = useAuth();
  const [myOrganisations, setMyOrganisations] = useState<Organisation[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    pageIndex: 1,
    totalPages: 1,
    hasPreviousPage: false,
    hasNextPage: false,
  });
  const navigate = useNavigate();

  { /* Get data about users organisations */} 
  useEffect(() => {
    if (!isAuthenticated || !token) return;

    const fetchMyOrganisations = async () => {
      try {
        setLoading(true);
        const response: OrganisationsResponse = await getMyOrganisations(token, pagination.pageIndex);
        setMyOrganisations(response.items);
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

    fetchMyOrganisations();
  }, [isAuthenticated, token, pagination.pageIndex]); 

  { /* System of pagination */}
  const handleNextPage = () => {
    if (pagination.hasNextPage) {
      setPagination((prev) => ({ ...prev, pageIndex: prev.pageIndex + 1 }));
    }
  };

  const handlePreviousPage = () => {
    if (pagination.hasPreviousPage) {
      setPagination((prev) => ({ ...prev, pageIndex: prev.pageIndex - 1 }));
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="app-container dark-theme">
        <Header />
        <section className={styles.userSearchContainer}>
          <div className={styles.searchContent}>
            <p className={styles.errorMessage}>
              Musisz być zalogowany, aby przeglądać swoje organizacje.
            </p>
          </div>
        </section>
        <Footer />
      </div>
    );
  }

  return (
    <div className="app-container dark-theme">
      <Header />
      <section className={styles.userSearchContainer}>
        <div className={styles.searchContent}>
          <div className={styles.headerSection}>
            <h2 className={styles.searchTitle}>Twoje Organizacje</h2>
            <div className={styles.organisationActions}>
              <Link to="/community/organisations/create" className={styles.createButton}>
                <i className="fas fa-plus"></i> Stwórz Organizację
              </Link>
              <Link to="/community/organisations/search" className={styles.searchButton}>
                <i className="fas fa-search"></i> Znajdź Organizację
              </Link>
            </div>
          </div>

          {error && (
            <div className={styles.errorMessage}>
              <i className="fas fa-exclamation-circle"></i> {error}
            </div>
          )}

          {loading ? (
            <div className={styles.loadingContainer}>
              <span className={styles.loader}></span>
            </div>
          ) : myOrganisations.length > 0 ? (
            <div className={styles.organisationsList}>              
            { /* Show users organisation */}
              {myOrganisations.map(org => (
                <div key={org.uniqueName} className={styles.organisationCard} onClick={() => navigate(`/community/organisation/${org.uniqueName}`)}>
                  <div className={styles.orgImageContainer}>
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
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.noResults}>
              <i className="fas fa-users"></i>
              <p>Nie należysz do żadnych organizacji</p>
            </div>
          )}

          {pagination.totalPages> 1 && (
            <div className={styles.pagination}>
              <button
                onClick={handlePreviousPage}
                disabled={!pagination.hasPreviousPage || loading}
                className={styles.paginationButton}
              >
                <i className="fas fa-chevron-left"></i> Poprzednia
              </button>
              <span className={styles.pageInfo}>
                Strona {pagination.pageIndex} z {pagination.totalPages}
              </span>
              <button
                onClick={handleNextPage}
                disabled={!pagination.hasNextPage || loading}
                className={styles.paginationButton}
              >
                Następna <i className="fas fa-chevron-right"></i>
              </button>
            </div>
          )}
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Organisations;