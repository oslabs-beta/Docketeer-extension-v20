import React, { useEffect, useState } from 'react';
import styles from './CompareModal.module.scss';
import { MongoData, ScanObject } from '../../../../ui-types';
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
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import { ChartData } from 'chart.js';

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
	data: [string | number, number][];
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
				// configurate tooltip on hover on each data dot
				callbacks: {
					title: (ctx) => {
						return ctx[0].dataset.label;
					},
					label: (ctx) => {
						const scanName = ctx.dataset.label;
						const timeStamp = ctx.label;
						const imagesList = historyData.filter(
							(document) => document.timeStamp === timeStamp
						)[0].imagesList;
						const vulObj: ScanObject = imagesList.filter(
							(image: ImageType) => image.ScanName === scanName
						)[0].Vulnerabilities;
						const { Critical, High, Medium, Low, Negligible, Unknown } = vulObj;
						return [
							`------------ Total Count: ${ctx.raw} ------------`,
							`Critical: ${Critical ? Critical : 0}`,
							`High: ${High ? High : 0}`,
							`Medium: ${Medium ? Medium : 0}`,
							`Low: ${Low ? Low : 0}`,
							`Negligible: ${Negligible ? Negligible : 0}`,
							`Unknown: ${Unknown ? Unknown : 0}`,
							`------------------------------------------`,
						];
					},
					footer: (ctx) => {
						return ctx[0].label;
					},
				},
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
				grid: {
					color: '#121d21',
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
				grid: {
					color: '#121d21',
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
		return Object.values(object).reduce((acc: ScanObject, cur) => acc + cur);
	};

	// data pass into Line chart
	const data: { labels: string[]; datasets: DataSet[]; } = {
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
		// Adjust bigObj to fill in missing data with null
		// we want the dataset to be [null, 10] if the first timestamp we don't have it and second one we do
		imagesListArr.forEach((document, index) => {
			for (let key in bigObj) {
				if (!document.find((imgObj) => imgObj.ScanName === key)) {
					// If the key doesn't exist in the current timestamp, insert null
					bigObj[key].splice(index, 0, null);
				}
			}
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
					<Tooltip
						title='Click background for more info'
						placement='right-end'
						arrow
						TransitionComponent={Zoom}>
						<IconButton
							style={{ position: 'absolute', bottom: '6vh', left: '22.5vw' }}>
							<InfoIcon />
						</IconButton>
					</Tooltip>
					{/* close button */}
					<button className={styles.closeBtn} onClick={() => setTrigger(false)}>
						x
					</button>
				</div>
				{/* Dropdown Data */}
				{historyData.length === 0 ? (
					<Box sx={{ width: '100%', height: 30 }}>
						<LinearProgress sx={{ height: '100%' }} />
					</Box>
				) : (
					<DropDownData
						selectedTime={selectedTime}
						setSelectedTime={setSelectedTime}
						time={time}
					/>
				)}
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
