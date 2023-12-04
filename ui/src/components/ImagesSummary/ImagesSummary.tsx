import React from 'react';
import styles from './ImagesSummary.module.scss';

/**
 * @module | ImagesSummary.tsx
 * @description | displays a summary of vulnerabilities across all images
 **/

const ImagesSummary = (): React.JSX.ELement => {
  return (
    <div className={styles.summaryCard}>
      
      {/* HIGH */}
      <div className={styles.high}>
        <text>HIGH</text>
      </div>
      
      {/* MED */}
      <div className={styles.med}>
        <text>MEDIUM</text>
      </div>
      
      {/* LOW */}
      <div className={styles.low}>
        <text>LOW</text>
      </div>
    
    </div>
  )
}

export default ImagesSummary;