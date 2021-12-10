import 'reflect-metadata';

import express, { Request, Response, NextFunction } from 'express';
import swaggerUi from 'swagger-ui-express';
import 'express-async-errors';

import { AppError } from '@shared/errors/AppError';

import swaggerConfig from '../../../swagger.json';
import createConnection from '../typeorm';
import { router } from './routes';

import '@shared/container';

createConnection();

const app = express();

app.use(express.json());

const options = {
  swaggerOptions: {
    supportedSubmitMethods: ["get"]
   }
};

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerConfig, options));

app.use(router);

app.use(
  (error: Error, request: Request, response: Response, _: NextFunction) => {
    if (error instanceof AppError) {
      return response.status(error.statusCode).json({
        status: 'error',
        message: error.message,
      });
    }

    return response.status(500).json({
      status: 'error',
      message: `Internal server error - ${error.message}`,
    });
  },
);

export { app };
