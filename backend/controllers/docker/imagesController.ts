import { Request, Response, NextFunction } from 'express';
import { ImageType } from '../../../types';
import { execAsync } from '../helper';
import { GrypeScan, ServerError, countVulnerability } from '../../backend-types';
import path from 'path';

// Storing the path to the grype data template file
const templatePath = path.resolve(__dirname, '../grype/json.tmpl')

// Types of our ImageController methods
interface ImageController {
  /**
   * @method GET
   * @abstract Gets array of images from docker in json format and adds a ScanName property to each to allow execuation of /scan on imageRouter
   * @returns {void}
   */
  getImages: (req: Request, res: Response, next: NextFunction) => Promise<void>;

  /**
   * @method POST
   * @abstract Outputs vulnerability information about image scanned
   * @param {string} req.body.scanName
   * @returns {void}
   */
  scanImages: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => Promise<void>;

  /**
   * @method POST
   * @todo implement
   * @param {string} req.body.name
   * @param {string} req.body.tag
   * @returns {void}
   */
  buildContainerFromImage: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => Promise<void>;

  /**
   * @method
   * @todo implement
   * @abstract Pulls image from docker hub
   * @returns {void}
   */
  pullImage: (req: Request, res: Response, next: NextFunction) => Promise<void>;

  /**
   * @method DELETE
   * @abstract Removes an image based on id
   * @param {string} req.params.id
   * @returns
   */
  removeImage: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => Promise<void>;

  dbStatus: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}

const imageController: ImageController = {} as ImageController;

imageController.getImages = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { stdout, stderr } = await execAsync('docker images --format "{{json .}},"');
    if (stderr) throw new Error(stderr);
    const images: ImageType[] = JSON.parse(`[${stdout.trim().slice(0, -1)}]`);

    // Add new ScanName on each object
    images.forEach(imageObj => imageObj.ScanName = imageObj.Repository + ':' + imageObj.Tag);

    // Store an array of strings with our images names
    res.locals.images = images;

    return next();
  } catch (error) {
    const errObj: ServerError = {
      log: { err: `imageController.getImages Error: ${error}` },
      status: 500,
      message: 'internal server error'
    }
    return next(errObj);
  }
}

imageController.scanImages = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  if (!res.locals.vulnerabilites) {
    const { scanName }: { scanName: string } = req.body;

    try {
      //Development mode: runs Grype on scanName and outputs result based on a custom Go Template in ./controllers/grype/json.tmpl
      //Production: runs Grype on scanName and outputs result based on a custom Go Template in backend/dist/controllers/grype/json.tmpl
      const { stdout, stderr } = await execAsync(`grype ${scanName} -o template -t ${templatePath}`);
      if (stderr) throw new Error(stderr);

      console.log("TEST HOT RELOADING!");


      //parse the vulnerability data and count the number of vulnerabilites
      const vulnerabilityJSON: GrypeScan[] = JSON.parse(stdout);

      const countVulnerability: countVulnerability = vulnerabilityJSON.reduce((acc, cur) => {
        acc.hasOwnProperty(cur.Severity) ? acc[cur.Severity]++ : acc[cur.Severity] = 1;
        return acc
      }, {});

      res.locals.scanName = scanName
      res.locals.vulnerabilites = countVulnerability;
      res.locals.addToCache = true;

      res.locals.timeStamp = new Date().toLocaleString(); // return "m/d/y, h:m:s AM/PM"

      // test JSON
      res.locals.everything = vulnerabilityJSON;

      next()
    } catch (error) {
      const errObj: ServerError = {
        log: { err: `imageController.scanImages Error: ${error}` },
        status: 500,
        message: 'internal server error'
      }
      next(errObj);
    }
  }
  else {
    next()
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
      log: { err: `imageController.buildContainerFromImage Error: ${error}` },
      status: 500,
      message: 'internal server error'
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
      log: { err: `imageController.removeImages Error: ${error}` },
      status: 500,
      message: 'internal server error'
    }
    return next(errObj);
  }
}

imageController.dbStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  if (!res.locals.cachedDbStatus) {
    try {
      const { stdout, stderr } = await execAsync('grype db update');
      if (stderr) throw new Error(stderr);
      console.log('grype db update status:', stdout)
      next();
    } catch (error) {
      const errObj: ServerError = {
        log: { err: `imageController.dbStatus Error: ${error}` },
        status: 500,
        message: 'internal server error',
      };
      next(errObj);
    }
  } else {
    next()
  }
};

export default imageController;