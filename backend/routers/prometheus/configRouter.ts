import { Router, Request, Response, NextFunction } from 'express';
import configController from '../../controllers/prometheus/configController';
import { EndpointType, PromDataSourceType } from '../../../types';
import mongoController from '../../controllers/docker/mongoController';
const router = Router();

/**
 * @abstract
 * @todo
 * @param
 * @returns {any}
 */
router.get('/initial', configController.getYaml, (req: Request, res: Response) => {
  return res.status(200).json(res.locals.yaml);
});

/**
 * @abstract
 * @todo
 * @param
 * @returns {any}
 */
router.post('/saveProm', mongoController.savePromConfigs, (req: Request, res: Response) => {
  return res.status(200).json(res.locals.success);
});

/**
 * @abstract
 * @todo
 * @param
 * @returns {any}
 */
router.post('/update', configController.updateYaml, configController.getYaml, (req: Request, res: Response) => {
  return res.status(200).json(res.locals.yaml);
});

export default router;