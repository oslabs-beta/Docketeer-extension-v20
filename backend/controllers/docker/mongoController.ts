import { Request, Response, NextFunction } from 'express';
import ImageModel from '../../db/ImageModel';
import { ServerError } from "../../backend-types";
import path from 'path';

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
    const { imageList, timeStamp } = req.body;
    const savedScan = await ImageModel.create({ imageList, timeStamp });
    await savedScan.save();
    // For checking front-end
    res.locals.savedScan = savedScan;
    next();
  } catch (error) {
    const errObj: ServerError = {
      log: { err: `mongoController.saveScan Error: ${error}` },
      status: 500,
      message: "internal server error",
    };
    return next(errObj);
  }
}

export default mongoController;