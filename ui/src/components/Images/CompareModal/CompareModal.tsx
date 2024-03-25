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
import { cross } from 'd3';

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
	pointStyle: string;
	cards: number[];
}

const CompareModal = ({
	trigger,
	setTrigger,
}: CompareModalProps): React.JSX.Element => {
	const [historyData, setHistoryData] = useState<MongoData[]>([]);
	const [time, setTime] = useState<string[]>([]);
	const [selectedTime, setSelectedTime] = useState<
		{ value: string; label: string }[]
	>([]);
	const [dataState, setDataState] = useState<DataSet[]>([]);
	const [scaleCardsPlugin, setScaleCardsPlugin] = useState<any>({});
	const [paddingBottom, setPaddingBottom] = useState<number>(0);

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

	const generateRandomPointStyle = (): string => {
		const pointStyles = [
			'circle',
			'rect',
			'rectRounded',
			'rectRot',
			'star',
			'triangle',
		];
		const randomIndex = Math.floor(Math.random() * pointStyles.length);
		return pointStyles[randomIndex];
	};

	const setupScaleCardsPlugin = (): object => {
		return {
			id: 'scaleCards',
			beforeDatasetsDraw(chart, args, plugins): void {
				const {
					ctx,
					data,
					scales: { x, y },
					options,
				} = chart;
				ctx.save();

				// helper functions
				const flagPole = (xStart, yStart, xEnd, yEnd): void => {
					ctx.beginPath();
					ctx.lineWidth = 2;
					ctx.strokeStyle = '#086afc';
					ctx.fillStyle = '#548fbf';
					ctx.moveTo(xStart, yStart);
					ctx.lineTo(xEnd, yEnd);
					ctx.stroke();
				};

				const flag = (x, y, w, h): void => {
					ctx.beginPath();
					ctx.lineWidth = 2;
					ctx.strokeStyle = '#086afc';
					ctx.fillStyle = '#548fbf';
					ctx.rect(x, y, w, h);
					ctx.fill();
					ctx.stroke();
				};

				const flagText = (label, x, y): void => {
					ctx.font = 'bold 15px sans-serif';
					ctx.fillStyle =
						label > 0 ? '#d42319' : label < 0 ? '#1deb1a' : 'white';
					ctx.textAlign = 'center';
					ctx.fillText(label > 0 ? `+${label}` : label, x, y);
				};

				// loop through each data and make the label below
				data.datasets[0].cards.forEach((cardText, index) => {
					const textWidth = ctx.measureText(cardText).width;

					const boundary =
						chart.getDatasetMeta(0).data[index].x + (textWidth + 20);
					if (boundary > x.right) {
						flag(
							chart.getDatasetMeta(0).data[index].x - textWidth - 20,
							x.bottom + 50,
							textWidth + 20,
							20
						);
						flagPole(
							chart.getDatasetMeta(0).data[index].x,
							x.bottom,
							chart.getDatasetMeta(0).data[index].x,
							x.bottom + 50
						);
						flagText(
							cardText,
							chart.getDatasetMeta(0).data[index].x - textWidth,
							x.bottom + 60
						);
					} else {
						flag(
							chart.getDatasetMeta(0).data[index].x,
							x.bottom + 20,
							textWidth + 20,
							20
						);
						flagPole(
							chart.getDatasetMeta(0).data[index].x,
							x.bottom,
							chart.getDatasetMeta(0).data[index].x,
							x.bottom + 20
						);
						flagText(
							cardText,
							chart.getDatasetMeta(0).data[index].x + textWidth,
							x.bottom + 30
						);
					}
				});
			},
		};
	};

	let crosshair: any;
	const crosshairLabel = {
		id: 'crosshairLabel',
		color: '#121d21',

		// drawing
		afterDatasetsDraw(chart): void {
			const { ctx } = chart;
			// Access the crosshair variable
			ctx.lineWidth = 2;
			ctx.strokeStyle = '#2a3647';

			if (crosshair) {
				ctx.save();
				ctx.beginPath();
				crosshair.forEach((line) => {
					ctx.moveTo(line.startX, line.startY);
					ctx.lineTo(line.endX, line.endY);
					ctx.setLineDash([5, 5]);
					ctx.stroke();
				});
			}
		},

		// mouse move
		afterEvent(chart, args): void {
			const { chartArea: { left, right, top, bottom } } = chart;
			const xCoor = args.event.x;
			const yCoor = args.event.y;

			// if mouse out of chart
			if (!args.inChartArea && crosshair) {
				crosshair = undefined;
				args.changed = true;
			} else if (args.inChartArea) {
				// Set crosshair position
				crosshair = [
					{
						startX: left,
						startY: yCoor,
						endX: right,
						endY: yCoor,
					},
					{
						startX: xCoor,
						startY: top,
						endX: xCoor,
						endY: bottom,
					},
				];
				args.changed = true;
			}
		},
	};

	// config for line chart
	const options: object = {
		onClick: (event: MouseEvent, elements: any[]) => {
			setPaddingBottom(paddingBottom === 0 ? 75 : 0);
		},
		layout: {
			padding: {
				bottom: paddingBottom,
			},
		},
		plugins: {
			legend: {
				labels: {
					font: {
						size: 20,
					},
					color: 'white',
					usePointStyle: true,
				},
			},
			tooltip: {
				// configurate tooltip on hover on each data dot
				usePointStyle: true,
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
	};

	const totalFunc = (object: ScanObject): number => {
		return Object.values(object).reduce((acc: ScanObject, cur) => acc + cur);
	};

	// data pass into Line chart
	const data: { labels: string[]; datasets: DataSet[] } = {
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
		// MAKE DATASET----------
		const names: string[] = Object.keys(bigObj);

		// get totalVul through time
		const lengths = Object.values(bigObj).map((arr) => arr.length);
		const totalTimeStamp: number[] = Array.from(
			{ length: lengths[0] },
			(_, index) =>
				Object.values(bigObj).reduce((acc, curr) => acc + (curr[index] || 0), 0)
		);

		const dataset: DataSet[] = names.map((name, i) => {
			return {
				label: name,
				data: bigObj[name],
				borderColor: generateRandomColor(),
				tension: 0.4,
				pointStyle: generateRandomPointStyle(),
				// TEST
				cards: totalTimeStamp.map((el, i, arr) => i === 0 ? 0 : el - arr[i-1]),
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
			const selectedMongoData: MongoData[] = historyData.filter((data) =>
				selectedTime
					.map((item) => new Date(item.value))
					.sort((a: any, b: any) => a - b)
					.map((date) => date.toLocaleString())
					.includes(data.timeStamp)
			);
			makeDataSet(selectedMongoData);
		}
	}, [selectedTime, historyData]);

	// Ensure MongoDB data load then enable plugins
	useEffect(() => {
		if (historyData.length > 0) {
			const plugin = setupScaleCardsPlugin();
			setScaleCardsPlugin(plugin);
		}
	}, [historyData]);

	return trigger ? (
		<div className={styles.popup}>
			<div className={styles.popupInner}>
				<div className={styles.header}>
					<h2 className={styles.popuptitle}>SCAN HISTORY</h2>
					{/* close button */}
					<button className={styles.closeBtn} onClick={() => setTrigger(false)}>
						x
					</button>
				</div>
				<div>
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
				</div>
				<Tooltip
					title='Click background for Total Vulnerability Comparison! (FIRST LOAD: Close and Reopen History Tab)'
					placement='right-end'
					arrow
					TransitionComponent={Zoom}>
					<IconButton style={{ position: 'absolute' }}>
						<InfoIcon />
					</IconButton>
				</Tooltip>
				{/* Line Chart */}
				<div className={styles.graphContainer}>
					<div className={styles.lineCanvas}>
						<Line
							data={data}
							options={options}
							plugins={[crosshairLabel, scaleCardsPlugin]}
						/>
					</div>
				</div>
			</div>
		</div>
	) : (
		<></>
	);
};

export default CompareModal;
