import express, { Request, Response, NextFunction } from 'express';
import swaggerUi from 'swagger-ui-express';
import 'express-async-errors';

import '../typeorm';

import '@shared/container';

import { AppError } from '@shared/errors/AppError';

import swaggerConfig from '../../../swagger.json';
import { router } from './routes';

const app = express();

app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerConfig));

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
