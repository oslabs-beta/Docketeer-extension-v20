import React, { useEffect, useRef, useState } from 'react';
import styles from './GraphModal.module.scss';
import { useAppSelector } from '../../../reducers/hooks';
import Client from '../../../models/Client';
import { ScanObject } from '../../../../ui-types';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

/* React-Chartjs-2 doc:
  https://react-chartjs-2.js.org/
  register globally to render as component!
 */
ChartJS.register(ArcElement, Tooltip, Legend);

interface GraphModalProps {
	trigger: boolean;
	setTrigger: (value: boolean) => void;
	index: number;
}

const GraphModal = ({
	trigger,
	setTrigger,
	index,
}: GraphModalProps): React.JSX.Element => {
	const modalRef = useRef<HTMLDivElement>(null);
	const scanName =
		useAppSelector((state) => state.images.imagesList[index].ScanName) || false;
	const vulList: ScanObject = useAppSelector(
		(state) => state.images.imagesList[index].Vulnerabilities
	);
	const levels: string[] = Object.keys(vulList ?? {});
  const dataVul: number[] = Object.values(vulList ?? {});
  const total: number = dataVul.reduce((acc, cur) => acc + cur, 0); 
  const percentArr: string[] = dataVul.map(
		(value) => ((value / total) * 100).toFixed(2) + '%'
	);

  // Pie Chart Configuration
  const options = {
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
				callbacks: {
					label: (context) => {
						const label = levels[context.dataIndex];
						const value = dataVul[context.dataIndex];
						const percentage = percentArr[context.dataIndex];
						return `${label}: ${value} - ${percentage}`;
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
	};

  // Pie chart props
	const data = {
		labels: levels,
		datasets: [
			{
				label: 'Count: ',
				data: dataVul,
				backgroundColor: [
					'rgba(255, 99, 132, 0.2)',
					'rgba(54, 162, 235, 0.2)',
					'rgba(255, 206, 86, 0.2)',
					'rgba(75, 192, 192, 0.2)',
					'rgba(153, 102, 255, 0.2)',
					'rgba(255, 159, 64, 0.2)',
				],
				borderColor: [
					'rgba(255, 99, 132, 1)',
					'rgba(54, 162, 235, 1)',
					'rgba(255, 206, 86, 1)',
					'rgba(75, 192, 192, 1)',
					'rgba(153, 102, 255, 1)',
					'rgba(255, 159, 64, 1)',
				],
				borderWidth: 1,
			},
    ],
	};

	const handleClickOutside = (event: MouseEvent) => {
		if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
			setTrigger(false);
		}
	};

	useEffect(() => {
		if (trigger) {
			document.addEventListener('mousedown', handleClickOutside);
		}
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [trigger, setTrigger]);

	return trigger ? (
		<div className={styles.popup} ref={modalRef}>
			<div className={styles.popupInner}>
				<div className={styles.header}>
					<h2 className={styles.popuptitle}>{scanName}</h2>
					{/* close button */}
					<button className={styles.closeBtn} onClick={() => setTrigger(false)}>
						x
					</button>
				</div>
				{/* PIE CHART HERE */}
				<div className={styles.graphContainer}>
					<div className={styles.pieCanvas}>
						<Pie data={data} options={options}/>
					</div>
				</div>
			</div>
		</div>
	) : (
		<></>
	);
};

export default GraphModal;
