import React, { SetStateAction, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../reducers/hooks';
import globalStyles from '../global.module.scss';
import styles from './ImageCard.module.scss';
import { ImageCardProps } from '../../../../types';
import {
  VulnerabilityPayload,
  ScanObject,
	ScanReturn,
	Top3Payload,
} from '../../../ui-types';
import { GrypeScan } from '../../../../backend/backend-types';
import Client from '../../models/Client';
import { updateVulnerabilities, updateTop3 } from '../../reducers/imageReducer';
import DeleteIcon from '../../../assets/delete_outline_white_24dp.svg';
import PlayIcon from '../../../assets/play_arrow_white_24dp.svg';
import { every } from 'd3';
import ImageCardDropdown from './ImageCardDropdown/ImageCardDropdown';

/**
 * @module | ImageCard.tsx
 * @description | new components for images dashboard
 **/

const ImageCard = ({
	imgObj,
	runImageAlert,
	removeImageAlert,
	index,
}: ImageCardProps): React.JSX.Element => {
	const dispatch = useAppDispatch();
	const [done, setDone] = useState<Boolean>(false);

	// get vulnerabilities directly from the store
	let vulnerabilities =
		useAppSelector((state) => state.images.imagesList[index].Vulnerabilities) ||
		false;
  
	let top3ObjFromStore =
		useAppSelector((state) => state.images.imagesList[index].Top3Obj) ||
		false;
  
	console.log(`TOP3 FROM STORE ${imgObj.ScanName}: ${JSON.stringify(top3ObjFromStore)}`);

	const getScan = async (scanName: string) => {
		try {
			// retrieve scan data - Client.ImageService.getScan creates DDClient Request
			const scanObjectReturn: ScanReturn = await Client.ImageService.getScan(
				scanName
			);
			const vulnerabilityObj: ScanObject = scanObjectReturn.vulnerabilites;
			if (!done) setDone(true);

			console.log("scanObjectReturn JSON FOR GRYPE: ", scanObjectReturn);
			console.log(`Success from getScan: ${scanName}`, vulnerabilityObj);

			/* get the info from 5 levels
			ex everything: [{ Package: "busybox", Severity: "Low", Version Installed: "1.36.1", Vulnerability ID: "CVE..." }]
			-> filter each severity into an array of critical objects, array of high objects, etc */
			const everything: GrypeScan[] = scanObjectReturn.everything;
			const critical = everything.filter((el) => el.Severity === "Critical");
			const high = everything.filter((el) => el.Severity === "High");
			const medium = everything.filter((el) => el.Severity === "Medium");
			const low = everything.filter((el) => el.Severity === "Low");
			const negligible = everything.filter(
				(el) => el.Severity === "Negligible"
			);

			/* Get top 3 in an obj
				 {"busybox": count 
					"crytpo": count, 
					"notbusybox": count }
			 */
      
			// Iterate over each array of critical objects and return an array of the top 3
			const top3Info = (levelArray: GrypeScan[]) => {
				const levelObj = {};
				levelArray.forEach((el) => {
					levelObj[el.Package] = (levelObj[el.Package] || 0) + 1;
				});
				// Ex for entries: [['busybox', 6], ['crypto', 10], ['another package name', 28]]
				const entries: [string, number][] = Object.entries(levelObj);
				const sortedEntries = entries.sort((a, b) => b[1] - a[1]);
				const top3Entries = sortedEntries.slice(0, 3);
				console.log("top3Entries inside func: ", top3Entries);
				return top3Entries;
			};
      
			const criticalTop3 = top3Info(critical);
			const highTop3 = top3Info(high);
			const mediumTop3 = top3Info(medium);
			const lowTop3 = top3Info(low);
			const negligibleTop3 = top3Info(negligible);
			console.log('TOP 3 - CRITICAL: ', criticalTop3);
			console.log('TOP 3 - HIGH: ', highTop3);
			console.log('TOP 3 - MEDIUM: ', mediumTop3);
			console.log('TOP 3 - LOW: ', lowTop3);
			console.log('TOP 3 - NEGLIGIBLE: ', negligibleTop3);

			// Dispatch top 3 object with 5 levels to imageList Store in imageReducer
			const top3Obj: Top3Payload = {
				top3Obj: {
					critical: top3Info(critical),
					high: top3Info(high),
					medium: top3Info(medium),
					low: top3Info(low),
					negligible: top3Info(negligible)
				},
				scanName: scanName
			}
			dispatch(updateTop3(top3Obj));

			// if the image failed to be scanned for vulnerabilities, update the image card state to have a default vulnerability object
			if (vulnerabilityObj === undefined) {
				const defaultVul: VulnerabilityPayload = {
					vulnerabilityObj: { Critical: "-", High: "-", Medium: "-", Low: "-" },
					scanName: scanName,
				};
				dispatch(updateVulnerabilities(defaultVul));
				return;
			}

			// create an object of type VulnerabilityPayload with the returned vulnerability object and the scanName
			const updateVul: VulnerabilityPayload = { vulnerabilityObj, scanName };

			// dispatch VulnerabilityPayload to update the imgObj in the store with the vulnerability info
			dispatch(updateVulnerabilities(updateVul));
			console.log("after reducuer invoked", imgObj);
			return;
		} catch (error) {
			// Log error if failed
			console.log('getScan has failed to get vulnerabilities: ', error);
		}
	};

	// DROPDOWN INFO CARD
	const [dropDown, setDropDown] = useState({
		critical: false,
		high: false,
		medium: false,
		low: false,
		negligible: false,
	});
	
	const toggleDropdown = (criticalType: string) => {
		setDropDown((prevState) => {
			// toggle true/false for that criticalType
			prevState[criticalType] = prevState[criticalType] ? false : true;
			// Change OTHER key to false
			for (let key in prevState) {
				prevState[key] = key !== criticalType ? false : prevState[key];
			}
			return { ...prevState };
		});
	};

	// Array to print out all levels
	const levels: string[] = ['Critical', 'High', 'Medium', 'Low', 'Negligible'];
	const printVul: React.JSX.Element[] = levels.map((el, i) => {
    return (<div className={styles.imgVulDiv} key={i} >
      <p
        onClick={() => toggleDropdown(el.toLowerCase())}
        className={`${
          vulnerabilities[el]
            ? styles[el.toLowerCase()]
            : done
            ? styles.green
            : styles.grayOut
        }`}>
        {vulnerabilities[el] && (
          <span className={styles.vulNum}>
            {vulnerabilities[el] ? vulnerabilities[el] : ''}
          </span>
        )}{' '}
        {`${el[0]}`}
      </p>
    </div>)
  });

	// call getScan upon render for each card
	useEffect(() => {
		if (!vulnerabilities) getScan(imgObj.ScanName);
		else setDone(true); // keep the green check
	}, []);

	return (
		<div
			className={
				done && Object.keys(vulnerabilities).length >= 4
					? styles.imageCardCrit
					: done && Object.keys(vulnerabilities).length === 3
						? styles.imageCardHigh
						: done && Object.keys(vulnerabilities).length === 2
							? styles.imageCardMed
							: done && Object.keys(vulnerabilities).length === 1
								? styles.imageCardLow
								: done && Object.keys(vulnerabilities).length === 0
									? styles.imageCardDone
									: styles.imageCard
			}
		>
			{/* vulnerability info card changing border color based on level found */}
			<div className={styles.imageInfo}>
				{/* image scanName: LEFT SIDE */}
				<div>
					<p className={styles.ImageName}>{imgObj["Repository"]}</p>
					<p className={styles.ImageTag}>{imgObj["Tag"]}</p>
				</div>
				{/* VULNERABILITY LEVELS*/}
				<div className={styles.VulnerabilitiesBlock}>
					<div className={styles.imageVulnerabilities}>
						{printVul}
					</div>
					{/* toggler drop down info of vulnerability type clicked */}
					{dropDown.critical && (
						<ImageCardDropdown severity="critical" scanName={imgObj.ScanName} index={index} />
					)}
					{dropDown.high && (
						<ImageCardDropdown severity="high" scanName={imgObj.ScanName} index={index} />
					)}
					{dropDown.medium && (
						<ImageCardDropdown severity="medium" scanName={imgObj.ScanName} index={index} />
					)}
					{dropDown.low && (
						<ImageCardDropdown severity="low" scanName={imgObj.ScanName} index={index} />
					)}
					{dropDown.negligible && (
						<ImageCardDropdown severity="negligible" scanName={imgObj.ScanName} index={index} />
					)}
				</div>
			</div>
			{/* RUN / REMOVE */}
			<div className={styles.buttons}>
				<img
					src={PlayIcon}
					className={styles.imgCardButton}
					onClick={() => runImageAlert(imgObj)}
				></img>
				<img
					src={DeleteIcon}
					className={styles.imgCardButton}
					onClick={() => removeImageAlert(imgObj)}
				></img>
			</div>
		</div>
	)
}

export default ImageCard;