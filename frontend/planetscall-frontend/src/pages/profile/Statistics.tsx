import React, { useEffect, useState } from 'react';
import Header from '../../components/shared/Header';
import { getUserAttendance } from '../../services/userService';
import { useAuth } from '../../context/AuthContext';
import Footer from '../../components/Footer/Footer';
import Loading from '../Additional/Loading';
import styles from '../../stylePage/profile.module.css';
import { Link, useParams } from 'react-router-dom';

const Statistics = () => {
  const { user, isAuthenticated, token } = useAuth();
    const { username } = useParams<{ username: string }>();
  const [loading, setLoading] = useState<boolean>(false);
  const [attendanceData, setAttendanceData] = useState<any[]>([]);
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [daysInMonth, setDaysInMonth] = useState<number>(0);

  useEffect(() => {
    const fetchAttendance = async () => {
      if (!isAuthenticated || !token) return;
      try {
        const data = await getUserAttendance(token, (username + ""));
        setAttendanceData(data);
      } catch (err: any) {
        console.log(err);
      }
    };

    fetchAttendance();
  }, [isAuthenticated, token, user]);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month + 1, 0).getDate(); 
  };

  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

    const calendar = [];

    for (let i = 0; i < firstDayOfMonth; i++) {
      calendar.push(<div key={`empty-${i}`} className={styles.emptyDay}></div>);
    }

    for (let i = 1; i <= daysInMonth; i++) {
      const dateString = formatDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), i));
      const isPresent = attendanceData.some((attendance) => {
        const attendanceDate = formatDate(new Date(attendance.createdAt));
        return attendanceDate === dateString;
      });

      calendar.push(
        <div
          key={i}
          className={`${styles.calendarDay} ${isPresent ? styles.present : ''}`}
        >
          {i}
        </div>
      );
    }

    return calendar;
  };

  const changeMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };

  return (
    <div className="app-container">
      <Header />
      <section className={styles.profileContainer}>
          <div className={styles.profileContent}>
            <h1 className={styles.settingsTitle}>Statystyka użytkownika {username}</h1>
            <Link to={`/user/${username}`} className={styles.backButton}>
              <i className="fas fa-arrow-left"></i> Powrót
            </Link>
              {loading ? <Loading /> : (
                <>
                  <div className={styles.calendarNavigation}>
                    <button onClick={() => changeMonth('prev')}  className={styles.primaryButton}>
                      <i className="fas fa-chevron-left"></i> Poprzedni
                    </button>
                    <span className={styles.monthName}>
                      {currentDate.toLocaleString('default', { month: 'long' })} {currentDate.getFullYear()}
                    </span>
                    <button onClick={() => changeMonth('next')}  className={styles.primaryButton}>
                    Następny <i className="fas fa-chevron-right"></i> 
                  </button>
                <button onClick={() => setCurrentDate(new Date())} className={styles.primaryButton}>
                  Obecny Miesiąc
                </button>
                  </div>
                  <div className={styles.calendarContainer}>
                    {renderCalendar()}
                  </div>
                </>
              )}
            </div>
      </section>
      <Footer />
    </div>
  );
};

export default Statistics;
