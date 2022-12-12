import { Application, Request } from 'express';
import { UserEntity } from '@entities/UserEntity';
import passport from 'passport';
import { buildJwtStrategy } from '@auth/adapters/jwtAdapter';

export type CheckAuthCallback = (user?: UserEntity, error?: Error) => void;

export const checkJwt = (req: Request, callback: CheckAuthCallback) => {
    req.passport.authenticate(
        'jwt',
        {
            session: false,
        },
        (info: unknown, user?: UserEntity, error?: Error) => {
            callback(user, error);
        },
    )(req);
};

export const applyAuth = (app: Application) => {
    passport.use(buildJwtStrategy());

    app.use((req, res, next) => {
        req.passport = passport;
        next();
    });
    app.use(passport.initialize());
};
