import { Request, Response, NextFunction } from 'express';
import { ContainerPS, VolumeType } from '../../../types';
import { execAsync } from '../helper';
import { ServerError } from '../../backend-types';

interface VolumeController{
  /**
   * @method
   * @abstract Get a list of all docker containers running on a given volume
   * @param {string} req.params.volume 
   * @returns @param {ContainerPS} req.body.containers
   */
  getContainersOnVolume: (req: Request, res: Response, next: NextFunction) => Promise<void>;

  /**
   * @method
   * @abstract Gets a list of all docker volumes
   * @returns @param {VolumeType} res.locals.volumes
   */
  getVolumes: (req: Request, res: Response, next: NextFunction) => Promise<void>;

  /**
   * @method
   * @abstract Removes a volume from docker.(?Must be detached from running containers first?)
   * @param {string} req.params
   * @returns
   */
  removeVolume: (req: Request, res: Response, next: NextFunction) => Promise<void>;

}

const volumeController: VolumeController = {} as VolumeController;

volumeController.getContainersOnVolume = async(req, res, next) => {
  try {
    const { id } = req.params;
    const { stdout, stderr } = await execAsync(`docker ps -a --filter volume=${id} --format "{{json .}},"`);
    if (stderr.length) throw new Error(stderr);
    const containers: ContainerPS[] = JSON.parse(`[${stdout.trim().slice(0, -1)}]`);
    res.locals.containers = containers;
    return next();
  } catch (error) {
    const errObj: ServerError = {
      log: { err: `volumeController.getContainersOnVolume Error: ${error}` },
      status: 500,
      message: 'internal server error'
    }
    next(errObj);
  }
}

volumeController.getVolumes = async (req, res, next)=> {
  try {
    const { stdout, stderr } = await execAsync('docker volume ls --format "{{json .}},"');
    if (stderr.length) throw new Error(stderr);
    const volumes: VolumeType[] = JSON.parse(`[${stdout.trim().slice(0, -1)}]`);
    res.locals.volumes = volumes;
    return next();
  } catch (error) {
    const errObj: ServerError = {
      log: { err: `volumeController.getVolumes Error: ${error}` },
      status: 500,
      message: 'internal server error'
    }
    next(errObj);
  }
}

volumeController.removeVolume = async(req, res, next) => {
  try {
    const { id } = req.params;
    const { stdout, stderr } = await execAsync(`docker volume rm ${id}`);
    if (stderr.length) throw new Error(stderr);

    /**@todo Remove this console log once verified */
    console.log(stdout);
    return next();
  } catch (error) {
    const errObj: ServerError = {
      log: { err: `volumeController.removeVolume Error: ${error}` },
      status: 500,
      message: 'internal server error'
    }
    next(errObj);
  }
}

export default volumeController;