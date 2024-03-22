import React, { useEffect, useRef, useState } from 'react';
import styles from './InfoModal.module.scss';
import { useAppSelector } from '../../../reducers/hooks';
import Client from '../../../models/Client';
import PieChart from '../../../../assets/piechart.svg';

interface ModalProps {
	trigger: boolean;
	setTrigger: (value: boolean) => void;
	index: number;
	severity: string;
	setgraphModal: (boolean) => void;
	setDropDown: (boolean) => void;
}

const InfoModal = ({
	trigger,
	setTrigger,
	index,
	severity,
	setgraphModal,
	setDropDown,
}: ModalProps): React.JSX.Element => {
	const [selectedLevel, setSelectedLevel] = useState<string>(severity);
	const modalRef = useRef<HTMLDivElement>(null);
	const everythingFromStore: object | boolean =
		useAppSelector((state) => state.images.imagesList[index].Everything) ||
		false;
	const everythingName: string | boolean =
		useAppSelector((state) => state.images.imagesList[index].ScanName) || false;

	const handleButtonClick = (level: string): void => {
		if (everythingFromStore[level].length > 0) {
			setSelectedLevel(level);
		}
	};

	const handleClickOutside = (event: MouseEvent): void => {
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
					<h2 className={styles.popuptitle}>{everythingName}</h2>
					{/* Pie button */}
					<img
						src={PieChart}
						className={styles.imgCardButton}
						onClick={() => {
							setTrigger(false);
							// reset other 2 states
							setgraphModal(true);
							setDropDown({
								critical: false,
								high: false,
								medium: false,
								low: false,
								negligible: false,
								unknown: false,
							});
						}}></img>
					{/* close button */}
					<button className={styles.closeBtn} onClick={() => setTrigger(false)}>
						x
					</button>
					{/* Buttons for 5 levels */}
				</div>
				<div className={styles.buttonsContainer}>
					{Object.keys(everythingFromStore).map((level) => (
						<button
							key={level}
							onClick={() => handleButtonClick(level)}
							className={
								selectedLevel === level
									? styles.chosenButton
									: everythingFromStore[level].length !== 0
									? styles.activeButton
									: styles.inactiveButton
							}>
							{level}
						</button>
					))}
				</div>
				{/* Render the table based on the selected level */}
				{selectedLevel && (
					<div className={styles.tableContainer}>
						<table className={styles.table}>
							<thead>
								<tr>
									<th>Package</th>
									<th>Version Installed</th>
									<th>Vulnerability ID</th>
								</tr>
							</thead>
							<tbody>
								{everythingFromStore[selectedLevel].map(
									(item: any, index: number) => (
										<tr key={index}>
											<td>{item.Package}</td>
											<td>{item['Version Installed']}</td>
											<td>
												{item['Vulnerability ID'].startsWith('CVE') ? (
													<a
														className={styles.linkID}
														href={`https://nvd.nist.gov/vuln/detail/${item['Vulnerability ID']}`}
														onClick={async (e) => {
															await Client.ImageService.openLink(
																`https://nvd.nist.gov/vuln/detail/${item['Vulnerability ID']}`
															);
														}}
														rel='noopener noreferrer'>
														{item['Vulnerability ID']}
													</a>
												) : (
													item['Vulnerability ID']
												)}
											</td>
										</tr>
									)
								)}
							</tbody>
						</table>
					</div>
				)}
			</div>
		</div>
	) : (
		<></>
	);
};

export default InfoModal;
