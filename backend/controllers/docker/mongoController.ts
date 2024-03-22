import { Request, Response, NextFunction } from 'express';
import { ServerError } from "../../backend-types";
const ImageModel = require('../../db/ImageModel');


interface MongoController {
  /**
   * @method POST
   * @abstract Save the scan to MongoDB
   * @returns saved Object sent from the frontend to console.log out to test
   */

  saveScan: (req: Request, res: Response, next: NextFunction) => Promise<void>;
  
  /**
   * @method GET
   * @abstract Retrieve scan data from MongoDB
   * @returns array of all the saved data
   */

  getHistory: (req: Request, res: Response, next: NextFunction) => Promise<void>;

  /**
   * @method GET
   * @abstract Check MongoDB database if the scan already in the database
   * @returns boolean true/false
   */
  checkForScan: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}

const mongoController: MongoController = {} as MongoController;

mongoController.saveScan = async (req, res, next) => {
  try {
    const { userIP, imagesList, timeStamp } = req.body;
    const savedScan = new ImageModel({ userIP, imagesList, timeStamp });
    await savedScan.save();
    res.locals.saved = true;

    // For checking front-end
    res.locals.savedScan = savedScan;
    return next();
  } catch (error) {
    const errObj: ServerError = {
      log: { err: `mongoController.saveScan Error: ${error}` },
      status: 500,
      message: `mongoController.saveScan Error: ${error}`,
    };
    return next(errObj);
  }
}
mongoController.getHistory = async (req, res, next) => {
  try {
    // get all the data from latest -> oldest
    res.locals.history = await ImageModel.find();
		return next();
	} catch (error) {
		const errObj: ServerError = {
			log: { err: `mongoController.getHistory Error: ${error}` },
			status: 500,
			message: `mongoController.getHistory Error: ${error}`,
		};
		return next(errObj);
	}
};

mongoController.checkForScan = async (req, res, next) => {
  try {
    const result = ImageModel.findOne({ timeStamp: res.locals.timeStamp });
    res.locals.scanExists = result ? true : false;
    return next();
  } catch (error) {
    const errObj: ServerError = {
      log: { err: `mongoController.checkForScan Error: ${error}` },
      status: 500,
      message: `mongoController.checkForScan Error: ${error}`,
    };
  return next(errObj);
  }
}

export default mongoController;