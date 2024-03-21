import { ddClientRequest } from '../ddClientRequest';
import { ImageType } from '../../../../types';
import { ScanReturn, MongoData } from '../../../ui-types';

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
			await ddClientRequest('/api/docker/image/openlink', 'POST', {
				link,
			});
		} catch (error) {
			console.error(`Failed to send ${link}`);
			return;
		}
	},

	async saveScan(
		imagesList: any[],
		time: string,
		userIP: string
	): Promise<{ printSavedScan: object; saved: boolean }> {
		try {
			const saveList: {
				printSavedScan: object;
				saved: boolean;
			} = await ddClientRequest('/api/docker/image/savescan', 'POST', {
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

	async getHistory(): Promise<MongoData[]> {
		const images: MongoData[] = await ddClientRequest(`/api/docker/image/history`);
		return images;
	},
};
