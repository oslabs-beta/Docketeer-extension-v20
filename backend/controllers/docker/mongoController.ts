import { Request, Response, NextFunction } from 'express';
import ImageModel from '../../db/ImageModel';
import { ServerError } from "../../backend-types";


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
    const { timeStamp } = req.body;
    const savedScan = new ImageModel({ timeStamp });
    await savedScan.save();
    // For checking front-end
    res.locals.savedScan = savedScan;
    next();
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










/*

Nick attempts at additional methods

GET SCAN:

mongoController.getScan = async (req, res, next) => {
  try {
    const scan = await ImageModel.find({})
    res.locals.scan = scan
    next();
  } catch (error) {
    const errObj: ServerError = {
      log: { err: `mongoController.getScan Error: ${error}` },
      status: 500,
      message: "mongoController.getScan Error",
    };
    return next(errObj);
  }
}


GET SCAN BY SEVERITY:

mongoController.getScanBySeverity = async (req, res, next) => {
  const { severity } = req.params;

  try {
    const scans = await ImageModel.find({ [`Everything.${severity}`]: { $exists: true, $not: { $size: 0 } } });
    if (!scans || scans.length === 0) {
      return res.status(404).json({ message: `No scans found with severity: ${severity}` });
    }
    res.locals.scansBySeverity = scans;
    next();
  } catch (error) {
    const errObj: ServerError = {
      log: { err: `mongoController.getScanBySeverity Error: ${error}` },
      status: 500,
      message: "mongoController.getScanBySeverity error",
    };
    return next(errObj);
  }
};

DELETE SCAN:

mongoController.deleteScan = async (req, res, next) => {
try {
    const scanID = req.params.id;
    const scanIDToDelete = await ImageModel.findOneAndDelete({ _id: scanID });
    res.locals.scanToDelete = scanToDelete;
    return next();
  } catch (error) {
    return next({
      log: `An error occured in mongoController.deleteScan: ${error}`,
      status: 500,
      message: {
      err: 'An error occured in mongoController.deleteScan',
      }, 
    });
  }
}




*/





