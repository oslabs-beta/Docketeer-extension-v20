import React, { useEffect, useRef, useState } from 'react';
import styles from './CompareModal.module.scss';
import { useAppSelector } from '../../../reducers/hooks';
import { MongoData } from '../../../../ui-types';
import { Chart as ChartJS, ArcElement, Tooltip as ChartToolTip, Legend } from 'chart.js';
import { Tooltip, IconButton } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import Zoom from '@mui/material/Zoom';
import Client from '../../../models/Client';
import DropDownData from './DropDownData';

/* React-Chartjs-2 doc:
  https://react-chartjs-2.js.org/
	https://www.chartjs.org/docs/latest/
  register globally to render as component!
 */
ChartJS.register(ArcElement, ChartToolTip, Legend);

/* React-Select
	Link: https://react-select.com/home#getting-started
	Example: https://codesandbox.io/p/sandbox/react-select-custom-dark-8leq1?file=%2Fsrc%2FApp.js
 */

interface CompareModalProps {
  trigger: boolean;
  setTrigger: (value: boolean) => void;
}

const CompareModal = ({
  trigger,
  setTrigger,
}: CompareModalProps): React.JSX.Element => {
	const modalRef = useRef<HTMLDivElement>(null);
	const [historyData, setHistoryData] = useState<MongoData[]>([]);
	const [time, setTime] = useState<string[]>([]);
	// selected
	const [selectedTime, setSelectedTime] = useState<[]>([]);

	const handleClickOutside = (event: MouseEvent): void => {
		if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
			setTrigger(false);
		}
	};

	// get all the MongoDB data
	const getHistory = async (): Promise<void> => {
		try {
			const mongoData: MongoData[] = await Client.ImageService.getHistory();
			console.log('MONGODATA: ', mongoData);

			setHistoryData(mongoData);
			setTime(mongoData.map((el) => el.timeStamp));

			return;
		} catch (error) {
			// Log error if failed
			console.log('getHistory has failed to get data: ', error);
		}
	};

	useEffect(() => {
		if (trigger) {
			// document.addEventListener('mousedown', handleClickOutside);
			getHistory();
		}
		return () => {
			// document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [trigger, setTrigger]);

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
				{/* Dropdown Data */}
				<div>
					<DropDownData
						selectedTime={selectedTime}
						setSelectedTime={setSelectedTime}
						time={time}
					/>
				</div>
			</div>
		</div>
	) : (
		<></>
	);
};

export default CompareModal;
