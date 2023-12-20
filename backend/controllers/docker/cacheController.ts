import { Request, Response, NextFunction } from 'express';
import redisClient from '../../cache/redis';
import { GrypeScan, ServerError, countVulnerability } from '../../backend-types';

interface CacheController {
  /**
   * @method POST
   * @param {string} req.body.scanName
   * @abstract Check RedisClient cache to see if the vulnerabilities have already been scaned
   * @returns {void}
   */
  checkCache: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}

const cacheController: CacheController = {} as CacheController;

cacheController.checkCache = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { scanName }: { scanName: string } = req.body;
  const cachedVulernabilities = await redisClient.get(`${scanName}`);
  if (cachedVulernabilities !== null) {
    console.log(`Cache ${scanName} hit result:`, cachedVulernabilities)
    res.locals.vulnerabilites = JSON.parse(cachedVulernabilities);
    next()
  }
  else {
    console.log('Cache miss:', `${scanName}`)
    next()
  }
}

export default cacheController;