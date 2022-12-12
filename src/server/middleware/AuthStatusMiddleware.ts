import { Middleware } from '@decorators/express';
import * as e from 'express';
import { checkJwt } from '@auth/index';

export default class AuthStatusMiddleware implements Middleware {
    public async use(req: e.Request, res: e.Response, next: e.NextFunction) {
        checkJwt(req, user => {
            req.user = user;
            next();
        });
    }
}
