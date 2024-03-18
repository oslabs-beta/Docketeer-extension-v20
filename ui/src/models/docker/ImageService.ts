import { ddClientRequest, encodeQuery } from "../ddClientRequest";
import { ImageType, ContainerPS } from "../../../../types";
import { ScanReturn, ImagesStateType, ModifiedObject } from '../../../ui-types';
import { updateTime } from '../../reducers/imageReducer';


export const ImageService = {
	async getImages(): Promise<ImageType[]> {
		const images = await ddClientRequest<ImageType[]>(`/api/docker/image`);
		return images;
	},

	async runImage(
		imageName: string,
		imageTag: string,
		containerName: string = imageName
	): Promise<boolean> {
		try {
			await ddClientRequest('/api/docker/image/run', 'POST', {
				imageName,
				tag: imageTag,
				containerName,
			});
			return true;
		} catch (error) {
			console.error(`Failed to start container from: ${imageName}`);
			return false;
		}
	},

	async removeImage(imageId: string): Promise<boolean> {
		try {
			await ddClientRequest(`/api/docker/image/${imageId}`, 'DELETE');
			return true;
		} catch (error) {
			console.error(`Failed to remove image by ID: ${imageId}`);
			return false;
		}
	},

	async getScan(scanName: string, timeStamp: string): Promise<ScanReturn> {
		try {
			const scan: ScanReturn = await ddClientRequest(
				'/api/docker/image/scan',
				'POST',
				{
					scanName,
					timeStamp,
				}
			);
			return scan;
		} catch (error) {
			console.error(`Failed to Scan the image vulnerability for ${scanName}`);
			return;
		}
	},

	async getRescan(scanName: string, timeStamp: string): Promise<ScanReturn> {
		try {
			const scan: ScanReturn = await ddClientRequest(
				'/api/docker/image/rescan',
				'POST',
				{
					scanName,
					timeStamp,
				}
			);
			return scan;
		} catch (error) {
			console.error(`Failed to Scan the image vulnerability for ${scanName}`);
			return;
		}
	},

	async openLink(link: string): Promise<void> {
		try {
			const sendLink: ScanReturn = await ddClientRequest(
				'/api/docker/image/openlink',
				'POST',
				{
					link,
				}
			);
		} catch (error) {
			console.error(`Failed to send ${link}`);
			return;
		}
	},

	async saveScan(
		imagesList: any[],
		time: string,
		userIP: string
	): Promise<{ userIP: string; imagesList: any; timeStamp: string }> {
		try {
			const saveList: { userIP: string; imagesList: any; timeStamp: string } =
				await ddClientRequest('/api/docker/image/savescan', 'POST', {
					userIP,
					imagesList,
					timeStamp: time,
				});
			return saveList;
		} catch (error) {
			console.error(`Failed to save scan!`, error);
			return;
		}
	},
};