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
  const [showInfo, setShowInfo] = useState(false)
  const [summary, setSummary] = useState({
    c: 0,
    h: 0,
    m: 0,
    l: 0,
    n: 0
  });
  let makeSummary;
  console.log('makeSummary outside useEffect: ', makeSummary);
  const imagesList: ImageType[] = useAppSelector(state => state.images.imagesList);

  // Looping until all cards are done
  useEffect(() => {
    makeSummary = imagesList.every((imageObj) => imageObj.Vulnerabilities !== undefined)
    console.log('makeSummary: Are all vulnerabilities done?: ', makeSummary);
    
    
    if (makeSummary) {
      let critical = 0;
      let high = 0;
      let med = 0;
      let low = 0;
      let negligible = 0

      imagesList.forEach(imageObj => {
        critical += typeof imageObj.Vulnerabilities.Critical === 'number' ? imageObj.Vulnerabilities.Critical : 0;
        high += typeof imageObj.Vulnerabilities.High === 'number' ? imageObj.Vulnerabilities.High : 0;
        med += typeof imageObj.Vulnerabilities.Medium === 'number' ? imageObj.Vulnerabilities.Medium : 0;
        low += typeof imageObj.Vulnerabilities.Low === 'number' ? imageObj.Vulnerabilities.Low : 0;
        negligible +=
          typeof imageObj.Vulnerabilities.Negligible === 'number'
            ? imageObj.Vulnerabilities.Negligible
            : 0;
      })

      console.log(
        `high: ${high}, med: ${med}, low: ${low}, critical: ${critical}, negligble: ${negligible}`
      );
      
      const total = critical + high + med + low + negligible;
      console.log('total vulnerabilities: ', total);
      
      if (total !== 0) {
        setSummary({
          c: (critical / total) * 100,
          h: (high / total) * 100,
          m: (med / total) * 100,
          l: (low / total) * 100,
          n: (negligible / total) * 100,
        });
        setShowInfo(true);
      }
    }

  }, [imagesList]);

  const levels: string[] = ['critical', 'high', 'medium', 'low', 'negligible'];
  const printPercent: React.JSX.Element[] = levels.map((el, i) => { 
    return (
      <div className={styles.boxPercent} key={i}>
        <div className={styles[`${el}Percent`]}></div>
        <p className={`${styles.textColor}`}>
          {`${el.toUpperCase()} `}
          {showInfo && (
            <span className={styles.percentNumber}>
              {summary[el[0]].toFixed(2) + '%'}
            </span>
          )}
        </p>
      </div>
    )
  });

  return (
		<div>
			<div className={styles.summaryCard}>
				{/* Show Loading message when vulnerabilities have not yet completed */}
				{!showInfo && <p className={styles.loadingMessage}>Loading...</p>}

				{/* PERCENT BAR */}
				{showInfo && (
					<div
						className={styles.critical}
						style={{ width: summary.c + '%' }}></div>
				)}
				{showInfo && (
					<div className={styles.high} style={{ width: summary.h + '%' }}></div>
				)}
				{showInfo && (
					<div className={styles.med} style={{ width: summary.m + '%' }}></div>
				)}
				{showInfo && (
					<div className={styles.low} style={{ width: summary.l + '%' }}></div>
				)}
				{showInfo && (
					<div
						className={styles.negligible}
						style={{ width: summary.n + '%' }}></div>
				)}
			</div>

			{/* PERCENT LABELS */}
			<div className={styles.percentagesContainer}>
        {printPercent}
			</div>
		</div>
	);
}

export default ImagesSummary;