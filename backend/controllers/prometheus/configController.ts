// Types
import { Request, Response, NextFunction } from 'express';
import { execAsync } from '../helper';
import { ServerError } from '../../backend-types';
import { EndpointType, PromDataSourceType } from '../../../types';
import pool from '../../db/model';
import yaml from 'js-yaml';
import fs from 'fs';

interface ConfigController {

/**
 * @method
 * @abstract
 * @returns @param {void}
 */
  getYaml: (req: Request, res: Response, next: NextFunction) => Promise<void>;

/**
 * @method
 * @abstract
 * @returns @param {void}
 */
 updateYaml: (req: Request, res: Response, next: NextFunction) => Promise<void>;
  
}

const configController: ConfigController = {} as ConfigController;

configController.getYaml = async (req, res, next) => {
  try {
    const doc = await yaml.load(fs.readFileSync('../prometheus/prometheus.yml'));
    res.locals.yaml = doc;
    return next();
  } catch (error) {
    const errObj: ServerError = {
      log: { err: `configController.getYaml Error: ${error}` },
      status: 500,
      message: 'internal server error'
    }
    return next(errObj);
  }
}

configController.updateYaml = async (req, res, next) => {
  try {
    const newYaml = yaml.dump(req.body);
    fs.writeFileSync('../prometheus/prometheus.yml', newYaml, 'utf8');
    return next();
  } catch (error) {
    const errObj: ServerError = {
      log: { err: `configController.updateYaml Error: ${error}` },
      status: 500,
      message: 'internal server error'
    }
    return next(errObj);
  }
}

export default configController;