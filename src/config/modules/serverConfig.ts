import Env from '@utils/Env';
import { IndexController } from '@controllers/IndexController';
import { AuthController } from '@controllers/AuthController';

const normalizeBaseUrl = (useHttps: boolean): URL => {
    const hostname = Env.asString('HOST_NAME');
    const port = Env.asNumber('PORT');

    const url = new URL(`${useHttps ? 'https' : 'http'}://${hostname}:${port}`);
    url.hostname = Env.asString('HOST_NAME');
    url.port = Env.asString('PORT');
    url.protocol = useHttps ? 'https' : 'http';

    return url;
};

const useHttps = Env.asBoolean('USE_HTTPS', false);
const url = normalizeBaseUrl(useHttps);

const serverConfig = {
    hostname: url.hostname,
    port: Number(url.port),
    useHttps,
    baseUrl: String(url),
    controllers: [IndexController, AuthController],
};

export default serverConfig;
