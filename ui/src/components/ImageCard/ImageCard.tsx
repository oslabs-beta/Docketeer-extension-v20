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
				<text>Image Name: {imgObj['Repository']}</text>
			</div>
			
			{/* vulnerability info + run / remove functionality: RIGHT SIDE */}
			<div>
				{/* RUN / REMOVE */}
				<div>
					<button onClick={() => runImageAlert(imgObj)}>run image</button>
					<button onClick={() => removeImageAlert(imgObj)}>remove image</button>
				</div>
				{/* VULNERABILITY */}
				<div>
					<text>Critical: {imgObj['Critical']}</text>
					<text>High: {imgObj['High']}</text>
					<text>Med: {imgObj['Med']}</text>
					<text>Low: {imgObj['Low']}</text>
				</div>
			</div>
		
		</div>
	)
}

export default ImageCard;