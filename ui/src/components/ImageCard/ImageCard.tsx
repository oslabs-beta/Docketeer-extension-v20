import React, { SetStateAction, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../reducers/hooks';
import globalStyles from '../global.module.scss';
import styles from './ImageCard.module.scss';
import { ImageCardProps } from '../../../../types';
import { VulnerabilityPayload, ScanObject } from '../../../ui-types';
import Client from '../../models/Client';
import { updateVulnerabilities } from '../../reducers/imageReducer';

import DeleteIcon from '../../../assets/delete_outline_white_24dp.svg';
import PlayIcon from '../../../assets/play_arrow_white_24dp.svg';

/**
 * @module | ImageCard.tsx
 * @description | new components for images dashboard
 **/

const ImageCard = ({ imgObj, runImageAlert, removeImageAlert, index }: ImageCardProps): React.JSX.Element => {
	const dispatch = useAppDispatch();

	// get vulnerabilities directly from the store
	let vulnerabilities =
    useAppSelector((state) => state.images.imagesList[index].Vulnerabilities) ||
    false;

	const getScan = async (scanName: string) => {
		
    try {
      // retrieve scan data - Client.ImageService.getScan creates DDClient Request
      const vulnerabilityObj: ScanObject = await Client.ImageService.getScan(scanName);
			console.log(`Success from getScan: ${scanName}`, vulnerabilityObj);
			// if the image failed to be scanned for vulnerabilities, update the image card state to have a default vulnerability object
			if (vulnerabilityObj === undefined) {
				const defaultVul: VulnerabilityPayload = {vulnerabilityObj:{ Critical: '-', High: '-', Medium: '-', Low: '-' }, scanName: scanName}
				dispatch(updateVulnerabilities(defaultVul));
				return;
    	}
			// create an object of type VulnerabilityPayload with the returned vulnerability object and the scanName
			const updateVul: VulnerabilityPayload = {vulnerabilityObj, scanName: scanName}
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

	// useEffect(() => {
  //   getScan(imgObj.ScanName);
  //   // Cleanup function to reset scanObj when component unmounts
  //   return () => {
  //     setScanObj({})
  //   };
  // }, [imgObj.ScanName]);

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
							<p className={`${ vulnerabilities.Critical ? styles.critical : styles.grayOut}`}>{ vulnerabilities.Critical && <span className={styles.vulNum}>{vulnerabilities.Critical}</span> } C</p>
						</div>

						<div className={styles.imgVulDiv}>
							<p className={`${ vulnerabilities.High ? styles.high : styles.grayOut}`}>{ vulnerabilities.High && <span className={styles.vulNum}>{vulnerabilities.High}</span> } H</p>
						</div>

						<div className={styles.imgVulDiv}>
							<p className={`${ vulnerabilities.Medium ? styles.medium : styles.grayOut}`}>{ vulnerabilities.Medium && <span className={styles.vulNum}>{vulnerabilities.Medium}</span> } M</p>
						</div>

						<div className={styles.imgVulDiv}>
							<p className={`${ vulnerabilities.Low ? styles.low : styles.grayOut}`}>{ vulnerabilities.Low && <span className={styles.vulNum}>{vulnerabilities.Low}</span> } L</p>
						</div>
					</div>
				</div>
			</div>

				{/* RUN / REMOVE */}
				<div className={styles.buttons}>
				<img src={PlayIcon} className={styles.imgCardButton} onClick={() => runImageAlert(imgObj)}></img>
				<img src={DeleteIcon} className={styles.imgCardButton} onClick={() => removeImageAlert(imgObj)}></img>
				</div>
		</div>
	)
}

export default ImageCard;