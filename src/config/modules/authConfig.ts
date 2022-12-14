import Env from '@utils/Env';

const authConfig = {
    jwtSecret: Env.asString('JWT_SECRET', 'secret'),
};

export default authConfig;
