import { Router, Request, Response, NextFunction } from 'express';
import configController from '../../controllers/prometheus/configController';
import { EndpointType, PromDataSourceType } from '../../../types';
import mongoController from '../../controllers/docker/mongoController';
const router = Router();

/**
 * @abstract
 * @todo
 * @param
 * @returns {PromDataSourceType[]}
 */
router.get('/', configController.getDataSources, (req: Request, res: Response) => {
  return res.status(200).json(res.locals.datasources);
});

/**
 * @abstract
 * @todo
 * @param
 * @returns {any{}}
 */
router.get('/initial', configController.getYaml, (req: Request, res: Response) => {
  return res.status(200).json(res.locals.yaml);
});

/**
 * @abstract
 * @todo
 * @param
 * @returns {any{}}
 */
router.post('/saveProm', mongoController.savePromConfigs, (req: Request, res: Response) => {
  return res.status(200).json(res.locals.success);
});

/**
 * @abstract
 * @todo
 * @param
 * @returns {any{}}
 */
router.post('/update', configController.updateYaml, configController.getYaml, (req: Request, res: Response) => {
  return res.status(200).json(res.locals.yaml);
});

/**
 * @abstract
 * @todo
 * @param
 * @returns {void}
 */
router.delete('/', configController.clearDataSources, (req: Request, res: Response) => {
  return res.status(200).json({a:1});
});

/**
 * @abstract
 * @returns {EndpointType[]}
 */
router.get('/types', configController.getTypeOptions, (req: Request, res: Response) => {
  return res.status(200).json(res.locals.types);
})

/**
 * @abstract
 * @returns {string}
 */
router.post('/', configController.createDataSource, (req: Request, res: Response) => {
  return res.status(201).json(res.locals.id);
})

/**
 * @abstract
 */
router.put('/', configController.updateDataSource, (req: Request, res: Response) => {
  return res.sendStatus(204);
});


router.delete('/:id/:url', configController.deleteDataSource, (req: Request, res: Response) => {
  return res.sendStatus(204);
})

export default router;