import React from 'react';
import styles from './ImageCard.module.scss';

/**
 * @module | ImageCard.tsx
 * @description | new components for images dashboard
 **/

interface ImageCardProps {
	imgObj: object,
	key: number
}

function ImageCard({ imgObj }: ImageCardProps): React.JSX.Element {
	console.log(imgObj)
	return (
		<div className={styles.imageCard}>
			
			{/* image name: LEFT SIDE */}
			<div>
				<text>Image Name: {imgObj['ImageName']}</text>
			</div>
			
			{/* vulnerability info + run / remove functionality: RIGHT SIDE */}
			<div>
				{/* RUN / REMOVE */}
				<div>
					<button>run image</button>
					<button>remove image</button>
				</div>
				{/* VULNERABILITY */}
				<div>
					<text>High: {imgObj['High']}</text>
					<text>Med: {imgObj['Med']}</text>
					<text>Low: {imgObj['Low']}</text>
				</div>
			</div>
		
		</div>
	)
}

export default ImageCard;