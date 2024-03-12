import express, { Router, Request, Response, NextFunction } from 'express';
import imageController from '../../controllers/docker/imagesController';
import cacheController from '../../controllers/docker/cacheController';
const router = Router();

router.use(express.json());


/**
 * @abstract Get current Docker images from user's docker and update Grype's DB
 * @todo
 * @param
 * @returns
 */
router.get('/', cacheController.checkCacheGrypeDb, imageController.getImages, imageController.dbStatus, cacheController.setCacheGrypeDb, (req, res) => {
  return res.status(200).json(res.locals.images);
});

/**
 * @abstract Check if image vulnerabilities are in the cache, if not perform a Grype scan
 * @todo
 * @param
 * @returns
 */
// router.post('/scan', cacheController.checkCacheVulnerability, imageController.scanImages, cacheController.setCacheVulnerability,(req, res) => {
//   // return res.status(200).json(res.locals.vulnerabilites);

//   // test everything
//   return res.status(200).json({ vulnerabilites: res.locals.vulnerabilites, everything: res.locals.everything });
// });

/**
 * @abstract Scans an using Grype CLI and summarizes the report's vulnerabilities by severity
 * @todo
 * @param req.body.scanName
 * @returns count of vulnerabilities in this format: {
    "Low": 19,
    "Medium": 11,
    "Negligible": 3
}
 */
router.post('/scan', imageController.scanImages, (req, res) => {
  return res
    .status(200)
    .json({
      vulnerabilites: res.locals.vulnerabilites,
      everything: res.locals.everything,
    });
});


/**
 * @abstract
 * @todo Move buildContainerFromImage to the containercontroller
 * @param req.body.name
 * @param req.body.tag
 * @returns containers
 */
router.post('/run', imageController.buildContainerFromImage, (req, res) => {
  return res.sendStatus(201);
});

/**
 * @abstract
 * @todo
 * @param
 * @returns
 */
router.delete('/:id', imageController.removeImage, (req, res) => {
  return res.sendStatus(204);
});

export default router;