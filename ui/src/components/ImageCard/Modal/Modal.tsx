import React, { useEffect, useRef, useState } from 'react';
import styles from './Modal.module.scss';
import { useAppSelector } from '../../../reducers/hooks';

interface ModalProps {
	trigger: boolean;
	setTrigger: (value: boolean) => void;
	index: number;
}

const Modal = ({
	trigger,
	setTrigger,
	index,
}: ModalProps): React.JSX.Element => {
	const everythingFromStore =
		useAppSelector((state) => state.images.imagesList[index].Everything) ||
		false;

	const everythingName =
		useAppSelector((state) => state.images.imagesList[index].ScanName) || false;

	const [selectedLevel, setSelectedLevel] = useState<string>('');

	const handleButtonClick = (level: string) => {
		if (everythingFromStore[level].length > 0) {
			setSelectedLevel(level);
		}
	};

	const modalRef = useRef<HTMLDivElement>(null);

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
		<div
			className={styles.popup}
			ref={modalRef}>
			<div className={styles.popupInner}>
				<div className={styles.header}>
					<h2 className={styles.popuptitle}>{everythingName}</h2>
					{/* Buttons for each level */}
					<div className={styles.buttonsContainer}>
						{Object.keys(everythingFromStore).map((level) => (
							<button
								key={level}
								onClick={() => handleButtonClick(level)}
								className={selectedLevel === level ? styles.activeButton : ''}>
								{level}
							</button>
						))}
					</div>
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
											<td>{item['Vulnerability ID']}</td>
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

export default Modal;
