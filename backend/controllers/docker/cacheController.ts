import { Request, Response, NextFunction } from 'express';
import redisClient from '../../cache/redis';
import { GrypeScan, ServerError, countVulnerability } from '../../backend-types';

interface CacheController {
      /**
    * @method GET
    * @abstract sets grype's db status to already updated
    * @returns {void}
    */
    setCacheGrypeDb: (req: Request, res: Response, next: NextFunction) => Promise<void>;
  
    /**
   * @method GET
   * @abstract see if grype's db has already been updated today
   * @returns {void}
   */
    checkCacheGrypeDb: (req: Request, res: Response, next: NextFunction) => Promise<void>;

    /**
   * @method POST
   * @abstract set countVulnerabilities to the redis cache
   * @returns {void}
   */
    setCacheVulnerability: (req: Request, res: Response, next: NextFunction) => Promise<void>;
  
  /**
   * @method POST
   * @param {string} req.body.scanName
   * @abstract Check RedisClient cache to see if the vulnerabilities have already been scanned and saved to cache
   * @returns {void}
   */
  checkCacheVulnerability: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}

const cacheController: CacheController = {} as CacheController;

cacheController.checkCacheGrypeDb = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const cachedDbStatus = await redisClient.get('cachedDbStatus');
    if (JSON.parse(cachedDbStatus)) {
    res.locals.cachedDbStatus = true
    }
    next()
  } catch (error) {
    const errObj: ServerError = {
      log: { err: `cacheController checkCacheGrypeDb Error: ${error}` },
      status: 500,
      message: 'internal server error'
    }
    next(errObj);
  }
}


  
cacheController.setCacheGrypeDb = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  if (res.locals.cachedDbStatus) {
    next()
  } else {
    try {
      await redisClient.set('cachedDbStatus', JSON.stringify(true));
      await redisClient.expire('cachedDbStatus', 60 * 60 * 24);
      next()
    } catch (error) {
      const errObj: ServerError = {
        log: { err: `cacheController setCacheGrypeDb Error: ${error}` },
        status: 500,
        message: 'internal server error'
      }
      next(errObj);
    }
  }
}

cacheController.setCacheVulnerability = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  if (res.locals.addToCache) {
    try {
      await redisClient.set(`${res.locals.scanName}`, JSON.stringify(res.locals.vulnerabilites));
      await redisClient.expire(`${res.locals.scanName}`, 60 * 60 * 24);
      next()
    } catch (error) {
      const errObj: ServerError = {
        log: { err: `cacheController setCacheVulnerability Error: ${error}` },
        status: 500,
        message: 'internal server error'
      }
      next(errObj);
    }
  } else {
    next()
  }
}

cacheController.checkCacheVulnerability = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
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