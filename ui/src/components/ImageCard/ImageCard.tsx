import React, { SetStateAction, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../reducers/hooks';
import globalStyles from '../global.module.scss';
import styles from './ImageCard.module.scss';
import { ImageCardProps } from '../../../../types';
import {
  VulnerabilityPayload,
  ScanObject,
  ScanReturn,
} from "../../../ui-types";
import { GrypeScan } from "../../../../backend/backend-types";

import Client from '../../models/Client';
import { updateVulnerabilities } from '../../reducers/imageReducer';
import DeleteIcon from '../../../assets/delete_outline_white_24dp.svg';
import PlayIcon from '../../../assets/play_arrow_white_24dp.svg';
import { every } from 'd3';


/**
 * @module | ImageCard.tsx
 * @description | new components for images dashboard
 **/


const ImageCard = ({ imgObj, runImageAlert, removeImageAlert, index }: ImageCardProps): React.JSX.Element => {
	const dispatch = useAppDispatch();
	let critical, high, medium, low;

	// get vulnerabilities directly from the store
	let vulnerabilities =
    useAppSelector((state) => state.images.imagesList[index].Vulnerabilities) ||
    false;

	const getScan = async (scanName: string) => {

    try {
			// retrieve scan data - Client.ImageService.getScan creates DDClient Request
			// const vulnerabilityObj: ScanObject = await Client.ImageService.getScan(scanName);

			const scanObjectReturn: ScanReturn = await Client.ImageService.getScan(scanName);
			const vulnerabilityObj: ScanObject = scanObjectReturn.vulnerabilites;

			console.log("scanObjectReturn JSON FOR GRYPE: ", scanObjectReturn);
			console.log(`Success from getScan: ${scanName}`, vulnerabilityObj);

			// get the info from 4 levels
			const everything: GrypeScan[] = scanObjectReturn.everything;
			critical = everything.filter((el) => el.Severity === 'Critical');
			high = everything.filter((el) => el.Severity === 'High');
			medium = everything.filter((el) => el.Severity === 'Medium');
			low = everything.filter((el) => el.Severity === 'Low');

			// if the image failed to be scanned for vulnerabilities, update the image card state to have a default vulnerability object
			if (vulnerabilityObj === undefined) {
				const defaultVul: VulnerabilityPayload = {vulnerabilityObj:{ Critical: '-', High: '-', Medium: '-', Low: '-' }, scanName: scanName}
				dispatch(updateVulnerabilities(defaultVul));
				return;
    }
			// create an object of type VulnerabilityPayload with the returned vulnerability object and the scanName
			const updateVul: VulnerabilityPayload = { vulnerabilityObj, scanName: scanName }
			// dispatch VulnerabilityPayload to update the imgObj in the store with the vulnerability info
			dispatch(updateVulnerabilities(updateVul))
			console.log('after reducuer invoked', imgObj)
			return;
    } catch (error) {
      // Log error if failed
      console.log('getScan has failed to get vulnerabilities: ', error);
    }
  }

	// call getScan upon render for each card
	useEffect(() => {
		if (!vulnerabilities) {
			getScan(imgObj.ScanName)
		}
	}, [])

	const [dropdown, setDropdown] = useState(false);

	const toggleDropdown = () => {
		setDropdown(!dropdown);
	}
	const [dropDown, setDropDown] = useState({
    critical: false,
    high: false,
    medium: false,
    low: false,
  });
  const toggleDropdown2 = (criticalType) => {
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


	return (
		<div className={styles.imageCard}>
      {/* vulnerability info + run / remove functionality: RIGHT SIDE */}
      <div className={styles.imageInfo}>
        {/* image name: LEFT SIDE */}
        <div>
          <p className={styles.ImageName}>{imgObj['Repository']}</p>
          <p className={styles.ImageTag}>{imgObj['Tag']}</p>
        </div>
        {/* VULNERABILITY */}
        <div className={styles.VulnerabilitiesBlock}>
          {/* <p className={styles.VulnerabilitiesTitle}>Vulnerabilities</p> */}
          <div className={styles.imageVulnerabilities}>
            <div className={styles.imgVulDiv}>
              <p
                onClick={() => toggleDropdown2('critical')}
                className={`${
                  vulnerabilities.Critical ? styles.critical : styles.grayOut
                }`}
              >
                {vulnerabilities.Critical && (
                  <span className={styles.vulNum}>
                    {vulnerabilities.Critical}
                  </span>
                )}{' '}
                C
              </p>
            </div>
            <div className={styles.imgVulDiv}>
              <p
                onClick={() => toggleDropdown2('high')}
                className={`${
                  vulnerabilities.High ? styles.high : styles.grayOut
                }`}
              >
                {vulnerabilities.High && (
                  <span className={styles.vulNum}>{vulnerabilities.High}</span>
                )}{' '}
                H
              </p>
            </div>
            <div className={styles.imgVulDiv}>
              <p
                onClick={() => toggleDropdown2('medium')}
                className={`${
                  vulnerabilities.Medium ? styles.medium : styles.grayOut
                }`}
              >
                {vulnerabilities.Medium && (
                  <span className={styles.vulNum}>
                    {vulnerabilities.Medium}
                  </span>
                )}{' '}
                M
              </p>
            </div>
            <div className={styles.imgVulDiv}>
              <p
                onClick={() => toggleDropdown2('low')}
                className={`${
                  vulnerabilities.Low ? styles.low : styles.grayOut
                }`}
              >
                {vulnerabilities.Low && (
                  <span className={styles.vulNum}>{vulnerabilities.Low}</span>
                )}{' '}
                L
              </p>
            </div>
          </div>
          {/* toggler drop down info of vulnerability type clicked */}
          {dropDown.critical && (
            <div className={styles.dropDown} id={`test${index}`}>
              criticalLinks
            </div>
          )}
          {dropDown.high && (
            <div className={styles.dropDown} id={`test${index}`}>
              highLinks
            </div>
          )}
          {dropDown.medium && (
            <div className={styles.dropDown} id={`test${index}`}>
              mediumLinks
            </div>
          )}
          {dropDown.low && (
            <div className={styles.dropDown} id={`test${index}`}>
              lowLinks
            </div>
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
}

export default ImageCard;