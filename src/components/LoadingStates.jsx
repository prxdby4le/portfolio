import React from 'react';
import styles from './LoadingStates.module.css';

export function CardSkeleton({ showImage = false }) {
  return (
    <div className={styles.cardSkeleton}>
      {showImage && <div className={styles.imageSkeleton} />}
      <div className={styles.lineSkeleton} style={{ width: '70%' }} />
      <div className={styles.lineSkeleton} style={{ width: '45%' }} />
    </div>
  );
}

export function Spinner({ size = 32 }) {
  return <div className={styles.spinner} style={{ '--size': `${size}px` }} />;
}

export default { CardSkeleton, Spinner };