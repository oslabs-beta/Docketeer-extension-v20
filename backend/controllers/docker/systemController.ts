import { Request, Response, NextFunction } from 'express';
import { execAsync } from '../helper';
import { ServerError } from '../../backend-types';

interface SystemController {
  /**
   * @method
   * @todo Needs to be implemented
   * @abstract Prunes the docker network forcefully
   * @returns
   */
  prune: (req: Request, res: Response, next: NextFunction) => Promise<void>;

}

const systemController: SystemController = {} as SystemController;

systemController.prune = async (req, res, next) => {
  try {
    const { stdout, stderr } = await execAsync('docker system prune --force');
    if (stderr.length) throw new Error(stderr);

    return next();
  } catch (error) {
    const errObj: ServerError = {
      log: { err: `systemController.prune Error: ${error}` },
      status: 500,
      message: 'internal server error'
    }
    next(errObj);
  }
}
export default systemController;