import { Middleware } from '@decorators/express';
import * as e from 'express';
import { checkJwt } from '@auth/index';
import createError from 'http-errors';

export default class AuthRestrictMiddleware implements Middleware {
    public async use(req: e.Request, res: e.Response, next: e.NextFunction) {
        checkJwt(req, (user, error) => {
            if (user) {
                req.user = user;
                next();
            } else {
                const httpError = error ? createError(404, error) : createError(404);
                next(httpError);
            }
        });
    }
}
