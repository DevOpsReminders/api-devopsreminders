import { ExtractJwt, Strategy, StrategyOptions, VerifyCallback } from 'passport-jwt';
import appConfig from '@config/index';
import { UserEntity } from '@entities/UserEntity';

export const buildJwtStrategy = () => {
    const options: StrategyOptions = {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: appConfig.auth.jwtSecret,
        issuer: appConfig.server.hostname,
    };

    const verifyCallback: VerifyCallback = (payload, done) => {
        const { sub } = payload;
        UserEntity.findOneByOrFail({ id: sub })
            .then(user => {
                done(null, user);
            })
            .catch(error => {
                done(error.message, false);
            });
    };

    return new Strategy(options, verifyCallback);
};
