import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../reducers/hooks';
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
import ImageCardDropdown from './ImageCardDropdown/ImageCardDropdown';
import DropdownIcon from '../../../assets/drop-down-arrow.png';
import DropupIcon from '../../../assets/drop-up-arrow.png';

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
	const [done, setDone] = useState(false);

	// get vulnerabilities directly from the store
	let vulnerabilities =
		useAppSelector((state) => state.images.imagesList[index].Vulnerabilities) ||
		false;

	const getScan = async (scanName: string) => {
		try {
			// retrieve scan data - Client.ImageService.getScan creates DDClient Request
			const scanObjectReturn: ScanReturn = await Client.ImageService.getScan(
				scanName
			);
			const vulnerabilityObj: ScanObject = scanObjectReturn.vulnerabilites;
			if (!done) setDone(true);

			console.log('scanObjectReturn JSON FOR GRYPE: ', scanObjectReturn);
			console.log(`Success from getScan: ${scanName}`, vulnerabilityObj);

			/* get the info from 5 levels
			ex everything: [{ Package: "busybox", Severity: "Low", Version Installed: "1.36.1", Vulnerability ID: "CVE..." }]
			-> filter each severity into an array of critical objects, array of high objects, etc */
			const everything: GrypeScan[] = scanObjectReturn.everything;
			const critical = everything.filter((el) => el.Severity === 'Critical');
			const high = everything.filter((el) => el.Severity === 'High');
			const medium = everything.filter((el) => el.Severity === 'Medium');
			const low = everything.filter((el) => el.Severity === 'Low');
			const negligible = everything.filter(
				(el) => el.Severity === 'Negligible'
			);

			/* Get top 3 in an obj
				 {"busybox": count
					"crytpo": count,
					"notbusybox": count }
			 */

			// Dispatch top 3 object with 5 levels to imageList Store in imageReducer
			const top3Obj: Top3Payload = {
				top3Obj: {
					critical: top3Info(critical).slice(0, 3),
					high: top3Info(high).slice(0, 3),
					medium: top3Info(medium).slice(0, 3),
					low: top3Info(low).slice(0, 3),
					negligible: top3Info(negligible).slice(0, 3),
				},
				scanName: scanName,
			};
			dispatch(updateTop3(top3Obj));

			// if the image failed to be scanned for vulnerabilities, update the image card state to have a default vulnerability object
			if (vulnerabilityObj === undefined) {
				const defaultVul: VulnerabilityPayload = {
					vulnerabilityObj: { Critical: '-', High: '-', Medium: '-', Low: '-' },
					scanName: scanName,
				};
				dispatch(updateVulnerabilities(defaultVul));
				return;
			}

			// create an object of type VulnerabilityPayload with the returned vulnerability object and the scanName
			const updateVul: VulnerabilityPayload = { vulnerabilityObj, scanName };

			// dispatch VulnerabilityPayload to update the imgObj in the store with the vulnerability info
			dispatch(updateVulnerabilities(updateVul));
			console.log('after reducuer invoked', imgObj);
			return;
		} catch (error) {
			// Log error if failed
			console.log('getScan has failed to get vulnerabilities: ', error);
		}
	};

	// Iterate over each array of critical objects and return an array of the top 3
	const top3Info = (levelArray: GrypeScan[]) => {
		const levelObj = {};
		levelArray.forEach((el) => {
			levelObj[el.Package] = (levelObj[el.Package] || 0) + 1;
		});
		// Ex for entries: [['busybox', 6], ['crypto', 10], ['another package name', 28]]
		const entries: [string, number][] = Object.entries(levelObj);
		const sortedEntries = entries.sort((a, b) => b[1] - a[1]);
		return sortedEntries;
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

	const toggleArrow = () => {
		setDropDown((prevState) => {
			// length is 0 if none opened, >= if one is opened
			const check = Object.values(dropDown).filter((el) => el).length;
			if (check) {
				for (let key in prevState) {
					prevState[key] = false;
				}
			} else prevState.critical = true;
			return { ...prevState };
		});
	};

	// Array to print out all levels
	const levels: string[] = ['Critical', 'High', 'Medium', 'Low', 'Negligible'];
	const printVul: React.JSX.Element[] = levels.map((el, i) => {
		return (
      <div className={styles.imgVulDiv} key={i}>
        <p
          onClick={() => toggleDropdown(el.toLowerCase())}
          className={`${
            vulnerabilities[el]
              ? styles[el.toLowerCase()]
              : done
              ? styles.green
              : styles.grayOut
          }`}
        >
          {vulnerabilities[el] && (
            <span className={styles.vulNum}>
              {vulnerabilities[el] ? vulnerabilities[el] : ""}
            </span>
          )}{" "}
          {`${el[0]}`}
				</p>
      </div>
    );
	});

	// UPON MOUNTED
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

        <div style={{ cursor: "pointer" }}>
          <p className={styles.ImageName}>{imgObj["Repository"]} </p>
          <p className={styles.ImageTag}>Version: {imgObj["Tag"]}</p>
        </div>
        {/* VULNERABILITY LEVELS*/}
        <div className={styles.VulnerabilitiesBlock}>
          <p>Severity Levels</p>
					<div className={styles.imageVulnerabilities}>
						{printVul}
						<img
							src={
								Object.values(dropDown).filter((el) => el).length !== 0
									? DropupIcon
									: DropdownIcon
							}
							onClick={toggleArrow}
							className={styles.dropdownIcon}
						/>
					</div>
          {/* toggler drop down info of vulnerability type clicked */}
          {dropDown.critical && (
            <ImageCardDropdown
              severity="critical"
              scanName={imgObj.ScanName}
              index={index}
						/>
          )}
          {dropDown.high && (
            <ImageCardDropdown
              severity="high"
              scanName={imgObj.ScanName}
              index={index}
            />
          )}
          {dropDown.medium && (
            <ImageCardDropdown
              severity="medium"
              scanName={imgObj.ScanName}
              index={index}
            />
          )}
          {dropDown.low && (
            <ImageCardDropdown
              severity="low"
              scanName={imgObj.ScanName}
              index={index}
            />
          )}
          {dropDown.negligible && (
            <ImageCardDropdown
              severity="negligible"
              scanName={imgObj.ScanName}
              index={index}
            />
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
  );
};

export default ImageCard;