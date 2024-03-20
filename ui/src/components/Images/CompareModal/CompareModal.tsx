import React, { useEffect, useRef } from 'react';
import styles from './CompareModal.module.scss';
import { useAppSelector } from '../../../reducers/hooks';
import { ScanObject } from '../../../../ui-types';
import { Chart as ChartJS, ArcElement, Tooltip as ChartToolTip, Legend } from 'chart.js';
import { Tooltip, IconButton } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import Zoom from '@mui/material/Zoom';
import Client from '../../../models/Client';

/* React-Chartjs-2 doc:
  https://react-chartjs-2.js.org/
	https://www.chartjs.org/docs/latest/
  register globally to render as component!
 */
ChartJS.register(ArcElement, ChartToolTip, Legend);

interface CompareModalProps {
  trigger: boolean;
  setTrigger: (value: boolean) => void;
}

const CompareModal = ({
  trigger,
  setTrigger,
}: CompareModalProps): React.JSX.Element => {
	const modalRef = useRef<HTMLDivElement>(null);

	const handleClickOutside = (event: MouseEvent): void => {
		if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
			setTrigger(false);
		}
  };
  
  const getHistory = async (scanName: string, scanType: string): Promise<void> => {
    try {
			
			return;
		} catch (error) {
			// Log error if failed
			console.log('getHistory has failed to get data: ', error);
		}
  }

	useEffect(() => {
		if (trigger) {
			document.addEventListener('mousedown', handleClickOutside);
		}
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [trigger, setTrigger]);

	// UPON MOUNTED
	useEffect(() => {
		getHistory;
	}, []);

	return trigger ? (
		<div className={styles.popup} ref={modalRef}>
			<div className={styles.popupInner}>
				<div className={styles.header}>
					<h2 className={styles.popuptitle}>COMPARE</h2>
					<div
						style={{
							position: 'relative',
							display: 'inline-block',
							marginTop: '-20px',
							marginLeft: '10px',
						}}></div>
					{/* close button */}
					<button className={styles.closeBtn} onClick={() => setTrigger(false)}>
						x
					</button>
				</div>
				<Tooltip
					title='ADD INFO HERE'
					placement='left-start'
					arrow
					TransitionComponent={Zoom}>
					<IconButton style={{ position: 'absolute', right: '1px' }}>
						<InfoIcon />
					</IconButton>
				</Tooltip>
			</div>
		</div>
	) : (
		<></>
	);
};

export default CompareModal;
