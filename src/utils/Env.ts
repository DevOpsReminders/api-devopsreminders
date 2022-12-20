import 'reflect-metadata';
import dotenv from 'dotenv';
import dotenvExpand from 'dotenv-expand';
import get from 'lodash/get';
import appConfig from '@config/index';

export class EnvClass {
    data: NodeJS.Dict<string | number>;

    constructor(data: NodeJS.Dict<string | number>) {
        this.data = data;
    }

    asString(path: string, fallback = ''): string {
        return String(get(this.data, path, fallback));
    }

    asBoolean(path: string, fallback = false): boolean {
        const raw = get(this.data, path);
        if (raw === undefined || raw === null) return fallback;

        return !!['true', '1'].includes(String(raw).toLowerCase());
    }

    asNumber(path: string, fallback = 0): number {
        const result = Number(get(this.data, path));
        return isNaN(result) ? fallback : result;
    }

    isDev() {
        return this.data.NODE_ENV === 'development';
    }

    isTesting() {
        return this.data.NODE_ENV === 'testing';
    }

    getBaseUrl(): string {
        return appConfig.server.baseUrl.replace(/\/$/, '');
    }
}

const myEnv = dotenv.config();
dotenvExpand.expand(myEnv);

const Env = new EnvClass(process.env);
export default Env;
