import React from 'react';
import { useState, useEffect } from 'react';
import styles from './ImagesSummary.module.scss';
import { useAppSelector, useAppDispatch } from '../../reducers/hooks';
import { ImageType } from '../../../../types';
import { updateTotalVul } from '../../reducers/imageReducer';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';

/**
 * @module | ImagesSummary.tsx
 * @description | displays a summary of vulnerabilities across all images
 **/

interface ImagesSummaryProps {
  setScanDone: (boolean) => void;
  reset: boolean;
  isHovered: string;
  setIsHovered: (string) => void;
  highContrast: boolean;
}

const ImagesSummary = ({
	setScanDone,
	reset,
	isHovered,
	setIsHovered,
	highContrast,
}: ImagesSummaryProps): React.JSX.Element => {
	const [showInfo, setShowInfo] = useState<boolean>(false);
	const [click, setClick] = useState<string>('');
	const [summary, setSummary] = useState<object>({
		c: 0,
		h: 0,
		m: 0,
		l: 0,
		n: 0,
		u: 0,
	});

	const dispatch = useAppDispatch();

	let makeSummary;
	console.log('makeSummary outside useEffect: ', makeSummary);
	const imagesList: ImageType[] = useAppSelector(
		(state) => state.images.imagesList
	);

	const handleHover = (level) => {
		if (!click) setIsHovered(level);
	};

	const handleHoverExit = () => {
		if (!click) setIsHovered('');
	};

	const handleHoverClick = (level) => {
		if (!click || click !== level) {
			setClick(level);
			setIsHovered(level);
		} else {
			// click on same level
			setClick('');
			setIsHovered('');
		}
	};


	// Looping until all cards are done
	useEffect(() => {
		makeSummary = imagesList.every(
			(imageObj) => imageObj.Vulnerabilities !== undefined
		);
		console.log('makeSummary: Are all vulnerabilities done?: ', makeSummary);

		setScanDone(makeSummary);

		if (makeSummary) {
			let critical = 0;
			let high = 0;
			let med = 0;
			let low = 0;
			let negligible = 0;
			let unknown = 0;

			imagesList.forEach((imageObj) => {
				if (!imageObj.Vulnerabilities) return
				critical +=
					typeof imageObj.Vulnerabilities.Critical === 'number'
						? imageObj.Vulnerabilities.Critical
						: 0;
				high +=
					typeof imageObj.Vulnerabilities.High === 'number'
						? imageObj.Vulnerabilities.High
						: 0;
				med +=
					typeof imageObj.Vulnerabilities.Medium === 'number'
						? imageObj.Vulnerabilities.Medium
						: 0;
				low +=
					typeof imageObj.Vulnerabilities.Low === 'number'
						? imageObj.Vulnerabilities.Low
						: 0;
				negligible +=
					typeof imageObj.Vulnerabilities.Negligible === 'number'
						? imageObj.Vulnerabilities.Negligible
						: 0;
				unknown +=
					typeof imageObj.Vulnerabilities.Unknown === 'number'
						? imageObj.Vulnerabilities.Unknown
						: 0;
			});

			console.log(
				`high: ${high}, med: ${med}, low: ${low}, critical: ${critical}, negligble: ${negligible}, unknown: ${unknown}`
			);

			const total = critical + high + med + low + negligible + unknown;
			console.log('total vulnerabilities: ', total);

			if (total !== 0) {
				setSummary({
					c: (critical / total) * 100,
					h: (high / total) * 100,
					m: (med / total) * 100,
					l: (low / total) * 100,
					n: (negligible / total) * 100,
					u: (unknown / total) * 100,
				});
				setShowInfo(true);
				dispatch(updateTotalVul({ totalVul: total }));
			}
		}
	}, [imagesList]);

	const levels: string[] = [
		'Critical',
		'High',
		'Medium',
		'Low',
		'Negligible',
		'Unknown',
	];
	const printPercent: React.JSX.Element[] = levels.map((el, i) => {
		console.log(el)
		return (
      <div className={styles.boxPercent} key={i}>
				<div
          className={
            highContrast
              ? styles[`high-contrast-${el.toLowerCase()}Percent`]
              : styles[`${el.toLowerCase()}Percent`]
          }
          style={isHovered === el ? { filter: 'brightness(1.3)' } : undefined}></div>
        <p className={`${styles.textColor}`}>
          {`${el.toUpperCase()} `}
          {showInfo && (
            <span className={styles.percentNumber}>
              {summary[el[0].toLowerCase()].toFixed(2) + '%'}
            </span>
          )}
        </p>
      </div>
    );
	});


	// Rescan Image Summary
	useEffect(() => {
		if (reset) {
			setSummary({
				c: 0,
				h: 0,
				m: 0,
				l: 0,
				n: 0,
				u: 0,
			});
			setShowInfo(false);
		}
	}, [reset]);

return (
  <div className={highContrast ? styles.highContrast : ''}>
    <div className={showInfo && styles.summaryCard}>
      {/* Show Loading message when vulnerabilities have not yet completed */}
      {!showInfo && (
        <Box sx={{ width: '100%', height: 10, borderRadius: 20 }}>
          <LinearProgress sx={{ height: '100%', borderRadius: 20 }} />
        </Box>
      )}

      {/* PERCENT BAR */}
      {showInfo && (
        <div
          className={highContrast ? styles['high-contrast-critical'] : styles.critical}
          style={
            click === 'Critical'
              ? { width: summary['c'] + '%', filter: 'brightness(1.3)' }
              : { width: summary['c'] + '%' }
          }
          onMouseEnter={() => handleHover('Critical')}
          onMouseLeave={handleHoverExit}
          onClick={() => handleHoverClick('Critical')}></div>
      )}
      {showInfo && (
        <div
          className={highContrast ? styles['high-contrast-high'] : styles.high}
          style={
            click === 'High'
              ? { width: summary['h'] + '%', filter: 'brightness(1.3)' }
              : { width: summary['h'] + '%' }
          }
          onMouseEnter={() => handleHover('High')}
          onMouseLeave={handleHoverExit}
          onClick={() => handleHoverClick('High')}></div>
      )}
      {showInfo && (
        <div
          className={highContrast ? styles['high-contrast-med'] : styles.med}
          style={
            click === 'Medium'
              ? { width: summary['m'] + '%', filter: 'brightness(1.3)' }
              : { width: summary['m'] + '%' }
          }
          onMouseEnter={() => handleHover('Medium')}
          onMouseLeave={handleHoverExit}
          onClick={() => handleHoverClick('Medium')}></div>
      )}
      {showInfo && (
        <div
          className={highContrast ? styles['high-contrast-low'] : styles.low}
          style={
            click === 'Low'
              ? { width: summary['l'] + '%', filter: 'brightness(1.3)' }
              : { width: summary['l'] + '%' }
          }
          onMouseEnter={() => handleHover('Low')}
          onMouseLeave={handleHoverExit}
          onClick={() => handleHoverClick('Low')}></div>
      )}
      {showInfo && (
        <div
          className={highContrast ? styles['high-contrast-negligible'] : styles.negligible}
          style={
            click === 'Negligile'
              ? { width: summary['n'] + '%', filter: 'brightness(1.3)' }
              : { width: summary['n'] + '%' }
          }
          onMouseEnter={() => handleHover('Negligible')}
          onMouseLeave={handleHoverExit}
          onClick={() => handleHoverClick('Negligible')}></div>
      )}
      {showInfo && (
        <div
          className={highContrast ? styles['high-contrast-unknown'] : styles.unknown}
          style={
            click === 'Unknown'
              ? { width: summary['u'] + '%', filter: 'brightness(1.3)' }
              : { width: summary['u'] + '%' }
          }
          onMouseEnter={() => handleHover('Unknown')}
          onMouseLeave={handleHoverExit}
          onClick={() => handleHoverClick('Unknown')}></div>
      )}
    </div>

    {/* PERCENT LABELS */}
    <div className={styles.percentagesContainer}>{printPercent}</div>
  </div>
);
};

export default ImagesSummary;
