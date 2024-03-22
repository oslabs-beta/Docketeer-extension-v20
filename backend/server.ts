import express, { NextFunction, Request, Response } from 'express';
import fs from 'fs';
import { ServerError } from './backend-types';
import process from 'process';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';

// DO NOT USE CORS!
// It will mess up the ddClientRequest!

// const PORT = 3003;
let SOCKETFILE: string;
if (process.env.MODE === 'browser') {
  SOCKETFILE = '3000';
} else {
  SOCKETFILE = '/run/guest-services/backend.sock';

  // Resets the docker socket, prevents the issue of VM socket being in use error but not always
  try {
    fs.unlinkSync(SOCKETFILE);
    console.log('Deleted the UNIX file.');
  }
  catch (err) {
    console.log('Did not need to delete the UNIX socket file.');
  }
}

/**
 *  "413 Request Entity Too Large" error
 *  Article: https://blog.hubspot.com/website/413-request-entity-too-large
 *  Need to add {limit: '50mb'} to increase the transfer limit (default is 10-15 mb)
 */

const app = express();
app.use(bodyParser.json({ limit: '50mb' })); // set file size limit to 50mb

app.use(cookieParser());
app.use(express.json({ limit: '50mb' })); // set file size limit to 50mb
app.use(express.urlencoded({ extended: true, limit: '50mb' })); // set file size limit to 50mb

import containerRouter from './routers/docker/containerRouter';
import imageRouter from './routers/docker/imageRouter';
import volumeRouter from './routers/docker/volumeRouter';
import networkRouter from './routers/docker/networkRouter';
import systemRouter from './routers/docker/systemRouter';
import configRouter from './routers/prometheus/configRouter';
import saveMetricsRouter from './routers/docker/saveMetricsRouter'

app.use('/api/docker/container', containerRouter);
app.use('/api/docker/image', imageRouter);
app.use('/api/docker/volume', volumeRouter);
app.use('/api/docker/network', networkRouter);
app.use('/api/docker/system', systemRouter);
app.use('/api/prometheus/config', configRouter);
app.use('/api/saveMetricsEntry', saveMetricsRouter);

// Handling requests to unknown endpoints...
app.use('/', (req: Request, res: Response): Response => {
  return res
    .status(404)
    .json({ error: 'Endpoint does not exist' });
});

// Handling global errors...
app.use(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  (err: ServerError, req: Request, res: Response, next: NextFunction): Response => {
    const defaultErr: ServerError = {
      log: {err:'Express error handler caught unknown middleware error'},
      status: 500,
      message: 'internal server error: HELLLO',
    };

    const errorObj: ServerError = Object.assign({}, defaultErr, err);
    console.log(errorObj.log);
    return res.status(errorObj.status).json(errorObj.message);
  }
);

app.listen(SOCKETFILE, (): void => {
  console.log(`Listening on socket: ${SOCKETFILE}`);
});
