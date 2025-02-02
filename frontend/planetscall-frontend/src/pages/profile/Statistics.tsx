import React, { useEffect } from 'react'
import Header from '../../components/shared/Header'
import { getAddAttendance } from '../../services/userService';
import { useAuth } from '../../context/AuthContext';

const Statistics = () => {
  const { user, isAuthenticated, token } = useAuth();

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
    <div>
      <Header/>
      
    </div>
  )
}

export default Statistics
