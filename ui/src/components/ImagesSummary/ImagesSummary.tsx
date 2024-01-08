import React from 'react';
import { useState, useEffect } from 'react';
import styles from './ImagesSummary.module.scss';
import { useAppSelector } from '../../reducers/hooks';
import { ImageType } from '../../../../types';

/**
 * @module | ImagesSummary.tsx
 * @description | displays a summary of vulnerabilities across all images
 **/

const ImagesSummary = (): React.JSX.Element => {
  let makeSummary;
  const [showInfo, setShowInfo] = useState(false)
  const imagesList: ImageType[] = useAppSelector(state => state.images.imagesList)
  console.log('makeSummary outside useEffect: ', makeSummary);
  const [summary, setSummary] = useState({
    c: 0,
    h: 0,
    m: 0,
    l: 0
  });

  useEffect(() => {
    makeSummary = imagesList.every((imageObj) => imageObj.Vulnerabilities !== undefined)
    console.log('makeSummary: Are all vulnerabilities done?: ', makeSummary);
    
    
    if (makeSummary) {
      console.log('Entered if statement of ImageSummary useEffect');
      
      let critical = 0;
      let high = 0;
      let med = 0;
      let low = 0;

      imagesList.forEach(imageObj => {
        critical += typeof imageObj.Vulnerabilities.Critical === 'number' ? imageObj.Vulnerabilities.Critical : 0;
        high += typeof imageObj.Vulnerabilities.High === 'number' ? imageObj.Vulnerabilities.High : 0;
        med += typeof imageObj.Vulnerabilities.Medium === 'number' ? imageObj.Vulnerabilities.Medium : 0;
        low += typeof imageObj.Vulnerabilities.Low === 'number' ? imageObj.Vulnerabilities.Low : 0;
      })

      console.log(`high: ${high}, med: ${med}, low: ${low}, critical: ${critical}`);
      
      let total = critical + high + med + low;
      console.log('total vulnerabilities: ', total);
      
      if (total !== 0) {
        setSummary({ c: (critical / total) * 100, h: (high / total) * 100, m: (med / total) * 100, l: (low / total) * 100 })
        setShowInfo(true)
      }
    }

  }, [imagesList])

  return (
    <div>
      <div className={styles.summaryCard}>
        {/* Show Loading message when vulnerabilities have not yet completed */}
        {!showInfo && <p className={styles.loadingMessage}>Loading...</p> }

        {/* CRITICAL */}
        {showInfo && <div className={styles.critical} style={{ width: summary.c + '%' }}></div>}

        {/* HIGH */}
        {showInfo && <div className={styles.high} style={{ width: summary.h + '%' }}></div>}

        {/* MED */}
        {showInfo && <div className={styles.med} style={{ width: summary.m + '%' }}></div>}

        {/* LOW */}
        {showInfo && <div className={styles.low} style={{ width: summary.l + '%' }}></div>}
      </div>
      <div className={styles.percentagesContainer}>
        <div className={styles.boxPercent}>
          <div className={styles.criticalPercent}></div>
          <p className={`${styles.textColor}`}>
            CRITICAL {showInfo && <span className={styles.percentNumber}>{(summary.c).toFixed(2) + '%'}</span>}
          </p>
        </div>
        <div className={styles.boxPercent}>
          <div className={styles.highPercent}></div>
          <p className={`${styles.textColor}`}>
            HIGH {showInfo && <span className={styles.percentNumber}>{(summary.h).toFixed(2) + '%'}</span>}
          </p>
        </div>
        <div className={styles.boxPercent}>
          <div className={styles.medPercent}></div>
          <p className={`${styles.textColor}`}>
            MEDIUM {showInfo && <span className={styles.percentNumber}>{(summary.m).toFixed(2) + '%'}</span>}
          </p>
        </div>
        <div className={styles.boxPercent}>
          <div className={styles.lowPercent}></div>
          <p className={`${styles.textColor}`}>
            LOW {showInfo && <span className={styles.percentNumber}>{(summary.l).toFixed(2) + '%'}</span>}
          </p>
        </div>
      </div>
    </div>
  );
}

export default ImagesSummary;