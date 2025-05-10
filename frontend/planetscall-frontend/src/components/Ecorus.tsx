import React from 'react'
import styles from '../stylePage/admin/adminShop.module.css';

const Ecorus = ({ className }:any) => {
  return (
    <div className={styles.ecorusContainer}>
      <img 
        src={require('../assets/stworek_bez_wlosow.png')} 
        alt="Ecorus" 
        className={className} 
      />
    </div>
  )
}

export default Ecorus;