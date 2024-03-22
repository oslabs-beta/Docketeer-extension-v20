import React, { useEffect, useRef } from 'react';
import styles from './GraphModal.module.scss';
import { useAppSelector } from '../../../reducers/hooks';
import { ScanObject } from '../../../../ui-types';
import { Chart as ChartJS, ArcElement, Tooltip as ChartToolTip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { Tooltip, IconButton } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import Zoom from '@mui/material/Zoom';
import { ChartData } from 'chart.js/auto';

/* React-Chartjs-2 doc:
  https://react-chartjs-2.js.org/
	https://www.chartjs.org/docs/latest/
  register globally to render as component!
 */
ChartJS.register(ArcElement, ChartToolTip, Legend);

interface GraphModalProps {
  trigger: boolean;
  setTrigger: (value: boolean) => void;
  index: number;
  setModalToggler: (boolean) => void;
  toggleDropdown: (string) => void;
}

const GraphModal = ({
  trigger,
  setTrigger,
  index,
  setModalToggler,
  toggleDropdown,
}: GraphModalProps): React.JSX.Element => {
  const modalRef = useRef<HTMLDivElement>(null);
  const scanName: string | boolean =
    useAppSelector((state) => state.images.imagesList[index].ScanName) || false;
  const vulList: ScanObject = useAppSelector(
    (state) => state.images.imagesList[index].Vulnerabilities
  );

  // Calculation for Pie Chart
  const levels: string[] = Object.keys(vulList ?? {});
  const dataVul: number[] = Object.values(vulList ?? {});
  const total: number = dataVul.reduce((acc, cur) => acc + cur, 0);
  const percentArr: string[] = dataVul.map(
    (value) => ((value / total) * 100).toFixed(2) + "%"
  );

  // Pie Chart Configuration
  const options: object = {
    plugins: {
      legend: {
        labels: {
          font: {
            size: 30,
          },
          color: "white",
        },
      },
      tooltip: {
        events: ["click"],
        callbacks: {
          label: (context) => {
            // what level is selected
            const label = levels[context.dataIndex];
            const value = dataVul[context.dataIndex];
            const percentage = percentArr[context.dataIndex];

            // open dropdown of that level
            toggleDropdown(label.toLowerCase());
            // open the InfoModal table
            setModalToggler(true);
            // close this modal pie chart
            setTrigger(false);
            return `Count: ${value} - ${percentage}`;
          },
        },
        titleFont: {
          size: 25,
        },
        bodyFont: {
          size: 20,
        },
        backgroundColor: "rgb(2, 108, 194)",
      },
    },
  };

  // Pie chart props
  const data: ChartData<'pie'> = {
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
				borderWidth: 2,
			},
		],
	};

  const handleClickOutside = (event: MouseEvent): void => {
    if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
      setTrigger(false);
    }
  };

  useEffect(() => {
    if (trigger) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [trigger, setTrigger]);

  return trigger ? (
		<div className={styles.popup} ref={modalRef}>
			<div className={styles.popupInner}>
				<div className={styles.header}>
					<h2 className={styles.popuptitle}>{scanName}</h2>
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
					title='Click for Severity Table Info!'
					placement='left-start'
					arrow
					TransitionComponent={Zoom}>
					<IconButton
						style={{ position: 'absolute', right: '1px' }}>
						<InfoIcon />
					</IconButton>
				</Tooltip>
				{/* PIE CHART*/}
				<div className={styles.graphContainer}>
					<div className={styles.pieCanvas}>
						<Pie data={data} options={options} />
					</div>
				</div>
			</div>
		</div>
	) : (
		<></>
	);
};

export default GraphModal;
