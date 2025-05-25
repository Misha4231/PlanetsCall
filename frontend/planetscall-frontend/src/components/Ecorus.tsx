import React from 'react'
import styles from '../stylePage/admin/adminShop.module.css';

type EcorusProps = {
  className?: string;
  variant?: 'default' | 'noHair' | 'hat';
};

const Ecorus = ({ className, variant = 'default'}: EcorusProps) => {
  
  const imageMap: Record<string, string> = {
    default: require('../assets/postac.png'),
    noHair: require('../assets/stworek_bez_wlosow.png'),
    hat: require('../assets/stworek_do_czapek.png'),
  };

  return (
    <div className={styles.ecorusContainer}>
      <img 
        src={imageMap[variant]} 
        alt="Ecorus" 
        className={className} 
      />
    </div>
  )
}

export default Ecorus;