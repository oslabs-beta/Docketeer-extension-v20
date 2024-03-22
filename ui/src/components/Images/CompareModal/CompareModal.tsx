import React, { useEffect, useState } from 'react';
import styles from './CompareModal.module.scss';
import { MongoData, ScanObject } from '../../../../ui-types';
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

interface DataSet {
	label: string;
	data: number[];
	borderColor: string;
	tension: number;
}

const CompareModal = ({
	trigger,
	setTrigger,
}: CompareModalProps): React.JSX.Element => {
	const [historyData, setHistoryData] = useState<MongoData[]>([]);
	const [time, setTime] = useState<string[]>([]);
	// selected
	const [selectedTime, setSelectedTime] = useState<{ value: string; label: string }[]>([]);
	const [dataState, setDataState] = useState<DataSet[]>([]);

	// get all the MongoDB data
	const getHistory = async (): Promise<void> => {
		try {
			const mongoData: MongoData[] = await Client.ImageService.getHistory();
			setHistoryData(mongoData);
			setTime(mongoData.map((el) => el.timeStamp));
			return;
		} catch (error) {
			// Log error if failed
			console.log('getHistory has failed to get data: ', error);
		}
	};

	// config for line chart
	const options: object = {
		backgroundColor: '#011924',
		plugins: {
			legend: {
				labels: {
					font: {
						size: 20,
					},
					color: 'white',
					backgroundColor: 'white',
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
		scales: {
			x: {
				title: {
					display: true,
					text: 'TimeStamp',
					color: 'white',
					font: {
						size: 20,
					},
				},
			},
			y: {
				title: {
					display: true,
					text: 'Total Vulnerability',
					color: 'white',
					font: {
						size: 20,
					},
				},
			},
		},
	};

	// onclick for LATER!
	const onClick = {};

	const generateRandomColor = (): string => {
		const red: number = Math.floor(Math.random() * 256);
		const green: number = Math.floor(Math.random() * 256);
		const blue: number = Math.floor(Math.random() * 256);
		const hexColor: string =
			'#' +
			((1 << 24) + (red << 16) + (green << 8) + blue).toString(16).slice(1);
		return hexColor;
	}

	const totalFunc = (object: ScanObject) => {
		return Object.values(object).reduce((acc, cur) => acc + cur);
	};

	// data pass into Line chart
	const data: object = {
		// x-axis label --> timeStamp
		labels:
			selectedTime.length === 0
				? time
				: selectedTime
						.map((item) => new Date(item.value))
						.sort((a: any, b: any) => a - b)
						.map((date) => date.toLocaleString()),
		// y-axis label --> totalVul
		datasets: dataState,
	};

	const makeDataSet = (mongoDataArr: MongoData[]): void => {
		const imagesListArr: any = mongoDataArr.map(
			(document) => document.imagesList
		);
		const bigObj: object = {};
		imagesListArr.forEach((timeStamp) => {
			timeStamp.forEach((imgObj) => {
				const total = totalFunc(imgObj.Vulnerabilities);
				if (!bigObj[imgObj.ScanName]) bigObj[imgObj.ScanName] = [total];
				else bigObj[imgObj.ScanName].push(total);
			});
		});
		const names: string[] = Object.keys(bigObj);
		const dataset: DataSet[] = names.map((name, i) => {
			return {
				label: name,
				data: bigObj[name],
				borderColor: generateRandomColor(),
				tension: 0.4,
			};
		});
		setDataState(dataset);
	};

	// UPON HISTORY MODAL STATE CHANGE
	useEffect(() => {
		if (trigger) getHistory();
	}, [trigger, setTrigger]);

	// Effect to update dataState when selectedTime changes
	useEffect(() => {
		if (selectedTime.length === 0) {
			makeDataSet(historyData);
		} else {
			// reset it
			setDataState([]);
			const selectedMongoData: MongoData[]  = historyData.filter((data) =>
				selectedTime
					.map((item) => new Date(item.value))
					.sort((a: any, b: any) => a - b)
					.map((date) => date.toLocaleString())
					.includes(data.timeStamp)
			);
			makeDataSet(selectedMongoData);
		}
	}, [selectedTime, historyData]);

	return trigger ? (
		<div className={styles.popup}>
			<div className={styles.popupInner}>
				<div className={styles.header}>
					<h2 className={styles.popuptitle}>SCAN HISTORY</h2>
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
