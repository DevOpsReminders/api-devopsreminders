import express from 'express';
import compression from 'compression';
import logger from 'morgan';
import { attachControllers } from '@decorators/express';
import https, { ServerOptions } from 'https';
import fs from 'fs';
import appConfig from '@config/index';
import createError from 'http-errors';
import { ServerErrorMiddleware } from '@server/middleware/ServerErrorMiddleware';
import { IndexController } from '@controllers/IndexController';

const server = express();

server.use(compression());
server.use(logger('combined'));
server.use(express.json());
server.use(express.urlencoded({ extended: true }));
attachControllers(server, [IndexController]);
server.use(function (req, res, next) {
    next(createError(404));
});
server.use(new ServerErrorMiddleware().use);

const createHttpServer = (port: number, cb: (baseUrl: string) => void) => {
    server.listen(port, () => cb(appConfig.server.baseUrl));
};

const createHttpsServer = (port: number, cb: (baseUrl: string) => void) => {
    const options: ServerOptions = {
        key: fs.readFileSync(__dirname + '/certs/key.pem'),
        cert: fs.readFileSync(__dirname + '/certs/cert.pem'),
    };
    const httpServer = https.createServer(options, server);
    httpServer.once('listening', () => cb(appConfig.server.baseUrl));
    httpServer.listen(port);
};

export const createServer = (cb: (baseUrl: string) => void, secure = false) => {
    const PORT = appConfig.server.port;
    if (secure) {
        createHttpsServer(PORT, cb);
    } else {
        createHttpServer(PORT, cb);
    }
};

export default server;
