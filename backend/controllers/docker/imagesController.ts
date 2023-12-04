import { Request, Response, NextFunction } from 'express';
import { ContainerPS, ImageType } from '../../../types';
import { execAsync } from '../helper';
import { ServerError } from '../../backend-types';
import { log } from 'console';
import { performance } from 'perf_hooks';

interface ImageController {
  /**
   * @method
   * @todo Reimplement this on frontend as old implementation used a matrix
   *       instead of array of objects...
   * @returns @param {ImageType[]} res.locals.images
   */
  getImages: (req: Request, res: Response, next: NextFunction) => Promise<void>;

  scanImages: (req: Request, res: Response, next: NextFunction) => Promise<void>;

  /**
   * @method
   * @todo implement
   * @param {string} req.body.name
   * @param {string} req.body.tag
   * @returns {void}
   */
  buildContainerFromImage: (req: Request, res: Response, next: NextFunction) => Promise<void>;


  /**
   * @method
   * @todo implement
   * @abstract Pulls image from docker hub
   * @returns {void}
   */
  pullImage: (req: Request, res: Response, next: NextFunction) => Promise<void>;

  /**
   * @method
   * @abstract Removes an image based on id
   * @param {string} req.params.id
   * @returns
   */
  removeImage: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}

const imageController: ImageController = {} as ImageController;

/**
 * @todo fix frontend implementation
 * @todo errObj message should more generic as it will be shown the client and should not reveal too much of the inner workings of the server
 */
imageController.getImages = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const start = performance.now()
  try {
    const { stdout, stderr } = await execAsync('docker images --format "{{json .}},"');
    if (stderr.length) throw new Error(stderr);
    const images: ImageType = JSON.parse(`[${stdout.trim().slice(0, -1)}]`);
    res.locals.images = images;
    const end = performance.now();
    const elapsedTime = end-start
    console.log('getImages elapsed time', elapsedTime);
    
    return next();
  } catch (error) {
    const errObj: ServerError = {
      log: JSON.stringify({ 'imageController.getImages Error: ': error }),
      status: 500,
      message: { err: 'imageController.getImages error' }
    }
    return next(errObj);
  }
}

imageController.scanImages = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const start = performance.now();
  //get image names from res.locals.images
  // const imageNames = res.locals.images.map(imageObj => imageObj.Repository + ':' + imageObj.Tag)

  res.locals.images.forEach(imageObj => imageObj.scanName = imageObj.Repository + ':' + imageObj.Tag);

  try {
    console.log('scanning images');
    
    //run grype scan on each image using custom template in grype/json.tmpl
    // const { stdout, stderr } = await execAsync(`grype ${imageNames[1]} -o template -t ./controllers/grype/json.tmpl`);
    async function scanAndCount(image) {
      const { stdout, stderr } = await execAsync(`grype ${image.scanName} -o template -t ./controllers/grype/json.tmpl`);
      if (stderr) throw new Error(stderr);

      //parse the vulnerability data and count the number of vulnerabilites
      const vulnerabilityJSON = JSON.parse(stdout);
      const countVulnerability = vulnerabilityJSON.reduce((acc, cur) => {
        acc.hasOwnProperty(cur.Severity) ? acc[cur.Severity]++ : acc[cur.Severity] = 1;
        return acc
      }, {});

      image.vulnerabilites = countVulnerability;
      return image
    }

    const execArray = res.locals.images.map(image => scanAndCount(image));
    
    // const execArray = imageNames.map(imageName => execAsync(`grype ${imageName} -o json`));
    
    // const resultArr = await Promise.all(execArray);

    // const execArray = [execAsync('GRYPE_DB_AUTO_UPDATE=false; grype mysql'), execAsync('GRYPE_DB_AUTO_UPDATE=false; grype postgres')]

    const resultArr = await Promise.all(execArray);
    console.log('result array type', typeof resultArr);
    
    console.log('do not kill my computer', resultArr);
    
    const end = performance.now();
    const elapsedTime = end - start
    console.log('getImages elapsed time', elapsedTime);
    res.locals.images = resultArr;
    next()

  } catch (error) {
    const errObj: ServerError = {
      log: `imageController.scanImages error ${error}`,
      status: 500,
      message: { err: 'internal server error'}
    }
    next(errObj);
  }
};

/**
 * @todo verify it's working 
 * @todo change body parameters. It must accept a name for the container and a name for
 *       the image
 */
imageController.buildContainerFromImage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { imageName, tag, containerName } = req.body;
    // Need to fix
    const { stdout, stderr } = await execAsync(`docker run --name ${containerName} ${imageName}:${tag}`);
    if (stderr.length) throw new Error(stderr);

    //Remove once verified working
    console.log(stdout);
    return next();
  } catch (error) {
    const errObj: ServerError = {
      log: JSON.stringify({ 'imageController.buildContainerFromImage Error: ': error }),
      status: 500,
      message: { err: 'imageController.buildContainerFromImage error' }
    }
    return next(errObj);
  }
}

imageController.removeImage =async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const { stdout, stderr } = await execAsync(`docker rmi -f ${id}`);
    if (stderr.length) throw new Error(stderr);

    // Remove once verified
    console.log(stdout)
    return next();
  } catch (error) {
    const errObj: ServerError = {
      log: JSON.stringify({ 'imageController.removeImage Error: ': error }),
      status: 500,
      message: { err: 'imageController.removeImage error' }
    }
    return next(errObj);
  }
}

export default imageController;