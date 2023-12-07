import React, {useEffect, useState} from 'react';
import styles from './ImageCard.module.scss';
import globalStyles from '../global.module.scss';
import { ImageType } from 'types';
import Client from '../../models/Client';


/**
 * @module | ImageCard.tsx
 * @description | new components for images dashboard
 **/

interface ImageCardProps {
	imgObj: ImageType,
	key: number,
	runImageAlert: (Image: ImageType) => void,
	removeImageAlert: (Image: ImageType) => void,
}

function ImageCard({ imgObj, runImageAlert, removeImageAlert }: ImageCardProps): React.JSX.Element {

	// initialize state variable to store vulnerabilities
	const [scanObj, setScanObj] = useState({})

	const getScan = async (scanName: string) => { 
		// retrieve scan data
    const success = await Client.ImageService.getScan(scanName);
		console.log(`Success from getScan: ${scanName}`, success);
		// set state with scan data
		setScanObj(success)
    // return scan data
    return success;
  }

	useEffect(() => { 		
		getScan(imgObj.ScanName)
	}, [])

	return (
		<div className={styles.imageCard}>
			{/* image name: LEFT SIDE */}
			<div>
				<p>Image Name: {imgObj['Repository']}</p>
			</div>
			{/* vulnerability info + run / remove functionality: RIGHT SIDE */}
			<div className={styles.imageInfo}>
				{/* RUN / REMOVE */}
				<div>
					<button className={styles.imgCardButton} onClick={() => runImageAlert(imgObj)}>run image</button>
					<button className={styles.imgCardButton} onClick={() => removeImageAlert(imgObj)}>remove image</button>
				</div>
				
				{/* VULNERABILITY */}
				<div className={styles.imageVulnerabilities}>
					<div className={styles.imgVulDiv}>
						<p className={styles.critical}>Critical</p>
						<p className={styles.critical}>{scanObj['Critical']} </p>
					</div>
					<div className={styles.imgVulDiv}>
						<p className={styles.high}>High</p>
						<p className={styles.high}>{scanObj['High']} </p>
					</div>
					<div className={styles.imgVulDiv}>
						<p className={styles.medium}>Med</p>
						<p className={styles.medium}>{scanObj['Medium']} </p>
					</div>
					<div className={styles.imgVulDiv}>
						<p className={styles.low}>Low</p>
						<p className={styles.low}>{scanObj['Low']} </p>
					</div>
				</div>
			</div>
		</div>
	)
}

export default ImageCard;