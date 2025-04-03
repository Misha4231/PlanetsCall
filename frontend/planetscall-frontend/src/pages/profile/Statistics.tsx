import React, { useEffect, useState } from 'react'
import Header from '../../components/shared/Header'
import { getAddAttendance } from '../../services/userService';
import { useAuth } from '../../context/AuthContext';
import Footer from '../../components/Footer/Footer';

const Statistics = () => {
  const { user, isAuthenticated, token } = useAuth();
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const authToken = token || '';
        const attendanceData = await getAddAttendance(authToken);
        console.log('Attendance Data:', attendanceData);
      } catch (err: any) {
        console.error('Error fetching attendance:', err.message);
      }
    };

    fetchAttendance();
  }, []);


  return (
    <div className="app-container">
      <Header/>
      <section className="blockCode">
      {loading ? (
          <p>Ładowanie...</p>
        ) : (
          <>



          </>
        )}
      </section>
      <Footer/>
      
    </div>
  )
}

export default Statistics
