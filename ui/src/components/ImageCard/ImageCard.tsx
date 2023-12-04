import React from 'react';

/**
 * @module | ImageCard.tsx
 * @description | new components for images dashboard
 **/

interface ImageCardProps {
	imgObj: object;
}

function ImageCard({ imgObj }): React.JSX.Element {
	console.log(imgObj)
	return (
		<div>
			<text>Image Name: {imgObj['ImageName']}</text>
			<text>High: {imgObj['High']}</text>
			<text>Med: {imgObj['Med']}</text>
			<text>Low: {imgObj['Low']}</text>
		</div>
	)
}

export default ImageCard;