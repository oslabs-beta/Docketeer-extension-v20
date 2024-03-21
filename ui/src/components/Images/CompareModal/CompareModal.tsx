import React, { useEffect, useRef, useState } from 'react';
import styles from './CompareModal.module.scss';
import { useAppSelector } from '../../../reducers/hooks';
import { MongoData } from '../../../../ui-types';
import { ImageType } from '../../../../../types';
import {
	Chart as ChartJS,
	Tooltip as ChartToolTip,
	Legend,
	LineElement,
	PointElement,
	CategoryScale,
	LinearScale,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
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
ChartJS.register(
	ChartToolTip,
	Legend,
	LineElement,
	PointElement,
	CategoryScale,
	LinearScale
);

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

	const handleClickOutside = (event: MouseEvent): void => {
		if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
			setTrigger(false);
		}
	};

	// UPON HISTORY MODAL STATE CHANGE
	useEffect(() => {
		if (trigger) {
			// document.addEventListener('mousedown', handleClickOutside);
			getHistory();
		}
		return () => {
			// document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [trigger, setTrigger]);

	// config for line chart
	const options: object = {
		plugins: {
			legend: {
				labels: {
					font: {
						size: 20, // Set the desired font size for the legend labels
					},
					color: 'white',
				},
			},
			tooltip: {
				titleFont: {
					size: 25,
				},
				bodyFont: {
					size: 20,
				},
				backgroundColor: 'rgb(2, 108, 194)',
			},
		},
	};

	// onclick for LATER!
	const onClick = {};

	function generateRandomColor() {
		// Generate random RGB values
		const red = Math.floor(Math.random() * 256);
		const green = Math.floor(Math.random() * 256);
		const blue = Math.floor(Math.random() * 256);

		// Convert RGB to hexadecimal
		const hexColor =
			'#' +
			((1 << 24) + (red << 16) + (green << 8) + blue).toString(16).slice(1);

		return hexColor;
	}

	const totalFunc = (object) => {
		return Object.values(object).reduce((acc: any, cur: any) => acc + cur);
	};

	const imagesListArr: any = historyData.map((document) => document.imagesList);
	console.log('imagesListArr: ', imagesListArr);

	const bigObj = {};
	/* {
    card1 : [total each time],
    card2 : [total each doc],
    card3 : [total each doc],
  }
   */
	imagesListArr.forEach((timeStamp) => {
		timeStamp.forEach((document) => {
			// calculate value of that card in that timestamp
			const total = totalFunc(document.Vulnerabilities);

			// set the name default to empty array
			if (!bigObj[document.ScanName]) bigObj[document.ScanName] = [total];
			else bigObj[document.ScanName].push(total);
		});
	});
	console.log('BIG-OBJ with names: ', bigObj);

	const names = Object.keys(bigObj);
	console.log('NAMES: ', names);
	const dataset = names.map((name, i) => {
		console.log(`${name} - ${bigObj[name]}`);
		return {
			label: name,
			data: bigObj[name],
			borderColor: generateRandomColor(),
			tension: 0.4,
		};
	});

	const data: object = {
		labels: time, // x-axis label --> timeStamp
		datasets: dataset,
	};

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
				{/* Line Chart */}
				<div className={styles.graphContainer}>
					<div className={styles.lineCanvas}>
						<Line data={data} options={options} />
					</div>
				</div>
			</div>
		</div>
	) : (
		<></>
	);
};

export default CompareModal;
