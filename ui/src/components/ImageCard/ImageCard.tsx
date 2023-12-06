import React from 'react';
import styles from './ImageCard.module.scss';
import { ImageType } from 'types';

/**
 * @module | ImageCard.tsx
 * @description | new components for images dashboard
 **/

interface ImageCardProps {
	imgObj: object,
	key: number,
	runImageAlert: (Image: ImageType) => void,
	removeImageAlert: (Image: ImageType) => void
}

function ImageCard({ imgObj, runImageAlert, removeImageAlert }: ImageCardProps): React.JSX.Element {
	console.log(imgObj)
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
					<p className={styles.critical}>{imgObj['Critical']} Critical</p>
					<p className={styles.high}>{imgObj['High']} High</p>
					<p className={styles.med}>{imgObj['Med']} Med</p>
					<p className={styles.low}>{imgObj['Low']} Low</p>
				</div>
		
			</div>
		
		</div>
	)
}

export default ImageCard;