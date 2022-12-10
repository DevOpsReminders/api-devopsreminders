import { ErrorMiddleware } from '@decorators/express';
import { NextFunction, Request, Response } from 'express';
import { isHttpError } from 'http-errors';
import { isString } from 'lodash';

// @TODO remove template render
const getReferrer = (request: Request): string => {
    const referrer = request.header('referrer');
    if (!referrer) return '/';
    const urlParts = new URL(referrer);
    return request.hostname === urlParts.hostname ? `${urlParts.pathname}${urlParts.search}` : referrer;
};
export class ServerErrorMiddleware implements ErrorMiddleware {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public use(error: Error, request: Request, response: Response, next: NextFunction) {
        const errorVars = isHttpError(error)
            ? {
                  statusCode: error.statusCode,
                  expose: error.expose,
                  name: error.name,
                  message: error.message,
                  stack: error.stack && isString(error.stack) ? error.stack.split('\n') : error.stack,
              }
            : {
                  message: error.message,
                  expose: false,
                  statusCode: 500,
                  name: error.name,
                  stack: error.stack && isString(error.stack) ? error.stack.split('\n') : error.stack,
              };
        if (errorVars.name === 'EntityNotFoundError') {
            errorVars.statusCode = 404;
        }

        response.status(errorVars.statusCode).json(errorVars);
    }
}
