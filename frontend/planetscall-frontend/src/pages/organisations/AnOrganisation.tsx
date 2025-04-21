//{/* Dana Organizacja i jej dane*/}
import React, { useEffect, useState } from 'react';
import { getOrganisationData, getOrganisationUsers } from '../../services/communityService';
import { useAuth } from '../../context/AuthContext';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Header from '../../components/shared/Header';
import Footer from '../../components/Footer/Footer';
import { imageUrl } from '../../services/imageConvert';
import { Member, Organisation } from '../community/communityTypes';
import styles from '../../stylePage/organisation/organisation.module.css';

const AnOrganisation = () => {
  const { user, isAuthenticated, token, loadingUser } = useAuth();
  const [organisation, setOrganisation] = useState<Organisation>();
  const [loading, setLoading] = useState<boolean>(false);
  const [users, setUsers] = useState<Member[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { organisationUniqueName } = useParams<{ organisationUniqueName: string }>();
  const navigate = useNavigate();
  
  { /* Variable to pagination data */} 
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [membersPerPage] = useState<number>(10); 
  
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
  
  const indexOfLastMember = currentPage * membersPerPage;
  const indexOfFirstMember = indexOfLastMember - membersPerPage;
  const currentMembers = users.slice(indexOfFirstMember, indexOfLastMember);
  const totalPages = Math.ceil(users.length / membersPerPage);

  { /* Get data about specific organisation and users in it */} 
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
          const userData = await getOrganisationUsers(token, organisationUniqueName);
          setUsers(userData);
          //console.log(users);     
          setLoading(false);
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


  if (loadingUser) {
    return <div>Ładowanie danych użytkownika...</div>;
  }  

  
  if (!isAuthenticated) {
    return (<div>
      <Header/>
      <p style={{ color: 'red' }}>Użytkownik nie jest zalogowany.</p>

    </div>);   
  }

  return (
    <div className="app-container dark-theme">
      <Header />
      <section className={styles.organisationContainer}>
        {loading ? (
          <div className={styles.loading}>Ładowanie...</div>
        ) : (
          <>
            {error && <div className={styles.error}>{error}</div>}
            {organisation && (
              <div className={styles.organisationContent}>
                <div className={styles.organisationHeader}>
                  <div className={styles.logoSection}>
                    {organisation.organizationLogo ? (
                      <img
                        src={imageUrl() + organisation.organizationLogo}
                        alt={`${organisation.name} logo`}
                        className={styles.logoImage}
                      />
                    ) : (
                      <div className={styles.logoPlaceholder}>
                        <i className="fas fa-users"></i>
                      </div>
                    )}
                  </div>
  
                  <div className={styles.infoSection}>
                    <div className={styles.titleSection}>
                      <h1 className={styles.organisationName}>
                        {organisation.name}
                        {organisation.isVerified && (
                          <span className={styles.verifiedBadge}>
                            <i className="fas fa-check-circle"></i>
                          </span>
                        )}
                      </h1>
                      <p className={styles.organisationUniqueName}>@{organisation.uniqueName}</p>
                    </div>
  
                    <div className={styles.metaInfo}>
                      <div className={styles.metaItem}>
                        <i className="fas fa-user"></i>
                        <span>{users.length} members</span>
                      </div>
                      <div className={styles.metaItem}>
                        <i className="fas fa-calendar-alt"></i>
                        <span>Created {new Date(organisation.createdAt).toLocaleDateString()}</span>
                      </div>
                      <div className={styles.metaItem}>
                        <i className="fas fa-lock"></i>
                        <span>{organisation.isPrivate ? 'Private' : 'Public'} group</span>
                      </div>
                    </div>
  
                    {organisation?.creatorId === user?.id && (
                      <Link 
                        to={`/community/organisation/${organisation.uniqueName}/admin`} 
                        className={styles.adminLink}
                      >
                        <i className="fas fa-cog"></i> Manage Organization
                      </Link>
                    )}
                  </div>
                </div>
  
                <div className={styles.descriptionSection}>
                  <h2 className={styles.sectionTitle}>About</h2>
                  <p className={styles.organisationDescription}>
                    {organisation.description || 'No description provided.'}
                  </p>
                </div>
  
                {organisation.instagramLink || organisation.linkedinLink || organisation.youtubeLink ? (
                  <div className={styles.linksSection}>
                    <h2 className={styles.sectionTitle}>Links</h2>
                    <div className={styles.socialLinks}>
                      {organisation.instagramLink && (
                        <a href={organisation.instagramLink} target="_blank" rel="noopener noreferrer">
                          <i className="fab fa-instagram"></i>
                        </a>
                      )}
                      {organisation.linkedinLink && (
                        <a href={organisation.linkedinLink} target="_blank" rel="noopener noreferrer">
                          <i className="fab fa-linkedin"></i>
                        </a>
                      )}
                      {organisation.youtubeLink && (
                        <a href={organisation.youtubeLink} target="_blank" rel="noopener noreferrer">
                          <i className="fab fa-youtube"></i>
                        </a>
                      )}
                    </div>
                  </div>
                ) : null}
  
                <div className={styles.membersSection}>
                  <div className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>Members ({users.length})</h2>
                  </div>
                  
                  {users.length > 0 ? (
                    <>
                      <div className={styles.membersGrid}>
                        {currentMembers.map((member) => (
                          <Link 
                            to={`/user/${member.username}`} 
                            key={member.id} 
                            className={styles.memberCard}
                          >
                            <div className={styles.memberAvatar}>
                              {member.profileImage ? (
                                <img 
                                    src={imageUrl() + member.profileImage}
                                    alt={`Profilowe ${member.username}`}
                                />
                              ) : (
                                <i className="fas fa-user"></i>
                              )}
                            </div>
                            <div className={styles.memberInfo}>
                              <h3 className={styles.memberUsername}>{member.username}</h3>
                              {member.isAdmin && (
                                <span className={styles.adminTag}>Admin</span>
                              )}
                            </div>
                          </Link>
                        ))}
                      </div>

                      {totalPages > 1 && (
                        <div className={styles.pagination}>
                          <button 
                            onClick={() => paginate(currentPage > 1 ? currentPage - 1 : 1)}
                            disabled={currentPage === 1}
                            className={styles.paginationButton}
                          >
                            Previous
                          </button>
                          
                          {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
                            <button
                              key={number}
                              onClick={() => paginate(number)}
                              className={`${styles.paginationButton} ${currentPage === number ? styles.active : ''}`}
                            >
                              {number}
                            </button>
                          ))}
                          
                          <button 
                            onClick={() => paginate(currentPage < totalPages ? currentPage + 1 : totalPages)}
                            disabled={currentPage === totalPages}
                            className={styles.paginationButton}
                          >
                            Next
                          </button>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className={styles.noMembers}>
                      <i className="fas fa-users-slash"></i>
                      <p>No members found</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </section>
      <Footer />
    </div>
  );
};

export default AnOrganisation;
