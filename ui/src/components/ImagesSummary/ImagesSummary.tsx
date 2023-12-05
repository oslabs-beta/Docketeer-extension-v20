import React from 'react';
import { useState, useEffect } from 'react';
import styles from './ImagesSummary.module.scss';

/**
 * @module | ImagesSummary.tsx
 * @description | displays a summary of vulnerabilities across all images
 **/

const ImagesSummary = (): React.JSX.ELement => {

  const [summary, setSummary] = useState({
    c: 0,
    h: 0,
    m: 0,
    l: 0
  });

  useEffect(() => {
    // reset state with props
    setSummary({c: 20, h: 30, m: 40, l: 10})
  }, [])

  return (
    <div className={styles.summaryCard}>
      
      {/* CRITICAL */}
      <div className={styles.critical} style={{ width: summary.c + '%' }}>
        <text>CRITICAL</text>
      </div>
      
      {/* HIGH */}
      <div className={styles.high} style={{ width: summary.h + '%' }}>
        <text>HIGH</text>
      </div>
      
      {/* MED */}
      <div className={styles.med} style={{ width: summary.m + '%' }}>
        <text>MEDIUM</text>
      </div>
      
      {/* LOW */}
      <div className={styles.low} style={{ width: summary.l + '%' }}>
        <text>LOW</text>
      </div>
    
    </div>
  )
}

export default ImagesSummary;