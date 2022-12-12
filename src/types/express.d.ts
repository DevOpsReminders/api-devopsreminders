/* eslint-disable @typescript-eslint/consistent-type-definitions */
import { UserEntity } from '@entities/UserEntity';
import { PassportStatic } from 'passport';

declare global {
    namespace Express {
        type User = UserEntity;
        interface Request {
            user?: User;
            passport: PassportStatic;
        }
    }
}
