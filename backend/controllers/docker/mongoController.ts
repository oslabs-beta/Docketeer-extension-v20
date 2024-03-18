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
}

const mongoController: MongoController = {} as MongoController;

mongoController.saveScan = async (req, res, next) => {
  try {
    const { userIP, timeStamp } = req.body;
    const savedScan = new ImageModel({ userIP, timeStamp });
    await savedScan.save();
    // For checking front-end
    res.locals.savedScan = savedScan;
    return next();
  } catch (error) {
    const errObj: ServerError = {
      log: { err: `mongoController.saveScan Error: ${error}` },
      status: 500,
      message: "mongoController.saveScan Error",
    };
    return next(errObj);
  }
}

export default mongoController;