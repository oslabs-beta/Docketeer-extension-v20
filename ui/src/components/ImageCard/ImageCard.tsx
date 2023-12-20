import React, { SetStateAction, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../reducers/hooks';
import styles from './ImageCard.module.scss';
import { ImageCardProps } from '../../../../types';
import { VulnerabilityPayload, ScanObject } from '../../../ui-types';
import Client from '../../models/Client';
import { updateVulnerabilities } from '../../reducers/imageReducer';


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
      const success: ScanObject = await Client.ImageService.getScan(scanName);
			console.log(`Success from getScan: ${scanName}`, success);
			// if the image failed to be scanned for vulnerabilities, update the image card state to have a default vulnerability object
			if (success === undefined) {
			const defaultVul: VulnerabilityPayload = {success:{ Critical: '-', High: '-', Medium: '-', Low: '-' }, scanName: scanName}
			dispatch(updateVulnerabilities(defaultVul));
      return;
    }
			// create an object of type VulnerabilityPayload with the returned vulnerability object and the scanName
			const updateVul: VulnerabilityPayload = {success, scanName: scanName}
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

	return (
		<div className={styles.imageCard}>

			{/* vulnerability info + run / remove functionality: RIGHT SIDE */}
			<div className={styles.imageInfo}>
				{/* image name: LEFT SIDE */}
				<div>
					<p className={styles.ImageName}>{imgObj['Repository']}</p>
				</div>
				
				{/* VULNERABILITY */}
				<div className={styles.VulnerabilitiesBlock}>
					<p className={styles.VulnerabilitiesTitle}>Vulnerabilities</p>
					<div className={styles.imageVulnerabilities}>
						<div className={styles.imgVulDiv}>
							<p className={styles.critical}>Critical</p>
							{vulnerabilities && <p className={styles.critical}>{vulnerabilities['Critical']} </p>}
						</div>
						<div className={styles.imgVulDiv}>
							<p className={styles.high}>High</p>
							{vulnerabilities && <p className={styles.high}>{vulnerabilities['High']} </p>}
						</div>
						<div className={styles.imgVulDiv}>
							<p className={styles.medium}>Med</p>
							{vulnerabilities && <p className={styles.medium}>{vulnerabilities['Medium']} </p>}
						</div>
						<div className={styles.imgVulDiv}>
							<p className={styles.low}>Low</p>
							{vulnerabilities && <p className={styles.low}>{vulnerabilities['Low']} </p>}
						</div>
					</div>
				</div>
			</div>

				{/* RUN / REMOVE */}
				<div className={styles.buttons}>
					<button className={styles.imgCardButton} onClick={() => runImageAlert(imgObj)}>RUN</button>
					<button className={styles.imgCardButton} onClick={() => removeImageAlert(imgObj)}>DELETE IMAGE</button>
				</div>
		</div>
	)
}

export default ImageCard;