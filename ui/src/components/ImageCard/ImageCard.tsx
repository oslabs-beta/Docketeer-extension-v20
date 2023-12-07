import React, {useEffect, useState} from 'react';
import styles from './ImageCard.module.scss';
import { ImageType } from 'types';

/**
 * @module | ImageCard.tsx
 * @description | new components for images dashboard
 **/

interface ImageCardProps {
	imgObj: ImageType,
	key: number,
	runImageAlert: (Image: ImageType) => void,
	removeImageAlert: (Image: ImageType) => void,
	getScan: (scanName: string) => Promise<unknown>
}

function ImageCard({ imgObj, runImageAlert, removeImageAlert, getScan }: ImageCardProps): React.JSX.Element {

	// initialize state variable to store vulnerabilities
	
	const [scanObj, setScanObj] = useState({})

	// reset scanObj state by adding ScanName prop with results from getScan
	useEffect(() => { 
		// setScanObj(getScan(imgObj.ScanName))
		const gotScan = (async () => { 
			return await getScan(imgObj.ScanName);
		 })();
		setScanObj(gotScan)
	 }, [])
	

	// gets updated as a promise obj that does not hv the data
	console.log('scanObj after useEffect: ', scanObj);
	

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
					<button onClick={() => runImageAlert(imgObj)}>run image</button>
					<button onClick={() => removeImageAlert(imgObj)}>remove image</button>
				</div>
				
				{/* VULNERABILITY */}
				<div className={styles.imageVulnerabilities}>
					<p className={styles.critical}>{scanObj['Critical']} Critical</p>
					<p className={styles.high}>{scanObj['High']} High</p>
					<p className={styles.med}>{scanObj['Medium']} Med</p>
					<p className={styles.low}>{scanObj['Low']} Low</p>
				</div>
		
			</div>
		
		</div>
	)
}

export default ImageCard;