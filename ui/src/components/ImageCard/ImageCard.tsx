import React from 'react';
import styles from './ImageCard.module.scss';
import { ImageType } from 'types';
// import * as PlayArrow from '@mui/icons-material/PlayArrow';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
// import { ThemeProvider, createTheme } from '@mui/material/styles';
// import PlayArrow from '@mui/icons-material/PlayArrow'

// console.log("PlayArrow: ", PlayArrow)
console.log("DateTimePicker: ", DateTimePicker)

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
					{/* <PlayArrow onClick={() => runImageAlert(imgObj)} /> */}
					{/* <i className="material-icons">play_arrow</i> */}
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